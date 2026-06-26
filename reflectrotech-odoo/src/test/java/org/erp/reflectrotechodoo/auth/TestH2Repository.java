package org.erp.reflectrotechodoo.auth;

import org.erp.reflectrotechodoo.auth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TestH2Repository extends JpaRepository<User , UUID> {
    Optional<User> findByEmail(String email);
}
