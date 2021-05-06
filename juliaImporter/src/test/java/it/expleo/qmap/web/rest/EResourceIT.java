package it.expleo.qmap.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import it.expleo.qmap.IntegrationTest;
import it.expleo.qmap.domain.E;
import it.expleo.qmap.repository.ERepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link EResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EResourceIT {

    private static final String ENTITY_API_URL = "/api/es";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ERepository eRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEMockMvc;

    private E e;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static E createEntity(EntityManager em) {
        E e = new E();
        return e;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static E createUpdatedEntity(EntityManager em) {
        E e = new E();
        return e;
    }

    @BeforeEach
    public void initTest() {
        e = createEntity(em);
    }

    @Test
    @Transactional
    void createE() throws Exception {
        int databaseSizeBeforeCreate = eRepository.findAll().size();
        // Create the E
        restEMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(e)))
            .andExpect(status().isCreated());

        // Validate the E in the database
        List<E> eList = eRepository.findAll();
        assertThat(eList).hasSize(databaseSizeBeforeCreate + 1);
        E testE = eList.get(eList.size() - 1);
    }

    @Test
    @Transactional
    void createEWithExistingId() throws Exception {
        // Create the E with an existing ID
        e.setId(1L);

        int databaseSizeBeforeCreate = eRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(e)))
            .andExpect(status().isBadRequest());

        // Validate the E in the database
        List<E> eList = eRepository.findAll();
        assertThat(eList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllES() throws Exception {
        // Initialize the database
        eRepository.saveAndFlush(e);

        // Get all the eList
        restEMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(e.getId().intValue())));
    }

    @Test
    @Transactional
    void getE() throws Exception {
        // Initialize the database
        eRepository.saveAndFlush(e);

        // Get the e
        restEMockMvc
            .perform(get(ENTITY_API_URL_ID, e.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(e.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingE() throws Exception {
        // Get the e
        restEMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewE() throws Exception {
        // Initialize the database
        eRepository.saveAndFlush(e);

        int databaseSizeBeforeUpdate = eRepository.findAll().size();

        // Update the e
        E updatedE = eRepository.findById(e.getId()).get();
        // Disconnect from session so that the updates on updatedE are not directly saved in db
        em.detach(updatedE);

        restEMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedE.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedE))
            )
            .andExpect(status().isOk());

        // Validate the E in the database
        List<E> eList = eRepository.findAll();
        assertThat(eList).hasSize(databaseSizeBeforeUpdate);
        E testE = eList.get(eList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingE() throws Exception {
        int databaseSizeBeforeUpdate = eRepository.findAll().size();
        e.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEMockMvc
            .perform(
                put(ENTITY_API_URL_ID, e.getId()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(e))
            )
            .andExpect(status().isBadRequest());

        // Validate the E in the database
        List<E> eList = eRepository.findAll();
        assertThat(eList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchE() throws Exception {
        int databaseSizeBeforeUpdate = eRepository.findAll().size();
        e.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(e))
            )
            .andExpect(status().isBadRequest());

        // Validate the E in the database
        List<E> eList = eRepository.findAll();
        assertThat(eList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamE() throws Exception {
        int databaseSizeBeforeUpdate = eRepository.findAll().size();
        e.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(e)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the E in the database
        List<E> eList = eRepository.findAll();
        assertThat(eList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEWithPatch() throws Exception {
        // Initialize the database
        eRepository.saveAndFlush(e);

        int databaseSizeBeforeUpdate = eRepository.findAll().size();

        // Update the e using partial update
        E partialUpdatedE = new E();
        partialUpdatedE.setId(e.getId());

        restEMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedE.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedE))
            )
            .andExpect(status().isOk());

        // Validate the E in the database
        List<E> eList = eRepository.findAll();
        assertThat(eList).hasSize(databaseSizeBeforeUpdate);
        E testE = eList.get(eList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateEWithPatch() throws Exception {
        // Initialize the database
        eRepository.saveAndFlush(e);

        int databaseSizeBeforeUpdate = eRepository.findAll().size();

        // Update the e using partial update
        E partialUpdatedE = new E();
        partialUpdatedE.setId(e.getId());

        restEMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedE.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedE))
            )
            .andExpect(status().isOk());

        // Validate the E in the database
        List<E> eList = eRepository.findAll();
        assertThat(eList).hasSize(databaseSizeBeforeUpdate);
        E testE = eList.get(eList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingE() throws Exception {
        int databaseSizeBeforeUpdate = eRepository.findAll().size();
        e.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, e.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(e))
            )
            .andExpect(status().isBadRequest());

        // Validate the E in the database
        List<E> eList = eRepository.findAll();
        assertThat(eList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchE() throws Exception {
        int databaseSizeBeforeUpdate = eRepository.findAll().size();
        e.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(e))
            )
            .andExpect(status().isBadRequest());

        // Validate the E in the database
        List<E> eList = eRepository.findAll();
        assertThat(eList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamE() throws Exception {
        int databaseSizeBeforeUpdate = eRepository.findAll().size();
        e.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(e)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the E in the database
        List<E> eList = eRepository.findAll();
        assertThat(eList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteE() throws Exception {
        // Initialize the database
        eRepository.saveAndFlush(e);

        int databaseSizeBeforeDelete = eRepository.findAll().size();

        // Delete the e
        restEMockMvc.perform(delete(ENTITY_API_URL_ID, e.getId()).accept(MediaType.APPLICATION_JSON)).andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<E> eList = eRepository.findAll();
        assertThat(eList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
