import { expect } from 'chai';

import {
  FETCH_VETERAN_INFORMATION,
  FETCH_VETERAN_INFORMATION_FAILURE,
} from '../../constants';
import {
  fetchVeteranInformation,
  fetchVeteranInformationFailure,
} from '../../actions';

const data = {
  formData: {
    first: 'Greg',
    last: 'Anderson',
    gender: 'M',
    dateOfBirth: '1933-04-05',
    addressLine1: 'MILITARY ADDY 3',
    city: 'DPO',
    state: 'MI',
    country: 'USA',
    zip: '22312',
    email: 'test2@test1.net',
  },
};

describe('FORM 2346 actions', () => {
  describe('fetchVeteranInformation', () => {
    it("returns an action with type 'FETCH_VETERAN_INFORMATION", () => {
      const action = fetchVeteranInformation(data);
      const expectedAction = {
        type: FETCH_VETERAN_INFORMATION,
        data,
      };
      expect(action).to.deep.equal(expectedAction);
    });
  });

  describe('fetchVeteranInformationFailure', () => {
    it("returns an action with type 'FETCH_VETERAN_INFORMATION_FAILURE", () => {
      const error = 'failed to retrieve data from the api';
      const action = fetchVeteranInformationFailure(error);
      const expectedAction = {
        type: FETCH_VETERAN_INFORMATION_FAILURE,
        error,
      };
      expect(action).to.deep.equal(expectedAction);
    });
  });
});
