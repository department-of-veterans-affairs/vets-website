import sinon from 'sinon';
import { expect } from 'chai';

import formConfig from '../../../config/form';

describe('form.js', () => {
  describe('initialData prop', () => {
    it('should use mock data when environment is localhost and not in Cypress', () => {
      const mockData = { foo: 'bar' };
      const environment = { isLocalhost: sinon.stub().returns(true) };
      const window = { Cypress: undefined };
      const {
        initialData,
      } = formConfig.chapters.veteranPersonalInfoChapter.pages.veteranPersonalInfoPage;

      const result =
        environment.isLocalhost() && !window.Cypress ? mockData : initialData;

      expect(result).equal(mockData);
    });

    it('should not use mock data when environment is not localhost or in Cypress', () => {
      const mockData = { foo: 'bar' };
      const environment = { isLocalhost: sinon.stub().returns(false) };
      const window = { Cypress: true };

      const {
        initialData,
      } = formConfig.chapters.veteranPersonalInfoChapter.pages.veteranPersonalInfoPage;

      const result =
        environment.isLocalhost() && !window.Cypress ? mockData : initialData;

      expect(result).equal(initialData);
    });
  });
});
