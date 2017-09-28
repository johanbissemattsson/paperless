import { List, Map } from 'immutable';
import { format, getMonth, addMonths, subMonths, eachDay, startOfMonth, endOfMonth, startOfWeek, getDaysInMonth, differenceInWeeks} from 'date-fns';

const initialDate = new Date();

/*
const initMonth = (date) => {
  const daysOfMonth = eachDay(startOfMonth(date),endOfMonth(date));
  return [
    {
      key: format(date, 'YYYYMM'),
      name: format(date, 'MMMM'),
      weeks: new Array(differenceInWeeks(endOfMonth(date), startOfMonth(date)) + 1)
      .fill()
      .map((_,w) => ({
        startOfWeek: w
      }))
    },
  ]
}
    format(subMonths(date, 1), formatConfig),

*/

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