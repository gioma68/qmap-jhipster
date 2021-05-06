package it.expleo.qmap.importer.julia.repository;

import it.expleo.qmap.importer.julia.domain.E;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the E entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ERepository extends JpaRepository<E, Long> {}
