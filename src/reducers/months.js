import { List, Map } from 'immutable';
import { format, addMonths, subMonths } from 'date-fns';

const initialDate = new Date();

const _initMonth = (date) => {
  return format(date, 'YYYY-MM');
}

const _initMonthsInList = (date) => {
  return List([
    _initMonth(subMonths(date,1)),
    _initMonth(date),
    _initMonth(addMonths(date,1))
  ]);
}

const initialState = Map({
  inList: _initMonthsInList(initialDate),
});

export default months = (state = initialState, action) => {
  switch (action.type) {
    case 'addMonthBefore':
    return state.update('inList', list => list.unshift(_initMonth(subMonths(new Date(state.get('inList').first()), 1))));       
    case 'addMonthAfter':
      return state.update('inList', list => list.push(_initMonth(addMonths(new Date(state.get('inList').last()), 1))));     
    default:
      return state;
  }
}