package it.expleo.qmap.importer.silk.repository;

import it.expleo.qmap.importer.silk.domain.B;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the B entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BRepository extends JpaRepository<B, Long> {}
