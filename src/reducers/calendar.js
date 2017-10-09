import { List, Map, Seq } from 'immutable';
import { format, addMonths, subMonths } from 'date-fns';

import { SELECT_DATE } from '../actionTypes';

const initialDate = new Date();
const initialMonthsBeforeAndAfter = 6; // amount of months to initialize before and after the initial date 
const amountOfMonthsToAdd = 6;

const _formatMonth = (date) => {
  return format(date, 'YYYY-MM');
}

const _formatDate = (date) => {
  return format(date, 'YYYY-MM-DD');  
}

const _initMonthsInList = (date) => (
  List(new Array(initialMonthsBeforeAndAfter + 1 + initialMonthsBeforeAndAfter))
    .map((_,m) => (
      _formatMonth(addMonths(subMonths(date, initialMonthsBeforeAndAfter ), m))
    ))
)

const initialState = Map({
  months: _initMonthsInList( initialDate ),
  selected: _formatDate( initialDate )
});

export default calendar = (state = initialState, action) => {
  switch (action.type) {
    case SELECT_DATE:
      return state.set('selected', action.date);
    case 'addMonthsBefore':
      const firstMonth = state.get('months').first();
      return state.update('months', list => (
        list.withMutations((listWithMutations) => {
          for(let a = 0; a <= amountOfMonthsToAdd; a++) {
            listWithMutations.unshift(_formatMonth(addMonths(firstMonth, a)))            
          }
        })
      ))    
    case 'addMonthsAfter':
      const lastMonth = state.get('months').last();
      return state.update('months', list => (
        list.withMutations((listWithMutations) => {
          for(let a = 0; a <= amountOfMonthsToAdd; a++) {
            listWithMutations.push(_formatMonth(addMonths(lastMonth, a)))            
          }
        })
      ))
    default:
      return state;
  }
}