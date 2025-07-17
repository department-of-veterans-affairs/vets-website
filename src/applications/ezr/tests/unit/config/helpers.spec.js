import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import {
  renderProviderWrappedComponent,
  isRefillTakingLongerThanExpected,
} from '../../helpers';

export const expectedFieldTypes = 'input, select, textarea';
const expectedFieldTypesWebComponents =
  'va-text-input, va-select, va-textarea, va-number-input, va-radio, va-checkbox, va-memorable-date';

export const testNumberOfFields = (
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfFields,
  pageTitle,
  data = {},
) => {
  describe(`${pageTitle} page`, () => {
    it('should have appropriate number of fields', async () => {
      const { container } = renderProviderWrappedComponent(
        {
          form: {
            data,
          },
        },
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={data}
          formData={{}}
        />,
      );

      await waitFor(() => {
        expect(container.querySelectorAll(expectedFieldTypes)).to.have.lengthOf(
          expectedNumberOfFields,
        );
      });
    });
  });
};

export const testNumberOfErrorsOnSubmit = (
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfErrors,
  pageTitle,
  data = {},
) => {
  describe(`${pageTitle} page`, () => {
    it('should show the correct number of errors on submit', async () => {
      const { getByRole, queryAllByRole } = renderProviderWrappedComponent(
        {
          form: {
            data,
          },
        },
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={data}
          formData={{}}
        />,
      );

      getByRole('button', { name: /submit/i }).click();
      await waitFor(() => {
        const errors = queryAllByRole('alert');
        expect(errors).to.have.lengthOf(expectedNumberOfErrors);
      });
    });
  });
};

export const testNumberOfWebComponentFields = (
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfFields,
  pageTitle,
  data = {},
) => {
  describe(`${pageTitle} page`, () => {
    it('should have appropriate number of web components', async () => {
      const { container } = render(
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={data}
          formData={{}}
        />,
      );

      await waitFor(() => {
        expect(
          container.querySelectorAll(expectedFieldTypesWebComponents),
        ).to.have.lengthOf(expectedNumberOfFields);
      });
    });
  });
};

export const testNumberOfErrorsOnSubmitForWebComponents = (
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfErrors,
  pageTitle,
  data = {},
) => {
  describe(`${pageTitle} page`, () => {
    it('should show the correct number of errors on submit for web components', async () => {
      const { container, getByRole } = render(
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={data}
          formData={{}}
        />,
      );

      getByRole('button', { name: /submit/i }).click();
      await waitFor(() => {
        const nodes = Array.from(
          container.querySelectorAll(expectedFieldTypesWebComponents),
        );
        const errors = nodes.filter(node => node.error);
        expect(errors).to.have.lengthOf(expectedNumberOfErrors);
      });
    });
  });
};

const dispStatusObj = {
  refillinprocess: 'refillinprocess',
  submitted: 'submitted',
};

describe('isRefillTakingLongerThanExpected - additional edge cases', () => {
  const now = new Date('2025-03-10T12:00:00Z').getTime();

  it('returns true if rxRfRecords[0] has valid dates and main object does not', () => {
    const rx = {
      dispStatus: dispStatusObj.refillinprocess,
      rxRfRecords: [
        {
          refillDate: '2025-03-01T12:00:00Z',
          refillSubmitDate: '2025-03-01T12:00:00Z',
        },
      ],
    };
    expect(isRefillTakingLongerThanExpected(rx)).to.be.true;
  });

  it('returns false if both refillDate and refillSubmitDate are missing and rxRfRecords is empty', () => {
    const rx = {
      dispStatus: dispStatusObj.refillinprocess,
      rxRfRecords: [],
    };
    expect(isRefillTakingLongerThanExpected(rx)).to.be.false;
  });

  it('returns false if rxRfRecords[0] has invalid dates', () => {
    const rx = {
      dispStatus: dispStatusObj.refillinprocess,
      rxRfRecords: [
        {
          refillDate: 'not-a-date',
          refillSubmitDate: 'not-a-date',
        },
      ],
    };
    expect(isRefillTakingLongerThanExpected(rx)).to.be.false;
  });

  it('returns false if dispStatus is not refillinprocess or submitted, even with valid dates', () => {
    const rx = {
      dispStatus: 'otherstatus',
      refillDate: '2025-03-01T12:00:00Z',
      refillSubmitDate: '2025-03-01T12:00:00Z',
    };
    expect(isRefillTakingLongerThanExpected(rx)).to.be.false;
  });

  it('returns true if submitted and refillSubmitDate is exactly 8 days ago', () => {
    const eightDaysAgo = new Date(now);
    eightDaysAgo.setDate(eightDaysAgo.getDate() - 8);
    const rx = {
      dispStatus: dispStatusObj.submitted,
      refillDate: '2025-03-01T12:00:00Z',
      refillSubmitDate: eightDaysAgo.toISOString(),
    };
    expect(isRefillTakingLongerThanExpected(rx)).to.be.true;
  });
});
