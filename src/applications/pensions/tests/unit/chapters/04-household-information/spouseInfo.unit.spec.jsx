import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, fireEvent, waitFor } from '@testing-library/react';

import {
  $, // get first
  $$, // get all
} from '@department-of-veterans-affairs/platform-forms-system/ui';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../../../config/form';

const errors =
  '.usa-input-error, va-radio[error], va-text-input[error], va-memorable-date[error]';

const marriageInfo = {
  marriages: [
    {
      spouseFullName: {
        first: 'Jane',
        last: 'Doe',
      },
    },
  ],
};

describe('Pensions spouse info', () => {
  const {
    schema,
    uiSchema,
    depends,
  } = formConfig.chapters.householdInformation.pages.spouseInfo;

  it('should render', () => {
    const { container } = render(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
        data={marriageInfo}
      />,
    );

    expect($('legend').textContent).to.equal('Jane Doe information');

    expect($$('va-text-input', container).length).to.equal(1);
    expect($$('va-memorable-date', container).length).to.equal(1);
    expect($$('va-radio', container).length).to.equal(2);
  });

  it('should render spouse va file number', () => {
    const { container } = render(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
        data={marriageInfo}
      />,
    );

    // passing values in data does not set a yesNoUI correctly
    const spouseIsVeteran = $(
      'va-radio[name="root_spouseIsVeteran"]',
      container,
    );
    fireEvent(
      spouseIsVeteran,
      new CustomEvent('vaValueChange', { detail: { value: 'Y' } }),
    );

    expect($('va-text-input[name="root_spouseVaFileNumber"]', container)).to.not
      .be.null;
  });

  it('should not submit an empty form', async () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
        data={{}}
      />,
    );

    fireEvent.submit($('form', container));
    await waitFor(() => {
      expect($$(errors, container).length).to.equal(4);
      expect(onSubmit.called).to.be.false;
    });
  });

  // SKIP -
  // vaMemorableDateField does not populate via data or fireEvent
  // ssnField does not populating via data or fireEvent
  // yesNoField does not populate via data
  it.skip('should submit with valid data', async () => {
    marriageInfo.marriages[0] = {
      ...marriageInfo.marriages[0],
      spouseDateOfBirth: '1955-11-5',
      spouseSocialSecurityNumber: '111223333',
      spouseIsVeteran: 'N',
      'view:liveWithSpouse': 'Y',
    };

    const onSubmit = sinon.spy();
    const { container } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
        schema={schema}
        onSubmit={onSubmit}
        data={marriageInfo}
      />,
    );

    const birthDate = $(
      'va-memorable-date[name="root_spouseDateOfBirth"]',
      container,
    );
    fireEvent(
      birthDate,
      new CustomEvent('dateChange', { detail: { value: '1955-11-5' } }),
    );

    const ssnInput = $(
      'va-text-input[name="root_spouseSocialSecurityNumber"]',
      container,
    );
    fireEvent.change(ssnInput, '111223333');

    const spouseIsVeteran = $(
      'va-radio[name="root_spouseIsVeteran"]',
      container,
    );
    fireEvent(
      spouseIsVeteran,
      new CustomEvent('vaValueChange', { detail: { value: 'N' } }),
    );

    const liveWithSpouse = $(
      'va-radio[name="root_view:liveWithSpouse"]',
      container,
    );
    fireEvent(
      liveWithSpouse,
      new CustomEvent('vaValueChange', { detail: { value: 'Y' } }),
    );

    fireEvent.submit($('form', container));
    await waitFor(() => {
      expect($$(errors, container).length).to.equal(0);
      expect(onSubmit.called).to.be.true;
    });
  });

  it('depends should return true if married', () => {
    const result = depends({ maritalStatus: 'MARRIED' });
    expect(result).to.be.true;
  });
});
