package org.erp.reflectrotechodoo.auth.controller;

import org.erp.reflectrotechodoo.auth.TestH2Repository;
import org.erp.reflectrotechodoo.auth.dto.ApiResponse;
import org.erp.reflectrotechodoo.auth.dto.SignupRequest;
import org.erp.reflectrotechodoo.auth.model.User;
import org.erp.reflectrotechodoo.auth.repository.UserRepository;
import org.erp.reflectrotechodoo.auth.service.EmailService;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@ActiveProfiles("test")
class AuthControllerIntegrationTest {

    @MockitoBean
    private EmailService emailService;  // ← add this, no real emails sent

    @Autowired
    private UserRepository userRepository;

    @LocalServerPort
    private int port;

    private String baseUrl;
    private static RestTemplate restTemplate;

    @Autowired
    private TestH2Repository repository;

    @BeforeAll
    public static void init() {
        restTemplate = new RestTemplate();
    }

    @BeforeEach
    void setup() {
        baseUrl = "http://localhost:" + port + "/api/v1/auth";
    }

    @Test
    void shouldRegisterUserSuccessfully() {

        String email = "test" + System.currentTimeMillis() + "@gmail.com";

        SignupRequest request = SignupRequest.builder()
                .email(email)
                .firstName("Venky")
                .lastName("Rapolu")
                .password("1234567890")
                .build();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<SignupRequest> entity = new HttpEntity<>(request, headers);

        ResponseEntity<ApiResponse> response = restTemplate.postForEntity(
                baseUrl + "/signup",
                entity,
                ApiResponse.class
        );

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertTrue(response.getBody().isSuccess());

        Optional<User> user = repository.findByEmail(email);
        assertTrue(user.isPresent());
        assertEquals("Venky", user.get().getFirstName());
    }
}