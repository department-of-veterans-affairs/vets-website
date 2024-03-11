import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import moment from 'moment';
import { render, fireEvent, waitFor } from '@testing-library/react';

import {
  $, // get first
  $$, // get all
} from '@department-of-veterans-affairs/platform-forms-system/ui';

import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import formConfig from '../../../../config/form';

const definitions = formConfig.defaultDefinitions;
const {
  schema,
  uiSchema,
  arrayPath,
  title,
} = formConfig.chapters.householdInformation.pages.dependentChildInformation;

const dependentData = {
  'view:hasDependents': true,
  dependents: [
    {
      fullName: {
        first: 'Jane',
        last: 'Doe',
      },
      childDateOfBirth: moment()
        .subtract(19, 'years')
        .toISOString(),
    },
  ],
};

describe('Child information page', () => {
  it('should set the title to the dependents name if available', () => {
    expect(title(dependentData.dependents[0])).to.eql('Jane Doe information');
    expect(title({ fullName: {} })).to.eql('  information');
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

    expect($$('va-text-input', container).length).to.equal(2);
    expect($$('va-radio', container).length).to.equal(3);
    expect($('va-checkbox[name=root_view\\:noSSN]', container)).to.exist;
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
      const errors = '.usa-input-error, va-radio[error], va-text-input[error]';
      expect($$(errors, container).length).to.equal(5);
      expect(onSubmit.called).to.be.false;
    });
  });

  it('should not require ssn if noSSN is checked', async () => {
    dependentData.dependents[0]['view:noSSN'] = true;

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

    const noSSN = $('va-checkbox[name=root_view\\:noSSN]', container);

    fireEvent.submit($('form', container));
    await waitFor(() => {
      const errors = '.usa-input-error, va-radio[error], va-text-input[error]';
      expect($$(errors, container).length).to.equal(4);
      expect(noSSN.checked).to.be.true;
      expect(onSubmit.called).to.be.false;
    });
  });

  it('should submit with valid data', async () => {
    dependentData.dependents[0] = {
      ...dependentData.dependents[0],
      childPlaceOfBirth: 'Dagobah',
      childSocialSecurityNumber: '111223333',
      childRelationship: 'BIOLOGICAL',
      attendingCollege: 'N',
      previouslyMarried: 'N',
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

    // passing 'N' values in data does not set a yesNoUI correctly
    const college = $('va-radio[name="root_attendingCollege"]', container);
    college.__events.vaValueChange(
      new CustomEvent('selected', { detail: { value: 'N' } }),
    );
    const prevMarried = $('va-radio[name="root_previouslyMarried"]', container);
    prevMarried.__events.vaValueChange(
      new CustomEvent('selected', { detail: { value: 'N' } }),
    );

    fireEvent.submit($('form', container));
    await waitFor(() => {
      expect(onSubmit.called).to.be.true;
    });
  });

  it('should ask if the child is in school (18-23 years old)', () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={dependentData}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    expect($('#root_attendingCollegeYes', container)).to.not.be.null;
  });

  it('should not ask if the child is disabled', () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={dependentData}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    expect($('#root_disabledYes', container)).to.be.null;
  });

  it('should not ask if the child is in school', () => {
    dependentData.dependents[0] = {
      ...dependentData.dependents[0],
      childDateOfBirth: moment()
        .subtract(5, 'years')
        .toISOString(),
    };

    const onSubmit = sinon.spy();
    const { container } = render(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={dependentData}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    expect($('#root_attendingCollegeYes', container)).to.be.null;
  });

  it('should ask if the child is disabled (Under 18 years old)', () => {
    dependentData.dependents[0] = {
      ...dependentData.dependents[0],
      childDateOfBirth: moment()
        .subtract(10, 'years')
        .toISOString(),
    };

    const onSubmit = sinon.spy();
    const { container } = render(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={dependentData}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    expect($('#root_disabledYes', container)).to.not.be.null;
  });
});
