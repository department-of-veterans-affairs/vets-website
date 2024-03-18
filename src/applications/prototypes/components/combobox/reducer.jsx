// import React from 'react'
import { createStore, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {v4 as uuidv4} from 'uuid';
import {
  ADD_ITEM,
  UPDATE_CURRENT,
  DELETE_ITEM,
  UPDATE_ITEM,
  SHOW_NEW_CONDITION_SECTION,
  HIDE_NEW_CONDITION_SECTION,
} from './actions';


// import "@department-of-veterans-affairs/formation/dist/formation.min.css";
// import "@department-of-veterans-affairs/component-library/dist/main.css";
export const initialState = {
    list: [
      // {
      //   name: "Finger(s)",
      //   id: 1
      // },
      // {
      //   name: "Asthma",
      //   id: 2
      // }
    ],
    current: { name: ""},
    isAddingNewCondition: true
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_NEW_CONDITION_SECTION:
        return { ...state, isAddingNewCondition: true };
    case HIDE_NEW_CONDITION_SECTION:
        return { ...state, isAddingNewCondition: false };
    case ADD_ITEM:
        return { ...state, list: [...state.list, action.payload] };
    case UPDATE_CURRENT:
        return { ...state, current: { ...state.current, ...action.payload } };
    case DELETE_ITEM:
        return { ...state, list: state.list.filter(item => item.id !== action.payload.id) }
    case UPDATE_ITEM:
        return {
            ...state,
            list: state.list.map(item => item.id === action.payload.id ? action.payload : item)
        };
    default:
          return state;
  }
};

export const store = createStore(reducer);
