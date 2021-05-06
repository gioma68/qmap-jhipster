package it.expleo.qmap.repository;

import it.expleo.qmap.domain.E;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.data.relational.core.query.Criteria;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data SQL reactive repository for the E entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ERepository extends R2dbcRepository<E, Long>, ERepositoryInternal {
    // just to avoid having unambigous methods
    @Override
    Flux<E> findAll();

    @Override
    Mono<E> findById(Long id);

    @Override
    <S extends E> Mono<S> save(S entity);
}

interface ERepositoryInternal {
    <S extends E> Mono<S> insert(S entity);
    <S extends E> Mono<S> save(S entity);
    Mono<Integer> update(E entity);

    Flux<E> findAll();
    Mono<E> findById(Long id);
    Flux<E> findAllBy(Pageable pageable);
    Flux<E> findAllBy(Pageable pageable, Criteria criteria);
}
