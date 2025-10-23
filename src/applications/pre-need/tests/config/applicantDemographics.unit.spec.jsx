import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { render, fireEvent, waitFor } from '@testing-library/react';

import {
  DefinitionTester,
  fillData,
  selectRadio,
  selectCheckbox,
} from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form';

describe('Pre-need applicant demographics', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.applicantInformation.pages.applicantDemographics;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
      />,
    );

    expect(form.find('input').length).to.equal(14);
    form.unmount();
  });

  it('should not submit empty form', async () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    fireEvent.submit(container.querySelector('form'));

    await waitFor(() => {
      const errorElements = container.querySelectorAll('.usa-input-error');
      expect(errorElements.length).to.equal(3);
      expect(onSubmit.called).to.be.false;
    });
  });

  it('should submit with required information', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );
    fillData(form, 'input#root_application_veteran_gender_0', 'Female');
    selectCheckbox(
      form,
      'root_application_veteran_race_isSpanishHispanicLatino',
      true,
    );
    selectRadio(form, 'root_application_veteran_maritalStatus', 'Single');

    form.find('form').simulate('submit');

    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
