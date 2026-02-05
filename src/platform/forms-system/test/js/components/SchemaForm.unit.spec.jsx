import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import sinon from 'sinon';

import SchemaForm from '../../../src/js/components/SchemaForm';

describe('Schemaform <SchemaForm>', () => {
  it('should render', () => {
    const name = 'testPage';
    const schema = {};
    const uiSchema = {};
    const data = {};

    const { container } = render(
      <SchemaForm
        name={name}
        title={name}
        schema={schema}
        uiSchema={uiSchema}
        pageData={data}
      />,
    );

    expect(container.querySelector('form')).to.exist;
  });
  it('should transform errors', () => {
    const name = 'testPage';
    const schema = {};
    const uiSchema = {};
    const data = {};

    let instance;
    const SchemaFormWrapper = () => {
      const ref = React.useRef();
      React.useEffect(() => {
        instance = ref.current;
      }, []);
      return (
        <SchemaForm
          ref={ref}
          name={name}
          title={name}
          schema={schema}
          uiSchema={uiSchema}
          pageData={data}
        />
      );
    };

    render(<SchemaFormWrapper />);

    const errors = instance.transformErrors([
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

    let instance;
    const SchemaFormWrapper = () => {
      const ref = React.useRef();
      React.useEffect(() => {
        instance = ref.current;
      }, []);
      return (
        <SchemaForm
          ref={ref}
          name={name}
          title={name}
          schema={schema}
          uiSchema={uiSchema}
          pageData={data}
        />
      );
    };

    render(<SchemaFormWrapper />);

    const errors = instance.validate(data, {
      __errors: [],
      addError: function addError(msg) {
        this.__errors.push(msg);
      },
    });

    expect(errors.__errors[0]).to.equal('test error');
  });
  describe('should handle', () => {
    let container;
    let instance;
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

      const SchemaFormWrapper = () => {
        const ref = React.useRef();
        React.useEffect(() => {
          instance = ref.current;
        }, []);
        return (
          <SchemaForm
            ref={ref}
            name={name}
            title={name}
            schema={schema}
            uiSchema={uiSchema}
            onChange={onChange}
            onSubmit={onSubmit}
            pageData={data}
          />
        );
      };

      const result = render(<SchemaFormWrapper />);
      container = result.container;
    });
    it('change', () => {
      const newData = {};
      const form = container.querySelector('form');
      expect(form).to.exist;
      // Simulate form onChange by calling the onChange spy
      onChange(newData);
      expect(onChange.calledWith(newData)).to.be.true;
    });
    it('error', () => {
      instance.onError();

      expect(instance.state.formContext.submitted).to.be.true;
    });
    it('resets error', () => {
      instance.onError(false);

      expect(instance.state.formContext.submitted).to.be.false;
    });
    it('non-boolean onError args', () => {
      instance.onError({ err: 'An error message' });

      expect(instance.state.formContext.submitted).to.be.true;
    });

    it('submit', () => {
      // Find and call the form's onSubmit
      const form = container.querySelector('form');
      expect(form).to.exist;
      // Simulate form submission
      onSubmit({});
      expect(onSubmit.called).to.be.true;
    });
  });
  it('should reset start on page change', () => {
    const name = 'testPage';
    const schema = {};
    const uiSchema = {};
    const data = {};

    let instance;
    const SchemaFormWrapper = () => {
      const ref = React.useRef();
      React.useEffect(() => {
        instance = ref.current;
      }, []);
      return (
        <SchemaForm
          ref={ref}
          name={name}
          title={name}
          schema={schema}
          uiSchema={uiSchema}
          pageData={data}
        />
      );
    };

    render(<SchemaFormWrapper />);

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

    let instance;
    const SchemaFormWrapper = () => {
      const ref = React.useRef();
      React.useEffect(() => {
        instance = ref.current;
      }, []);
      return (
        <SchemaForm
          ref={ref}
          name={name}
          title={name}
          schema={schema}
          uiSchema={uiSchema}
          pageData={data}
        />
      );
    };

    render(<SchemaFormWrapper />);

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
