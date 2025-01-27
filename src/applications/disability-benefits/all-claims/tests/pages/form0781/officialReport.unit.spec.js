import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import sinon from 'sinon';
import {
  inputVaTextInput,
  checkVaCheckbox,
} from '@department-of-veterans-affairs/platform-testing/helpers';
import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import * as officialReport from '../../../pages/form0781/officialReport';
import {
  officialReportPageTitle,
  reportTypesQuestion,
  otherReportTypesQuestion,
} from '../../../content/officialReport';
import { OFFICIAL_REPORT_TYPES } from '../../../constants';

describe('Official report', () => {
  const index = 1;
  const { schema, uiSchema } = {
    schema: officialReport.schema(index),
    uiSchema: officialReport.uiSchema(index),
  };

  it('should define a uiSchema function', () => {
    expect(officialReport.uiSchema).to.be.a('function');
  });

  it('should define a schema function', () => {
    expect(officialReport.schema).to.be.a('function');
  });

  it('should render with all checkboxes', () => {
    const { container, getByText } = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );

    getByText(officialReportPageTitle);

    expect($$('va-checkbox-group', container).length).to.equal(1);
    expect($('va-checkbox-group', container).getAttribute('label')).to.equal(
      reportTypesQuestion,
    );

    // fail fast - verify the correct number of checkboxes are present
    expect($$('va-checkbox', container).length).to.equal(
      Object.keys(OFFICIAL_REPORT_TYPES).length,
    );

    // verify each checkbox exists with user facing label
    Object.values(OFFICIAL_REPORT_TYPES).forEach(option => {
      expect($$(`va-checkbox[label="${option}"]`, container)).to.exist;
    });
  });

  it('displays other report type field', () => {
    const onSubmit = sinon.spy();
    const { container, getByText } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        definitions={{}}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    expect(getByText(officialReportPageTitle)).to.exist;

    const textInputs = container.querySelectorAll('va-text-input');
    expect(textInputs.length).to.eq(1);

    const otherReportTextInput = Array.from(textInputs).find(
      input => input.getAttribute('label') === otherReportTypesQuestion,
    );
    expect(otherReportTextInput).to.not.be.null;
    expect(otherReportTextInput.getAttribute('required')).to.eq('false');
  });

  it('should submit without selecting any report types', () => {
    const onSubmit = sinon.spy();
    const { getByText } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        definitions={{}}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    userEvent.click(getByText('Submit'));
    expect(onSubmit.calledOnce).to.be.true;
  });

  it('should submit when 1 or more report types are selected', async () => {
    const onSubmit = sinon.spy();
    const { container, getByText } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        definitions={{}}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );
    const checkboxGroup = $('va-checkbox-group', container);

    checkVaCheckbox(checkboxGroup, 'restricted');
    checkVaCheckbox(checkboxGroup, 'police');

    userEvent.click(getByText('Submit'));
    expect(onSubmit.calledOnce).to.be.true;
  });

  it('should submit without entering any text', () => {
    const onSubmit = sinon.spy();
    const { getByText } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        definitions={{}}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    userEvent.click(getByText('Submit'));
    expect(onSubmit.calledOnce).to.be.true;
  });

  it('should submit if text entered', () => {
    const onSubmit = sinon.spy();
    const { container, getByText } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        definitions={{}}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    inputVaTextInput(container, 'Entered text', 'va-text-input');

    userEvent.click(getByText('Submit'));
    expect(onSubmit.called).to.be.true;
  });
});
