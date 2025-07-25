import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import {
  DefinitionTester,
  selectRadio,
} from 'platform/testing/unit/schemaform-utils';
import { mount } from 'enzyme';
import { waitFor } from '@testing-library/dom';
import formConfig from '../../config/form';

describe('Unemployability 8940 Walkthrough', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.disabilities.pages.unemployabilityFormIntro;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
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

  it('should fail to submit when no data is filled out', async () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:unemployable': true,
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );
    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(form.find('.usa-input-error-message').length).to.equal(1);
      expect(onSubmit.called).to.be.false;
      form.unmount();
    });
  });

  it('should submit when data filled in', async () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
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
    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(form.find('.usa-input-error-message').length).to.equal(0);
      expect(onSubmit.called).to.be.true;
      form.unmount();
    });
  });
});
