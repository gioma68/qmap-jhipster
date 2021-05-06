package it.expleo.qmap.importer.webinspect.repository;

import it.expleo.qmap.importer.webinspect.domain.D;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the D entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DRepository extends JpaRepository<D, Long> {}
