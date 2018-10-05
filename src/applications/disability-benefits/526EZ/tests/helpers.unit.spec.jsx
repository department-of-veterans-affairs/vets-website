import { expect } from 'chai';
import _ from 'lodash';

import {
  validateDisability,
  addPhoneEmailToCard,
  prefillTransformer,
  get4142Selection,
  transform,
  transformObligationDates,
  getReservesGuardData,
} from '../helpers.jsx';
import maximalData from './schema/maximal-test';
import initialData from './schema/initialData.js';

describe('526 helpers', () => {
  const prefilledData = _.cloneDeep(initialData);
  const invalidDisability = prefilledData.disabilities[1];
  const validDisability = Object.assign(
    { disabilityActionType: 'INCREASE' },
    invalidDisability,
  );
  describe('transform', () => {
    const formData = maximalData;
    const transformedData = {
      form526: {
        disabilities: [
          {
            name: 'Diabetes mellitus0',
            disabilityActionType: 'INCREASE',
            ratedDisabilityId: '0',
            ratingDecisionId: '63655',
            diagnosticCode: 5238,
          },
          {
            name: 'Diabetes mellitus1',
            disabilityActionType: 'INCREASE',
            ratedDisabilityId: '1',
            ratingDecisionId: '63655',
            diagnosticCode: 5238,
          },
        ],
        veteran: {
          homelessness: {
            isHomeless: true,
            pointOfContact: {
              pointOfContactName: 'John',
              primaryPhone: '1231231231',
            },
          },
          mailingAddress: {
            country: 'USA',
            addressLine1: '123 MAIN ST',
            addressLine2: 'BEN FRANKLIN VILLAGE',
            city: 'APO',
            state: 'AE',
            zipCode: '09028',
          },
          forwardingAddress: {
            country: 'USA',
            addressLine1: '123 Anystreet',
            addressLine2: 'Viking Drive',
            addressLine3: 'Some Suite',
            city: 'Anyville',
            state: 'AK',
            zipCode: '33492',
            effectiveDate: '2019-04-04',
          },
          primaryPhone: '4445551212',
          emailAddress: 'test2@test1.net',
        },
        attachments: [
          {
            name: 'Screen Shot 2018-07-09 at 11.25.49 AM.png',
            confirmationCode: '9664f488-1243-4b25-805e-75ad7e4cf765',
            attachmentId: 'L105',
          },
          {
            name: 'Screen Shot 2018-07-09 at 11.24.39 AM.png',
            confirmationCode: '66bfab89-6e2b-4361-a905-754dfbff7df7',
            attachmentId: 'L105',
          },
          {
            name: 'Screen Shot 2018-07-09 at 3.29.08 PM.png',
            confirmationCode: 'a58ae568-d190-49cd-aa04-b1b1da5eae35',
            attachmentId: 'L105',
          },
          {
            name: 'Screen Shot 2018-07-09 at 2.02.39 PM.png',
            confirmationCode: 'f23194e4-c534-42c6-9e96-16c08d8230a5',
            attachmentId: 'L105',
          },
        ],
        privacyAgreementAccepted: true,
        serviceInformation: {
          servicePeriods: [
            {
              serviceBranch: 'Air National Guard',
              dateRange: {
                from: '1980-03-06',
                to: '1990-02-04',
              },
            },
            {
              serviceBranch: 'Army Reserve',
              dateRange: {
                from: '1990-07-05',
                to: '2000-02-04',
              },
            },
          ],
          reservesNationalGuardService: {
            unitName: 'Alpha Bravo Charlie',
            obligationTermOfServiceDateRange: {
              from: '2015-05-12',
              to: '2017-05-12',
            },
            title10Activation: {
              title10ActivationDate: '2014-054-12',
              anticipatedSeparationDate: '2019-09-02',
            },
            waiveVABenefitsToRetainTrainingPay: true,
          },
        },
        standardClaim: false,
        treatments: [
          {
            treatmentCenterName: 'Somerset VA Clinic',
            treatmentDateRange: {
              from: '2000-06-06',
              to: '2004-02-06',
            },
          },
          {
            treatmentCenterName: 'DC VA Regional Medical Center',
            treatmentDateRange: {
              from: '2000-07-04',
              to: '2010-01-03',
            },
          },
        ],
      },
    };
    it('should return stringified, transformed data for submit', () => {
      expect(transform(null, formData)).to.deep.equal(
        JSON.stringify(transformedData),
      );
    });
  });
  describe('validateDisability', () => {
    it('should reject invalid disability data', () => {
      expect(validateDisability(invalidDisability)).to.equal(false);
    });
    it('should accept valid disability data', () => {
      expect(validateDisability(validDisability)).to.equal(true);
    });
  });
  describe('addPhoneEmailToCard', () => {
    it('should return formData when veteran property does not exist', () => {
      const formData = { disabilities: {} };
      const newFormData = addPhoneEmailToCard(formData);
      expect(newFormData).to.equal(formData);
    });
    it('should return a new object with correctly-modified formData', () => {
      const formData = {
        disabilities: {},
        veteran: { primaryPhone: '1234567890', emailAddress: 'a@b.c' },
      };
      const newFormData = addPhoneEmailToCard(formData);
      expect(newFormData).to.not.equal(formData);
      expect(newFormData.veteran.primaryPhone).to.be.undefined;
      expect(newFormData.veteran.emailAddress).to.be.undefined;
      expect(newFormData.veteran.phoneEmailCard).to.exist;

      const { primaryPhone, emailAddress } = newFormData.veteran.phoneEmailCard;
      expect(primaryPhone).to.equal(formData.veteran.primaryPhone);
      expect(emailAddress).to.equal(formData.veteran.emailAddress);
    });
  });
  describe('transformObligationDates', () => {
    const dateRange = {
      from: '2012-04-01',
      to: '2015-04-01',
    };

    const formData = {
      reservesNationalGuardService: {
        obligationTermOfServiceDateRange: {
          from: dateRange.from,
          to: dateRange.to,
        },
      },
    };

    it('adds obligation dates to the top level formData', () => {
      expect(transformObligationDates(formData)).to.deep.equal({
        obligationTermOfServiceDateRange: {
          from: dateRange.from,
          to: dateRange.to,
        },
      });
    });
    it('returns original form data if reserves data is missing', () => {
      const newFormData = { someOtherProperty: 'someOtherValue' };
      expect(transformObligationDates(newFormData)).to.equal(newFormData);
    });
  });
  describe('prefillTransformer', () => {
    it('should transform prefilled disabilities', () => {
      const { formData: transformedPrefill } = prefillTransformer(
        [],
        prefilledData,
      );
      expect(transformedPrefill.disabilities[0].disabilityActionType).to.equal(
        'INCREASE',
      );
    });
    it('should add phone and email to phoneEmailCard', () => {
      const pages = [];
      const formData = initialData;
      const metadata = {};
      const transformedPhoneEmail = {
        primaryPhone: initialData.veteran.primaryPhone,
        emailAddress: initialData.veteran.emailAddress,
      };
      const newForm = prefillTransformer(pages, formData, metadata);
      expect(newForm.formData.veteran.phoneEmailCard).to.deep.equal(
        transformedPhoneEmail,
      );
    });
    it('should return original data when no disabilities returned', () => {
      const pages = [];
      const formData = _.omit(initialData, 'disabilities');
      const metadata = {};

      expect(prefillTransformer(pages, formData, metadata)).to.deep.equal({
        pages,
        formData,
        metadata,
      });
    });
    it('should return original data if disabilities is not an array', () => {
      const clonedData = _.cloneDeep(initialData);
      const pages = [];
      const formData = _.set(clonedData, 'disabilities', {
        someProperty: 'value',
      });
      const metadata = {};

      expect(prefillTransformer(pages, formData, metadata)).to.deep.equal({
        pages,
        formData,
        metadata,
      });
    });
    it('should transform prefilled data when disability name has special chars', () => {
      const newName = '//()';
      const dataClone = _.set(
        _.cloneDeep(initialData),
        'disabilities[0].name',
        newName,
      );
      const prefill = prefillTransformer([], dataClone, {});
      expect(prefill.formData.disabilities[0].name).to.equal(newName);
    });
    it('should put obligation dates into the parent level', () => {
      const dateRange = {
        from: '2015-05-07',
        to: '2018-05-07',
      };

      const pages = [];
      const metadata = {};
      const formData = _.set(
        _.cloneDeep(initialData),
        'reservesNationalGuardService',
        {
          obligationTermOfServiceDateRange: {
            from: dateRange.from,
            to: dateRange.to,
          },
        },
      );

      const newData = prefillTransformer(pages, formData, metadata);
      expect(newData.formData.obligationTermOfServiceDateRange).to.deep.equal(
        dateRange,
      );
    });
  });

  describe('get4142Selection', () => {
    const fullDisabilities = [
      {
        tag: 'shouldReturnTrue',
        'view:selected': true,
        'view:uploadPrivateRecords': 'no',
      },
      {
        tag: 'shouldReturnFalse',
      },
      {
        tag: 'shouldReturnFalse',
        'view:selected': true,
        'view:uploadPrivateRecords': 'yes',
      },
      {
        tag: 'shouldReturnFalse',
        'view:selected': true,
      },
    ];

    it('should return true when at least one disability has 4142 selected', () => {
      expect(get4142Selection(fullDisabilities)).to.equal(true);
    });

    it('should return false when disability not selected for increase', () => {
      const disabilities = fullDisabilities.slice(1, 2);
      expect(get4142Selection(disabilities)).to.equal(false);
    });

    it('should return false when disability has upload PMR selected', () => {
      const disabilities = fullDisabilities.slice(2, 3);
      expect(get4142Selection(disabilities)).to.equal(false);
    });

    it('should return false when disability has no PMR supporting evidence', () => {
      const disabilities = fullDisabilities.slice(3);
      expect(get4142Selection(disabilities)).to.equal(false);
    });

    it('should return false when no disabilities have 4142 selected', () => {
      const disabilities = fullDisabilities.slice(1);
      expect(get4142Selection(disabilities)).to.equal(false);
    });
  });

  describe('getReservesGuardData', () => {
    it('gets reserve & national guard data when available', () => {
      const formData = {
        unitName: 'Alpha Bravo',
        obligationTermOfServiceDateRange: {
          from: '2012-02-02',
          to: '2018-02-02',
        },
        waiveVABenefitsToRetainTrainingPay: false,
      };

      expect(getReservesGuardData(formData)).to.deep.equal(formData);
    });
    it('get title 10 data when available', () => {
      const formData = {
        unitName: 'Alpha Bravo',
        obligationTermOfServiceDateRange: {
          from: '2012-02-02',
          to: '2018-02-02',
        },
        waiveVABenefitsToRetainTrainingPay: false,
        'view:isTitle10Activated': true,
        title10Activation: {
          title10ActivationDate: '2016-05-04',
          anticipatedSeparationDate: '2099-05-03',
        },
      };

      expect(getReservesGuardData(formData)).to.deep.equal(
        _.omit(formData, 'view:isTitle10Activated'),
      );
    });
    it('returns null when some required data is missing', () => {
      const formData = {
        obligationTermOfServiceDateRange: {
          from: '2012-02-02',
          to: '2018-02-02',
        },
        waiveVABenefitsToRetainTrainingPay: false,
      };

      expect(getReservesGuardData(formData)).to.equal(null);
    });
  });
});
