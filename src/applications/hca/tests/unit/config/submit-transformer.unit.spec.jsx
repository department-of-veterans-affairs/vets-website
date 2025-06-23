import { add, format } from 'date-fns';
import { omit } from 'lodash';
import { expect } from 'chai';
import sinon from 'sinon-v20';
import { waitFor } from '@testing-library/react';
import * as recordEventModule from 'platform/monitoring/record-event';
import * as helpers from 'platform/forms-system/src/js/helpers';
import formConfig from '../../../config/form';
import { submitTransformer } from '../../../config/submit-transformer';
import maximumTest from '../../e2e/fixtures/data/maximal-test.json';
import minimumTest from '../../e2e/fixtures/data/minimal-test.json';

describe('hca `submitTransformer` utility', () => {
  const maxTestData = maximumTest.data;
  const minTestData = minimumTest.data;
  const getForm = ({ formData = {}, rating = 0 }) => {
    const vetInfo = {
      veteranDateOfBirth: maxTestData.veteranDateOfBirth,
    };
    return {
      data: {
        ...formData,
        'view:totalDisabilityRating': rating,
        'view:veteranInformation': vetInfo,
      },
      loadedData: { formData: {} },
    };
  };
  let mockLogger;

  beforeEach(() => {
    mockLogger = { error: sinon.spy() };

    Object.defineProperty(window, 'DD_LOGS', {
      value: { logger: mockLogger },
      configurable: true,
    });
  });

  afterEach(() => {
    mockLogger.error.resetHistory();
  });

  it('should correctly transform data when minimum form data is provided', () => {
    const form = getForm({ formData: minTestData });
    const transformedData = submitTransformer(formConfig, form);
    const { form: formData } = JSON.parse(transformedData);
    const parsedFormData = JSON.parse(formData);
    const dataKeys = Object.keys(parsedFormData);
    expect(dataKeys).to.have.lengthOf(22);
    expect(parsedFormData.veteranHomeAddress).to.deep.equal(
      parsedFormData.veteranAddress,
    );
  });

  it('should correctly transform data when Veteran home and mailing address do not match', () => {
    const testData = {
      ...minTestData,
      'view:doesMailingMatchHomeAddress': false,
      veteranHomeAddress: maxTestData.veteranHomeAddress,
    };
    const form = getForm({ formData: testData });
    const transformedData = submitTransformer(formConfig, form);
    const { form: formData } = JSON.parse(transformedData);
    const { veteranAddress, veteranHomeAddress } = JSON.parse(formData);
    expect(veteranHomeAddress).to.not.deep.equal(veteranAddress);
  });

  it('should correctly transform data when disability rating is high', () => {
    const testData = omit(minTestData, 'vaCompensationType');
    const form = getForm({ formData: testData, rating: 80 });
    const transformedData = submitTransformer(formConfig, form);
    const { form: formData } = JSON.parse(transformedData);
    const { vaCompensationType } = JSON.parse(formData);
    expect(vaCompensationType).to.equal('highDisability');
  });

  it('should correctly transform data when attachments are provided', () => {
    const testData = {
      ...minTestData,
      attachments: [
        { name: 'abc', size: 4, confirmationCode: '123', attachmentId: '1' },
      ],
    };
    const expectedOutput = {
      name: 'abc',
      size: 4,
      confirmationCode: '123',
      dd214: true,
    };
    const form = getForm({ formData: testData });
    const transformedData = submitTransformer(formConfig, form);
    const { form: formData } = JSON.parse(transformedData);
    const { attachments } = JSON.parse(formData);
    expect(attachments[0]).to.deep.equal(expectedOutput);
  });

  it('should correctly transform data when dependents are provided', () => {
    const testData = {
      ...maxTestData,
      dependents: [
        { ...maxTestData.dependents[0], dependentEducationExpenses: 0 },
      ],
    };
    const form = getForm({ formData: testData });
    const transformedData = submitTransformer(formConfig, form);
    const { form: formData } = JSON.parse(transformedData);
    const { dependents } = JSON.parse(formData);
    expect(Object.keys(dependents[0])).to.have.lengthOf(13);
  });

  it('should default dependent income/expense values to `0` when omitted', () => {
    const testDependent = omit(maxTestData.dependents[0], [
      'view:grossIncome',
      'view:netIncome',
      'view:otherIncome',
      'dependentEducationExpenses',
    ]);
    const testData = {
      ...maxTestData,
      dependents: [testDependent],
    };
    const form = getForm({ formData: testData });
    const transformedData = submitTransformer(formConfig, form);
    const { form: formData } = JSON.parse(transformedData);
    const { dependents } = JSON.parse(formData);
    expect(dependents[0]).to.include({
      grossIncome: 0,
      netIncome: 0,
      otherIncome: 0,
      dependentEducationExpenses: 0,
    });
  });

  it('should fire `recordEvent` method with correct event data when `lastDischargeDate` is after today', async () => {
    const recordEventStub = sinon.stub(recordEventModule, 'default');
    const eventData = { event: 'hca-future-discharge-date-submission' };
    const futureDischargeDate = add(new Date(), { months: 6 });
    const testData = {
      ...minTestData,
      lastDischargeDate: format(futureDischargeDate, 'yyyy-MM-dd'),
    };
    const form = getForm({ formData: testData });

    await waitFor(() => {
      submitTransformer(formConfig, form);
      expect(recordEventStub.calledWith(eventData)).to.be.true;
      recordEventStub.restore();
    });
  });

  it('should set form data to empty object if `JSON.stringify` fails', () => {
    const innerStringifyStub = sinon.stub().returns(null);
    sinon.stub(JSON, 'stringify').callsFake((value, replacer) => {
      if (replacer && typeof replacer === 'function') {
        return innerStringifyStub(value, replacer);
      }
      return Object.getPrototypeOf(JSON).stringify.apply(JSON);
    });
    const form = getForm({ formData: minTestData });
    const result = submitTransformer(formConfig, form);
    expect(result).to.equal('{}');
    sinon.restore();
  });

  it('should call `logErrorToDatadog` if `stringifyFormReplacer` produces an error', () => {
    const stub = sinon
      .stub(helpers, 'stringifyFormReplacer')
      .throws(new Error('stringify failed'));
    const form = getForm({ formData: minTestData });
    const result = submitTransformer(formConfig, form);
    expect(result).to.equal('{}');
    sinon.assert.calledOnce(mockLogger.error);
    stub.restore();
  });
});
