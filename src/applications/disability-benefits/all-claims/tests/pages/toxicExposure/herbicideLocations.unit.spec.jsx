import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import userEvent from '@testing-library/user-event';
import sinon from 'sinon';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import {
  checkVaCheckbox,
  inputVaTextInput,
} from '@department-of-veterans-affairs/platform-testing/helpers';
import formConfig from '../../../config/form';
import {
  herbicidePageTitle,
  herbicideQuestion,
  noneAndLocationError,
  otherInvalidCharError,
} from '../../../content/toxicExposure';
import { HERBICIDE_LOCATIONS } from '../../../constants';

describe('Herbicide Location', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.disabilities.pages.herbicideLocations;

  it('should render locations page with all checkboxes', () => {
    const { container, getByText } = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );

    getByText(herbicidePageTitle);

    expect($$('va-checkbox-group', container).length).to.equal(1);
    expect($('va-checkbox-group', container).getAttribute('label')).to.equal(
      herbicideQuestion,
    );

    Object.values(HERBICIDE_LOCATIONS).forEach(option => {
      expect($$(`va-checkbox[label="${option}"]`, container)).to.exist;
    });
  });

  it('should submit without selecting any locations', () => {
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

  it('should submit with locations selected', async () => {
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
    checkVaCheckbox(checkboxGroup, 'cambodia');
    checkVaCheckbox(checkboxGroup, 'laos');
    inputVaTextInput(container, 'Test location', 'va-textarea');

    userEvent.click(getByText('Submit'));
    expect(onSubmit.calledOnce).to.be.true;
  });

  it('should display error when location and "none"', () => {
    const formData = {};
    const { container, getByText } = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={formData} />,
    );
    const checkboxGroup = $('va-checkbox-group', container);
    checkVaCheckbox(checkboxGroup, 'guam');
    checkVaCheckbox(checkboxGroup, 'none');

    userEvent.click(getByText('Submit'));
    expect($('va-checkbox-group').error).to.equal(noneAndLocationError);
  });

  it('should submit with `none` and `notsure` selected', async () => {
    const formData = {};
    const onSubmit = sinon.spy();
    const { container, getByText } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={formData}
        onSubmit={onSubmit}
      />,
    );
    const checkboxGroup = $('va-checkbox-group', container);
    checkVaCheckbox(checkboxGroup, 'none');
    checkVaCheckbox(checkboxGroup, 'notsure');

    userEvent.click(getByText('Submit'));
    expect(onSubmit.calledOnce).to.be.true;
  });

  it('should display error when other location and "none"', () => {
    const formData = {};
    const { container, getByText } = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={formData} />,
    );
    const checkboxGroup = $('va-checkbox-group', container);

    checkVaCheckbox(checkboxGroup, 'none');
    inputVaTextInput(
      container,
      'Test location 1, Test location #2',
      'va-textarea',
    );

    userEvent.click(getByText('Submit'));
    expect($('va-checkbox-group').error).to.equal(noneAndLocationError);
  });

  it('should display error when other location does not match pattern', () => {
    const formData = {};
    const onSubmit = sinon.spy();
    const { container, getByText } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={formData}
        onSubmit={onSubmit}
      />,
    );

    inputVaTextInput(
      container,
      'Test location 1 + Test location 2',
      'va-textarea',
    );

    userEvent.click(getByText('Submit'));
    expect($('va-textarea').error).to.equal(otherInvalidCharError);
    expect(onSubmit.called).to.be.false;
  });

  it('should submit with "notsure" and other locations selected', async () => {
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
    checkVaCheckbox(checkboxGroup, 'cambodia');
    checkVaCheckbox(checkboxGroup, 'notsure');

    userEvent.click(getByText('Submit'));
    expect(onSubmit.calledOnce).to.be.true;
  });
});
