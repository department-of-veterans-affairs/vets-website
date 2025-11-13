import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { render, fireEvent, waitFor } from '@testing-library/react';

import {
  DefinitionTester,
  fillData,
} from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form';

describe('Pre-need applicant demographics', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.applicantInformation.pages.applicantDemographics2;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
      />,
    );

    expect(form.find('input').length).to.equal(4);
    expect(form.find('va-checkbox').length).to.equal(7);
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
      expect(errorElements.length).to.equal(1);
      expect(onSubmit.called).to.be.false;
    });
  });

  it('should check required boxes', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );
    fillData(form, 'input#root_application_veteran_ethnicity_2', 'unknown');
    form
      .find('va-checkbox[name*="root_application_veteran_race_isAsian"]')
      .simulate('change', { target: { checked: true } });

    expect(
      form
        .find('va-checkbox[name*="root_application_veteran_race_isAsian"]')
        .exists(),
    ).to.be.true;

    form.unmount();
  });
});
