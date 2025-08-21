import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import sinon from 'sinon';
import { expect } from 'chai';
import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import {
  checkVaCheckbox,
  inputVaTextInput,
} from '@department-of-veterans-affairs/platform-testing/helpers';
import formConfig from '../../../config/form';
import {
  additionalExposuresPageTitle,
  additionalExposuresQuestion,
  noneAndHazardError,
  otherInvalidCharError,
  specifyOtherExposuresLabel,
} from '../../../content/toxicExposure';
import { ADDITIONAL_EXPOSURES } from '../../../constants';

describe('Additional Exposures', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.disabilities.pages.additionalExposures;

  it('should render with all checkboxes and other field', () => {
    const { container, getByText } = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );

    getByText(additionalExposuresPageTitle);

    expect($$('va-checkbox-group', container).length).to.equal(1);
    expect($('va-checkbox-group', container).getAttribute('label')).to.equal(
      additionalExposuresQuestion,
    );

    expect($$('va-checkbox', container).length).to.equal(
      Object.keys(ADDITIONAL_EXPOSURES).length,
    );

    Object.values(ADDITIONAL_EXPOSURES).forEach(option => {
      expect($$(`va-checkbox[label="${option}"]`, container)).to.exist;
    });

    expect($('va-textarea', container).getAttribute('label')).to.equal(
      specifyOtherExposuresLabel,
    );
  });

  it('should submit without selecting any hazards', () => {
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

  it('should submit with hazards selected', async () => {
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
    checkVaCheckbox(checkboxGroup, 'asbestos');
    checkVaCheckbox(checkboxGroup, 'radiation');

    userEvent.click(getByText('Submit'));
    expect(onSubmit.calledOnce).to.be.true;
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

  it('should display error when hazard and "none" selected', async () => {
    const formData = {};
    const { container, getByText } = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={formData} />,
    );
    const checkboxGroup = $('va-checkbox-group', container);
    checkVaCheckbox(checkboxGroup, 'asbestos');
    checkVaCheckbox(checkboxGroup, 'none');

    await userEvent.click(getByText('Submit'));
    expect($('va-checkbox-group').error).to.equal(noneAndHazardError);
  });

  it('should display error when other exposures does not match pattern', () => {
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

    inputVaTextInput(container, 'Test hazard?', 'va-textarea');

    userEvent.click(getByText('Submit'));
    expect($('va-textarea').error).to.equal(otherInvalidCharError);
    expect(onSubmit.called).to.be.false;
  });
});
