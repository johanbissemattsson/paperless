import { List, Map, Seq } from 'immutable';
import { format, startOfWeek, addWeeks, subWeeks } from 'date-fns';

import { SELECT_DATE } from '../actionTypes';

const initialDate = new Date();
const initialWeeksBeforeAndAfter = 52; // amount of weeks to initialize before and after the initial date 
const amountOfWeeksToAdd = 52;
const weekStartsOn = 1; // 1 = Monday (start of week)

const _formatDate = (date) => {
  return format(date, 'YYYY-MM-DD');  
}

const _initWeeksInList = (date) => {
  const startOfInitialWeek = startOfWeek(date, {weekStartsOn: weekStartsOn}); 
  return (
  List(new Array(initialWeeksBeforeAndAfter + 1 + initialWeeksBeforeAndAfter))
    .map((_,w) => (
      _formatDate(addWeeks(subWeeks(startOfInitialWeek, initialWeeksBeforeAndAfter ), w))
    ))
)};

const initialState = Map({
  weeks: _initWeeksInList( initialDate ),
  selected: _formatDate( initialDate ),
  weekStartsOn: weekStartsOn,
});

export default calendar = (state = initialState, action) => {
  switch (action.type) {
    case SELECT_DATE:
      return state.set('selected', action.date);
    case 'addWeeksBefore':
      console.log('addWeeksBefore');
      const firstWeek = state.get('weeks').first();
      return state.update('weeks', list => (
        list.withMutations((listWithMutations) => {
          for(let a = 1; a <= amountOfWeeksToAdd; a++) {
            listWithMutations.unshift(_formatDate(addWeeks(firstWeek, a)))            
          }
        })
      ))    
    case 'addWeeksAfter':
      console.log('addWeeksAfter');
      const lastWeek = state.get('weeks').last();
      return state.update('weeks', list => {
        const updatedWeeksList = list.withMutations((listWithMutations) => {
          for(let a = 1; a <= amountOfWeeksToAdd; a++) {
            listWithMutations.push(_formatDate(addWeeks(lastWeek, a)))            
          }
        });
        return updatedWeeksList;
      })
    default:
      return state;
  }
}