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
import {
  officialReport,
  officialReportMst,
} from '../../../pages/form0781/officialReport';
import {
  officialReportPageTitle,
  reportTypesQuestion,
  otherReportTypesQuestion,
} from '../../../content/officialReport';
import { MILITARY_REPORT_TYPES, OTHER_REPORT_TYPES } from '../../../constants';

describe('Official report without MST event type', () => {
  const { schema, uiSchema } = officialReport;

  it('should define a uiSchema object', () => {
    expect(uiSchema).to.be.a('object');
  });

  it('should define a schema object', () => {
    expect(schema).to.be.a('object');
  });

  it('should render only other report type checkboxes', () => {
    const { container, getByText } = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );

    getByText(officialReportPageTitle);

    expect($$('va-checkbox-group', container).length).to.equal(1);
    expect($('va-checkbox-group', container).getAttribute('label')).to.equal(
      reportTypesQuestion,
    );

    Object.values(OTHER_REPORT_TYPES).forEach(option => {
      expect($$(`va-checkbox[label="${option}"]`, container)).to.exist;
    });
    Object.values(MILITARY_REPORT_TYPES).forEach(option => {
      expect($(`va-checkbox[label="${option}"]`, container)).to.be.null;
    });
  });

  it('should render optional unlisted report type field', () => {
    const { container, getByText } = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
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
        onSubmit={onSubmit}
      />,
    );

    userEvent.click(getByText('Submit'));
    expect(onSubmit.calledOnce).to.be.true;
  });

  it('should submit when 1 or more report types are selected', () => {
    const onSubmit = sinon.spy();
    const { container, getByText } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        onSubmit={onSubmit}
      />,
    );

    const checkboxGroup = $('va-checkbox-group', container);
    checkVaCheckbox(checkboxGroup, 'restricted');
    checkVaCheckbox(checkboxGroup, 'police');

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
        onSubmit={onSubmit}
      />,
    );

    inputVaTextInput(container, 'Entered text', 'va-text-input');

    userEvent.click(getByText('Submit'));
    expect(onSubmit.called).to.be.true;
  });
});

describe('Official Report with MST event type', () => {
  const { schema, uiSchema } = officialReportMst;

  it('should define a uiSchema object', () => {
    expect(uiSchema).to.be.a('object');
  });

  it('should define a schema object', () => {
    expect(schema).to.be.a('object');
  });

  it('should render military and other report type checkboxes', () => {
    const { container, getByText } = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );

    getByText(officialReportPageTitle);

    expect($$('va-checkbox-group', container).length).to.equal(2);
    expect($('va-checkbox-group', container).getAttribute('label')).to.equal(
      reportTypesQuestion,
    );

    Object.values(MILITARY_REPORT_TYPES).forEach(option => {
      expect($$(`va-checkbox[label="${option}"]`, container)).to.exist;
    });
    Object.values(OTHER_REPORT_TYPES).forEach(option => {
      expect($$(`va-checkbox[label="${option}"]`, container)).to.exist;
    });
  });

  it('should render optional unlisted report type field', () => {
    const { container, getByText } = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
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
        onSubmit={onSubmit}
      />,
    );

    userEvent.click(getByText('Submit'));
    expect(onSubmit.calledOnce).to.be.true;
  });

  it('should submit when 1 or more report types are selected', () => {
    const onSubmit = sinon.spy();
    const { container, getByText } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        onSubmit={onSubmit}
      />,
    );

    const checkboxGroup = $('va-checkbox-group', container);
    checkVaCheckbox(checkboxGroup, 'restricted');
    checkVaCheckbox(checkboxGroup, 'police');

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
        onSubmit={onSubmit}
      />,
    );

    inputVaTextInput(container, 'Entered text', 'va-text-input');

    userEvent.click(getByText('Submit'));
    expect(onSubmit.called).to.be.true;
  });
});
