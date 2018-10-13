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
    event: 'disability-526EZ-itf-not-creation',
  },
  {
    action: ITF_FETCH_SUCCEEDED,
    event: 'disability-526EZ-itf-retrieved',
  },
  {
    action: ITF_FETCH_FAILED,
    event: store => {
      const state = store.getState();
      return state.user.profile.savedForms.find(f => f.form === '21-526EZ')
        ? 'disability-526EZ-itf-not-retrieved-existing-user'
        : 'disability-526EZ-itf-not-retrieved-new-user';
    },
  },
];

export default analyticsEvents;
