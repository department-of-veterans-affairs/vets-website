import React from 'react';
import { expect } from 'chai';
/*
  import sinon from 'sinon';
  import { mount } from 'enzyme';
*/
import {
  /* $, */ $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { render } from '@testing-library/react';
import formConfig from '../../config/form';

describe('feedback tool applicant info', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.applicantInformation.pages.applicantRelationship;

  it('should render va-radio', () => {
    const { container } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );
    // Expect one question with two radio inputs
    expect($$('va-radio').length).to.equal(1);
    expect($$('va-radio-option').length).to.equal(3);

    const question = container.querySelector('va-radio');
    expect(question).to.have.attribute(
      'label',
      'I’m submitting feedback on behalf of...',
    );
    expect(
      container.querySelector('va-radio-option[label="Myself"]', container),
    ).exist;
    expect(
      container.querySelector(
        'va-radio-option[label="Someone else"]',
        container,
      ),
    ).exist;
    expect(
      container.querySelector(
        'va-radio-option[label="I want to submit my feedback anonymously"]',
        container,
      ),
    ).exist;
  });
  /*
  it('should not submit without required information', () => {
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
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

    it('should submit with required information', () => {
      const onSubmit = sinon.spy();
      const form = mount(
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          onSubmit={onSubmit}
          uiSchema={uiSchema}
        />,
      );

      selectRadio(form, 'root_onBehalfOf', 'Anonymous');
      form.find('form').simulate('submit');
      expect(form.find('.usa-input-error').length).to.equal(0);
      expect(onSubmit.called).to.be.true;
      form.unmount();
    });

      it('should render myself', () => {
        const onSubmit = sinon.spy();
        const form = mount(
          <DefinitionTester
            schema={schema}
            definitions={formConfig.defaultDefinitions}
            onSubmit={onSubmit}
            uiSchema={uiSchema}
          />,
        );

        selectRadio(form, 'root_onBehalfOf', 'Myself');
        expect(form.find('input').length).to.equal(3);
        form.unmount();
      });

      it('should render someone else', () => {
        const onSubmit = sinon.spy();
        const form = mount(
          <DefinitionTester
            schema={schema}
            definitions={formConfig.defaultDefinitions}
            onSubmit={onSubmit}
            uiSchema={uiSchema}
          />,
        );

        selectRadio(form, 'root_onBehalfOf', 'Someone else');
        expect(form.find('input').length).to.equal(3);
        form.unmount();
      });

      it('should render anonymous', () => {
        const onSubmit = sinon.spy();
        const form = mount(
          <DefinitionTester
            schema={schema}
            definitions={formConfig.defaultDefinitions}
            onSubmit={onSubmit}
            uiSchema={uiSchema}
          />,
        );

        selectRadio(form, 'root_onBehalfOf', 'Anonymous');
        expect(form.find('input').length).to.equal(4);
        form.unmount();
      }); */
});
