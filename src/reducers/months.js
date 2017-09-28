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

const _initMonthBefore = (oldList) => {
  const previousMoment = oldList.first().get("moment");
  const newList = List(oldList).unshift(_initMonth(subMonths(previousMoment, 1)));
  return newList;
}

const _initMonthAfter = (last) => {
  const newLastDate = _initMonth(addMonths(new Date(last), 1));
  console.warn(_initMonth(addMonths(new Date(last), 1)));
  
  //const previousMoment = Map(List(oldList).last()).get("moment");
  //const newList = List(oldList).push(initMonth(addMonths(previousMoment, 1)));
  return "aaaa";
}

const initialMonthsState = Map({
  inList: _initMonthsInList(initialDate),
});

export default months = (state = initialMonthsState, action) => {
  switch (action.type) {
    case 'addMonthBefore':
    return state.update('inList', list => list.unshift("bbb"));     
    case 'addMonthAfter':
      return state.update('inList', list => list.push(_initMonth(addMonths(new Date(state.get('inList').last()), 1))))        
    default:
      return state;
  }
}