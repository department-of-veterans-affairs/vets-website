import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import ReactTestUtils from 'react-dom/test-utils';

import {
  DefinitionTester,
  submitForm,
} from 'platform/testing/unit/schemaform-utils.jsx';
import { waitFor } from '@testing-library/react';
import formConfig from '../../config/form';

describe('Edu 1995 benefitSelection', () => {
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
  } = formConfig.chapters.benefitSelection.pages.benefitSelection;
  it('renders the correct amount of options for the benefit selection radio button', async () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );
    await waitFor(() => {
      expect(form.find('input').length).to.equal(6);
      form.unmount();
    });
  });

  it('should have no required inputs', async () => {
    const onSubmit = sandbox.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        onSubmit={onSubmit}
        data={{}}
        uiSchema={uiSchema}
      />,
    );
    const formDOM = findDOMNode(form);
    submitForm(form);

    await waitFor(() => {
      expect(
        Array.from(formDOM.querySelectorAll('.usa-input-error')).length,
      ).to.equal(1);
    });

    submitForm(form);

    expect(onSubmit.called).to.be.false;
  });
});

describe('Delete Environment Variables Edu 1995 benefitSelection', () => {
  beforeEach(() => {
    global.window.buildType = true;
  });
  afterEach(() => {
    global.window.buildType = false;
  });
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.benefitSelection.pages.benefitSelection;
  it('renders the correct amount of options for the benefit selection radio button', async () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );
    await waitFor(() => {
      expect(form.find('input').length).to.equal(6);
      form.unmount();
    });
  });
});
