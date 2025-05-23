import { expect } from 'chai';
import sinon from 'sinon';

import { errorMessages, SC_NEW_FORM_DATA } from '../../constants';

import {
  validateVaLocation,
  validateVaIssues,
  validateVaFromDate,
  validateVaToDate,
  buildVaLocationString,
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
  validateVaDate,
  buildPrivateString,
  isEmptyPrivateEntry,
  validatePrivateUnique,
} from '../../validations/evidence';

import {
  MAX_LENGTH,
  MAX_YEARS_PAST,
  SELECTED,
} from '../../../shared/constants';
import { parseDateWithOffset } from '../../../shared/utils/dates';
import sharedErrorMessages from '../../../shared/content/errorMessages';

describe('VA evidence', () => {
  describe('validateVaLocation', () => {
    it('should not show an error for an added location name', () => {
      const errors = { addError: sinon.spy() };
      validateVaLocation(errors, { locationAndName: 'ok' });
      expect(errors.addError.called).to.be.false;
    });
    it('should show an error for a missing location name', () => {
      const errors = { addError: sinon.spy() };
      validateVaLocation(errors);
      expect(errors.addError.calledWith(errorMessages.evidence.locationMissing))
        .to.be.true;
    });
    it('should show an error for a too long location name', () => {
      const errors = { addError: sinon.spy() };
      validateVaLocation(errors, {
        locationAndName: 'a'.repeat(
          MAX_LENGTH.SC_EVIDENCE_LOCATION_AND_NAME + 1,
        ),
      });
      expect(
        errors.addError.calledWith(errorMessages.evidence.locationMaxLength),
      ).to.be.true;
    });
  });

  describe('validateVaIssues', () => {
    it('should not show an error for included issues', () => {
      const errors = { addError: sinon.spy() };
      validateVaIssues(errors, null, {
        additionalIssues: [{ issue: 'ok', [SELECTED]: true }],
        locations: [{ issues: ['ok'] }],
      });
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
      expect(errors.addError.calledWith(errorMessages.evidence.blankDate)).to
        .true;
    });
    it('should show an error for a missing from date', () => {
      const errors = { addError: sinon.spy() };
      validateVaFromDate(errors, { evidenceDates: { from: '' } });
      expect(errors.addError.calledWith(errorMessages.evidence.blankDate)).to
        .true;
    });

    it('should return false if feature toggle is enabled', () => {
      const errors = { addError: sinon.spy() };
      const result = validateVaFromDate(
        errors,
        { evidenceDates: { from: '', to: '' } },
        { [SC_NEW_FORM_DATA]: true },
      );
      expect(errors.addError.notCalled).to.be.true;
      expect(result).to.be.false;
    });
  });

  describe('validateVaToDate', () => {
    it('should not show an error for a valid to date & range', () => {
      const errors = { addError: sinon.spy() };
      validateVaToDate(errors, {
        evidenceDates: { from: '2022-01-01', to: '2023-02-02' },
      });
      expect(errors.addError.called).to.be.false;
    });
    it('should show an error for an invalid to date', () => {
      const errors = { addError: sinon.spy() };
      validateVaToDate(errors, { evidenceDates: { to: '-01-01' } });
      expect(errors.addError.calledWith(errorMessages.evidence.blankDate)).to.be
        .be.true;
    });
    it('should show an error for a missing to date', () => {
      const errors = { addError: sinon.spy() };
      validateVaToDate(errors, { evidenceDates: { to: '' } });
      expect(errors.addError.calledWith(errorMessages.evidence.blankDate)).to.be
        .be.true;
    });
    it('should show an error for a to date before from date', () => {
      const errors = { addError: sinon.spy() };
      validateVaToDate(errors, {
        evidenceDates: { from: '2023-02-02', to: '2022-01-01' },
      });
      expect(errors.addError.calledWith(sharedErrorMessages.endDateBeforeStart))
        .to.be.true;
    });
    it('should show an error for a to date in the future', () => {
      const errors = { addError: sinon.spy() };
      validateVaToDate(errors, {
        evidenceDates: {
          to: parseDateWithOffset({ years: MAX_YEARS_PAST + 1 }),
        },
      });
      expect(errors.addError.args[0][0]).eq(errorMessages.evidence.pastDate);
    });

    it('should return false if feature toggle is enabled', () => {
      const errors = { addError: sinon.spy() };
      const result = validateVaToDate(
        errors,
        { evidenceDates: { from: '', to: '' } },
        { [SC_NEW_FORM_DATA]: true },
      );
      expect(errors.addError.notCalled).to.be.true;
      expect(result).to.be.false;
    });
  });

  describe('validateVaDate', () => {
    const fullData = { [SC_NEW_FORM_DATA]: true };
    it('should not show an error for a valid treatment date', () => {
      const errors = { addError: sinon.spy() };
      validateVaDate(errors, { treatmentDate: '2022-01' }, fullData);
      expect(errors.addError.called).to.be.false;
    });
    it('should not show an error for an invalid treatment date', () => {
      const errors = { addError: sinon.spy() };
      validateVaDate(errors, { treatmentDate: '2000' }, fullData);
      expect(errors.addError.notCalled).to.be.true;
    });
    it('should not show an error for a missing treatment date', () => {
      const errors = { addError: sinon.spy() };
      validateVaDate(errors, { treatmentDate: '' }, fullData);
      expect(errors.addError.notCalled).to.be.true;
    });
    it('should show an error for a to date in the future', () => {
      const errors = { addError: sinon.spy() };
      const treatmentDate = parseDateWithOffset({
        years: MAX_YEARS_PAST + 1,
      }).substring(0, 7); // only keep YYYYY-MM
      validateVaDate(errors, { treatmentDate }, fullData);
      expect(errors.addError.args[0][0]).eq(errorMessages.evidence.pastDate);
    });

    it('should return undefined if feature toggle is disabled', () => {
      const errors = { addError: sinon.spy() };
      const result = validateVaDate(errors, { treatmentDate: '' });
      expect(errors.addError.notCalled).to.be.true;
      expect(result).to.be.undefined;
    });
  });

  describe('buildVaLocationString', () => {
    describe('current form', () => {
      const getLocation = ({
        name = 'name',
        issues = ['1', '2'],
        from = '2022-01-01',
        to = '2023-02-02',
      } = {}) => ({
        locationAndName: name,
        issues,
        evidenceDates: { from, to },
      });
      const setup = ({
        data,
        name,
        issues,
        from,
        to,
        joiner = '',
        includeIssues = true,
      } = {}) =>
        buildVaLocationString({
          data: data || getLocation({ name, issues, from, to }),
          joiner,
          includeIssues,
          wrapped: false,
        });

      it('should return an empty string', () => {
        expect(buildVaLocationString()).to.eq('');
        expect(setup({ data: {} })).to.eq('');
        expect(setup({ data: { evidenceDates: {} } })).to.eq('');
      });
      it('should add different joiners', () => {
        expect(setup()).to.eq('name122022-01-012023-02-02');
        expect(setup({ joiner: ',' })).to.eq('name,1,2,2022-01-01,2023-02-02');
        expect(setup({ joiner: ';' })).to.eq('name;1;2;2022-01-01;2023-02-02');
      });
      it('should return expected strings for original form', () => {
        expect(setup({ data: {} })).to.eq('');
        expect(setup({ data: {}, joiner: ',' })).to.eq(',,');
        expect(
          setup({
            issues: [],
            from: '',
            to: '',
            joiner: ',',
          }),
        ).to.eq('name,,');
        expect(setup({ from: '', to: '', joiner: ',' })).to.eq('name,1,2,,');
        expect(setup({ to: '', joiner: ',' })).to.eq('name,1,2,2022-01-01,');
        expect(setup({ joiner: ',' })).to.eq('name,1,2,2022-01-01,2023-02-02');
      });

      it('should remove empty dates', () => {
        expect(setup({ from: '--', joiner: ',' })).to.eq(
          'name,1,2,,2023-02-02',
        );
        expect(setup({ from: '-00-00', joiner: ',' })).to.eq(
          'name,1,2,,2023-02-02',
        );
        expect(setup({ to: '--', joiner: ',' })).to.eq('name,1,2,2022-01-01,');
        expect(setup({ to: '-00-00', joiner: ',' })).to.eq(
          'name,1,2,2022-01-01,',
        );
      });
      it('should add leading zeros to dates', () => {
        expect(setup({ from: '2021-12-4', joiner: ',' })).to.eq(
          'name,1,2,2021-12-04,2023-02-02',
        );
        expect(setup({ from: '2022-1-16', joiner: ',' })).to.eq(
          'name,1,2,2022-01-16,2023-02-02',
        );
        expect(setup({ from: '2022-1-5', joiner: ',' })).to.eq(
          'name,1,2,2022-01-05,2023-02-02',
        );

        expect(setup({ to: '2022-12-3', joiner: ',' })).to.eq(
          'name,1,2,2022-01-01,2022-12-03',
        );
        expect(setup({ to: '2022-3-17', joiner: ',' })).to.eq(
          'name,1,2,2022-01-01,2022-03-17',
        );
        expect(setup({ to: '2022-3-3', joiner: ',' })).to.eq(
          'name,1,2,2022-01-01,2022-03-03',
        );
      });

      it('should not include issues', () => {
        expect(
          setup({
            joiner: ',',
            includeIssues: false,
          }),
        ).to.eq('name,2022-01-01,2023-02-02');
      });
    });

    describe('new form', () => {
      const getLocation = ({
        name = 'name',
        issues = ['1', '2'],
        date = '2024-05-06',
        noDate = '',
      } = {}) => ({
        locationAndName: name,
        issues,
        treatmentDate: date,
        noDate,
      });
      const setup = ({
        data,
        name,
        issues,
        date,
        noDate,
        joiner = '',
        includeIssues = true,
        wrapped = false,
      } = {}) =>
        buildVaLocationString({
          data: data || getLocation({ name, issues, date, noDate }),
          joiner,
          includeIssues,
          newForm: true,
          wrapped,
        });
      it('should add different joiners', () => {
        expect(setup()).to.eq('name122024-05-06false');
        expect(setup({ noDate: false })).to.eq('name122024-05-06false');
        expect(setup({ noDate: false, joiner: ',' })).to.eq(
          'name,1,2,2024-05-06,false',
        );
        expect(setup({ noDate: true, joiner: ';' })).to.eq('name;1;2;;true');
      });
      it('should return expected strings for original form', () => {
        expect(setup({ data: {} })).to.eq('false');
        expect(setup({ data: {}, joiner: ',' })).to.eq(',,false');
        expect(
          setup({
            issues: [],
            noDate: false,
            joiner: ',',
          }),
        ).to.eq('name,2024-05-06,false');
        expect(
          setup({
            issues: [],
            noDate: true,
            joiner: ',',
          }),
        ).to.eq('name,,true');
        expect(setup({ date: '', joiner: ',' })).to.eq('name,1,2,,false');
        expect(setup({ noDate: false, joiner: ',' })).to.eq(
          'name,1,2,2024-05-06,false',
        );
      });

      it('should remove empty dates', () => {
        expect(setup({ date: '-', joiner: ',' })).to.eq('name,1,2,,false');
      });
      it('should add leading zeros to month', () => {
        expect(setup({ date: '2022-3', joiner: ',' })).to.eq(
          'name,1,2,2022-03-01,false',
        );
      });
      it('should get correct no date value', () => {
        expect(
          buildVaLocationString({
            data: { ...getLocation(), noTreatmentDates: true },
            joiner: ',',
            wrapped: true,
            newForm: true,
          }),
        ).to.eq('name,1,2,,true');
      });

      it('should not include issues', () => {
        expect(
          setup({
            noDate: true,
            joiner: ',',
            includeIssues: false,
          }),
        ).to.eq('name,,true');
      });
    });
  });

  describe('isEmptyVaEntry', () => {
    it('should return true for empty entries', () => {
      expect(isEmptyVaEntry()).to.be.true;
      expect(isEmptyVaEntry({ locationAndName: null })).to.be.true;
      expect(isEmptyVaEntry({ locationAndName: '' })).to.be.true;
      expect(isEmptyVaEntry({ issues: null })).to.be.true;
      expect(isEmptyVaEntry({ issues: [] })).to.be.true;
      // current form
      expect(isEmptyVaEntry({ evidenceDates: null })).to.be.true;
      expect(isEmptyVaEntry({ evidenceDates: {} })).to.be.true;
      expect(isEmptyVaEntry({ evidenceDates: { from: '--', to: '--' } })).to.be
        .true;
      expect(isEmptyVaEntry({ evidenceDates: { from: '-0-0', to: '-0-0' } })).to
        .be.true;
      expect(isEmptyVaEntry({ evidenceDates: { from: '-00-00', to: '--' } })).to
        .be.true;
      expect(
        isEmptyVaEntry({
          locationAndName: '',
          issues: [''],
          evidenceDates: { from: '', to: '' },
        }),
      ).to.be.true;

      expect(
        isEmptyVaEntry(
          { treatmentDate: null, noDate: null, newForm: true },
          true,
        ),
      ).to.be.true;
      expect(isEmptyVaEntry({ treatmentDate: null }, true)).to.be.true;

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
      expect(
        isEmptyVaEntry(
          { treatmentDate: null, noDate: true, newForm: true },
          true,
        ),
      ).to.be.false;
    });
  });

  describe('validateVaUnique', () => {
    const _ = null;
    const getLocations = (name3 = 'location 3') => ({
      locations: [
        {
          locationAndName: 'Location 1',
          issues: ['test 1', 'test 2'],
          evidenceDates: { from: '2001-01-01', to: '2011-01-01' },
        },
        {},
        {
          locationAndName: 'Location 2',
          issues: ['test 1', 'test 2'],
          evidenceDates: { from: '2002-02-02', to: '2012-02-02' },
        },
        {
          locationAndName: '',
          issues: [''],
          evidenceDates: { from: '', to: '' },
        },
        {
          locationAndName: name3,
          issues: ['TeSt 2', 'tEsT 1'],
          evidenceDates: { from: '2001-1-01', to: '2011-01-1' },
        },
      ],
    });
    it('should NOT show an error for unique locations', () => {
      const errors = { addError: sinon.spy() };
      validateVaUnique(errors, {}, getLocations(), _, _, 0);
      expect(errors.addError.called).to.be.false;
    });
    it('should NOT show an error for duplicate locations when on the first duplicate', () => {
      const errors = { addError: sinon.spy() };
      validateVaUnique(errors, {}, getLocations('LOCATION 1'), _, _, 0);
      expect(errors.addError.calledWith(errorMessages.evidence.uniqueVA)).to.be
        .false;
    });
    it('should SHOW an error for duplicate locations when not on the first duplicate index', () => {
      const errors = { addError: sinon.spy() };
      validateVaUnique(errors, {}, getLocations('LOCATION 1'), _, _, 4);
      expect(errors.addError.calledWith(errorMessages.evidence.uniqueVA)).to.be
        .true;
    });
    it('should NOT show an error for duplicate locations when on a different index', () => {
      const errors = { addError: sinon.spy() };
      validateVaUnique(errors, {}, getLocations('LOCATION 2'), _, _, 0);
      expect(errors.addError.calledWith(errorMessages.evidence.uniqueVA)).to.be
        .false;
    });

    it('should NOT show an error for empty duplicates', () => {
      const errors = { addError: sinon.spy() };
      const data = [
        ...getLocations().locations,
        {},
        { issues: [], evidenceDates: {} },
      ];
      validateVaUnique(errors, {}, data);
      expect(errors.addError.called).to.be.false;
    });
  });
});

describe('Private evidence', () => {
  describe('validatePrivateName', () => {
    it('should show an error when missing data', () => {
      const errors = { addError: sinon.spy() };
      validatePrivateName(errors);
      expect(errors.addError.called).to.be.true;
    });
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
      expect(errors.addError.calledWith(sharedErrorMessages.country)).to.be
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
      expect(errors.addError.calledWith(sharedErrorMessages.street)).to.be.true;
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
      expect(errors.addError.calledWith(sharedErrorMessages.city)).to.be.true;
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
      expect(errors.addError.calledWith(sharedErrorMessages.state)).to.be.true;
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
      expect(errors.addError.calledWith(sharedErrorMessages.postal)).to.be.true;
    });
    it('should show an error for an invalid pattern', () => {
      const errors = { addError: sinon.spy() };
      validatePostal(errors, {
        providerFacilityAddress: { postalCode: '1234' },
      });
      expect(errors.addError.calledWith(sharedErrorMessages.zip)).to.be.true;
    });
  });

  describe('validatePrivateIssues', () => {
    it('should not show an error for an added facility issues', () => {
      const errors = { addError: sinon.spy() };
      validatePrivateIssues(errors, null, {
        additionalIssues: [{ issue: 'ok', [SELECTED]: true }],
        providerFacility: [{ issues: ['ok'] }],
      });
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
      expect(errors.addError.calledWith(errorMessages.evidence.blankDate)).to.be
        .be.true;
    });
    it('should show an error for a missing from date', () => {
      const errors = { addError: sinon.spy() };
      validatePrivateFromDate(errors, { treatmentDateRange: { from: '' } });
      expect(errors.addError.calledWith(errorMessages.evidence.blankDate)).to.be
        .be.true;
    });
  });

  describe('validatePrivateToDate', () => {
    it('should not show an error for a valid to date & range', () => {
      const errors = { addError: sinon.spy() };
      validatePrivateToDate(errors, {
        treatmentDateRange: { from: '2022-01-01', to: '2023-02-02' },
      });
      expect(errors.addError.called).to.be.false;
    });
    it('should show an error for an invalid to date', () => {
      const errors = { addError: sinon.spy() };
      validatePrivateToDate(errors, { treatmentDateRange: { to: '-01-01' } });
      expect(errors.addError.calledWith(errorMessages.evidence.blankDate)).to.be
        .be.true;
    });
    it('should show an error for a missing to date', () => {
      const errors = { addError: sinon.spy() };
      validatePrivateToDate(errors, { treatmentDateRange: { to: '' } });
      expect(errors.addError.calledWith(errorMessages.evidence.blankDate)).to.be
        .be.true;
    });
    it('should show an error for a to date before from date', () => {
      const errors = { addError: sinon.spy() };
      validatePrivateToDate(errors, {
        treatmentDateRange: { from: '2023-02-02', to: '2022-01-01' },
      });
      expect(errors.addError.calledWith(sharedErrorMessages.endDateBeforeStart))
        .to.be.true;
    });
    it('should show an error for a to date in the future', () => {
      const errors = { addError: sinon.spy() };
      validatePrivateToDate(errors, {
        treatmentDateRange: {
          to: parseDateWithOffset({ years: MAX_YEARS_PAST + 1 }),
        },
      });
      expect(errors.addError.args[0][0]).eq(errorMessages.evidence.pastDate);
    });
  });

  describe('buildPrivateString', () => {
    const getLocation = ({
      name = 'name',
      issues = ['1', '2'],
      country = 'USA',
      street = '123 Main',
      city = 'Anywhere',
      state = 'Confusion',
      postalCode = '55555',
      from = '2022-01-01',
      to = '2023-02-02',
    } = {}) => ({
      providerFacilityName: name,
      issues,
      providerFacilityAddress: {
        country,
        street,
        city,
        state,
        postalCode,
      },
      treatmentDateRange: { from, to },
    });
    it('should add different joiners', () => {
      expect(buildPrivateString(getLocation())).to.eq(
        'nameUSA123 MainAnywhereConfusion55555122022-01-012023-02-02',
      );
      expect(buildPrivateString(getLocation(), ',')).to.eq(
        'name,USA,123 Main,Anywhere,Confusion,55555,1,2,2022-01-01,2023-02-02',
      );
      expect(buildPrivateString(getLocation(), ';')).to.eq(
        'name;USA;123 Main;Anywhere;Confusion;55555;1;2;2022-01-01;2023-02-02',
      );
    });
    it('should return expected strings', () => {
      expect(buildPrivateString({})).to.eq('');
      expect(buildPrivateString({}, ',')).to.eq(',,');
      expect(
        buildPrivateString(
          getLocation({
            country: '',
            street: '',
            city: '',
            state: '',
            postalCode: '',
            issues: [],
            from: '',
            to: '',
          }),
          ',',
        ),
      ).to.eq('name,,,,,,,');
      expect(
        buildPrivateString(
          getLocation({
            street: '',
            city: '',
            state: '',
            postalCode: '',
            issues: [],
            from: '',
            to: '',
          }),
          ',',
        ),
      ).to.eq('name,USA,,,,,,');
      expect(
        buildPrivateString(
          getLocation({
            city: '',
            state: '',
            postalCode: '',
            issues: [],
            from: '',
            to: '',
          }),
          ',',
        ),
      ).to.eq('name,USA,123 Main,,,,,');
      expect(
        buildPrivateString(
          getLocation({
            state: '',
            postalCode: '',
            issues: [],
            from: '',
            to: '',
          }),
          ',',
        ),
      ).to.eq('name,USA,123 Main,Anywhere,,,,');
      expect(
        buildPrivateString(
          getLocation({ postalCode: '', issues: [], from: '', to: '' }),
          ',',
        ),
      ).to.eq('name,USA,123 Main,Anywhere,Confusion,,,');
      expect(
        buildPrivateString(getLocation({ issues: [], from: '', to: '' }), ','),
      ).to.eq('name,USA,123 Main,Anywhere,Confusion,55555,,');
      expect(buildPrivateString(getLocation({ from: '', to: '' }), ',')).to.eq(
        'name,USA,123 Main,Anywhere,Confusion,55555,1,2,,',
      );
      expect(buildPrivateString(getLocation({ to: '' }), ',')).to.eq(
        'name,USA,123 Main,Anywhere,Confusion,55555,1,2,2022-01-01,',
      );
      expect(buildPrivateString(getLocation(), ',')).to.eq(
        'name,USA,123 Main,Anywhere,Confusion,55555,1,2,2022-01-01,2023-02-02',
      );
    });
    it('should remove empty dates', () => {
      expect(buildPrivateString(getLocation({ from: '--' }), ',')).to.eq(
        'name,USA,123 Main,Anywhere,Confusion,55555,1,2,,2023-02-02',
      );
      expect(buildPrivateString(getLocation({ from: '-00-00' }), ',')).to.eq(
        'name,USA,123 Main,Anywhere,Confusion,55555,1,2,,2023-02-02',
      );
      expect(buildPrivateString(getLocation({ to: '--' }), ',')).to.eq(
        'name,USA,123 Main,Anywhere,Confusion,55555,1,2,2022-01-01,',
      );
      expect(buildPrivateString(getLocation({ to: '-00-00' }), ',')).to.eq(
        'name,USA,123 Main,Anywhere,Confusion,55555,1,2,2022-01-01,',
      );
    });
    it('should add leading zeros to dates', () => {
      expect(buildPrivateString(getLocation({ from: '2021-12-4' }), ',')).to.eq(
        'name,USA,123 Main,Anywhere,Confusion,55555,1,2,2021-12-04,2023-02-02',
      );
      expect(buildPrivateString(getLocation({ from: '2022-1-16' }), ',')).to.eq(
        'name,USA,123 Main,Anywhere,Confusion,55555,1,2,2022-01-16,2023-02-02',
      );
      expect(buildPrivateString(getLocation({ from: '2022-1-5' }), ',')).to.eq(
        'name,USA,123 Main,Anywhere,Confusion,55555,1,2,2022-01-05,2023-02-02',
      );

      expect(buildPrivateString(getLocation({ to: '2022-12-3' }), ',')).to.eq(
        'name,USA,123 Main,Anywhere,Confusion,55555,1,2,2022-01-01,2022-12-03',
      );
      expect(buildPrivateString(getLocation({ to: '2022-3-17' }), ',')).to.eq(
        'name,USA,123 Main,Anywhere,Confusion,55555,1,2,2022-01-01,2022-03-17',
      );
      expect(buildPrivateString(getLocation({ to: '2022-3-3' }), ',')).to.eq(
        'name,USA,123 Main,Anywhere,Confusion,55555,1,2,2022-01-01,2022-03-03',
      );
    });
    it('should not include issues', () => {
      expect(
        buildPrivateString(getLocation(), ',', { includeIssues: false }),
      ).to.eq(
        'name,USA,123 Main,Anywhere,Confusion,55555,2022-01-01,2023-02-02',
      );
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
        isEmptyPrivateEntry({ treatmentDateRange: { from: '--', to: '--' } }),
      ).to.be.true;

      expect(
        isEmptyPrivateEntry({
          treatmentDateRange: { from: '-0-0', to: '-0-0' },
        }),
      ).to.be.true;
      expect(
        isEmptyPrivateEntry({
          treatmentDateRange: { from: '-00-00', to: '--' },
        }),
      ).to.be.true;

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
          issues: ['test 1', 'test 2'],
          treatmentDateRange: { from: '2001-01-01', to: '2011-01-01' },
        },
        {},
        {
          providerFacilityName: 'Facility 2',
          providerFacilityAddress,
          issues: ['test 1', 'test 2'],
          treatmentDateRange: { from: '2002-02-02', to: '2012-02-02' },
        },
        {
          providerFacilityName: '',
          providerFacilityAddress: { city: '' },
          issues: [''],
          treatmentDateRange: { from: '', to: '' },
        },
        {
          providerFacilityName: name3,
          providerFacilityAddress,
          issues: ['TeSt 2', 'tEsT 1'],
          treatmentDateRange: { from: '2001-01-01', to: '2011-01-01' },
        },
      ],
    });
    it('should NOT show an error for unique facilities', () => {
      const errors = { addError: sinon.spy() };
      validatePrivateUnique(errors, _, getFacilities(), _, _, 0);
      expect(errors.addError.called).to.be.false;
    });
    it('should NOT show a duplicate Facility error on the initial duplicate entry', () => {
      const errors = { addError: sinon.spy() };
      validatePrivateUnique(errors, _, getFacilities('FACILITY 1'), _, _, 0);
      expect(errors.addError.called).to.be.false;
    });
    it('should SHOW an error for duplicate Facilities on the indexed page', () => {
      const errors = { addError: sinon.spy() };
      validatePrivateUnique(errors, _, getFacilities('FACILITY 1'), _, _, 4);
      expect(errors.addError.calledWith(errorMessages.evidence.uniquePrivate))
        .to.be.true;
    });
    it('should NOT show a duplicate Facility error when data is missing', () => {
      const errors = { addError: sinon.spy() };
      validatePrivateUnique(errors);
      expect(errors.addError.called).to.be.false;
    });
    it('should NOT show a duplicate Facility error on a different index', () => {
      const errors = { addError: sinon.spy() };
      validatePrivateUnique(errors, _, getFacilities('FACILITY 2'), _, _, 0);
      expect(errors.addError.called).to.be.false;
    });

    it('should NOT show an error for empty duplicates', () => {
      const errors = { addError: sinon.spy() };
      const data = [
        ...getFacilities().providerFacility,
        {},
        { issues: [], treatmentDateRange: {} },
      ];
      validatePrivateUnique(errors, _, data);
      expect(errors.addError.called).to.be.false;
    });
  });
});
