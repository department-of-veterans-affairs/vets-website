import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { render, waitFor } from '@testing-library/react';

import {
  DefinitionTester,
  selectCheckbox,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';

describe('feedback tool benefits info', () => {
  let sandbox;
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.benefitsInformation.pages.benefitsInformation;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        data={{}}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
      />,
    );

    expect(form.find('input').length).to.equal(10);
    form.unmount();
  });

  it('should not submit without required information', async () => {
    const onSubmit = sandbox.spy();
    const { container } = render(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    const formDOM = getFormDOM({ container });
    formDOM.submitForm();

    await waitFor(() => {
      expect(container.querySelectorAll('.usa-input-error').length).to.equal(1);
      expect(onSubmit.called).to.be.false;
    });
  });

  it('should submit with required information', () => {
    const onSubmit = sandbox.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    selectCheckbox(form, 'root_educationDetails_programs_chapter33', true);
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
