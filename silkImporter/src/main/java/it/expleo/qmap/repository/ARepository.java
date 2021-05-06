package it.expleo.qmap.repository;

import it.expleo.qmap.domain.A;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the A entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ARepository extends JpaRepository<A, Long> {}
