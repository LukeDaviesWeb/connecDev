import { combineReducers } from 'redux';
import authReducer from './authReducer.jsx';
import errorReducer from './errorReducer.jsx';

export default combineReducers({
  auth: authReducer,
  errors: errorReducer
});
