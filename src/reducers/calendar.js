import { List, Map, Seq } from 'immutable';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, isEqual, isBefore, isAfter, eachDay, startOfDay, isSameWeek, isSameDay } from 'date-fns';

import { SELECT_DATE } from '../actionTypes';

const initialDate = new Date();
const initialWeeksBeforeAndAfter = 20; // amount of weeks to initialize before and after the initial date 
const amountOfWeeksToAdd = 2;
const weekStartsOn = 1; // 1 = Monday (start of week)

const _formatDate = (date) => {
  return format(date, 'YYYY-MM-DD');  
}

const _initWeek = (date, selectedDate) => {
  const days = List(eachDay(date, endOfWeek(date, {weekStartsOn: weekStartsOn})).map((day) => Map({date: day, selected: isSameDay(day, selectedDate)})));
  return (
    new Map({days: days, isSelectedWeek: isSameWeek(date, selectedDate, {weekStartsOn: weekStartsOn}), isBeforeSelectedWeek: isBefore(date, selectedDate), isAfterSelectedWeek: isAfter(date, selectedDate)})
  );
}

const _reinitWeeksInList = (selectedDate, firstDateInList, numberOfWeeksInList) => {
  const newWeeks = List(new Array(numberOfWeeksInList))
      .map((_,w) => {
        const startOfW = addWeeks(firstDateInList, w);
        return _initWeek(startOfW, selectedDate);
      });
  return(newWeeks);
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
    const firstDateInList = state.get('weeks').first().get('days').first().get('date');
    const numberOfWeeksInList = state.get('weeks').size;

      const reinitializedCalendar = Map({
        weeks: _reinitWeeksInList(action.date, firstDateInList, numberOfWeeksInList),
        selectedDate: action.date,
      })    
      return state.merge(reinitializedCalendar);
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

      /*
      console.warn('selectedDate in reducer', action.date);
      const oldSelectedWeekIndex = state.get('weeks').findIndex((weekItem) => weekItem.get('isSelectedWeek'));
      console.log(oldSelectedWeekIndex);
      console.log(state.get('weeks').get(oldSelectedWeekIndex).get('days').first().get('date'));
      console.warn(isSameWeek(action.date, state.get('weeks').get(oldSelectedWeekIndex).get('days').first().get('date'), {weekStartsOn: weekStartsOn}));

      const isSameWeekAsOldSelected = isSameWeek(action.date, state.get('weeks').get(oldSelectedWeekIndex).get('days').first().get('date'), {weekStartsOn: weekStartsOn});

      if (isSameWeekAsOldSelected) {
        console.log('sameweek so update just this week');
        const reinitializedWeek = _initWeek(startOfWeek(action.date, {weekStartsOn: weekStartsOn}), action.date);
        console.log(reinitializedWeek);
        return state.set('selectedDate', action.date).setIn(['weeks', oldSelectedWeekIndex], reinitializedWeek);
      } else {
        console.log('not same week so update both old week and new one');
        const newSelectedWeekIndex = state.get('weeks').findIndex((weekItem) => isSameWeek(action.date, weekItem.get('days').first().get('date'), {weekStartsOn: weekStartsOn}));
        const oldReinitializedWeek = _initWeek(startOfWeek(state.get('weeks').get(oldSelectedWeekIndex).get('days').first().get('date'), {weekStartsOn: weekStartsOn}), action.date);
        const newReinitializedWeek = _initWeek(startOfWeek(action.date, {weekStartsOn: weekStartsOn}), action.date);

        return state.set('selectedDate', action.date).setIn(['weeks', newSelectedWeekIndex], newReinitializedWeek).setIn(['weeks', oldSelectedWeekIndex], oldReinitializedWeek);
      };
      */