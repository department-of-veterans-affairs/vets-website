import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { DefinitionTester } from '../../../../../platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';
import { ERR_MSG_CSS_CLASS } from '../../constants';

describe('trainingPayWaiver', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.additionalInformation.pages.trainingPayWaiver;
  const { defaultDefinitions } = formConfig;
  it('should render', () => {
    const form = mount(
      <DefinitionTester
        definitions={defaultDefinitions}
        uiSchema={uiSchema}
        schema={schema}
      />,
    );

    expect(form.find('input').length).to.equal(2);
  });

  it('should submit without any input from user', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={defaultDefinitions}
        uiSchema={uiSchema}
        schema={schema}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');

    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
    expect(onSubmit.calledOnce).to.be.true;
  });
});
