import { expect } from 'chai';
import sinon from 'sinon';

import { errorMessages, MAX_LENGTH } from '../../constants';
import { getDate } from '../../utils/dates';

import {
  validateVaLocation,
  validateVaIssues,
  validateVaFromDate,
  validateVaToDate,
  isEmptyVaEntry,
  validateVaUnique,
  validatePrivateName,
  validateCountry,
  validateStreet,
  validateCity,
  validateState,
  validatePostal,
  validatePrivateIssues,
  validatePrivateFromDate,
  validatePrivateToDate,
  isEmptyPrivateEntry,
  validatePrivateUnique,
} from '../../validations/evidence';

describe('VA evidence', () => {
  describe('validateVaLocation', () => {
    it('should not show an error for an added location name', () => {
      const errors = { addError: sinon.spy() };
      validateVaLocation(errors, { locationAndName: 'ok' });
      expect(errors.addError.called).to.be.false;
    });
    it('should show an error for a missing location name', () => {
      const errors = { addError: sinon.spy() };
      validateVaLocation(errors, { locationAndName: '' });
      expect(errors.addError.calledWith(errorMessages.evidence.locationMissing))
        .to.be.true;
    });
    it('should show an error for a too long location name', () => {
      const errors = { addError: sinon.spy() };
      validateVaLocation(errors, {
        locationAndName: 'a'.repeat(MAX_LENGTH.EVIDENCE_LOCATION_AND_NAME + 1),
      });
      expect(
        errors.addError.calledWith(errorMessages.evidence.locationMaxLength),
      ).to.be.true;
    });
  });

  describe('validateVaIssues', () => {
    it('should not show an error for included issues', () => {
      const errors = { addError: sinon.spy() };
      validateVaIssues(errors, { issues: ['ok'] });
      expect(errors.addError.called).to.be.false;
    });
    it('should show an error for a missing issues', () => {
      const errors = { addError: sinon.spy() };
      validateVaIssues(errors, { issues: [] });
      expect(errors.addError.calledWith(errorMessages.evidence.issuesMissing))
        .to.be.true;
    });
  });

  describe('validateVaIssues', () => {
    it('should not show an error for included issues', () => {
      const errors = { addError: sinon.spy() };
      validateVaIssues(errors, { issues: ['ok'] });
      expect(errors.addError.called).to.be.false;
    });
    it('should show an error for a missing issues', () => {
      const errors = { addError: sinon.spy() };
      validateVaIssues(errors, { issues: [] });
      expect(errors.addError.calledWith(errorMessages.evidence.issuesMissing))
        .to.be.true;
    });
  });

  describe('validateVaFromDate', () => {
    it('should not show an error for a valid from date', () => {
      const errors = { addError: sinon.spy() };
      validateVaFromDate(errors, { evidenceDates: { from: '2022-01-01' } });
      expect(errors.addError.called).to.be.false;
    });
    it('should show an error for an invalid from date', () => {
      const errors = { addError: sinon.spy() };
      validateVaFromDate(errors, { evidenceDates: { from: '-01-01' } });
      expect(errors.addError.calledWith(errorMessages.evidence.missingDate)).to
        .be.true;
    });
    it('should show an error for a missing from date', () => {
      const errors = { addError: sinon.spy() };
      validateVaFromDate(errors, { evidenceDates: { from: '' } });
      expect(errors.addError.calledWith(errorMessages.evidence.missingDate)).to
        .be.true;
    });
  });

  describe('validateVaToDate', () => {
    it('should not show an error for a valid to date & range', () => {
      const errors = { addError: sinon.spy() };
      validateVaToDate(errors, {
        evidenceDates: { from: '2022-01-01', to: '2022-02-02' },
      });
      expect(errors.addError.called).to.be.false;
    });
    it('should show an error for an invalid to date', () => {
      const errors = { addError: sinon.spy() };
      validateVaToDate(errors, { evidenceDates: { to: '-01-01' } });
      expect(errors.addError.calledWith(errorMessages.evidence.missingDate)).to
        .be.true;
    });
    it('should show an error for a missing to date', () => {
      const errors = { addError: sinon.spy() };
      validateVaToDate(errors, { evidenceDates: { to: '' } });
      expect(errors.addError.calledWith(errorMessages.evidence.missingDate)).to
        .be.true;
    });
    it('should show an error for a to date before from date', () => {
      const errors = { addError: sinon.spy() };
      validateVaToDate(errors, {
        evidenceDates: { from: '2022-02-02', to: '2022-01-01' },
      });
      expect(errors.addError.calledWith(errorMessages.endDateBeforeStart)).to.be
        .true;
    });
    it('should show an error for a to date in the future', () => {
      const errors = { addError: sinon.spy() };
      validateVaToDate(errors, {
        evidenceDates: { to: getDate({ offset: { years: 101 } }) },
      });
      expect(errors.addError.args[0][0]).eq(errorMessages.evidence.pastDate);
    });
  });

  describe('isEmptyVaEntry', () => {
    it('should return true for empty entries', () => {
      expect(isEmptyVaEntry()).to.be.true;
      expect(isEmptyVaEntry({ locationAndName: null })).to.be.true;
      expect(isEmptyVaEntry({ locationAndName: '' })).to.be.true;
      expect(isEmptyVaEntry({ issues: null })).to.be.true;
      expect(isEmptyVaEntry({ issues: [] })).to.be.true;
      expect(isEmptyVaEntry({ evidenceDates: null })).to.be.true;
      expect(isEmptyVaEntry({ evidenceDates: {} })).to.be.true;
      expect(
        isEmptyVaEntry({
          locationAndName: '',
          issues: [''],
          evidenceDates: { from: '', to: '' },
        }),
      ).to.be.true;
      // unknown keys are ignored
      expect(isEmptyVaEntry({ foo: 'bar' })).to.be.true;
    });
    it('should return false for filled or partially filled entries', () => {
      expect(isEmptyVaEntry({ locationAndName: 'bar' })).to.be.false;
      expect(isEmptyVaEntry({ issues: ['bar'] })).to.be.false;
      expect(isEmptyVaEntry({ evidenceDates: { from: '2020-01-01' } })).to.be
        .false;
      expect(isEmptyVaEntry({ evidenceDates: { to: '2020-01-01' } })).to.be
        .false;
      expect(
        isEmptyVaEntry({
          locationAndName: 'bar',
          issues: ['test'],
          evidenceDates: { from: '2020-01-01', to: '2020-02-02' },
        }),
      ).to.be.false;
    });
  });

  describe('validateVaUnique', () => {
    const getLocations = (name3 = 'location 2') => ({
      locations: [
        {
          locationAndName: 'Location 1',
          issues: ['Ankylosis of knee'],
          evidenceDates: { from: '2001-01-01', to: '2011-01-01' },
        },
        {
          locationAndName: 'Location 2',
          issues: ['Ankylosis of knees'],
          evidenceDates: { from: '2002-02-02', to: '2012-02-02' },
        },
        {
          locationAndName: name3,
          issues: ['AnKyLoSiS of KNEE'],
          evidenceDates: { from: '2001-01-01', to: '2011-01-01' },
        },
      ],
    });
    it('should not show an error for unique locations', () => {
      const errors = { addError: sinon.spy() };
      validateVaUnique(errors, {}, getLocations());
      expect(errors.addError.called).to.be.false;
    });
    it('should show an error for duplicate locations', () => {
      const errors = { addError: sinon.spy() };
      validateVaUnique(errors, {}, getLocations('LOCATION 1'));
      expect(errors.addError.calledWith(errorMessages.evidence.unique)).to.be
        .true;
    });
    it('should not show an error for empty duplicates', () => {
      const errors = { addError: sinon.spy() };
      const data = [
        ...getLocations().locations,
        {},
        { issues: [], evidenceData: {} },
      ];
      validateVaUnique(errors, {}, data);
      expect(errors.addError.called).to.be.false;
    });
  });
});

describe('Private evidence', () => {
  describe('validatePrivateName', () => {
    it('should not show an error for an added facility name', () => {
      const errors = { addError: sinon.spy() };
      validatePrivateName(errors, { providerFacilityName: 'ok' });
      expect(errors.addError.called).to.be.false;
    });
    it('should show an error for a missing facility name', () => {
      const errors = { addError: sinon.spy() };
      validatePrivateName(errors, { providerFacilityName: '' });
      expect(errors.addError.calledWith(errorMessages.evidence.facilityMissing))
        .to.be.true;
    });
  });

  describe('validateCountry', () => {
    it('should not show an error for an added facility country', () => {
      const errors = { addError: sinon.spy() };
      validateCountry(errors, { providerFacilityAddress: { country: 'ok' } });
      expect(errors.addError.called).to.be.false;
    });
    it('should show an error for a missing facility country', () => {
      const errors = { addError: sinon.spy() };
      validateCountry(errors, { providerFacilityAddress: { country: '' } });
      expect(errors.addError.calledWith(errorMessages.evidence.country)).to.be
        .true;
    });
  });

  describe('validateStreet', () => {
    it('should not show an error for an added facility street', () => {
      const errors = { addError: sinon.spy() };
      validateStreet(errors, { providerFacilityAddress: { street: 'ok' } });
      expect(errors.addError.called).to.be.false;
    });
    it('should show an error for a missing facility street', () => {
      const errors = { addError: sinon.spy() };
      validateStreet(errors, { providerFacilityAddress: { street: '' } });
      expect(errors.addError.calledWith(errorMessages.evidence.street)).to.be
        .true;
    });
  });

  describe('validateCity', () => {
    it('should not show an error for an added facility city', () => {
      const errors = { addError: sinon.spy() };
      validateCity(errors, { providerFacilityAddress: { city: 'ok' } });
      expect(errors.addError.called).to.be.false;
    });
    it('should show an error for a missing facility city', () => {
      const errors = { addError: sinon.spy() };
      validateCity(errors, { providerFacilityAddress: { city: '' } });
      expect(errors.addError.calledWith(errorMessages.evidence.city)).to.be
        .true;
    });
  });

  describe('validateState', () => {
    it('should not show an error for an added facility state', () => {
      const errors = { addError: sinon.spy() };
      validateState(errors, { providerFacilityAddress: { state: 'ok' } });
      expect(errors.addError.called).to.be.false;
    });
    it('should show an error for a missing facility state', () => {
      const errors = { addError: sinon.spy() };
      validateState(errors, { providerFacilityAddress: { state: '' } });
      expect(errors.addError.calledWith(errorMessages.evidence.state)).to.be
        .true;
    });
  });

  describe('validatePostal', () => {
    it('should not show an error for an added facility postal', () => {
      const errors = { addError: sinon.spy() };
      validatePostal(errors, {
        providerFacilityAddress: { postalCode: '12345' },
      });
      expect(errors.addError.called).to.be.false;
    });
    it('should not show an error for an added facility postal + 4', () => {
      const errors = { addError: sinon.spy() };
      validatePostal(errors, {
        providerFacilityAddress: { postalCode: '12345-6789' },
      });
      expect(errors.addError.called).to.be.false;
    });
    it('should show an error for a missing facility postal', () => {
      const errors = { addError: sinon.spy() };
      validatePostal(errors, { providerFacilityAddress: { postalCode: '' } });
      expect(errors.addError.calledWith(errorMessages.evidence.postal)).to.be
        .true;
    });
    it('should show an error for an invalid pattern', () => {
      const errors = { addError: sinon.spy() };
      validatePostal(errors, {
        providerFacilityAddress: { postalCode: '1234' },
      });
      expect(errors.addError.calledWith(errorMessages.invalidZip)).to.be.true;
    });
  });

  describe('validatePrivateIssues', () => {
    it('should not show an error for an added facility issues', () => {
      const errors = { addError: sinon.spy() };
      validatePrivateIssues(errors, { issues: ['ok'] });
      expect(errors.addError.called).to.be.false;
    });
    it('should show an error for a missing facility issues', () => {
      const errors = { addError: sinon.spy() };
      validatePrivateIssues(errors, { issues: [] });
      expect(errors.addError.calledWith(errorMessages.evidence.issuesMissing))
        .to.be.true;
    });
  });

  describe('validatePrivateFromDate', () => {
    it('should not show an error for a valid from date', () => {
      const errors = { addError: sinon.spy() };
      validatePrivateFromDate(errors, {
        treatmentDateRange: { from: '2022-01-01' },
      });
      expect(errors.addError.called).to.be.false;
    });
    it('should show an error for an invalid from date', () => {
      const errors = { addError: sinon.spy() };
      validatePrivateFromDate(errors, {
        treatmentDateRange: { from: '-01-01' },
      });
      expect(errors.addError.calledWith(errorMessages.evidence.missingDate)).to
        .be.true;
    });
    it('should show an error for a missing from date', () => {
      const errors = { addError: sinon.spy() };
      validatePrivateFromDate(errors, { treatmentDateRange: { from: '' } });
      expect(errors.addError.calledWith(errorMessages.evidence.missingDate)).to
        .be.true;
    });
  });

  describe('validatePrivateToDate', () => {
    it('should not show an error for a valid to date & range', () => {
      const errors = { addError: sinon.spy() };
      validatePrivateToDate(errors, {
        treatmentDateRange: { from: '2022-01-01', to: '2022-02-02' },
      });
      expect(errors.addError.called).to.be.false;
    });
    it('should show an error for an invalid to date', () => {
      const errors = { addError: sinon.spy() };
      validatePrivateToDate(errors, { treatmentDateRange: { to: '-01-01' } });
      expect(errors.addError.calledWith(errorMessages.evidence.missingDate)).to
        .be.true;
    });
    it('should show an error for a missing to date', () => {
      const errors = { addError: sinon.spy() };
      validatePrivateToDate(errors, { treatmentDateRange: { to: '' } });
      expect(errors.addError.calledWith(errorMessages.evidence.missingDate)).to
        .be.true;
    });
    it('should show an error for a to date before from date', () => {
      const errors = { addError: sinon.spy() };
      validatePrivateToDate(errors, {
        treatmentDateRange: { from: '2022-02-02', to: '2022-01-01' },
      });
      expect(errors.addError.calledWith(errorMessages.endDateBeforeStart)).to.be
        .true;
    });
    it('should show an error for a to date in the future', () => {
      const errors = { addError: sinon.spy() };
      validatePrivateToDate(errors, {
        treatmentDateRange: { to: getDate({ offset: { years: 101 } }) },
      });
      expect(errors.addError.args[0][0]).eq(errorMessages.evidence.pastDate);
    });
  });

  describe('isEmptyPrivateEntry', () => {
    it('should return true for empty entries', () => {
      expect(isEmptyPrivateEntry()).to.be.true;
      expect(isEmptyPrivateEntry({ providerFacilityName: null })).to.be.true;
      expect(isEmptyPrivateEntry({ providerFacilityName: '' })).to.be.true;
      expect(isEmptyPrivateEntry({ providerFacilityAddress: { country: '' } }))
        .to.be.true;
      expect(
        isEmptyPrivateEntry({ providerFacilityAddress: { country: 'USA' } }),
      ).to.be.true;
      expect(isEmptyPrivateEntry({ providerFacilityAddress: { street: '' } }))
        .to.be.true;
      expect(isEmptyPrivateEntry({ providerFacilityAddress: { street2: '' } }))
        .to.be.true;
      expect(isEmptyPrivateEntry({ providerFacilityAddress: { city: '' } })).to
        .be.true;
      expect(isEmptyPrivateEntry({ providerFacilityAddress: { state: '' } })).to
        .be.true;
      expect(
        isEmptyPrivateEntry({ providerFacilityAddress: { postalCode: '' } }),
      ).to.be.true;
      expect(
        isEmptyPrivateEntry({
          providerFacilityAddress: {
            country: '',
            street: '',
            street2: '',
            city: '',
            state: '',
            postalCode: '',
          },
        }),
      ).to.be.true;
      expect(isEmptyPrivateEntry({ issues: null })).to.be.true;
      expect(isEmptyPrivateEntry({ issues: [] })).to.be.true;
      expect(isEmptyPrivateEntry({ treatmentDateRange: null })).to.be.true;
      expect(isEmptyPrivateEntry({ treatmentDateRange: {} })).to.be.true;
      expect(
        isEmptyPrivateEntry({
          providerFacilityName: '',
          providerFacilityAddress: {
            country: '',
            street: '',
            street2: '',
            city: '',
            state: '',
            postalCode: '',
          },
          issues: [''],
          treatmentDateRange: { from: '', to: '' },
        }),
      ).to.be.true;
      expect(
        isEmptyPrivateEntry({
          providerFacilityName: '',
          providerFacilityAddress: {
            country: 'USA',
            street: '',
            street2: '',
            city: '',
            state: '',
            postalCode: '',
          },
          issues: [''],
          treatmentDateRange: { from: '', to: '' },
        }),
      ).to.be.true;
    });
    it('should return false for filled or partially filled entries', () => {
      expect(isEmptyPrivateEntry({ providerFacilityName: 'bar' })).to.be.false;
      expect(
        isEmptyPrivateEntry({ providerFacilityAddress: { country: 'Fiji' } }),
      ).to.be.false;
      expect(
        isEmptyPrivateEntry({ providerFacilityAddress: { street: '123' } }),
      ).to.be.false;
      expect(
        isEmptyPrivateEntry({ providerFacilityAddress: { street2: '456' } }),
      ).to.be.false;
      expect(isEmptyPrivateEntry({ providerFacilityAddress: { city: 'asd' } }))
        .to.be.false;
      expect(isEmptyPrivateEntry({ providerFacilityAddress: { state: 'AK' } }))
        .to.be.false;
      expect(
        isEmptyPrivateEntry({
          providerFacilityAddress: { postalCode: '12345' },
        }),
      ).to.be.false;
      expect(isEmptyPrivateEntry({ issues: ['bar'] })).to.be.false;
      expect(
        isEmptyPrivateEntry({ treatmentDateRange: { from: '2020-01-01' } }),
      ).to.be.false;
      expect(isEmptyPrivateEntry({ treatmentDateRange: { to: '2020-01-01' } }))
        .to.be.false;
      expect(
        isEmptyPrivateEntry({
          providerFacilityName: 'bar',
          providerFacilityAddress: {
            country: 'USA',
            street: '123',
            street2: '456',
            city: 'asd',
            state: 'AK',
            postalCode: '12345',
          },
          issues: ['test'],
          treatmentDateRange: { from: '2020-01-01', to: '2020-02-02' },
        }),
      ).to.be.false;
    });
  });

  describe('validatePrivateUnique', () => {
    const _ = null;
    const providerFacilityAddress = {
      country: 'USA',
      street: '123 Main',
      street2: '456',
      city: 'city',
      state: 'AK',
      postalCode: '90210',
    };
    const getFacilities = (name3 = 'facility 3') => ({
      providerFacility: [
        {
          providerFacilityName: 'Facility 1',
          providerFacilityAddress,
          issues: ['Ankylosis of knee'],
          treatmentDateRange: { from: '2001-01-01', to: '2011-01-01' },
        },
        {
          providerFacilityName: 'Facility 2',
          providerFacilityAddress,
          issues: ['Ankylosis of knee'],
          treatmentDateRange: { from: '2002-02-02', to: '2012-02-02' },
        },
        {
          providerFacilityName: name3,
          providerFacilityAddress,
          issues: ['AnKyLoSiS of KNEE'],
          treatmentDateRange: { from: '2001-01-01', to: '2011-01-01' },
        },
      ],
    });
    it('should not show an error for unique facility', () => {
      const errors = { addError: sinon.spy() };
      validatePrivateUnique(errors, _, getFacilities(), _, _, 0);
      expect(errors.addError.called).to.be.false;
    });
    it('should not show a duplicate Facility error on the initial duplicate entry', () => {
      const errors = { addError: sinon.spy() };
      validatePrivateUnique(errors, _, getFacilities('FACILITY 1'), _, _, 0);
      expect(errors.addError.called).to.be.false;
    });
    it('should show an error for duplicate Facilities on the indexed page', () => {
      const errors = { addError: sinon.spy() };
      validatePrivateUnique(errors, _, getFacilities('FACILITY 1'), _, _, 2);
      expect(errors.addError.calledWith(errorMessages.evidence.unique)).to.be
        .true;
    });
  });
});
