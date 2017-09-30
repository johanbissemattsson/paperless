import { List, Map, Seq } from 'immutable';
import { format, addMonths, subMonths } from 'date-fns';

const initialDate = new Date();
const initialMonthsBeforeAndAfter = 6; // amount of months to initialize before and after the initial date 
const amountOfMonthsToAdd = 6;

const _initMonth = (date) => {
  return format(date, 'YYYY-MM');
}

const _initMonthsInList = (date) => (
  List(new Array(initialMonthsBeforeAndAfter + 1 + initialMonthsBeforeAndAfter))
    .map((_,m) => (
      _initMonth(addMonths(subMonths(date, initialMonthsBeforeAndAfter ), m))
    ))
)

const initialState = Map({
  months: _initMonthsInList( initialDate ),
});

export default calendar = (state = initialState, action) => {
  switch (action.type) {
    case 'addMonthBefore':
     return state.update('months', list => list.unshift(_initMonth(subMonths(format(state.get('months').first()), 1))));       
    case 'addMonthAfter':
      const lastMonth = state.get('months').last();
      return state.update('months', list => (
        list.withMutations((listWithMutations) => {
          for(let i = 0; i <= amountOfMonthsToAdd; i++) {
            listWithMutations.push(_initMonth(addMonths(lastMonth, i)))            
          }
        })
      )) 
    default:
      return state;
  }
}