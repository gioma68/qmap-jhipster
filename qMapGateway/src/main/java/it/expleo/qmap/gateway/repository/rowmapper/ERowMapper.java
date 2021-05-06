package it.expleo.qmap.gateway.repository.rowmapper;

import io.r2dbc.spi.Row;
import it.expleo.qmap.gateway.domain.E;
import it.expleo.qmap.gateway.service.ColumnConverter;
import java.util.function.BiFunction;
import org.springframework.stereotype.Service;

/**
 * Converter between {@link Row} to {@link E}, with proper type conversions.
 */
@Service
public class ERowMapper implements BiFunction<Row, String, E> {

    private final ColumnConverter converter;

    public ERowMapper(ColumnConverter converter) {
        this.converter = converter;
    }

    /**
     * Take a {@link Row} and a column prefix, and extract all the fields.
     * @return the {@link E} stored in the database.
     */
    @Override
    public E apply(Row row, String prefix) {
        E entity = new E();
        entity.setId(converter.fromRow(row, prefix + "_id", Long.class));
        return entity;
    }
}
