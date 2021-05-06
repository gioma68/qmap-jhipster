import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IB, defaultValue } from 'app/shared/model/b.model';

export const ACTION_TYPES = {
  FETCH_B_LIST: 'b/FETCH_B_LIST',
  FETCH_B: 'b/FETCH_B',
  CREATE_B: 'b/CREATE_B',
  UPDATE_B: 'b/UPDATE_B',
  PARTIAL_UPDATE_B: 'b/PARTIAL_UPDATE_B',
  DELETE_B: 'b/DELETE_B',
  RESET: 'b/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IB>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
};

export type BState = Readonly<typeof initialState>;

// Reducer

export default (state: BState = initialState, action): BState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_B_LIST):
    case REQUEST(ACTION_TYPES.FETCH_B):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_B):
    case REQUEST(ACTION_TYPES.UPDATE_B):
    case REQUEST(ACTION_TYPES.DELETE_B):
    case REQUEST(ACTION_TYPES.PARTIAL_UPDATE_B):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_B_LIST):
    case FAILURE(ACTION_TYPES.FETCH_B):
    case FAILURE(ACTION_TYPES.CREATE_B):
    case FAILURE(ACTION_TYPES.UPDATE_B):
    case FAILURE(ACTION_TYPES.PARTIAL_UPDATE_B):
    case FAILURE(ACTION_TYPES.DELETE_B):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_B_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.FETCH_B):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_B):
    case SUCCESS(ACTION_TYPES.UPDATE_B):
    case SUCCESS(ACTION_TYPES.PARTIAL_UPDATE_B):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_B):
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

const apiUrl = 'api/bs';

// Actions

export const getEntities: ICrudGetAllAction<IB> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_B_LIST,
  payload: axios.get<IB>(`${apiUrl}?cacheBuster=${new Date().getTime()}`),
});

export const getEntity: ICrudGetAction<IB> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_B,
    payload: axios.get<IB>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IB> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_B,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IB> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_B,
    payload: axios.put(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const partialUpdate: ICrudPutAction<IB> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.PARTIAL_UPDATE_B,
    payload: axios.patch(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IB> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_B,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
