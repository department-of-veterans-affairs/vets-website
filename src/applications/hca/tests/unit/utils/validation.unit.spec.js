import { expect } from 'chai';
import sinon from 'sinon';
import moment from 'moment';

import {
  validateServiceDates,
  validateDependentDate,
  validateGulfWarDates,
  validateExposureDates,
  validateCurrency,
} from '../../../utils/validation';

describe('hca `validateServiceDates` form validation', () => {
  const getData = ({
    spy = () => {},
    errorKey = 'lastDischargeDate',
    dischargeDate = '2016-01-01',
    entryDate = '2011-01-01',
    birthdate = '1980-01-01',
  }) => ({
    errors: {
      [errorKey]: { addError: spy },
    },
    fieldData: {
      lastDischargeDate: dischargeDate,
      lastEntryDate: entryDate,
    },
    formData: {
      veteranDateOfBirth: birthdate,
    },
  });

  context('when form data is valid', () => {
    const spy = sinon.spy();
    const { errors, fieldData, formData } = getData({ spy });

    it('should not set error message', () => {
      validateServiceDates(errors, fieldData, formData);
      expect(spy.called).to.be.false;
    });
  });

  context('when discharge date is before entry date', () => {
    const spy = sinon.spy();
    const { errors, fieldData, formData } = getData({
      dischargeDate: '2010-01-01',
      spy,
    });

    it('should set error message ', () => {
      validateServiceDates(errors, fieldData, formData);
      expect(spy.called).to.be.true;
    });
  });

  context('when discharge date is later than 1 year from today', () => {
    const spy = sinon.spy();
    const { errors, fieldData, formData } = getData({
      dischargeDate: moment()
        .add(367, 'days')
        .format('YYYY-MM-DD'),
      spy,
    });

    it('should set error message', () => {
      validateServiceDates(errors, fieldData, formData);
      expect(spy.called).to.be.true;
    });
  });

  context('when discharge date is exactly 1 year from today', () => {
    const spy = sinon.spy();
    const { errors, fieldData, formData } = getData({
      dischargeDate: moment()
        .add(1, 'year')
        .format('YYYY-MM-DD'),
      spy,
    });

    it('should not set message ', () => {
      validateServiceDates(errors, fieldData, formData);
      expect(spy.called).to.be.false;
    });
  });

  context('when entry date is less than 15 years after birthdate', () => {
    const spy = sinon.spy();
    const { errors, fieldData, formData } = getData({
      errorKey: 'lastEntryDate',
      dischargeDate: '2010-03-01',
      entryDate: '2000-01-01',
      birthdate: '1990-01-01',
      spy,
    });

    it('should set error message ', () => {
      validateServiceDates(errors, fieldData, formData);
      expect(spy.called).to.be.true;
    });
  });
});

describe('hca `validateGulfWarDates` form validation', () => {
  const getData = ({
    spy = () => {},
    startDate = '1990-09-XX',
    endDate = '1991-01-XX',
  }) => ({
    errors: {
      gulfWarEndDate: {
        addError: spy,
      },
    },
    fieldData: {
      gulfWarStartDate: startDate,
      gulfWarEndDate: endDate,
    },
  });

  context('when form data is valid', () => {
    const spy = sinon.spy();
    const { errors, fieldData } = getData({ spy });

    it('should not set error message', () => {
      validateGulfWarDates(errors, fieldData);
      expect(spy.called).to.be.false;
    });
  });

  context('when end date is before start date', () => {
    const spy = sinon.spy();
    const { errors, fieldData } = getData({
      endDate: '1989-09-XX',
      spy,
    });

    it('should set error message ', () => {
      validateGulfWarDates(errors, fieldData);
      expect(spy.called).to.be.true;
    });
  });
});

describe('hca `validateExposureDates` form validation', () => {
  const getData = ({
    spy = () => {},
    startDate = '1990-09-XX',
    endDate = '1991-01-XX',
  }) => ({
    errors: {
      toxicExposureEndDate: {
        addError: spy,
      },
    },
    fieldData: {
      toxicExposureStartDate: startDate,
      toxicExposureEndDate: endDate,
    },
  });

  context('when form data is valid', () => {
    const spy = sinon.spy();
    const { errors, fieldData } = getData({ spy });

    it('should not set error message', () => {
      validateExposureDates(errors, fieldData);
      expect(spy.called).to.be.false;
    });
  });

  context('when end date is before start date', () => {
    const spy = sinon.spy();
    const { errors, fieldData } = getData({
      endDate: '1989-09-XX',
      spy,
    });

    it('should set error message ', () => {
      validateExposureDates(errors, fieldData);
      expect(spy.called).to.be.true;
    });
  });
});

describe('hca `validateDependentDate` form validation', () => {
  const getData = ({
    spy = () => {},
    fieldData = '2010-01-01',
    birthdate = '2009-12-31',
  }) => ({
    errors: { addError: spy },
    fieldData,
    formData: { dateOfBirth: birthdate },
  });

  context('when form data is valid', () => {
    const spy = sinon.spy();
    const { errors, fieldData, formData } = getData({ spy });

    it('should not set error message', () => {
      validateDependentDate(errors, fieldData, formData);
      expect(spy.called).to.be.false;
    });
  });

  context('when birthdate is after dependent date', () => {
    const spy = sinon.spy();
    const { errors, fieldData, formData } = getData({
      birthdate: '2011-01-01',
      spy,
    });

    it('should set error message', () => {
      validateDependentDate(errors, fieldData, formData);
      expect(spy.called).to.be.true;
    });
  });
});

describe('hca `validateCurrency` form validation', () => {
  const getData = ({ spy = () => {} }) => ({
    errors: { addError: spy },
  });

  context('when form data is valid', () => {
    const spy = sinon.spy();
    const { errors } = getData({ spy });

    it('should not set error message', () => {
      validateCurrency(errors, '234.23');
      expect(spy.called).to.be.false;
    });
  });

  context('when value has three decimals', () => {
    const spy = sinon.spy();
    const { errors } = getData({ spy });

    it('should set error message', () => {
      validateCurrency(errors, '234.234');
      expect(spy.called).to.be.true;
    });
  });

  context('when value has trailing whitespace', () => {
    const spy = sinon.spy();
    const { errors } = getData({ spy });

    it('should set error message', () => {
      validateCurrency(errors, '234234 ');
      expect(spy.called).to.be.true;
    });
  });

  context('when value has leading whitespace', () => {
    const spy = sinon.spy();
    const { errors } = getData({ spy });

    it('should set error message', () => {
      validateCurrency(errors, ' 234234');
      expect(spy.called).to.be.true;
    });
  });

  context('when value includes dollar sign', () => {
    const spy = sinon.spy();
    const { errors } = getData({ spy });

    it('should not set error message', () => {
      validateCurrency(errors, '$234,234');
      expect(spy.called).to.be.false;
    });
  });
});
