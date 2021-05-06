package it.expleo.qmap.repository;

import it.expleo.qmap.domain.D;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the D entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DRepository extends JpaRepository<D, Long> {}
