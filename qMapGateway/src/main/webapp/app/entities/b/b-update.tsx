import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IA } from 'app/shared/model/a.model';
import { getEntities as getAs } from 'app/entities/a/a.reducer';
import { getEntity, updateEntity, createEntity, reset } from './b.reducer';
import { IB } from 'app/shared/model/b.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IBUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const BUpdate = (props: IBUpdateProps) => {
  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const { bEntity, as, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/b');
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getAs();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...bEntity,
        ...values,
        a: as.find(it => it.id.toString() === values.aId.toString()),
      };

      if (isNew) {
        props.createEntity(entity);
      } else {
        props.updateEntity(entity);
      }
    }
  };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="qMapGatewayApp.b.home.createOrEditLabel" data-cy="BCreateUpdateHeading">
            <Translate contentKey="qMapGatewayApp.b.home.createOrEditLabel">Create or edit a B</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : bEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="b-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="b-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label for="b-a">
                  <Translate contentKey="qMapGatewayApp.b.a">A</Translate>
                </Label>
                <AvInput id="b-a" data-cy="a" type="select" className="form-control" name="aId">
                  <option value="" key="0" />
                  {as
                    ? as.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/b" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </AvForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  as: storeState.a.entities,
  bEntity: storeState.b.entity,
  loading: storeState.b.loading,
  updating: storeState.b.updating,
  updateSuccess: storeState.b.updateSuccess,
});

const mapDispatchToProps = {
  getAs,
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(BUpdate);
