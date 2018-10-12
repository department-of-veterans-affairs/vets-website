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
    event: 'disability-526EZ-itf-creation-failed',
  },
  {
    action: ITF_FETCH_SUCCEEDED,
    event: 'disability-526EZ-itf-retrieved',
  },
  {
    action: ITF_FETCH_FAILED,
    event: 'disability-526EZ-itf-fetch-failed',
  },
];

export default analyticsEvents;
