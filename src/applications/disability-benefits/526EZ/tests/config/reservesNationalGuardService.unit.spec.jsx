import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import _ from 'lodash/fp';

import { DefinitionTester } from '../../../../../platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form.js';

describe('Disability benefits 526EZ reservesNationalGuardService', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.veteranDetails.pages.reservesNationalGuardService;

  const defaultFormData = {
    unitName: 'Alpha Bravo Charlie',
    obligationTermOfServiceDateRange: {
      from: '2015-05-04',
      to: '2016-06-05',
    },
    waiveVABenefitsToRetainTrainingPay: false,
  };

  it('renders reserves national guard service form', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{}}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    expect(form.find('input[type="radio"]').length).to.equal(2);
  });

  it('requires title 10 dates when title 10 activation indicated', () => {
    const formData = _.merge(defaultFormData, {
      'view:isTitle10Activated': true,
    });
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={formData}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(2);
  });

  it('does not submit without all required info', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{}}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(4);
  });

  it('does submit with all required info', () => {
    const formData = _.merge(defaultFormData, {
      'view:isTitle10Activated': true,
      title10Activation: {
        title10ActivationDate: '2015-06-05',
        anticipatedSeparationDate: '2099-08-12', // must be a future date
      },
    });
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={formData}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.calledOnce).to.be.true;
  });
});
