import { expect } from 'chai';

import {
  FETCH_PREFERENCES_SUCCESS,
  SAVE_PREFERENCES_SUCCESS,
  SET_NOTIFICATION_EMAIL,
  SET_NOTIFICATION_FREQUENCY
} from '../../../src/js/messaging/utils/constants';

import { makeField } from '../../../src/js/common/model/fields';
import preferencesReducer from '../../../src/js/messaging/reducers/preferences';

describe('preferencesducer', () => {
  it('should handle successfully loading preferences', () => {
    const state = preferencesReducer(undefined, {
      type: FETCH_PREFERENCES_SUCCESS,
      preferences: {
        emailAddress: 'test@vets.gov',
        frequency: 'daily'
      }
    });
    expect(state.emailAddress.value).to.eql('test@vets.gov');
    expect(state.frequency.value).to.eql('daily');
  });

  it('should handle successfully saving preferences', () => {
    const state = preferencesReducer({
      emailAddress: makeField('test@vets.gov'),
      frequency: makeField('daily')
    }, { type: SAVE_PREFERENCES_SUCCESS });
    expect(state.emailAddress.value).to.eql('test@vets.gov');
    expect(state.frequency.value).to.eql('daily');
  });

  it('should set notification email', () => {
    const state = preferencesReducer(undefined, {
      type: SET_NOTIFICATION_EMAIL,
      email: makeField('test@vets.gov', true)
    });
    expect(state.emailAddress.value).to.eql('test@vets.gov');
    expect(state.emailAddress.dirty).to.be.true;
  });

  it('should set notification frequency', () => {
    const state = preferencesReducer(undefined, {
      type: SET_NOTIFICATION_FREQUENCY,
      frequency: makeField('each_message', true)
    });
    expect(state.frequency.value).to.eql('each_message');
    expect(state.frequency.dirty).to.be.true;
  });
});

