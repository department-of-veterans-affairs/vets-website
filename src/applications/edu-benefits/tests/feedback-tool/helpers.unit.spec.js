import { expect } from 'chai';
import sinon from 'sinon';

import { mockFetch, resetFetch } from '../../../../platform/testing/unit/helpers';
import conditionalStorage from '../../../../platform/utilities/storage/conditionalStorage';

import { submit, transformSearchToolAddress } from '../../feedback-tool/helpers';

function setFetchResponse(stub, data) {
  const response = new Response();
  response.ok = true;
  response.json = () => Promise.resolve(data);
  stub.resolves(response);
}

describe('feedback-tool helpers:', () => {
  describe('transformSearchToolAddress', () => {
    it('converts international address data to the proper format', () => {
      const inputData = {
        address1: '254 PHAYATHAI ROAD',
        address2: 'ENGINEERING BLDG 2',
        address3: 'ROOM 107   10330',
        city: 'BANGKOK',
        country: 'THAILAND',
        state: null,
        zip: null,
      };
      const expectedAddress = {
        street: '254 PHAYATHAI ROAD',
        street2: 'ENGINEERING BLDG 2',
        street3: 'ROOM 107   10330',
        city: 'BANGKOK',
        country: 'THAILAND',
        state: null,
        postalCode: null,
      };
      const address = transformSearchToolAddress(inputData);
      expect(address).to.eql(expectedAddress);
    });
    it('converts domestic address data to the proper format', () => {
      const inputData = {
        address1: '1840 NE ARGYLE',
        address2: null,
        address3: null,
        city: 'PORTLAND',
        country: 'USA',
        state: 'OR',
        zip: '97211',
      };
      const expectedAddress = {
        street: '1840 NE ARGYLE',
        street2: null,
        street3: null,
        city: 'PORTLAND',
        country: 'United States',
        state: 'OR',
        postalCode: '97211',
      };
      const address = transformSearchToolAddress(inputData);
      expect(address).to.eql(expectedAddress);
    });
    it('trims fields that are too long', () => {
      const inputData1 = {
        address1: '254 PHAYATHAI ROAD 254 PHAYATHAI ROAD 254 PHAYATHAI ROAD',
        address2: 'ENGINEERING BLDG 2 ENGINEERING BLDG 2 ENGINEERING BLDG 2',
        address3: 'ROOM 107   10330 ROOM 107   10330 ROOM 107   10330 ROOM 107',
        city: 'BANGKOK IS A VERY VERY VERY VERY VERY VERY VERY LONG CITY NAME',
        country: 'THAILAND',
        state: null,
        zip: null,
      };
      const expectedAddress1 = {
        street: '254 PHAYATHAI ROAD 254 PHAYATHAI ROAD 254 PHAYATHAI ',
        street2: 'ENGINEERING BLDG 2 ENGINEERING BLDG 2 ENGINEERING BL',
        street3: 'ROOM 107   10330 ROOM 107   10330 ROOM 107   10330 R',
        city: 'BANGKOK IS A VERY VERY VERY VERY VERY VE',
        country: 'THAILAND',
        state: null,
        postalCode: null,
      };
      const inputData2 = {
        address1: '1840 NE ARGYLE IS A VERY VERY LONG STREET NAME 1840 NE ARGYLE IS A VERY VERY LONG STREET NAME',
        address2: '1840 NE ARGYLE IS A VERY VERY LONG STREET NAME 1840 NE ARGYLE IS A VERY VERY LONG STREET NAME',
        address3: '1840 NE ARGYLE IS A VERY VERY LONG STREET NAME 1840 NE ARGYLE IS A VERY VERY LONG STREET NAME',
        city: 'PORTLAND IS A SUPER DUPER REALLY LONG CITY NAME WAY LONGER THAN ANY CITY NAME WOULD EVER BE PORTLAND IS A SUPER DUPER REALLY LONG CITY NAME WAY LONGER THAN ANY CITY NAME WOULD EVER BE PORTLAND IS A SUPER DUPER REALLY LONG CITY NAME WAY LONGER THAN ANY CITY NAME WOULD EVER BE',
        country: 'USA',
        state: 'OR',
        zip: '97211',
      };
      const expectedAddress2 = {
        street: '1840 NE ARGYLE IS A VERY VERY LONG STREET NAME 1840 NE ARGYLE IS A VERY VERY LONG ST',
        street2: '1840 NE ARGYLE IS A VERY VERY LONG STREET NAME 1840 NE ARGYLE IS A VERY VERY LONG ST',
        street3: '1840 NE ARGYLE IS A VERY VERY LONG STREET NAME 1840 NE ARGYLE IS A VERY VERY LONG ST',
        city: 'PORTLAND IS A SUPER DUPER REALLY LONG CITY NAME WAY LONGER THAN ANY CITY NAME WOULD EVER BE PORTLAND IS A SUPER DUPER REALLY LONG CITY NAME WAY LONGER THAN ANY CITY NAME WOULD EVER BE PORTLAND IS A SUPER DUPER REALLY LONG CITY NAME WAY LONGER THAN ANY CIT',
        country: 'United States',
        state: 'OR',
        postalCode: '97211',
      };
      const address1 = transformSearchToolAddress(inputData1);
      const address2 = transformSearchToolAddress(inputData2);
      expect(address1).to.eql(expectedAddress1);
      expect(address2).to.eql(expectedAddress2);
    });
  });

  describe('submit', () => {
    beforeEach(() => {
      conditionalStorage().setItem('userToken', 'testing');
      window.VetsGov = { pollTimeout: 1 };
      window.URL = {
        createObjectURL: sinon.stub().returns('test')
      };
    });
    it('should reject if initial request fails', () => {
      mockFetch(new Error('fake error'), false);
      const formConfig = {
        chapters: {}
      };
      const form = {
        data: {}
      };

      return submit(form, formConfig).then(() => {
        expect.fail();
      })
        .catch(err => {
          expect(err.message).to.equal('fake error');
        });
    });
    it('should resolve if polling state is success', () => {
      mockFetch();
      setFetchResponse(global.fetch.onFirstCall(), {
        data: {
          attributes: {
            guid: 'test'
          }
        }
      });
      setFetchResponse(global.fetch.onSecondCall(), {
        data: {
          attributes: {
            state: 'pending'
          }
        }
      });
      const parsedResponse = {};
      setFetchResponse(global.fetch.onThirdCall(), {
        data: {
          attributes: {
            state: 'success',
            parsedResponse
          }
        }
      });
      const formConfig = {
        chapters: {}
      };
      const form = {
        data: {}
      };

      return submit(form, formConfig).then((res) => {
        expect(res).to.deep.equal({});
      });
    });
    it('should reject if polling state is failed', () => {
      mockFetch();
      setFetchResponse(global.fetch.onFirstCall(), {
        data: {
          attributes: {
            guid: 'test'
          }
        }
      });
      setFetchResponse(global.fetch.onSecondCall(), {
        data: {
          attributes: {
            state: 'pending'
          }
        }
      });
      setFetchResponse(global.fetch.onThirdCall(), {
        data: {
          attributes: {
            state: 'failed'
          }
        }
      });
      const formConfig = {
        chapters: {}
      };
      const form = {
        data: {}
      };

      return submit(form, formConfig).then(() => {
        expect.fail();
      }).catch(err => {
        expect(err.message).to.equal('vets_server_error_gi_bill_feedbacks: status failed');
      });
    });

    afterEach(() => {
      resetFetch();
      conditionalStorage().clear();
      delete window.URL;
    });
  });
});
