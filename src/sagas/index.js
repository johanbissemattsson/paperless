import { all } from 'redux-saga/effects';
import helloSaga from './helloSaga';

const appSaga = function * appSaga() {
  yield all([
    ...helloSaga
  ]);
};

export default appSaga;