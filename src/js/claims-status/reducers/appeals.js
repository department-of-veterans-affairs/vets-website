import _ from 'lodash/fp';
// import moment from 'moment';

import {
  SET_APPEALS,
  SET_APPEALS_UNAVAILABLE,
  FETCH_APPEALS_PENDING,
  FETCH_APPEALS_SUCCESS
} from '../actions/index.jsx';

const initialState = {
  appealsList: [],
  appealsLoading: false, // They're loading only after the fetch action
  available: true
};


// Sort by the latest event in each appeal
// Commented out because it's not necessary now, but will be when we refactor the reducers
// function sortAppeals(list) {
//   // const list = [
//   //   {
//   //     events: [
//   //       { date: '2015-10-20' },
//   //       { date: '2015-02-19' },
//   //       { date: '2015-11-30' }
//   //     ]
//   //   }
//   // ];
// 
//   return _.orderBy([appeal => {
//     const dates = appeal.events.map(e => moment(e.date).unix());
//     const latestDate = dates.reduce((latest, date) => {
//       return date > latest ? date : latest;
//     }, 0);
// 
//     return latestDate;
//   }], 'desc', list);
// }


export default function appealsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_APPEALS_PENDING:
      return _.set('appealsLoading', true, state);
    case FETCH_APPEALS_SUCCESS: {
      // TODO: When we refactor the reducers, make sure to combine the claims and appeals.
      //  It doesn't need to be done here (and probably shouldn't be), but I think it makes
      //  sense to do it in a reducer or action creator.
      return _.merge(state, {
        appealsLoading: false,
        available: true,
      });
    }
    // TODO: Verify that this isn't actually needed and then remove it
    case SET_APPEALS:
      return _.set('available', true, state);
    case SET_APPEALS_UNAVAILABLE:
      // Maybe should set appealsLoading to false here too
      return _.set('available', false, state);
    default:
      return state;
  }
}
