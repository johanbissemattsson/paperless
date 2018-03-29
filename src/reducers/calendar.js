import { List, Map, Seq } from 'immutable';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, isEqual, isBefore, isAfter, eachDay, startOfDay } from 'date-fns';

import { SELECT_DATE } from '../actionTypes';

const initialDate = new Date();
const initialWeeksBeforeAndAfter = 26; // amount of weeks to initialize before and after the initial date 
const amountOfWeeksToAdd = 26;
const weekStartsOn = 1; // 1 = Monday (start of week)

const _formatDate = (date) => {
  return format(date, 'YYYY-MM-DD');  
}

const _initWeek = (date, selectedDate) => {
  const days = List(eachDay(date, endOfWeek(date, {weekStartsOn: 1})).map((day) => Map({date: day, selected: isEqual(day, selectedDate)})));
  return (
    new Map({days: days, isSelectedWeek: isEqual(date, selectedDate), isBeforeSelectedWeek: isBefore(date, selectedDate), isAfterSelectedWeek: isAfter(date, selectedDate)})
  );
}

const _initWeeksInList = (date) => {
  const startOfInitialWeek = startOfWeek(date, {weekStartsOn: weekStartsOn});
  const endOfInitialWeek = endOfWeek(date, {weekStartsOn: weekStartsOn});

  return (
    List(new Array(initialWeeksBeforeAndAfter + 1 + initialWeeksBeforeAndAfter))
      .map((_,w) => {
        const startOfWeek = addWeeks(subWeeks(startOfInitialWeek, initialWeeksBeforeAndAfter ), w);
        const endOfWeek = addWeeks(subWeeks(endOfInitialWeek, initialWeeksBeforeAndAfter ), w);
        const isSelectedWeek = isEqual(startOfWeek, startOfInitialWeek);
        const days = List(eachDay(startOfWeek, endOfWeek).map((day) => Map({date: day, selected: isEqual(day, startOfDay(initialDate))})));
        return (
          new Map({days: days, isSelectedWeek: isSelectedWeek, isBeforeSelectedWeek: isBefore(startOfWeek, startOfInitialWeek), isAfterSelectedWeek: isAfter(startOfWeek, startOfInitialWeek)})
        )
      })
)};

const initialState = Map({
  weeks: _initWeeksInList( initialDate ),
  selectedDate: startOfDay(initialDate),
  weekStartsOn: weekStartsOn,
});

export default calendar = (state = initialState, action) => {
  switch (action.type) {
    case SELECT_DATE:
      return state.set('selectedDate', action.date); //remeber to reinit/update weeks
    case 'addWeeksBefore':
      console.log('addWeeksBefore');
      return state;
    case 'addWeeksAfter':
      console.log('addWeeksAfter');
      const lastWeekInList = state.getIn(['weeks', -1, 'days', 0, 'date' ]);
      const selectedDate = state.get('selectedDate');
      return state.update('weeks', list => {
        const updatedWeeksList = list.withMutations((listWithMutations) => {
          for (let a = 1; a <= amountOfWeeksToAdd; a++) {
            listWithMutations.push(_initWeek(addWeeks(lastWeekInList, a), selectedDate));           
          }
        });
        return updatedWeeksList;
      })
    default:
      return state;
  }
}