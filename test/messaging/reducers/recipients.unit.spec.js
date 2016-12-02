import { expect } from 'chai';

import recipientsReducer from '../../../src/js/messaging/reducers/recipients';

import {
  FETCH_RECIPIENTS_FAILURE,
  FETCH_RECIPIENTS_SUCCESS,
  LOADING_RECIPIENTS
} from '../../../src/js/messaging/utils/constants';

import { testData } from '../../util/messaging-helpers';

describe('recipients reducer', () => {
  it('should indicate when it\'s loading recipients', () => {
    const state = recipientsReducer(undefined, {
      type: LOADING_RECIPIENTS
    });

    expect(state.loading).to.be.true;
  });

  it('should have no data when it fails to load recipients', () => {
    const state = recipientsReducer(undefined, {
      type: FETCH_RECIPIENTS_FAILURE
    });

    expect(state.loading).to.be.false;
    expect(state.data).to.be.null;
  });

  it('should populate the list of possible recipients on success', () => {
    const recipients = testData.recipients;
    const state = recipientsReducer(undefined, {
      type: FETCH_RECIPIENTS_SUCCESS,
      recipients
    });

    expect(state.loading).to.be.false;

    recipients.data.forEach((recipient) => {
      expect(state.data).to.contain({
        label: recipient.attributes.name,
        value: recipient.attributes.triageTeamId
      });
    });
  });
});
