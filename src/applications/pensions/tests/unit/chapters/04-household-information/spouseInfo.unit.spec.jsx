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
        data={marriageInfo}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
      />,
    );

    expect($('legend').textContent).to.equal('Jane Doe information');

    expect($$('va-text-input', container).length).to.equal(1);
    expect($$('va-memorable-date', container).length).to.equal(1);
    expect($$('va-radio', container).length).to.equal(2);
  });

  it('should not submit an empty form', async () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    fireEvent.submit($('form', container));
    await waitFor(() => {
      expect($$(errors, container).length).to.equal(4);
      expect(onSubmit.called).to.be.false;
    });
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
    spouseIsVeteran.__events.vaValueChange(
      new CustomEvent('selected', { detail: { value: 'Y' } }),
    );

    expect($('va-text-input[name="root_spouseVaFileNumber"]', container)).to.not
      .be.null;
  });

  it('should submit with valid data', async () => {
    marriageInfo.marriages[0] = {
      ...marriageInfo.marriages[0],
      spouseDateOfBirth: {
        spouseDateOfBirthMonth: '2',
        spouseDateOfBirthDay: '2',
        spouseDateOfBirthYear: '2000',
      },
      spouseSocialSecurityNumber: '111223333',
      spouseIsVeteran: 'N',
      'view:liveWithSpouse': 'Y',
    };

    const onSubmit = sinon.spy();
    const { container } = render(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
        data={marriageInfo}
      />,
    );

    // passing values in data does not set a yesNoUI correctly
    const spouseIsVeteran = $(
      'va-radio[name="root_spouseIsVeteran"]',
      container,
    );
    spouseIsVeteran.__events.vaValueChange(
      new CustomEvent('selected', { detail: { value: 'N' } }),
    );

    const liveWithSpouse = $(
      'va-radio[name="root_view:liveWithSpouse"]',
      container,
    );
    liveWithSpouse.__events.vaValueChange(
      new CustomEvent('selected', { detail: { value: 'Y' } }),
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
