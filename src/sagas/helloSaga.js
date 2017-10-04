import { all, takeEvery } from 'redux-saga/effects';

import { LOGIN, LOGOUT } from '../actionTypes';

/* Start worker sagas */

const login = function* login(action) {
  try {
    console.log("saga login!!!");
  } catch (e) {
    console.log("error", e);
  }
}

const logout = function* logout(action) {
  try {
    console.log("saga logout!!!");
  } catch (e) {
    console.log("error", e);
  }
}

/* End worker sagas */

export default helloSaga = [
  takeEvery(LOGIN, login),
  takeEvery(LOGOUT, logout)
];