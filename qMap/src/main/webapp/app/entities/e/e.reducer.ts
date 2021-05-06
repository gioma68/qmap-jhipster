import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IE, defaultValue } from 'app/shared/model/e.model';

export const ACTION_TYPES = {
  FETCH_E_LIST: 'e/FETCH_E_LIST',
  FETCH_E: 'e/FETCH_E',
  CREATE_E: 'e/CREATE_E',
  UPDATE_E: 'e/UPDATE_E',
  PARTIAL_UPDATE_E: 'e/PARTIAL_UPDATE_E',
  DELETE_E: 'e/DELETE_E',
  RESET: 'e/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IE>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
};

export type EState = Readonly<typeof initialState>;

// Reducer

export default (state: EState = initialState, action): EState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_E_LIST):
    case REQUEST(ACTION_TYPES.FETCH_E):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_E):
    case REQUEST(ACTION_TYPES.UPDATE_E):
    case REQUEST(ACTION_TYPES.DELETE_E):
    case REQUEST(ACTION_TYPES.PARTIAL_UPDATE_E):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_E_LIST):
    case FAILURE(ACTION_TYPES.FETCH_E):
    case FAILURE(ACTION_TYPES.CREATE_E):
    case FAILURE(ACTION_TYPES.UPDATE_E):
    case FAILURE(ACTION_TYPES.PARTIAL_UPDATE_E):
    case FAILURE(ACTION_TYPES.DELETE_E):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_E_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.FETCH_E):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_E):
    case SUCCESS(ACTION_TYPES.UPDATE_E):
    case SUCCESS(ACTION_TYPES.PARTIAL_UPDATE_E):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_E):
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

const apiUrl = 'api/es';

// Actions

export const getEntities: ICrudGetAllAction<IE> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_E_LIST,
  payload: axios.get<IE>(`${apiUrl}?cacheBuster=${new Date().getTime()}`),
});

export const getEntity: ICrudGetAction<IE> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_E,
    payload: axios.get<IE>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IE> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_E,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IE> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_E,
    payload: axios.put(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const partialUpdate: ICrudPutAction<IE> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.PARTIAL_UPDATE_E,
    payload: axios.patch(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IE> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_E,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
