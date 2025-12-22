import React from 'react';
import { expect } from 'chai';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import veteranName from '../../../../config/chapters/01-veteran-information/veteranName';

const url =
  '/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/veteran';

describe('Veteran Information Page', () => {
  const { schema, uiSchema } = veteranName;
  it('renders the veteran name and date of birth page with alert', async () => {
    const form = renderWithStoreAndRouter(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
      {
        initialState: {
          user: {
            login: { currentlyLoggedIn: false },
          },
        },
        reducers: {},
        path: url,
      },
    );
    const formDOM = getFormDOM(form);
    expect(
      form.getByText(
        /This application is 8 steps long and it contains several substeps per step./i,
      ),
    ).to.exist;
    expect(form.getByRole('heading')).to.have.text(
      'Veteran’s name and date of birth',
    );
    const vaTextInput = $$('va-text-input', formDOM);
    const vaSelects = $$('va-select', formDOM);
    const vaMemorableDates = $$('va-memorable-date', formDOM);

    const vaFirstNameInput = $(
      'va-text-input[label="First or given name"]',
      formDOM,
    );
    const vaMiddleNameInput = $('va-text-input[label="Middle name"]', formDOM);
    const vaLastNameInput = $(
      'va-text-input[label="Last or family name"]',
      formDOM,
    );
    const vaSuffixSelect = $('va-select[label="Suffix"]', formDOM);
    const vaDateOfBirth = $(
      'va-memorable-date[label="Date of birth"]',
      formDOM,
    );

    expect(vaTextInput.length).to.equal(3);
    expect(vaSelects.length).to.equal(1);
    expect(vaMemorableDates.length).to.equal(1);

    expect(vaFirstNameInput.getAttribute('required')).to.equal('true');
    expect(vaMiddleNameInput.getAttribute('required')).to.equal('false');
    expect(vaLastNameInput.getAttribute('required')).to.equal('true');
    expect(vaSuffixSelect.getAttribute('required')).to.equal('false');
    expect(vaDateOfBirth.getAttribute('required')).to.equal('true');
  });
  it('renders the veteran name and date of birth page without alert', async () => {
    const form = renderWithStoreAndRouter(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
      {
        initialState: {
          user: {
            login: { currentlyLoggedIn: true },
          },
        },
        reducers: {},
        path: url,
      },
    );
    expect(
      form.queryByText(
        /This application is 8 steps long and it contains several substeps per step./i,
      ),
    ).to.not.exist;
  });
});
