import sinon from 'sinon';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import _ from 'lodash';

import {
  validateDisability,
  transformDisabilities,
  addPhoneEmailToCard,
  prefillTransformer,
  getDisabilityName,
  get4142Selection,
  queryForFacilities,
  transform,
  hasGuardOrReservePeriod,
  ReservesGuardDescription,
  transformObligationDates,
  isInFuture,
  getReservesGuardData
} from '../helpers.jsx';
import maximalData from './schema/maximal-test';
import initialData from './schema/initialData.js';
import FacilityLocatorManifest from '../../../facility-locator/manifest.json';

describe('526 helpers', () => {
  const prefilledData = _.cloneDeep(initialData);
  const invalidDisability = prefilledData.disabilities[1];
  const validDisability = Object.assign({ disabilityActionType: 'INCREASE' }, invalidDisability);
  describe('transform', () => {
    const formData = maximalData;
    const transformedData = {
      form526: {
        disabilities: [
          {
            name: 'Diabetes mellitus0',
            disabilityActionType: 'INCREASE',
            specialIssues: [
              {
                code: 'TRM',
                name: 'Personal Trauma PTSD'
              }
            ],
            ratedDisabilityId: '0',
            ratingDecisionId: '63655',
            diagnosticCode: 5238
          },
          {
            name: 'Diabetes mellitus1',
            disabilityActionType: 'INCREASE',
            specialIssues: [
              {
                code: 'TRM',
                name: 'Personal Trauma PTSD'
              }
            ],
            ratedDisabilityId: '1',
            ratingDecisionId: '63655',
            diagnosticCode: 5238
          }
        ],
        veteran: {
          homelessness: {
            isHomeless: true,
            pointOfContact: {
              pointOfContactName: 'John',
              primaryPhone: '1231231231'
            }
          },
          mailingAddress: {
            country: 'USA',
            addressLine1: '123 MAIN ST',
            addressLine2: 'BEN FRANKLIN VILLAGE',
            city: 'APO',
            state: 'AE',
            zipCode: '09028'
          },
          forwardingAddress: {
            country: 'USA',
            addressLine1: '123 Anystreet',
            addressLine2: 'Viking Drive',
            addressLine3: 'Some Suite',
            city: 'Anyville',
            state: 'AK',
            zipCode: '33492',
            effectiveDate: '2019-04-04'
          },
          primaryPhone: '4445551212',
          emailAddress: 'test2@test1.net'
        },
        treatments: [
          {
            treatmentCenterName: 'Somerset VA Clinic',
            treatmentDateRange: {
              from: '2000-06-06',
              to: '2004-02-06'
            }
          },
          {
            treatmentCenterName: 'DC VA Regional Medical Center',
            treatmentDateRange: {
              from: '2000-07-04',
              to: '2010-01-03'
            }
          }
        ],
        attachments: [
          {
            name: 'Screen Shot 2018-07-09 at 11.25.49 AM.png',
            confirmationCode: '9664f488-1243-4b25-805e-75ad7e4cf765',
            attachmentId: 'L105'
          },
          {
            name: 'Screen Shot 2018-07-09 at 11.24.39 AM.png',
            confirmationCode: '66bfab89-6e2b-4361-a905-754dfbff7df7',
            attachmentId: 'L105'
          },
          {
            name: 'Screen Shot 2018-07-09 at 3.29.08 PM.png',
            confirmationCode: 'a58ae568-d190-49cd-aa04-b1b1da5eae35',
            attachmentId: 'L105'
          },
          {
            name: 'Screen Shot 2018-07-09 at 2.02.39 PM.png',
            confirmationCode: 'f23194e4-c534-42c6-9e96-16c08d8230a5',
            attachmentId: 'L105'
          }
        ],
        privacyAgreementAccepted: true,
        serviceInformation: {
          servicePeriods: [
            {
              serviceBranch: 'Air National Guard',
              dateRange: {
                from: '1980-03-06',
                to: '1990-02-04'
              }
            },
            {
              serviceBranch: 'Army Reserve',
              dateRange: {
                from: '1990-07-05',
                to: '2000-02-04'
              }
            }
          ],
          reservesNationalGuardService: {
            unitName: 'Alpha Bravo Charlie',
            obligationTermOfServiceDateRange: {
              from: '2015-05-12',
              to: '2017-05-12'
            },
            title10Activation: {
              title10ActivationDate: '2014-054-12',
              anticipatedSeparationDate: '2019-09-02'
            },
            waiveVABenefitsToRetainTrainingPay: true
          }
        },
        standardClaim: false
      }
    };
    it('should return stringified, transformed data for submit', () => {
      expect(transform(null, formData)).to.deep.equal(JSON.stringify(transformedData));
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
  describe('transformDisabilities', () => {
    it('should create a list of disabilities with disabilityActionType set to INCREASE', () => {
      expect(transformDisabilities([invalidDisability])).to.deep.equal([validDisability]);
    });
    it('should return an empty array when given undefined input', () => {
      expect(transformDisabilities(undefined)).to.deep.equal([]);
    });
    it('should remove ineligible disabilities', () => {
      const ineligibleDisability = _.omit(invalidDisability, 'ratingPercentage');
      expect(transformDisabilities([ineligibleDisability])).to.deep.equal([]);
    });
  });
  describe('addPhoneEmailToCard', () => {
    it('should return formData when veteran property does not exist', () => {
      const formData = { disabilities: {} };
      const newFormData = addPhoneEmailToCard(formData);
      expect(newFormData).to.equal(formData);
    });
    it('should return a new object with correctly-modified formData', () => {
      const formData = { disabilities: {}, veteran: { primaryPhone: '1234567890', emailAddress: 'a@b.c' } };
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
      to: '2015-04-01'
    };

    const formData = {
      reservesNationalGuardService: {
        obligationTermOfServiceDateRange: {
          from: dateRange.from,
          to: dateRange.to
        }
      }
    };

    it('adds obligation dates to the top level formData', () => {
      expect(transformObligationDates(formData)).to.deep.equal({
        obligationTermOfServiceDateRange: {
          from: dateRange.from,
          to: dateRange.to
        }
      });
    });
    it('returns original form data if reserves data is missing', () => {
      const newFormData = { someOtherProperty: 'someOtherValue' };
      expect(transformObligationDates(newFormData)).to.equal(newFormData);
    });
  });
  describe('prefillTransformer', () => {
    it('should transform prefilled disabilities', () => {
      const { formData: transformedPrefill } = prefillTransformer([], prefilledData);
      expect(transformedPrefill.disabilities[0].disabilityActionType).to.equal('INCREASE');
    });
    it('should add phone and email to phoneEmailCard', () => {
      const pages = [];
      const formData = initialData;
      const metadata = {};
      const transformedPhoneEmail = {
        primaryPhone: initialData.veteran.primaryPhone,
        emailAddress: initialData.veteran.emailAddress
      };
      const newForm = prefillTransformer(pages, formData, metadata);
      expect(newForm.formData.veteran.phoneEmailCard).to.deep.equal(transformedPhoneEmail);
    });
    it('should return original data when no disabilities returned', () => {
      const pages = [];
      const formData = _.omit(initialData, 'disabilities');
      const metadata = {};

      expect(prefillTransformer(pages, formData, metadata)).to.deep.equal({ pages, formData, metadata });
    });
    it('should return original data if disabilities is not an array', () => {
      const clonedData = _.cloneDeep(initialData);
      const pages = [];
      const formData = _.set(clonedData, 'disabilities', { someProperty: 'value' });
      const metadata = {};

      expect(prefillTransformer(pages, formData, metadata)).to.deep.equal({ pages, formData, metadata });
    });
    it('should transform prefilled data when disability name has special chars', () => {
      const newName = '//()';
      const dataClone = _.set(_.cloneDeep(initialData), 'disabilities[0].name', newName);
      const prefill = prefillTransformer([], dataClone, {});
      expect(prefill.formData.disabilities[0].name).to.equal(newName);
    });
    it('should put obligation dates into the parent level', () => {
      const dateRange = {
        from: '2015-05-07',
        to: '2018-05-07'
      };

      const pages = [];
      const metadata = {};
      const formData = _.set(_.cloneDeep(initialData), 'reservesNationalGuardService', {
        obligationTermOfServiceDateRange: {
          from: dateRange.from,
          to: dateRange.to
        }
      });

      const newData = prefillTransformer(pages, formData, metadata);
      expect(newData.formData.obligationTermOfServiceDateRange).to.deep.equal(dateRange);
    });
  });
  describe('getDisabilityName', () => {
    it('should return string with each word capitalized when name supplied', () => {
      expect(getDisabilityName('some disability - some detail')).to.equal('Some Disability - Some Detail');
    });
    it('should return Unknown Condition with undefined name', () => {
      expect(getDisabilityName()).to.equal('Unknown Condition');
    });
    it('should return Unknown Condition when input is empty string', () => {
      expect(getDisabilityName('')).to.equal('Unknown Condition');
    });
    it('should return Unknown Condition when name is not a string', () => {
      expect(getDisabilityName(249481)).to.equal('Unknown Condition');
    });
  });
  describe('get4142Selection', () => {
    const fullDisabilities = [
      {
        tag: 'shouldReturnTrue',
        'view:selected': true,
        'view:uploadPrivateRecords': 'no'
      },
      {
        tag: 'shouldReturnFalse'
      },
      {
        tag: 'shouldReturnFalse',
        'view:selected': true,
        'view:uploadPrivateRecords': 'yes'
      },
      {
        tag: 'shouldReturnFalse',
        'view:selected': true
      }
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

  describe('queryForFacilities', () => {
    const originalFetch = global.fetch;
    beforeEach(() => {
      // Replace fetch with a spy
      global.fetch = sinon.stub();
      global.fetch.resolves({
        ok: true,
        headers: { get: () => 'application/json' },
        json: () => ({
          data: [
            { id: 0, attributes: { name: 'first' } },
            { id: 1, attributes: { name: 'second' } },
          ]
        })
      });
    });

    afterEach(() => {
      global.fetch = originalFetch;
    });

    it('should not call the api if the input length is < 3', () => {
      queryForFacilities('12');
      expect(global.fetch.called).to.be.false;
    });

    it('should call the api if the input length is >= 3', () => {
      queryForFacilities('123');
      expect(global.fetch.called).to.be.true;
    });

    it('should call the api with the input', () => {
      queryForFacilities('asdf');
      expect(global.fetch.firstCall.args[0]).to.contain(`${FacilityLocatorManifest.rootUrl}/suggested?type%5B%5D=health&type%5B%5D=dod_health&name_part=asdf`);
    });

    it('should return the mapped data for autosuggest if successful', () => {
      // Doesn't matter what we call this with since our stub will always return the same thing
      const requestPromise = queryForFacilities('asdf');
      return requestPromise.then(result => {
        expect(result).to.eql([
          { id: 0, label: 'first' },
          { id: 1, label: 'second' },
        ]);
      });
    });

    it('should return an empty array if unsuccesful', () => {
      global.fetch.resolves({ ok: false });
      // Doesn't matter what we call this with since our stub will always return the same thing
      const requestPromise = queryForFacilities('asdf');
      return requestPromise.then(result => {
        // This .then() fires after the apiRequest failure callback returns []
        expect(result).to.eql([]);
      });
    });
  });

  describe('hasGuardOrReservePeriod', () => {
    it('should return true when reserve period present', () => {
      const formData = {
        servicePeriods: [{
          serviceBranch: 'Air Force Reserve',
          dateRange: {
            to: '2011-05-06',
            from: '2015-05-06'
          }
        }]
      };

      expect(hasGuardOrReservePeriod(formData)).to.be.true;
    });

    it('should return true when national guard period present', () => {
      const formData = {
        servicePeriods: [{
          serviceBranch: 'Air National Guard',
          dateRange: {
            to: '2011-05-06',
            from: '2015-05-06'
          }
        }]
      };

      expect(hasGuardOrReservePeriod(formData)).to.be.true;
    });

    it('should return false when no reserves or guard period present', () => {
      const formData = {
        servicePeriods: [{
          serviceBranch: 'Air Force',
          dateRange: {
            from: '2011-05-06',
            to: '2015-05-06'
          }
        }]
      };

      expect(hasGuardOrReservePeriod(formData)).to.be.false;
    });

    it('should return false when no service history present', () => {
      const formData = {};

      expect(hasGuardOrReservePeriod(formData)).to.be.false;
    });
  });

  describe('reservesGuardDescription', () => {
    it('should pick the most recent service branch', () => {
      const form = {
        formData: {
          servicePeriods: [{
            serviceBranch: 'Air Force',
            dateRange: {
              from: '2010-05-08',
              to: '2018-10-08',
            }
          },
          {
            serviceBranch: 'Air Force Reserve',
            dateRange: {
              from: '2000-05-08',
              to: '2011-10-08',
            }
          },
          {
            serviceBranch: 'Marine Corps Reserve',
            dateRange: {
              from: '2000-05-08',
              to: '2018-10-08',
            }
          }]
        }
      };

      const renderedText = shallow(ReservesGuardDescription(form)).render().text();
      expect(renderedText).to.contain('Marine Corps Reserve');
    });

    it('should return null when no service periods present', () => {
      const form = {
        formData: {}
      };

      expect(ReservesGuardDescription(form)).to.equal(null);
    });
  });

  describe('isInFuture', () => {
    it('adds an error when entered date is today or earlier', () => {
      const addError = sinon.spy();
      const errors = { addError };
      const fieldData = '2018-04-12';

      isInFuture(errors, fieldData);
      expect(addError.calledOnce).to.be.true;
    });

    it('does not add an error when the entered date is in the future', () => {
      const addError = sinon.spy();
      const errors = { addError };
      const fieldData = '2099-04-12';

      isInFuture(errors, fieldData);
      expect(addError.callCount).to.equal(0);
    });
  });

  describe('getReservesGuardData', () => {
    it('gets reserve & national guard data when available', () => {
      const formData = {
        unitName: 'Alpha Bravo',
        obligationTermOfServiceDateRange: {
          from: '2012-02-02',
          to: '2018-02-02'
        },
        waiveVABenefitsToRetainTrainingPay: false
      };

      expect(getReservesGuardData(formData)).to.deep.equal(formData);
    });
    it('get title 10 data when available', () => {
      const formData = {
        unitName: 'Alpha Bravo',
        obligationTermOfServiceDateRange: {
          from: '2012-02-02',
          to: '2018-02-02'
        },
        waiveVABenefitsToRetainTrainingPay: false,
        'view:isTitle10Activated': true,
        title10Activation: {
          title10ActivationDate: '2016-05-04',
          anticipatedSeparationDate: '2099-05-03'
        }
      };

      expect(getReservesGuardData(formData)).to.deep.equal(_.omit(formData, 'view:isTitle10Activated'));
    });
    it('returns null when some required data is missing', () => {
      const formData = {
        obligationTermOfServiceDateRange: {
          from: '2012-02-02',
          to: '2018-02-02'
        },
        waiveVABenefitsToRetainTrainingPay: false
      };

      expect(getReservesGuardData(formData)).to.equal(null);
    });
  });
});
