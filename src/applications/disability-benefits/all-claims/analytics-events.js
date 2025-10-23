import { VA_FORM_IDS } from 'platform/forms/constants';
import {
  ITF_FETCH_SUCCEEDED,
  ITF_FETCH_FAILED,
  ITF_CREATION_SUCCEEDED,
  ITF_CREATION_FAILED,
} from './actions';

const analyticsEvents = [
  {
    action: ITF_CREATION_SUCCEEDED,
    event: 'disability-526EZ-itf-created',
  },
  {
    action: ITF_CREATION_FAILED,
    event: 'disability-526EZ-itf-not-created',
  },
  {
    action: ITF_FETCH_SUCCEEDED,
    event: 'disability-526EZ-itf-retrieved',
  },
  {
    action: ITF_FETCH_FAILED,
    event: store => {
      const state = store.getState();
      return state.user.profile.savedForms.find(
        f => f.form === VA_FORM_IDS.FORM_21_526EZ,
      )
        ? 'disability-526EZ-itf-not-retrieved-saved-form-found'
        : 'disability-526EZ-itf-not-retrieved-saved-form-not-found';
    },
  },
];

export default analyticsEvents;
