import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { DefinitionTester } from '../../../../../platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form.js';

describe('Disability benefits 526EZ special circumstances', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.veteranDetails.pages.specialCircumstances;

  const defaultFormData = {
    veteran: {
      homelessness: {
        pointOfContact: {},
      },
    },
  };

  it('renders special circumstances form', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={defaultFormData}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    expect(form.find('input[type="radio"]').length).to.equal(2);
  });

  it('should not submit form without required fields', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={defaultFormData}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });

  it('should submit form when veteran indicates not homeless', () => {
    const onSubmit = sinon.spy();
    const formData = {
      veteran: {
        homelessness: {
          isHomeless: false,
        },
      },
    };

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
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });

  it('should submit form when veteran indicates they are homeless but have no POC', () => {
    const onSubmit = sinon.spy();
    const formData = {
      veteran: {
        homelessness: {
          isHomeless: true,
          pointOfContact: {},
        },
      },
    };

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
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });

  it('should not submit form when veteran indicates only POC name', () => {
    const onSubmit = sinon.spy();
    const formData = {
      veteran: {
        homelessness: {
          isHomeless: true,
          pointOfContact: {
            pointOfContactName: 'Abraham Lincoln',
          },
        },
      },
    };

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
    expect(form.find('.usa-input-error').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });

  it('should not submit form when veteran indicates only POC phone', () => {
    const onSubmit = sinon.spy();
    const formData = {
      veteran: {
        homelessness: {
          isHomeless: true,
          pointOfContact: {
            primaryPhone: '1234567890',
          },
        },
      },
    };

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
    expect(form.find('.usa-input-error').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });

  it('should submit form when veteran indicates all required POC info', () => {
    const onSubmit = sinon.spy();
    const formData = {
      veteran: {
        homelessness: {
          isHomeless: true,
          pointOfContact: {
            pointOfContactName: 'Abraham Lincoln',
            primaryPhone: '1234567890',
          },
        },
      },
    };

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
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
});
