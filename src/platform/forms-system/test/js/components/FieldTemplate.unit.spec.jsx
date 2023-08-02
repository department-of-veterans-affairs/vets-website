import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

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
    const tree = SkinDeep.shallowRender(
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

    expect(tree.subTree('label').text()).to.equal('Title');
    expect(tree.everySubTree('.field-child')).not.to.be.empty;
    expect(tree.everySubTree('.usa-input-error-message')).to.be.empty;
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
    const tree = SkinDeep.shallowRender(
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

    expect(tree.subTree('label').text()).to.equal('Title');
    expect(tree.everySubTree('.field-child')).not.to.be.empty;
    expect(tree.everySubTree('.usa-input-error-message')).to.be.empty;
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
    const tree = SkinDeep.shallowRender(
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

    expect(tree.props.className).to.equal('field-child');
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
    const tree = SkinDeep.shallowRender(
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

    expect(tree.everySubTree('.schemaform-required-span')).not.to.be.empty;
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
    const tree = SkinDeep.shallowRender(
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

    expect(tree.subTree('.usa-input-error-message').text()).to.equal(
      'Error Some error',
    );
    expect(tree.everySubTree('.usa-input-error')).not.to.be.empty;
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
    const tree = SkinDeep.shallowRender(
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

    expect(tree.subTree('.usa-input-error-message').text()).to.equal(
      'Error Some error',
    );
    expect(tree.everySubTree('.usa-input-error')).not.to.be.empty;
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
    const tree = SkinDeep.shallowRender(
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

    expect(tree.subTree('p').text()).to.equal('Blah');
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
    const tree = SkinDeep.shallowRender(
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

    expect(tree.text()).to.contain('Blah');
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
    const tree = SkinDeep.shallowRender(
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

    expect(tree.text()).to.not.contain('Blah');
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
    const tree = SkinDeep.shallowRender(
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

    expect(tree.text()).to.contain('uiDescription');
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
    const tree = SkinDeep.shallowRender(
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
    // `tree.text()` logs `<Unknown />Title<uiDescription />`, but
    // `tree.subTree('uiDescription')` <- doesn't find anything
    // so we're using props & children to find what we need
    expect(tree.props.children.props.children[2].props.index).to.equal(2);
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
    const tree = SkinDeep.shallowRender(
      <FieldTemplate
        id="test"
        schema={schema}
        uiSchema={uiSchema}
        formContext={formContext}
      >
        <div className="field-child" />
      </FieldTemplate>,
    );

    expect(tree.subTree('legend').text()).to.equal('Title');
    expect(tree.subTree('fieldset')).not.to.be.false;
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
    const tree = SkinDeep.shallowRender(
      <FieldTemplate
        id="test"
        schema={schema}
        uiSchema={uiSchema}
        formContext={formContext}
      >
        <div className="field-child" />
      </FieldTemplate>,
    );

    expect(tree.subTree('label').text()).to.equal('Title');
    expect(tree.subTree('fieldset')).to.be.false;
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
    const tree = SkinDeep.shallowRender(
      <FieldTemplate
        id="test"
        schema={schema}
        uiSchema={uiSchema}
        formContext={formContext}
      >
        <div className="field-child" />
      </FieldTemplate>,
    );

    expect(tree.subTree('h3').text()).to.equal('Title');
    expect(tree.subTree('label')).to.be.false;
    expect(tree.subTree('fieldset')).to.be.false;
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
    const tree = SkinDeep.shallowRender(
      <FieldTemplate
        id="test"
        schema={schema}
        uiSchema={uiSchema}
        rawErrors={errors}
        formContext={formContext}
      />,
    );

    expect(tree.subTree('label')).to.be.false;
    expect(tree.everySubTree('.usa-input-error-message')).to.be.empty;
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
    const tree = SkinDeep.shallowRender(
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

    expect(tree.subTree('label')).to.be.false;
    expect(tree.everySubTree('.field-child')).not.to.be.empty;
    expect(tree.everySubTree('.usa-input-error-message')).to.be.empty;
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
    const tree = SkinDeep.shallowRender(
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

    expect(tree.subTree('label')).not.to.be.empty;
    expect(tree.everySubTree('.schemaform-required-span')).not.to.be.empty;
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
    const tree = SkinDeep.shallowRender(
      <FieldTemplate
        id="test"
        schema={schema}
        uiSchema={uiSchema}
        formContext={formContext}
      >
        children
      </FieldTemplate>,
    );

    expect(tree.text()).to.equal('<WebComponentField />');
  });
});
