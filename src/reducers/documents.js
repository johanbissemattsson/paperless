import { List, Map } from 'immutable';
import { format, getMonth, addMonths, subMonths, eachDay, startOfMonth, endOfMonth, startOfWeek, getDaysInMonth, differenceInWeeks} from 'date-fns';
const tempListData = [{title: 'Title text', month:'111', documents:'', key: 's1item1'},{title: 'Title textaaaa 2', month:'222', documents:'', key: 's1item2'},{title: 'Title text3',month:'111', documents: '', key: 's1item3'}];

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

const initMonth = (date) => {
  return Map({
    key: format(date, 'YYYYMM'),    
    moment: format(startOfMonth(date)),
    monthName: format(date, 'MMMM'),
    isLoading: true,
    data: null
  });
}

const initVisibleMonths = (date) => {
  return List([
    initMonth(subMonths(date,1)),
    initMonth(date),
    initMonth(addMonths(date,1))
  ]);
}

const addMonthBefore = (oldList) => {
  const previousMoment = Map(List(oldList).first()).get("moment");
  const newList = List(oldList).unshift(initMonth(subMonths(previousMoment, 1)));
  return newList;
}

const addMonthAfter = (oldList) => {
  const previousMoment = Map(List(oldList).last()).get("moment");
  const newList = List(oldList).push(initMonth(addMonths(previousMoment, 1)));
  return newList;
}

const initialDocumentsState = Map({
  isCameraActivated: true,
  data: tempListData,
  visibleMonths: initVisibleMonths(initialDate),
});

export default documents = (state = initialDocumentsState, action) => {
  switch (action.type) {
    case 'loadDocuments':
      return { ...state, isCameraActivated: false }; //Måste göras immutable??
    case 'addMonthBefore':
      return { ...state, visibleMonths: addMonthBefore(state.visibleMonths)};
    case 'addMonthAfter':
      return { ...state, visibleMonths: addMonthAfter(state.visibleMonths)};      
    case 'Login':
      return { ...state, isCameraActivated: true };
    case 'Logout':
      return { ...state, isCameraActivated: false };
    default:
      return state;
  }
}