import { all, takeEvery } from 'redux-saga/effects';

import { LOGIN, LOGOUT } from '../actionTypes';

/* Start worker sagas */
const sagaLogin = function* sagaLogin(action) {
  try {
    console.log("saga login!!!");
  } catch (e) {
    console.log("error", e);
  }
}

const sagaLogout = function* sagaLogout(action) {
  try {
    console.log("saga logout!!!");
  } catch (e) {
    console.log("error", e);
  }
}
/* End worker sagas */

export default helloSaga = [
  takeEvery(LOGIN, sagaLogin),
  takeEvery(LOGOUT, sagaLogout)
];