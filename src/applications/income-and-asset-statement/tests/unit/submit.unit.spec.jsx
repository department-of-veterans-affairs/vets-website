import { expect } from 'chai';
import sinon from 'sinon';

import { mockFetch } from 'platform/testing/unit/helpers';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import {
  replacer,
  submit,
  removeDisallowedFields,
  remapOtherVeteranFields,
} from '../../config/submit';

describe('Income and asset submit', () => {
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

  describe('transformForSubmit', () => {
    it('should remove undefined, null, and view: prefixed fields', () => {
      const formConfig = {
        chapters: {},
      };
      const formData = {
        data: {
          mailingAddress: { street: '123 Main St' },
          'view:viewField': 'someView',
          undefinedField: undefined,
          nullField: null,
        },
      };

      const transformed = transformForSubmit(formConfig, formData, replacer);

      expect(transformed).to.deep.equal(
        JSON.stringify({
          mailingAddress: { street: '123 Main St' },
        }),
      );
    });
  });

  describe('removeDisallowedFields', () => {
    it('should remove disallowed fields from the form data', () => {
      const form = {
        data: {
          mailingAddress: { street: '123 Main St' }, // allowed field
          vaFileNumberLastFour: 1234, // disallowed field
          veteranSsnLastFour: 5678, // disallowed field
          otherVeteranFullName: {
            first: 'John',
            last: 'Doe',
          }, // disallowed field
          otherVeteranSocialSecurityNumber: '123456789', // disallowed field
          otherVaFileNumber: 'VA1234', // disallowed field
        },
      };

      const cleanedForm = removeDisallowedFields(form);

      expect(cleanedForm.data).to.eql({
        mailingAddress: { street: '123 Main St' },
      });
    });
  });

  describe('replacer', () => {
    it('should clean up empty objects', () => {
      const formConfig = {
        chapters: {},
      };
      const formData = { data: { mailingAddress: {}, telephone: null } };
      const transformed = transformForSubmit(formConfig, formData, replacer);

      expect(transformed).not.to.haveOwnProperty('data');
      expect(transformed).not.to.haveOwnProperty('mailingAddress');
      expect(transformed).not.to.haveOwnProperty('telephone');
    });
  });

  describe('remapOtherVeteranFields', () => {
    it('should copy otherVeteran fields into standard fields when claimantType is not VETERAN', () => {
      const input = {
        claimantType: 'SPOUSE',
        otherVeteranFullName: {
          first: 'John',
          last: 'Doe',
        },
        otherVeteranSocialSecurityNumber: '123456789',
        otherVaFileNumber: 'VA1234',
      };

      const result = remapOtherVeteranFields(input);

      expect(result.veteranFullName).to.deep.equal({
        first: 'John',
        last: 'Doe',
      });
      expect(result.veteranSocialSecurityNumber).to.equal('123456789');
      expect(result.vaFileNumber).to.equal('VA1234');
    });

    it('should not override veteran fields if claimantType is VETERAN', () => {
      const input = {
        claimantType: 'VETERAN',
        veteranFullName: {
          first: 'Alice',
          last: 'Smith',
        },
        veteranSocialSecurityNumber: '999999999',
        vaFileNumber: 'VA5678',
        otherVeteranFullName: {
          first: 'John',
          last: 'Doe',
        },
        otherVeteranSocialSecurityNumber: '123456789',
        otherVaFileNumber: 'VA1234',
      };

      const result = remapOtherVeteranFields(input);

      expect(result.veteranFullName).to.deep.equal({
        first: 'Alice',
        last: 'Smith',
      });
      expect(result.veteranSocialSecurityNumber).to.equal('999999999');
      expect(result.vaFileNumber).to.equal('VA5678');
    });

    it('should return original data if no remapping is needed', () => {
      const input = {
        claimantType: 'VETERAN',
        unrelatedField: 'unchanged',
      };

      const result = remapOtherVeteranFields(input);

      expect(result).to.deep.equal(input);
    });
  });
});
