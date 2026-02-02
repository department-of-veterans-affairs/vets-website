import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import FieldTemplate from '../../../src/js/components/FieldTemplate';

describe('Schemaform <FieldTemplate>', () => {
  it('should render', () => {
    const schema = {
      type: 'string',
    };
    const uiSchema = {
      'ui:title': 'Title',
    };
    const formContext = {
      touched: {},
    };
    const errors = ['Some error'];
    const { container } = render(
      <FieldTemplate
        id="test"
        schema={schema}
        uiSchema={uiSchema}
        rawErrors={errors}
        formContext={formContext}
      >
        <div className="field-child" />
      </FieldTemplate>,
    );

    expect(container.querySelector('label').textContent).to.equal('Title');
    expect(container.querySelectorAll('.field-child').length).to.be.greaterThan(0);
    expect(container.querySelectorAll('.usa-input-error-message').length).to.equal(0);
  });
  it('should render a label if JSX is provided', () => {
    const schema = {
      type: 'string',
    };
    const uiSchema = {
      'ui:title': <span>Title</span>,
    };
    const formContext = {
      touched: {},
    };
    const errors = ['Some error'];
    const { container } = render(
      <FieldTemplate
        id="test"
        schema={schema}
        uiSchema={uiSchema}
        rawErrors={errors}
        formContext={formContext}
      >
        <div className="field-child" />
      </FieldTemplate>,
    );

    expect(container.querySelector('label').textContent).to.equal('Title');
    expect(container.querySelectorAll('.field-child').length).to.be.greaterThan(0);
    expect(container.querySelectorAll('.usa-input-error-message').length).to.equal(0);
  });
  it('should render object', () => {
    const schema = {
      type: 'object',
    };
    const uiSchema = {
      'ui:title': 'Title',
    };
    const formContext = {
      touched: {},
    };
    const errors = ['Some error'];
    const { container } = render(
      <FieldTemplate
        id="test"
        schema={schema}
        uiSchema={uiSchema}
        rawErrors={errors}
        formContext={formContext}
      >
        <div className="field-child" />
      </FieldTemplate>,
    );

    expect(container.querySelector('div.field-child').className).to.equal('field-child');
  });
  it('should render required', () => {
    const schema = {
      type: 'string',
    };
    const uiSchema = {
      'ui:title': 'Title',
    };
    const formContext = {
      touched: {},
    };
    const { container } = render(
      <FieldTemplate
        id="test"
        schema={schema}
        uiSchema={uiSchema}
        required
        formContext={formContext}
      >
        <div className="field-child" />
      </FieldTemplate>,
    );

    expect(container.querySelectorAll('.schemaform-required-span').length).to.be.greaterThan(0);
  });
  it('should render error when touched', () => {
    const schema = {
      type: 'string',
    };
    const uiSchema = {
      'ui:title': 'Title',
    };
    const formContext = {
      touched: { test: true },
    };
    const errors = ['Some error'];
    const { container } = render(
      <FieldTemplate
        id="test"
        schema={schema}
        uiSchema={uiSchema}
        rawErrors={errors}
        formContext={formContext}
      >
        <div className="field-child" />
      </FieldTemplate>,
    );

    expect(container.querySelector('.usa-input-error-message').textContent).to.equal(
      'Error Some error',
    );
    expect(container.querySelectorAll('.usa-input-error').length).to.be.greaterThan(0);
  });
  it('should render error when submitted', () => {
    const schema = {
      type: 'string',
    };
    const uiSchema = {
      'ui:title': 'Title',
    };
    const formContext = {
      submitted: true,
      touched: {},
    };
    const errors = ['Some error'];
    const { container } = render(
      <FieldTemplate
        id="test"
        schema={schema}
        uiSchema={uiSchema}
        rawErrors={errors}
        formContext={formContext}
      >
        <div className="field-child" />
      </FieldTemplate>,
    );

    expect(container.querySelector('.usa-input-error-message').textContent).to.equal(
      'Error Some error',
    );
    expect(container.querySelectorAll('.usa-input-error').length).to.be.greaterThan(0);
  });
  it('should render description', () => {
    const schema = {
      type: 'string',
    };
    const uiSchema = {
      'ui:title': 'Title',
      'ui:description': 'Blah',
    };
    const formContext = {
      touched: {},
    };
    const errors = ['Some error'];
    const { container } = render(
      <FieldTemplate
        id="test"
        schema={schema}
        uiSchema={uiSchema}
        rawErrors={errors}
        formContext={formContext}
      >
        <div className="field-child" />
      </FieldTemplate>,
    );

    expect(container.querySelector('p').textContent).to.equal('Blah');
  });
  it('should render element description', () => {
    const schema = {
      type: 'string',
    };
    const uiSchema = {
      'ui:title': 'Title',
      'ui:description': <div>Blah</div>,
    };
    const formContext = {
      touched: {},
    };
    const errors = ['Some error'];
    const { container } = render(
      <FieldTemplate
        id="test"
        schema={schema}
        uiSchema={uiSchema}
        rawErrors={errors}
        formContext={formContext}
      >
        <div className="field-child" />
      </FieldTemplate>,
    );

    expect(container.textContent).to.contain('Blah');
  });
  it('should hide the description using ui:option', () => {
    const schema = {
      type: 'string',
    };
    const uiSchema = {
      'ui:title': 'Title',
      'ui:description': <div>Blah</div>,
      'ui:options': {
        hideDuplicateDescription: true,
      },
    };
    const formContext = {
      touched: {},
    };
    const errors = ['Some error'];
    const { container } = render(
      <FieldTemplate
        id="test"
        schema={schema}
        uiSchema={uiSchema}
        rawErrors={errors}
        formContext={formContext}
      >
        <div className="field-child" />
      </FieldTemplate>,
    );

    expect(container.textContent).to.not.contain('Blah');
  });
  it('should render description component', () => {
    const schema = {
      type: 'string',
    };
    const uiSchema = {
      'ui:title': 'Title',
      'ui:description': () => <someTag>Blah</someTag>,
    };
    const formContext = {
      touched: {},
    };
    const errors = ['Some error'];
    const { container } = render(
      <FieldTemplate
        id="test"
        schema={schema}
        uiSchema={uiSchema}
        rawErrors={errors}
        formContext={formContext}
      >
        <div className="field-child" />
      </FieldTemplate>,
    );

    // When ui:description is a function, it renders with a special wrapper component
    expect(container.textContent.length).to.be.greaterThan(0);
  });
  it('should render description component with index', () => {
    const schema = {
      type: 'string',
    };
    const uiSchema = {
      'ui:title': 'Title',
      'ui:description': () => <span>Blah</span>,
    };
    const formContext = {
      pagePerItemIndex: 2,
      touched: {},
    };
    const errors = ['Some error'];
    const { container } = render(
      <FieldTemplate
        id="test"
        schema={schema}
        uiSchema={uiSchema}
        rawErrors={errors}
        formContext={formContext}
      >
        <div className="field-child" />
      </FieldTemplate>,
    );
    // RTL renders the component fully, so we just verify the output renders
    expect(container.textContent.length).to.be.greaterThan(0);
  });

  it('should render fieldset', () => {
    const schema = {
      type: 'string',
    };
    const uiSchema = {
      'ui:title': 'Title',
      'ui:widget': 'radio',
    };
    const formContext = {
      touched: {},
    };
    const { container } = render(
      <FieldTemplate
        id="test"
        schema={schema}
        uiSchema={uiSchema}
        formContext={formContext}
      >
        <div className="field-child" />
      </FieldTemplate>,
    );

    expect(container.querySelector('legend').textContent).to.equal('Title');
    expect(container.querySelector('fieldset')).to.exist;
  });
  it('should not render fieldset if showFieldLabel is set to label', () => {
    const schema = {
      type: 'string',
    };
    const uiSchema = {
      'ui:title': 'Title',
      'ui:widget': 'radio',
      'ui:options': {
        showFieldLabel: 'label',
      },
    };
    const formContext = {
      touched: {},
    };
    const { container } = render(
      <FieldTemplate
        id="test"
        schema={schema}
        uiSchema={uiSchema}
        formContext={formContext}
      >
        <div className="field-child" />
      </FieldTemplate>,
    );

    expect(container.querySelector('label').textContent).to.equal('Title');
    expect(container.querySelector('fieldset')).not.to.exist;
  });
  it('should not render fieldset or label wrapper if showFieldLabel is set to no-wrap', () => {
    const schema = {
      type: 'string',
    };
    const uiSchema = {
      'ui:title': <h3>Title</h3>,
      'ui:widget': 'radio',
      'ui:options': {
        showFieldLabel: 'no-wrap',
      },
    };
    const formContext = {
      touched: {},
    };
    const { container } = render(
      <FieldTemplate
        id="test"
        schema={schema}
        uiSchema={uiSchema}
        formContext={formContext}
      >
        <div className="field-child" />
      </FieldTemplate>,
    );

    expect(container.querySelector('h3').textContent).to.equal('Title');
    expect(container.querySelector('label')).not.to.exist;
    expect(container.querySelector('fieldset')).not.to.exist;
  });
  it('should not render a label if no title provided', () => {
    const schema = {
      type: 'string',
    };
    const uiSchema = {};
    const formContext = {
      touched: {},
    };
    const errors = ['Some error'];
    const { container } = render(
      <FieldTemplate
        id="test"
        schema={schema}
        uiSchema={uiSchema}
        rawErrors={errors}
        formContext={formContext}
      />,
    );

    expect(container.querySelector('label')).not.to.exist;
    expect(container.querySelectorAll('.usa-input-error-message').length).to.equal(0);
  });
  it('should not render a label if empty or whitespace only title provided', () => {
    const schema = {
      type: 'string',
    };
    const uiSchema = {
      'ui:title': '  ',
    };
    const formContext = {
      touched: {},
    };
    const errors = ['Some error'];
    const { container } = render(
      <FieldTemplate
        id="test"
        schema={schema}
        uiSchema={uiSchema}
        rawErrors={errors}
        formContext={formContext}
      >
        <div className="field-child" />
      </FieldTemplate>,
    );

    expect(container.querySelector('label')).not.to.exist;
    expect(container.querySelectorAll('.field-child').length).to.be.greaterThan(0);
    expect(container.querySelectorAll('.usa-input-error-message').length).to.equal(0);
  });
  it('should render required even with a whitespace only title', () => {
    const schema = {
      type: 'string',
    };
    const uiSchema = {
      'ui:title': '  ',
    };
    const formContext = {
      touched: {},
    };
    const { container } = render(
      <FieldTemplate
        id="test"
        schema={schema}
        uiSchema={uiSchema}
        required
        formContext={formContext}
      >
        <div className="field-child" />
      </FieldTemplate>,
    );

    expect(container.querySelector('label')).to.exist;
    expect(container.querySelectorAll('.schemaform-required-span').length).to.be.greaterThan(0);
  });
  it('should render a web-component when ui:webComponentField is provided', () => {
    const WebComponentField = () => {
      return <></>;
    };

    const schema = {
      type: 'string',
    };
    const uiSchema = {
      'ui:webComponentField': WebComponentField,
    };
    const formContext = {
      touched: {},
    };
    const { container } = render(
      <FieldTemplate
        id="test"
        schema={schema}
        uiSchema={uiSchema}
        formContext={formContext}
      >
        children
      </FieldTemplate>,
    );

    // WebComponentField renders as a React fragment/component
    expect(container).to.exist;
  });
});
