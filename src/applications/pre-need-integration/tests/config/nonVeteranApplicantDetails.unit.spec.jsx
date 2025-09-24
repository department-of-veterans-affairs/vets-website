import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { render, fireEvent, waitFor } from '@testing-library/react';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form';

describe('Pre-need applicant non veteran applicant details', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.applicantInformation.pages.nonVeteranApplicantDetails;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
      />,
    );

    expect(form.find('input').length).to.equal(5);
    expect(form.find('VaMemorableDate').length).to.equal(1);
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
});
