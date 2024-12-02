import { expect } from 'chai';
import sinon from 'sinon';

import { mockFetch } from 'platform/testing/unit/helpers';
import { fullNameUI } from 'platform/forms-system/src/js/web-component-patterns';
import { benefitsIntakeFullNameUI } from '../utils/helpers';
import { submit } from '../config/submit';

describe('Burials helpers', () => {
  describe('submit', () => {
    beforeEach(() => {
      window.VetsGov = { pollTimeout: 1 };
      window.URL = {
        createObjectURL: sinon.stub().returns('test'),
      };
    });
    it('should reject if initial request fails', () => {
      mockFetch(new Error('fake error'), false);
      const formConfig = {
        chapters: {},
      };
      const form = {
        data: {},
      };

      return submit(form, formConfig).then(
        () => {
          expect.fail();
        },
        err => {
          expect(err.message).to.equal('fake error');
        },
      );
    });

    afterEach(() => {
      delete window.URL;
    });
  });
  describe('benefitIntakeFullName', () => {
    it('should extend name validation', () => {
      const benefitsUiSchema = benefitsIntakeFullNameUI();
      const defaultUiSchema = fullNameUI();
      expect(Object.keys(benefitsUiSchema)).to.have.same.members(
        Object.keys(defaultUiSchema),
      );
      expect(benefitsUiSchema.first['ui:validations']).to.have.lengthOf(2);
      expect(benefitsUiSchema.last['ui:validations']).to.have.lengthOf(2);
    });
  });
});
