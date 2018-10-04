import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { DefinitionTester } from '../../../../../platform/testing/unit/schemaform-utils.jsx';
import { mount } from 'enzyme';
import formConfig from '../../config/form';

describe('Add Secondary Stressful Incident Description', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.introductionPage.pages.otherSourcesSecondary;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    expect(form.find('input').length).to.equal(2);
  });

  it('should render additional options', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          gatherInformation: 'yes',
        }}
        formData={{}}
      />,
    );

    expect(form.find('input').length).to.equal(4);
  });

  it('should submit', () => {
    const onSubmit = sinon.spy();

    const form = mount(
      <DefinitionTester
        definitions={formConfig}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
});
