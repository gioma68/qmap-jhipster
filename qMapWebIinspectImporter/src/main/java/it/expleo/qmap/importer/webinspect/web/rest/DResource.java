package it.expleo.qmap.importer.webinspect.web.rest;

import it.expleo.qmap.importer.webinspect.domain.D;
import it.expleo.qmap.importer.webinspect.repository.DRepository;
import it.expleo.qmap.importer.webinspect.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link it.expleo.qmap.importer.webinspect.domain.D}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DResource {

    private final Logger log = LoggerFactory.getLogger(DResource.class);

    private static final String ENTITY_NAME = "qMapWebIinspectImporterD";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DRepository dRepository;

    public DResource(DRepository dRepository) {
        this.dRepository = dRepository;
    }

    /**
     * {@code POST  /ds} : Create a new d.
     *
     * @param d the d to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new d, or with status {@code 400 (Bad Request)} if the d has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/ds")
    public ResponseEntity<D> createD(@RequestBody D d) throws URISyntaxException {
        log.debug("REST request to save D : {}", d);
        if (d.getId() != null) {
            throw new BadRequestAlertException("A new d cannot already have an ID", ENTITY_NAME, "idexists");
        }
        D result = dRepository.save(d);
        return ResponseEntity
            .created(new URI("/api/ds/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /ds/:id} : Updates an existing d.
     *
     * @param id the id of the d to save.
     * @param d the d to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated d,
     * or with status {@code 400 (Bad Request)} if the d is not valid,
     * or with status {@code 500 (Internal Server Error)} if the d couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/ds/{id}")
    public ResponseEntity<D> updateD(@PathVariable(value = "id", required = false) final Long id, @RequestBody D d)
        throws URISyntaxException {
        log.debug("REST request to update D : {}, {}", id, d);
        if (d.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, d.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!dRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        D result = dRepository.save(d);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, d.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /ds/:id} : Partial updates given fields of an existing d, field will ignore if it is null
     *
     * @param id the id of the d to save.
     * @param d the d to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated d,
     * or with status {@code 400 (Bad Request)} if the d is not valid,
     * or with status {@code 404 (Not Found)} if the d is not found,
     * or with status {@code 500 (Internal Server Error)} if the d couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/ds/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<D> partialUpdateD(@PathVariable(value = "id", required = false) final Long id, @RequestBody D d)
        throws URISyntaxException {
        log.debug("REST request to partial update D partially : {}, {}", id, d);
        if (d.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, d.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!dRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<D> result = dRepository
            .findById(d.getId())
            .map(
                existingD -> {
                    return existingD;
                }
            )
            .map(dRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, d.getId().toString())
        );
    }

    /**
     * {@code GET  /ds} : get all the dS.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of dS in body.
     */
    @GetMapping("/ds")
    public List<D> getAllDS() {
        log.debug("REST request to get all DS");
        return dRepository.findAll();
    }

    /**
     * {@code GET  /ds/:id} : get the "id" d.
     *
     * @param id the id of the d to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the d, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/ds/{id}")
    public ResponseEntity<D> getD(@PathVariable Long id) {
        log.debug("REST request to get D : {}", id);
        Optional<D> d = dRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(d);
    }

    /**
     * {@code DELETE  /ds/:id} : delete the "id" d.
     *
     * @param id the id of the d to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/ds/{id}")
    public ResponseEntity<Void> deleteD(@PathVariable Long id) {
        log.debug("REST request to delete D : {}", id);
        dRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
