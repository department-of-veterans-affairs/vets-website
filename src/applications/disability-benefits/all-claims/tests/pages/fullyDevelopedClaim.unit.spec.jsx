import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import { mount } from 'enzyme';
import formConfig from '../../config/form';
import { ERR_MSG_CSS_CLASS } from '../../constants';

describe('Fully Developed Claim', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.additionalInformation.pages.fullyDevelopedClaim;
  it('should render', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
        schema={schema}
        data={{}}
        formData={{}}
      />,
    );

    expect(form.find('input').length).to.equal(2);
    form.unmount();
  });

  // Value should default `false`; form should submit without any user input
  it('should submit with required data', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
        schema={schema}
        data={{}}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
    form.unmount();
  });
});
