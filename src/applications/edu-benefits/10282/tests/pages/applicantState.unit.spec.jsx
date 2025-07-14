import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { waitFor } from '@testing-library/react';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';

const definitions = formConfig.defaultDefinitions;

describe('Edu 10282 contact information', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.personalInformation.pages.applicantState;
  it('renders the correct amount of inputs', () => {
    const form = mount(
      <DefinitionTester
        definitions={definitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );
    expect(form.find('va-select').length).to.equal(1);
    form.unmount();
  });

  it('should show errors when required fields are empty', async () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
        definitions={definitions}
        // data={formData}
      />,
    );

    form.find('form').simulate('submit');
    await waitFor(() => {
      form.update();
      expect(form.find('va-select[error]').length).to.equal(1);
    });
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });
});
