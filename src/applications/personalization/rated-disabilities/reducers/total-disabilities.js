import set from 'platform/utilities/data/set';

import { FETCH_TOTAL_RATING_REQUEST } from '../actions/index';

const initialState = {
    someStuff: "initial",
}

 export function totalRating(state = initialState, action) {
    switch(action.type) {
        case FETCH_TOTAL_RATING_REQUEST:
            state.someStuff = 'new value';
            return state;
        default:
            return state;
    }
}