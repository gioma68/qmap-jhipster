import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IC, defaultValue } from 'app/shared/model/c.model';

export const ACTION_TYPES = {
  FETCH_C_LIST: 'c/FETCH_C_LIST',
  FETCH_C: 'c/FETCH_C',
  CREATE_C: 'c/CREATE_C',
  UPDATE_C: 'c/UPDATE_C',
  PARTIAL_UPDATE_C: 'c/PARTIAL_UPDATE_C',
  DELETE_C: 'c/DELETE_C',
  RESET: 'c/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IC>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
};

export type CState = Readonly<typeof initialState>;

// Reducer

export default (state: CState = initialState, action): CState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_C_LIST):
    case REQUEST(ACTION_TYPES.FETCH_C):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_C):
    case REQUEST(ACTION_TYPES.UPDATE_C):
    case REQUEST(ACTION_TYPES.DELETE_C):
    case REQUEST(ACTION_TYPES.PARTIAL_UPDATE_C):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_C_LIST):
    case FAILURE(ACTION_TYPES.FETCH_C):
    case FAILURE(ACTION_TYPES.CREATE_C):
    case FAILURE(ACTION_TYPES.UPDATE_C):
    case FAILURE(ACTION_TYPES.PARTIAL_UPDATE_C):
    case FAILURE(ACTION_TYPES.DELETE_C):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_C_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.FETCH_C):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_C):
    case SUCCESS(ACTION_TYPES.UPDATE_C):
    case SUCCESS(ACTION_TYPES.PARTIAL_UPDATE_C):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_C):
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

const apiUrl = 'api/cs';

// Actions

export const getEntities: ICrudGetAllAction<IC> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_C_LIST,
  payload: axios.get<IC>(`${apiUrl}?cacheBuster=${new Date().getTime()}`),
});

export const getEntity: ICrudGetAction<IC> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_C,
    payload: axios.get<IC>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IC> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_C,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IC> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_C,
    payload: axios.put(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const partialUpdate: ICrudPutAction<IC> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.PARTIAL_UPDATE_C,
    payload: axios.patch(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IC> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_C,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
