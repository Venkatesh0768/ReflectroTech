package org.erp.reflectrotechodoo.auth.repository;

import org.erp.reflectrotechodoo.auth.model.Role;
import org.erp.reflectrotechodoo.auth.model.RoleType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(RoleType name);
}