import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IA, defaultValue } from 'app/shared/model/a.model';

export const ACTION_TYPES = {
  FETCH_A_LIST: 'a/FETCH_A_LIST',
  FETCH_A: 'a/FETCH_A',
  CREATE_A: 'a/CREATE_A',
  UPDATE_A: 'a/UPDATE_A',
  PARTIAL_UPDATE_A: 'a/PARTIAL_UPDATE_A',
  DELETE_A: 'a/DELETE_A',
  RESET: 'a/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IA>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
};

export type AState = Readonly<typeof initialState>;

// Reducer

export default (state: AState = initialState, action): AState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_A_LIST):
    case REQUEST(ACTION_TYPES.FETCH_A):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_A):
    case REQUEST(ACTION_TYPES.UPDATE_A):
    case REQUEST(ACTION_TYPES.DELETE_A):
    case REQUEST(ACTION_TYPES.PARTIAL_UPDATE_A):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_A_LIST):
    case FAILURE(ACTION_TYPES.FETCH_A):
    case FAILURE(ACTION_TYPES.CREATE_A):
    case FAILURE(ACTION_TYPES.UPDATE_A):
    case FAILURE(ACTION_TYPES.PARTIAL_UPDATE_A):
    case FAILURE(ACTION_TYPES.DELETE_A):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_A_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.FETCH_A):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_A):
    case SUCCESS(ACTION_TYPES.UPDATE_A):
    case SUCCESS(ACTION_TYPES.PARTIAL_UPDATE_A):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_A):
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

const apiUrl = 'api/as';

// Actions

export const getEntities: ICrudGetAllAction<IA> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_A_LIST,
  payload: axios.get<IA>(`${apiUrl}?cacheBuster=${new Date().getTime()}`),
});

export const getEntity: ICrudGetAction<IA> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_A,
    payload: axios.get<IA>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IA> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_A,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IA> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_A,
    payload: axios.put(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const partialUpdate: ICrudPutAction<IA> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.PARTIAL_UPDATE_A,
    payload: axios.patch(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IA> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_A,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
