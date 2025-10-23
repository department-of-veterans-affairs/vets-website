import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';
import sinon from 'sinon';

import SchemaForm from '../../../src/js/components/SchemaForm';
import { render } from '@testing-library/react';

describe('Schemaform <SchemaForm>', () => {
  it('should render', () => {
    const name = 'testPage';
    const schema = {};
    const uiSchema = {};
    const data = {};

    const tree = SkinDeep.shallowRender(
      <SchemaForm
        name={name}
        title={name}
        schema={schema}
        uiSchema={uiSchema}
        pageData={data}
      />,
    );

    expect(tree.everySubTree('Form')).not.to.be.empty;
  });
  it('should transform errors', () => {
    const name = 'testPage';
    const schema = {};
    const uiSchema = {};
    const data = {};

    const tree = SkinDeep.shallowRender(
      <SchemaForm
        name={name}
        title={name}
        schema={schema}
        uiSchema={uiSchema}
        pageData={data}
      />,
    );

    const errors = tree.getMountedInstance().transformErrors([
      {
        name: 'required',
        property: 'instance',
        argument: 'test',
      },
    ]);

    expect(errors[0].property).to.equal('instance.test');
  });
  it('should call ui schema validation', () => {
    const name = 'testPage';
    const schema = {};
    const uiSchema = {
      'ui:validations': [errors => errors.addError('test error')],
    };
    const data = {};

    const tree = SkinDeep.shallowRender(
      <SchemaForm
        name={name}
        title={name}
        schema={schema}
        uiSchema={uiSchema}
        pageData={data}
      />,
    );

    const errors = tree.getMountedInstance().validate(data, {
      __errors: [],
      addError: function addError(msg) {
        this.__errors.push(msg);
      },
    });

    expect(errors.__errors[0]).to.equal('test error');
  });
  describe('should handle', () => {
    let tree;
    let onChange;
    let onSubmit;
    let data;
    let name;
    let schema;
    let uiSchema;
    beforeEach(() => {
      onChange = sinon.spy();
      onSubmit = sinon.spy();
      name = 'testPage';
      schema = {};
      uiSchema = {};
      data = {};

      tree = SkinDeep.shallowRender(
        <SchemaForm
          name={name}
          title={name}
          schema={schema}
          uiSchema={uiSchema}
          onChange={onChange}
          onSubmit={onSubmit}
          pageData={data}
        />,
      );
    });
    it('change', () => {
      const newData = {};
      tree.subTree('Form').props.onChange(newData);

      expect(onChange.calledWith(newData));
    });
    it('error', () => {
      tree.getMountedInstance().onError();

      expect(tree.getMountedInstance().state.formContext.submitted).to.be.true;
    });
    it('resets error', () => {
      tree.getMountedInstance().onError(false);

      expect(tree.getMountedInstance().state.formContext.submitted).to.be.false;
    });
    it('non-boolean onError args', () => {
      tree.getMountedInstance().onError({ err: 'An error message' });

      expect(tree.getMountedInstance().state.formContext.submitted).to.be.true;
    });

    it('submit', () => {
      tree.subTree('Form').props.onSubmit();

      expect(onSubmit.called).to.be.true;
    });
  });
  it('should reset start on page change', () => {
    const name = 'testPage';
    const schema = {};
    const uiSchema = {};
    const data = {};

    const tree = SkinDeep.shallowRender(
      <SchemaForm
        name={name}
        title={name}
        schema={schema}
        uiSchema={uiSchema}
        pageData={data}
      />,
    );

    const instance = tree.getMountedInstance();

    instance.onError();

    expect(instance.state.formContext.submitted).to.be.true;

    instance.UNSAFE_componentWillReceiveProps({
      name: 'testPage2',
      title: name,
      schema,
      uiSchema,
      data,
    });

    expect(instance.state.formContext.submitted).to.be.false;
  });
  it('should merge state with new form context', () => {
    const name = 'testPage';
    const schema = {};
    const uiSchema = {};
    const data = {};

    const tree = SkinDeep.shallowRender(
      <SchemaForm
        name={name}
        title={name}
        schema={schema}
        uiSchema={uiSchema}
        pageData={data}
      />,
    );

    const instance = tree.getMountedInstance();

    expect(instance.state.formContext.submitted).to.be.false;

    instance.UNSAFE_componentWillReceiveProps({
      name,
      formContext: { test: true },
      title: name,
      schema,
      uiSchema,
      data,
    });

    expect(instance.state.formContext.test).to.be.true;
    expect(instance.state.formContext.submitted).to.be.false;
  });
  it('should render a memoized description and field', async () => {
    const name = 'testPage';
    const schema = {
      type: 'object',
      properties: {
        field1: {
          type: 'string',
        },
        field2: {
          type: 'string',
        },
      },
    };
    const uiSchema = {
      field1: {
        'ui:description': React.memo(() => <div>Description comp</div>),
        'ui:widget': React.memo(() => <div>Widget comp</div>),
      },
      field2: {
        'ui:field': React.memo(() => <div>Field comp</div>),
      },
    };
    const data = {};

    const screen = render(
      <SchemaForm
        name={name}
        title={name}
        schema={schema}
        uiSchema={uiSchema}
        pageData={data}
      />,
    );

    expect(await screen.findByText('Description comp')).to.be.ok;
    expect(screen.getByText('Widget comp')).to.be.ok;
    expect(screen.getByText('Field comp')).to.be.ok;
  });
});
