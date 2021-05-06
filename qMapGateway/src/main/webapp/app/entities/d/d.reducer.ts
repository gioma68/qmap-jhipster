import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ID, defaultValue } from 'app/shared/model/d.model';

export const ACTION_TYPES = {
  FETCH_D_LIST: 'd/FETCH_D_LIST',
  FETCH_D: 'd/FETCH_D',
  CREATE_D: 'd/CREATE_D',
  UPDATE_D: 'd/UPDATE_D',
  PARTIAL_UPDATE_D: 'd/PARTIAL_UPDATE_D',
  DELETE_D: 'd/DELETE_D',
  RESET: 'd/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ID>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
};

export type DState = Readonly<typeof initialState>;

// Reducer

export default (state: DState = initialState, action): DState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_D_LIST):
    case REQUEST(ACTION_TYPES.FETCH_D):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_D):
    case REQUEST(ACTION_TYPES.UPDATE_D):
    case REQUEST(ACTION_TYPES.DELETE_D):
    case REQUEST(ACTION_TYPES.PARTIAL_UPDATE_D):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_D_LIST):
    case FAILURE(ACTION_TYPES.FETCH_D):
    case FAILURE(ACTION_TYPES.CREATE_D):
    case FAILURE(ACTION_TYPES.UPDATE_D):
    case FAILURE(ACTION_TYPES.PARTIAL_UPDATE_D):
    case FAILURE(ACTION_TYPES.DELETE_D):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_D_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.FETCH_D):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_D):
    case SUCCESS(ACTION_TYPES.UPDATE_D):
    case SUCCESS(ACTION_TYPES.PARTIAL_UPDATE_D):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_D):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {},
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

const apiUrl = 'api/ds';

// Actions

export const getEntities: ICrudGetAllAction<ID> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_D_LIST,
  payload: axios.get<ID>(`${apiUrl}?cacheBuster=${new Date().getTime()}`),
});

export const getEntity: ICrudGetAction<ID> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_D,
    payload: axios.get<ID>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<ID> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_D,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ID> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_D,
    payload: axios.put(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const partialUpdate: ICrudPutAction<ID> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.PARTIAL_UPDATE_D,
    payload: axios.patch(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ID> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_D,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
