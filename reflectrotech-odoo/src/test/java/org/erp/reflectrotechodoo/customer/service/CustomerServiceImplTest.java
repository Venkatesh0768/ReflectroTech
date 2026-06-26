package org.erp.reflectrotechodoo.customer.service;

import org.erp.reflectrotechodoo.common.enums.Status;
import org.erp.reflectrotechodoo.common.exception.BusinessException;
import org.erp.reflectrotechodoo.common.exception.DuplicateResourceException;
import org.erp.reflectrotechodoo.common.exception.ResourceNotFoundException;
import org.erp.reflectrotechodoo.common.response.PageResponse;
import org.erp.reflectrotechodoo.customer.dto.request.CustomerRequest;
import org.erp.reflectrotechodoo.customer.dto.request.CustomerSearchRequest;
import org.erp.reflectrotechodoo.customer.dto.response.CustomerResponse;
import org.erp.reflectrotechodoo.customer.entity.Customer;
import org.erp.reflectrotechodoo.customer.enums.CustomerType;
import org.erp.reflectrotechodoo.customer.enums.GstType;
import org.erp.reflectrotechodoo.customer.mapper.CustomerMapper;
import org.erp.reflectrotechodoo.customer.repository.CustomerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests for {@link CustomerServiceImpl}.
 *
 * <p>Uses Mockito to isolate the service from the database layer.
 * No Spring context is loaded — these tests are fast and deterministic.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("CustomerServiceImpl")
class CustomerServiceImplTest {

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private CustomerMapper customerMapper;

    @InjectMocks
    private CustomerServiceImpl customerService;

    private CustomerRequest  validRequest;
    private Customer         savedCustomer;
    private CustomerResponse savedResponse;
    private UUID             testUuid;

    @BeforeEach
    void setUp() {
        testUuid = UUID.randomUUID();

        validRequest = new CustomerRequest();
        validRequest.setCompanyName("Acme Circuits Pvt. Ltd.");
        validRequest.setCustomerType(CustomerType.COMPANY);
        validRequest.setEmail("procurement@acme.com");
        validRequest.setGstNumber("33AAAPL1234F1Z5");
        validRequest.setGstType(GstType.REGISTERED);
        validRequest.setCreditLimit(BigDecimal.valueOf(500000));
        validRequest.setPaymentTermsDays(30);
        validRequest.setCity("Chennai");
        validRequest.setState("Tamil Nadu");

        savedCustomer = new Customer();
        savedCustomer.setCustomerCode("CUST-20240626-00001");
        savedCustomer.setCompanyName("Acme Circuits Pvt. Ltd.");
        savedCustomer.setStatus(Status.ACTIVE);
        savedCustomer.setDeleted(false);

        savedResponse = CustomerResponse.builder()
                .uuid(testUuid)
                .customerCode("CUST-20240626-00001")
                .companyName("Acme Circuits Pvt. Ltd.")
                .status(Status.ACTIVE)
                .build();
    }

    // ── CREATE ────────────────────────────────────────────────────────────────

    @Nested
    @DisplayName("create()")
    class Create {

        @Test
        @DisplayName("should create customer and return response when input is valid")
        void shouldCreateCustomerSuccessfully() {
            // arrange
            when(customerRepository.existsByEmailAndDeletedFalse(validRequest.getEmail())).thenReturn(false);
            when(customerRepository.existsByGstNumberAndDeletedFalse(validRequest.getGstNumber())).thenReturn(false);
            when(customerMapper.toEntity(validRequest)).thenReturn(savedCustomer);
            when(customerRepository.countCreatedToday()).thenReturn(0L);
            when(customerRepository.save(any(Customer.class))).thenReturn(savedCustomer);
            when(customerMapper.toResponse(savedCustomer)).thenReturn(savedResponse);

            // act
            CustomerResponse result = customerService.create(validRequest);

            // assert
            assertThat(result).isNotNull();
            assertThat(result.getCompanyName()).isEqualTo("Acme Circuits Pvt. Ltd.");
            verify(customerRepository).save(any(Customer.class));
            verify(customerMapper).toResponse(savedCustomer);
        }

        @Test
        @DisplayName("should throw DuplicateResourceException when email already exists")
        void shouldThrowWhenEmailIsDuplicate() {
            when(customerRepository.existsByEmailAndDeletedFalse(validRequest.getEmail())).thenReturn(true);

            assertThatThrownBy(() -> customerService.create(validRequest))
                    .isInstanceOf(DuplicateResourceException.class)
                    .hasMessageContaining("email");

            verify(customerRepository, never()).save(any());
        }

        @Test
        @DisplayName("should throw DuplicateResourceException when GST number already exists")
        void shouldThrowWhenGstIsDuplicate() {
            when(customerRepository.existsByEmailAndDeletedFalse(anyString())).thenReturn(false);
            when(customerRepository.existsByGstNumberAndDeletedFalse(validRequest.getGstNumber())).thenReturn(true);

            assertThatThrownBy(() -> customerService.create(validRequest))
                    .isInstanceOf(DuplicateResourceException.class)
                    .hasMessageContaining("gstNumber");

            verify(customerRepository, never()).save(any());
        }
    }

    // ── GET BY UUID ───────────────────────────────────────────────────────────

    @Nested
    @DisplayName("getByUuid()")
    class GetByUuid {

        @Test
        @DisplayName("should return customer when found")
        void shouldReturnCustomerWhenFound() {
            when(customerRepository.findByUuidAndDeletedFalse(testUuid))
                    .thenReturn(Optional.of(savedCustomer));
            when(customerMapper.toResponse(savedCustomer)).thenReturn(savedResponse);

            CustomerResponse result = customerService.getByUuid(testUuid);

            assertThat(result.getUuid()).isEqualTo(testUuid);
        }

        @Test
        @DisplayName("should throw ResourceNotFoundException when customer not found")
        void shouldThrowWhenNotFound() {
            when(customerRepository.findByUuidAndDeletedFalse(testUuid))
                    .thenReturn(Optional.empty());

            assertThatThrownBy(() -> customerService.getByUuid(testUuid))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("Customer");
        }
    }

    // ── SEARCH ────────────────────────────────────────────────────────────────

    @Nested
    @DisplayName("search()")
    class Search {

        @Test
        @DisplayName("should return paginated results")
        void shouldReturnPaginatedResults() {
            List<Customer> customers = List.of(savedCustomer);
            Page<Customer> page = new PageImpl<>(customers, PageRequest.of(0, 20), 1);

            when(customerRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(page);
            when(customerMapper.toResponse(savedCustomer)).thenReturn(savedResponse);

            CustomerSearchRequest filter = new CustomerSearchRequest();
            PageResponse<CustomerResponse> result = customerService.search(filter, PageRequest.of(0, 20));

            assertThat(result.getTotalElements()).isEqualTo(1);
            assertThat(result.getContent()).hasSize(1);
            assertThat(result.getPage()).isZero();
        }
    }

    // ── DELETE ────────────────────────────────────────────────────────────────

    @Nested
    @DisplayName("delete()")
    class Delete {

        @Test
        @DisplayName("should soft-delete customer successfully")
        void shouldSoftDeleteCustomer() {
            savedCustomer.setStatus(Status.ACTIVE);
            when(customerRepository.findByUuidAndDeletedFalse(testUuid))
                    .thenReturn(Optional.of(savedCustomer));
            when(customerRepository.save(any(Customer.class))).thenReturn(savedCustomer);

            customerService.delete(testUuid);

            assertThat(savedCustomer.isDeleted()).isTrue();
            assertThat(savedCustomer.getStatus()).isEqualTo(Status.INACTIVE);
            verify(customerRepository).save(savedCustomer);
        }

        @Test
        @DisplayName("should throw BusinessException when customer is BLOCKED")
        void shouldThrowWhenCustomerIsBlocked() {
            savedCustomer.setStatus(Status.BLOCKED);
            when(customerRepository.findByUuidAndDeletedFalse(testUuid))
                    .thenReturn(Optional.of(savedCustomer));

            assertThatThrownBy(() -> customerService.delete(testUuid))
                    .isInstanceOf(BusinessException.class)
                    .hasMessageContaining("blocked");

            verify(customerRepository, never()).save(any());
        }
    }

    // ── STATUS CHANGE ─────────────────────────────────────────────────────────

    @Nested
    @DisplayName("changeStatus()")
    class ChangeStatus {

        @Test
        @DisplayName("should update status when customer is active")
        void shouldUpdateStatus() {
            savedCustomer.setStatus(Status.ACTIVE);
            savedCustomer.setDeleted(false);

            CustomerResponse blockedResponse = CustomerResponse.builder()
                    .uuid(testUuid)
                    .status(Status.BLOCKED)
                    .build();

            when(customerRepository.findByUuidAndDeletedFalse(testUuid))
                    .thenReturn(Optional.of(savedCustomer));
            when(customerRepository.save(any(Customer.class))).thenReturn(savedCustomer);
            when(customerMapper.toResponse(savedCustomer)).thenReturn(blockedResponse);

            CustomerResponse result = customerService.changeStatus(testUuid, Status.BLOCKED);

            assertThat(result.getStatus()).isEqualTo(Status.BLOCKED);
        }

        @Test
        @DisplayName("should throw BusinessException when customer is deleted")
        void shouldThrowWhenCustomerIsDeleted() {
            savedCustomer.setDeleted(true);
            when(customerRepository.findByUuidAndDeletedFalse(testUuid))
                    .thenReturn(Optional.empty());

            assertThatThrownBy(() -> customerService.changeStatus(testUuid, Status.ACTIVE))
                    .isInstanceOf(ResourceNotFoundException.class);
        }
    }
}
