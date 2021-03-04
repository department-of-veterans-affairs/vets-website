import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import {
  DefinitionTester,
  selectRadio,
} from 'platform/testing/unit/schemaform-utils.jsx';
import { mount } from 'enzyme';
import formConfig from '../../config/form';

describe('Unemployability 8940 Walkthrough', () => {
  const opts = { showSubforms: true };
  const { schema, uiSchema } = formConfig(
    opts,
  ).chapters.disabilities.pages.unemployabilityFormIntro;
  const defaultDefinitions = formConfig(opts).defaultDefinitions;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        definitions={defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:unemployable': true,
        }}
        formData={{}}
      />,
    );

    expect(form.find('input').length).to.equal(2);
    form.unmount();
  });

  it('should fail to submit when no data is filled out', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:unemployable': true,
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should submit when data filled in', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:unemployable': true,
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    selectRadio(
      form,
      'root_view:unemployabilityUploadChoice',
      'answerQuestions',
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
