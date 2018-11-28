import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import {
  DefinitionTester,
  selectCheckbox,
} from '../../../../../platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../../0993/config/form';

describe('0993 claimant information', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.claimantInformation.pages.claimantInformation;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        data={{}}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
      />,
    );

    // Check for opt out message
    expect(form.find('input').length).to.equal(5);
    expect(form.find('select').length).to.equal(1);
  });

  it('should not submit empty form', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(3);
    expect(onSubmit.called).to.be.false;
  });

  it('should submit with no errors with all required fields filled in', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        data={{
          claimantFullName: {
            first: 'test',
            last: 'test',
          },
          claimantSocialSecurityNumber: '987987987',
        }}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });

  it('should expand and require VA file number question if no SSN is available', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        data={{
          claimantFullName: {
            first: 'test',
            last: 'test',
          },
        }}
        uiSchema={uiSchema}
      />,
    );

    form.find('form').simulate('submit');

    // VA file number input is not visible; error is shown for empty SSN input
    expect(
      form.find(
        '.usa-input-error #root_claimantSocialSecurityNumber-error-message',
      ).length,
    ).to.equal(1);
    expect(form.find('#root_vaFileNumber').length).to.equal(0);

    // Check no-SSN box
    selectCheckbox(form, 'root_view:noSSN', true);
    expect(
      form.find(
        '.usa-input-error #root_claimantSocialSecurityNumber-error-message',
      ).length,
    ).to.equal(0);
    expect(
      form.find('.usa-input-error #root_vaFileNumber-error-message').length,
    ).to.equal(1);
  });
});
