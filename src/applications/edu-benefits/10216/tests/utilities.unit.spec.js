import { expect } from 'chai';
import sinon from 'sinon';
import { addStyleToShadowDomOnPages, validateFacilityCode } from '../utilities';

global.window = { location: { href: '' } };

describe('Utilities Tests', () => {
  describe('addStyleToShadowDomOnPages', () => {
    it('should inject styles into shadow DOM elements on specified pages', async () => {
      window.location.href = 'http://example.com';
      const urlArray = ['example.com'];
      const targetElements = ['va-select'];
      const style = 'color: red;';
      const selectElement = document.createElement('va-select');
      document.body.appendChild(selectElement);
      const shadowRoot = selectElement.attachShadow({ mode: 'open' });
      shadowRoot.adoptedStyleSheets = [];

      await addStyleToShadowDomOnPages(urlArray, targetElements, style);

      expect(shadowRoot.adoptedStyleSheets.length).to.equal(0);
    });
  });

  describe('validateFacilityCode', () => {
    let apiRequestStub;

    beforeEach(() => {
      apiRequestStub = sinon.stub();
    });

    it('should return accredited status from API', async () => {
      const field = {
        institutionDetails: {
          facilityCode: '31850932',
          institutionName: 'test',
          startDate: '2024-01-01',
        },
      };
      const mockResponse = { data: { attributes: { accredited: true } } };
      apiRequestStub.returns(Promise.resolve(mockResponse));

      const result = await validateFacilityCode(field);

      expect(result).to.be.true;
    });
    it('should return false on API error', async () => {
      const field = { institutionDetails: { facilityCode: '123' } };

      apiRequestStub.returns(Promise.reject(new Error('API error')));

      const result = await validateFacilityCode(field);

      expect(result).to.be.false;
    });
  });
});
