import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { render, fireEvent, waitFor } from '@testing-library/react';

import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';

import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { formatISO, subYears } from 'date-fns';
import formConfig from '../../../../config/form';
import dependentChildAddress from '../../../../config/chapters/04-household-information/dependentChildAddress';
import { testNumberOfFieldsByType } from '../pageTests.spec';

const { schema, uiSchema } = dependentChildAddress;
const definitions = formConfig.defaultDefinitions;
const {
  arrayPath,
  title,
} = formConfig.chapters.householdInformation.pages.dependentChildAddress;

const dependentData = {
  'view:hasDependents': true,
  dependents: [
    {
      fullName: {
        first: 'Jane',
        last: 'Doe',
      },
      childDateOfBirth: formatISO(subYears(new Date(), 19)),
      childInHousehold: false,
    },
  ],
};

describe('Child address page', () => {
  it('should set the title to the dependents name', () => {
    expect(title(dependentData.dependents[0])).to.eql('Jane Doe address');
  });

  it('should render all fields', async () => {
    const { container } = render(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        definitions={definitions}
        schema={schema}
        data={dependentData}
        uiSchema={uiSchema}
      />,
    );

    expect($$('va-text-input', container).length).to.equal(8);
    expect($$('va-select', container).length).to.equal(2);
    expect($('button[type="submit"]', container)).to.exist;
  });

  it('should show errors when required fields are empty', async () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        definitions={definitions}
        schema={schema}
        onSubmit={onSubmit}
        data={dependentData}
        uiSchema={uiSchema}
      />,
    );

    fireEvent.submit($('form', container));
    await waitFor(() => {
      const errors = '.usa-input-error, va-select[error], va-text-input[error]';
      expect($$(errors, container).length).to.equal(7);
      expect(onSubmit.called).to.be.false;
    });
  });

  it('should submit with valid data', async () => {
    dependentData.dependents[0] = {
      ...dependentData.dependents[0],
      childAddress: {
        street: '123 8th st',
        city: 'Hadley',
        country: 'USA',
        state: 'ME',
        postalCode: '01050',
      },
      personWhoLivesWithChild: {
        first: 'Joe',
        middle: 'Middle',
        last: 'Smith',
      },
      monthlyPayment: 2500,
    };

    const onSubmit = sinon.spy();
    const { container } = render(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        definitions={definitions}
        schema={schema}
        data={dependentData}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    fireEvent.submit($('form', container));
    await waitFor(() => {
      expect(onSubmit.called).to.be.true;
    });
  });

  testNumberOfFieldsByType(
    formConfig,
    schema,
    uiSchema,
    {
      'va-text-input': 7,
      'va-select': 3,
      input: 1,
    },
    'dependent address',
    dependentData,
    {
      arrayPath,
      pagePerItemIndex: 0,
    },
  );
});
