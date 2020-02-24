import { expect } from 'chai';
import { FETCH_VETERAN_INFORMATION } from '../../constants';
import { fetchVeteranInformation } from '../../actions';
import { getVeteranInformation } from '../../api';

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

  describe('getVeteranInformationData', () => {
    it('should fetch request veteran information', async () => {});
    it('should dispatch failure action if veteran information fetch fails', async () => {});
  });
});
