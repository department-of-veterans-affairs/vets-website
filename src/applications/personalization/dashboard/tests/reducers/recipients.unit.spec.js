import recipientsReducer from '../../reducers/recipients';

import {
  FETCH_RECIPIENTS_FAILURE,
  FETCH_RECIPIENTS_SUCCESS,
} from '../../utils/constants';

import { recipients } from '../messaging-helpers';

describe('recipients reducer', () => {
  test('should have no data when it fails to load recipients', () => {
    const state = recipientsReducer(undefined, {
      type: FETCH_RECIPIENTS_FAILURE,
    });

    expect(state.data).toBeNull();
  });

  test('should populate the list of possible recipients on success', () => {
    const state = recipientsReducer(undefined, {
      type: FETCH_RECIPIENTS_SUCCESS,
      recipients,
    });

    recipients.data.forEach(recipient => {
      expect(state.data).toMatchObject({
        label: recipient.attributes.name,
        value: recipient.attributes.triageTeamId,
      });
    });
  });
});
