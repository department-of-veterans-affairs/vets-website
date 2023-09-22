import recordEvent from '~/platform/monitoring/record-event';
import { apiRequest } from '~/platform/utilities/api';

import { LOADING_STATES } from '../../common/constants';
import { RX_TRACKING_SUPPORTING_FACILITIES } from '../constants';

// HELPERS

// Gets an error key string to send to Google Analytics. Expects to receive an
// array of objects and will build the error key string from the first object.
const getErrorKey = errors => {
  let key = 'Unknown Error';
  const firstError = errors.slice(0, 1);
  if (firstError) {
    key = `${firstError.status || 'unknown error status'} - ${firstError.code ||
      firstError.error ||
      'unknown error code'}`;
  }
  return key;
};

const recordAPIEvent = ({
  method,
  success,
  errors,
  usingCheckboxes = false,
}) => {
  const event = {
    event: 'api_call',
    'api-name': `${method} communication_preferences${
      usingCheckboxes ? ' - checkboxes' : ''
    }`,
    'api-status': 'started',
  };
  if (success) {
    event['api-status'] = 'successful';
  }
  if (errors) {
    event['api-status'] = 'failed';
    event['error-key'] = getErrorKey(errors);
  }
  recordEvent(event);

  // clear the `error-key` immediately after recording an error
  if (event['error-key']) {
    recordEvent({
      'error-key': undefined,
    });
  }
};

// Callback function to use with Array.sort
// At present its only function is to
// make sure that the Your Health Care group appears first
function communicationGroupsSorter(groupA, groupB) {
  // The lower the sorting priority value, the closer it is to the top of the
  // list (because lower numbers come first). We'll use negative numbers to
  // override the group IDs that comes from the API.
  const groupSortingPriorities = {
    3: -1000, // group 3, "Your health care", should come first
  };
  function getCommunicationGroupSortingPriority(groupId) {
    return groupSortingPriorities[groupId] ?? groupId;
  }

  return (
    getCommunicationGroupSortingPriority(groupA.id) -
    getCommunicationGroupSortingPriority(groupB.id)
  );
}

// Makes a filter callback to operate on the raw communication groups API data
// 1. Removes the health care group if there are no facilities available
const makeHealthCareGroupFilter = facilities => group => {
  if (group.id === 3 && !facilities?.length) {
    return false;
  }
  return true;
};

// Makes a reducer callback to operate on the raw communication groups API data
// 1. Removes the RX tracking item if there are no facilities that support that
// feature
const makeRxTrackingItemFilterReducer = facilities => (groups, group) => {
  const newGroup = { ...group };
  const filteredItems = newGroup.communicationItems.filter(item => {
    if (item.id === 4) {
      return facilities.some(facility =>
        RX_TRACKING_SUPPORTING_FACILITIES.has(facility.facilityId),
      );
    }
    return true;
  });
  newGroup.communicationItems = filteredItems;
  groups.push(newGroup);
  return groups;
};

// ACTION TYPES
const FETCH_STARTED = '@@profile/communicationPreferences/fetchStarted';
const FETCH_FAILED = '@@profile/communicationPreferences/fetchFailed';
const FETCH_SUCCEEDED = '@@profile/communicationPreferences/fetchSucceeded';
const SAVE_CHANNEL_STARTED =
  '@@profile/communicationPreferences/saveChannelStarted';
const SAVE_CHANNEL_FAILED =
  '@@profile/communicationPreferences/saveChannelFailed';
const SAVE_CHANNEL_SUCCEEDED =
  '@@profile/communicationPreferences/saveChannelSucceeded';

export const endpoint = '/profile/communication_preferences';

// ACTION CREATORS
const startFetch = () => {
  return { type: FETCH_STARTED };
};

const fetchSucceeded = (communicationGroups, { facilities } = {}) => {
  return {
    type: FETCH_SUCCEEDED,
    payload: { communicationGroups, facilities },
  };
};

const fetchFailed = errors => {
  return { type: FETCH_FAILED, errors };
};

const startSaveChannel = (channelId, isAllowed) => {
  return { type: SAVE_CHANNEL_STARTED, payload: { channelId, isAllowed } };
};

const saveChannelFailed = (channelId, isAllowed, errors) => {
  return {
    type: SAVE_CHANNEL_FAILED,
    payload: { channelId, isAllowed, errors },
  };
};

const saveChannelSucceeded = (channelId, data) => {
  return { type: SAVE_CHANNEL_SUCCEEDED, payload: { channelId, data } };
};

export const fetchCommunicationPreferenceGroups = ({
  facilities = [],
} = {}) => {
  return async dispatch => {
    dispatch(startFetch());
    recordAPIEvent({ method: 'GET' });

    try {
      const communicationPreferences = await apiRequest(endpoint);
      const { communicationGroups } = communicationPreferences.data.attributes;
      if (!communicationGroups) {
        throw new TypeError('communicationGroups is undefined');
      }
      dispatch(fetchSucceeded(communicationGroups, { facilities }));
      recordAPIEvent({ method: 'GET', success: true });
    } catch (error) {
      const errors = error.errors || [error];
      dispatch(fetchFailed(errors));
      recordAPIEvent({ method: 'GET', errors });
    }
  };
};

// accepts an "api call" object we can use to easily make an apiRequest call.
// The `api call` object has a method, endpoint, and payload. The "api call"
// object will be generated by a CommunicationChannel.getApiData() method
export const saveCommunicationPreferenceChannel = (channelId, apiCallInfo) => {
  return async dispatch => {
    dispatch(startSaveChannel(channelId, apiCallInfo.isAllowed));
    recordAPIEvent({ method: apiCallInfo.method });

    try {
      const response = await apiRequest(apiCallInfo.endpoint, {
        method: apiCallInfo.method,
        body: JSON.stringify(apiCallInfo.payload),
        headers: { 'Content-Type': 'application/json' },
      });
      // It's possible that a 200 from the API is not _really_ a successful
      // call and we need to treat it like an error
      if (response.status !== 'COMPLETED_SUCCESS') {
        const error = new Error();
        error.errors = response.messages;
        throw error;
      }
      dispatch(saveChannelSucceeded(channelId, response.bio));
      recordAPIEvent({ method: apiCallInfo.method, success: true });
    } catch (error) {
      const errors = error.errors ?? [error];
      dispatch(saveChannelFailed(channelId, apiCallInfo.wasAllowed, errors));
      recordAPIEvent({ method: apiCallInfo.method, errors });
    }
  };
};

// SELECTORS
export const selectGroups = state => {
  return state.groups;
};
export const selectGroupById = (state, groupId) => {
  return selectGroups(state).entities[groupId];
};
export const selectItems = state => {
  return state.items;
};
export const selectItemById = (state, itemId) => {
  return selectItems(state).entities[itemId];
};
const selectChannels = state => {
  return state.channels;
};
export const selectChannelById = (state, channelId) => {
  return selectChannels(state).entities[channelId];
};
export const selectChannelUiById = (state, channelId) => {
  return selectChannelById(state, channelId).ui;
};

// REDUCERS
function communicationGroupsReducer(accumulator, group) {
  const groupId = `group${group.id}`;
  accumulator.ids.push(groupId);
  const communicationGroup = {
    name: group.name,
    description: group.description,
  };
  communicationGroup.items = group.communicationItems.map(item => {
    return `item${item.id}`;
  });
  accumulator.entities[groupId] = communicationGroup;
  return accumulator;
}

function communicationItemsReducer(accumulator, item) {
  const itemId = `item${item.id}`;
  accumulator.ids.push(itemId);
  const communicationItem = {
    name: item.name,
  };
  communicationItem.channels = item.communicationChannels.map(channel => {
    return `channel${item.id}-${channel.id}`;
  });
  accumulator.entities[itemId] = communicationItem;
  return accumulator;
}

function communicationChannelsReducer(accumulator, item) {
  const itemId = `item${item.id}`;
  item.communicationChannels.forEach(channel => {
    const channelId = `channel${item.id}-${channel.id}`;
    accumulator.ids.push(channelId);
    const communicationChannel = {
      channelType: channel.id,
      parentItem: itemId,
      isAllowed: channel.communicationPermission?.allowed ?? null,
      permissionId: channel.communicationPermission?.id ?? null,
      defaultSendIndicator: channel?.defaultSendIndicator ?? null,
      ui: {
        updateStatus: LOADING_STATES.idle,
        errors: null,
      },
    };
    accumulator.entities[channelId] = communicationChannel;
  });
  return accumulator;
}

// used to clear out any existing UI alerts on all channels,
// before we attempt to start a new update request
function resetUiStateOnAllChannels(state) {
  const newState = { ...state };
  Object.keys(newState.channels.entities).forEach(key => {
    newState.channels.entities[key].ui = {
      updateStatus: LOADING_STATES.idle,
      errors: null,
    };
  });
  return newState;
}

// MAIN REDUCER
const initialState = {
  loadingStatus: LOADING_STATES.idle,
  loadingErrors: null,
  groups: {
    ids: [],
    entities: {},
  },
  items: {
    ids: [],
    entities: {},
  },
  channels: {
    ids: [],
    entities: {},
  },
};
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case FETCH_STARTED: {
      return { ...state, loadingStatus: LOADING_STATES.pending };
    }
    case FETCH_FAILED: {
      return {
        ...state,
        loadingStatus: LOADING_STATES.error,
        loadingErrors: action.errors,
      };
    }
    case FETCH_SUCCEEDED: {
      const { communicationGroups, facilities } = action.payload;
      // sort the raw API data and filter out any groups the user should not see
      const availableCommunicationGroups = communicationGroups
        .filter(makeHealthCareGroupFilter(facilities))
        .reduce(makeRxTrackingItemFilterReducer(facilities), [])
        .sort(communicationGroupsSorter);
      const availableCommunicationItems = availableCommunicationGroups.reduce(
        (acc, group) => {
          return [...acc, ...group.communicationItems];
        },
        [],
      );
      // massaged communication group data to store in Redux
      const groups = availableCommunicationGroups.reduce(
        communicationGroupsReducer,
        {
          ids: [],
          entities: {},
        },
      );
      // massaged and filtered communication items data to store in Redux
      const items = availableCommunicationItems.reduce(
        communicationItemsReducer,
        {
          ids: [],
          entities: {},
        },
      );
      // massaged communication channels data to store in Redux
      const channels = availableCommunicationItems.reduce(
        communicationChannelsReducer,
        {
          ids: [],
          entities: {},
        },
      );
      return {
        ...state,
        loadingStatus: LOADING_STATES.loaded,
        loadingErrors: null,
        groups,
        items,
        channels,
      };
    }
    case SAVE_CHANNEL_STARTED: {
      resetUiStateOnAllChannels(state);
      const { channelId, isAllowed } = action.payload;
      const updatedChannel = { ...selectChannelById(state, channelId) };
      updatedChannel.isAllowed = isAllowed;
      updatedChannel.ui = {
        ...updatedChannel.ui,
        updateStatus: LOADING_STATES.pending,
      };
      const newState = { ...state };
      newState.channels.entities = { ...newState.channels.entities };
      newState.channels.entities[channelId] = { ...updatedChannel };
      return newState;
    }
    case SAVE_CHANNEL_SUCCEEDED: {
      const { channelId, data } = action.payload;
      const updatedChannel = { ...selectChannelById(state, channelId) };
      updatedChannel.isAllowed = data.allowed;
      updatedChannel.permissionId = data.communicationPermissionId;
      updatedChannel.ui = {
        ...updatedChannel.ui,
        updateStatus: LOADING_STATES.loaded,
        errors: null,
      };
      const newState = { ...state };
      newState.channels.entities[channelId] = { ...updatedChannel };

      return newState;
    }
    case SAVE_CHANNEL_FAILED: {
      const { channelId, errors, isAllowed } = action.payload;
      const updatedChannel = { ...selectChannelById(state, channelId) };
      updatedChannel.isAllowed = isAllowed;
      updatedChannel.ui = {
        ...updatedChannel.ui,
        updateStatus: LOADING_STATES.error,
        errors,
      };
      const newState = { ...state };
      newState.channels.entities[channelId] = { ...updatedChannel };
      return newState;
    }
    default: {
      return state;
    }
  }
}
