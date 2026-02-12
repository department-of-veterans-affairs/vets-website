import {
  CH31_CASE_MILESTONES_FETCH_FAILED,
  CH31_CASE_MILESTONES_FETCH_STARTED,
  CH31_CASE_MILESTONES_FETCH_SUCCEEDED,
} from '../constants';

const initialState = {
  loading: false,
  error: null,
  data: null,
};

export default function ch31CaseMilestones(state = initialState, action) {
  switch (action.type) {
    case CH31_CASE_MILESTONES_FETCH_STARTED:
      return { ...state, loading: true, error: null };

    case CH31_CASE_MILESTONES_FETCH_SUCCEEDED:
      return { ...state, loading: false, data: action.payload, error: null };

    case CH31_CASE_MILESTONES_FETCH_FAILED:
      return {
        ...state,
        loading: false,
        error: action.error || { status: null, messages: ['Unknown error'] },
      };

    default:
      return state;
  }
}
