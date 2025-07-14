import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import { waitFor } from '@testing-library/react';
import { mount } from 'enzyme';
import ReactTestUtils from 'react-dom/test-utils';

import {
  DefinitionTester,
  submitForm,
} from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';

describe('Edu 10203 personalInformation', () => {
  let sandbox;
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.personalInformation.pages.contactInformation;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });
  it('renders the correct amount of options', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );
    expect(form.find('input').length).to.equal(13);
    form.unmount();
  });

  it('should have no required inputs', async () => {
    const onSubmit = sandbox.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        onSubmit={onSubmit}
        data={{}}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
      />,
    );
    const formDOM = findDOMNode(form);
    submitForm(form);

    await waitFor(() => {
      expect(
        Array.from(formDOM.querySelectorAll('.usa-input-error')).length,
      ).to.equal(6);
    });

    submitForm(form);

    expect(onSubmit.called).to.be.false;
  });
});
