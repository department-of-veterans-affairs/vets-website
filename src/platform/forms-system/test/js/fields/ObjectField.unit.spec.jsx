import React, { createRef } from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import sinon from 'sinon';

import { getFormDOM } from 'platform/testing/unit/schemaform-utils';
import ObjectField from '../../../src/js/fields/ObjectField';

describe('Schemaform: ObjectField', () => {
  it('should render', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const schema = {
      type: 'object',
      properties: {
        test: {
          type: 'string',
        },
      },
    };
    const { container } = render(
      <ObjectField
        schema={schema}
        idSchema={{}}
        onChange={onChange}
        onBlur={onBlur}
      />,
    );

    expect(container.querySelectorAll('input')).not.to.be.empty;
  });
  it('should not render hidden items', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const schema = {
      type: 'object',
      properties: {
        test: {
          'ui:hidden': true,
          type: 'string',
        },
      },
    };
    const { container } = render(
      <ObjectField
        schema={schema}
        idSchema={{}}
        onChange={onChange}
        onBlur={onBlur}
      />,
    );

    // Hidden items should not render SchemaField components
    expect(container.querySelectorAll('input').length).to.equal(0);
  });
  it('should render description', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const schema = {
      properties: {
        test: {
          type: 'string',
        },
      },
    };
    const uiSchema = {
      'ui:description': 'Blah',
    };
    const { container } = render(
      <ObjectField
        uiSchema={uiSchema}
        schema={schema}
        idSchema={{}}
        formData={{}}
        onChange={onChange}
        onBlur={onBlur}
      />,
    );

    expect(container.textContent).to.contain('Blah');
  });
  it('should render jsx description', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const schema = {
      properties: {
        test: {
          type: 'string',
        },
      },
    };
    const uiSchema = {
      'ui:description': <div className="test-class" />,
    };
    const { container } = render(
      <ObjectField
        uiSchema={uiSchema}
        schema={schema}
        idSchema={{}}
        formData={{}}
        onChange={onChange}
        onBlur={onBlur}
      />,
    );

    expect(container.querySelectorAll('.test-class')).not.to.be.empty;
  });
  it('should render component description', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const schema = {
      properties: {
        test: {
          type: 'string',
        },
      },
    };
    const uiSchema = {
      'ui:description': () => <div className="test-class" />,
    };
    const { container } = render(
      <ObjectField
        uiSchema={uiSchema}
        schema={schema}
        idSchema={{}}
        formData={{}}
        onChange={onChange}
        onBlur={onBlur}
      />,
    );

    expect(container.querySelectorAll('.test-class')).not.to.be.empty;
  });
  it('should render title', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const schema = {
      properties: {
        test: {
          type: 'string',
        },
      },
    };
    const uiSchema = {
      'ui:title': 'Blah',
    };
    const { container } = render(
      <ObjectField
        uiSchema={uiSchema}
        schema={schema}
        idSchema={{}}
        formData={{}}
        onChange={onChange}
        onBlur={onBlur}
      />,
    );

    expect(container.textContent).to.contain('Blah');
  });
  it('should render component title', () => {
    const schema = {
      properties: {
        test: {
          type: 'string',
        },
      },
    };
    const uiSchema = {
      'ui:title': () => <div className="test-title-class" />,
    };
    const { container } = render(
      <ObjectField
        uiSchema={uiSchema}
        schema={schema}
        idSchema={{}}
        formData={{}}
        onChange={f => f}
        onBlur={f => f}
      />,
    );

    expect(container.querySelectorAll('.test-title-class')).not.to.be.empty;
  });
  it('should hide expand under items when false', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const schema = {
      type: 'object',
      properties: {
        test: {
          type: 'boolean',
        },
        test2: {
          type: 'string',
          'ui:collapsed': true,
        },
      },
    };
    const uiSchema = {
      test2: {
        'ui:options': {
          expandUnder: 'test',
        },
      },
    };
    const formData = {
      test: false,
    };
    const { container } = render(
      <ObjectField
        schema={schema}
        uiSchema={uiSchema}
        idSchema={{}}
        formData={formData}
        onChange={onChange}
        onBlur={onBlur}
      />,
    );

    // Check for expanding group class with collapsed state
    const expandingGroup = container.querySelector(
      '.form-expanding-group',
    );
    expect(expandingGroup).not.to.be.null;
  });
  it('should not hide expand under items when true', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const schema = {
      type: 'object',
      properties: {
        test: {
          type: 'boolean',
        },
        test2: {
          type: 'string',
        },
      },
    };
    const uiSchema = {
      test2: {
        'ui:options': {
          expandUnder: 'test',
        },
      },
    };
    const formData = {
      test: true,
    };
    const { container } = render(
      <ObjectField
        schema={schema}
        uiSchema={uiSchema}
        idSchema={{}}
        formData={formData}
        onChange={onChange}
        onBlur={onBlur}
      />,
    );

    // Check for expanding group class with expanded state
    const expandingGroup = container.querySelector(
      '.form-expanding-group',
    );
    expect(expandingGroup).not.to.be.null;
  });
  it('should handle change', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const schema = {
      type: 'object',
      properties: {
        test: {
          type: 'string',
        },
      },
    };
    const ref = createRef();
    render(
      <ObjectField
        ref={ref}
        schema={schema}
        idSchema={{}}
        onChange={onChange}
        onBlur={onBlur}
      />,
    );

    ref.current.onPropertyChange('test')('value');

    expect(onChange.firstCall.args[0]).to.eql({
      test: 'value',
    });
  });
  it('should handle blur', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const schema = {
      type: 'object',
      properties: {
        test: {
          type: 'string',
        },
      },
    };
    const ref = createRef();
    render(
      <ObjectField
        ref={ref}
        schema={schema}
        idSchema={{}}
        onChange={onChange}
        onBlur={onBlur}
      />,
    );

    ref.current.onPropertyBlur('test')();

    expect(onBlur.firstCall.args[0]).to.eql(['test']);
  });

  it('should render non-unique IDs on regular pages', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const formContext = {
      onReviewPage: false,
    };
    const schema1 = {
      properties: {
        type: 'object',
        test: {
          type: 'string',
        },
      },
    };
    const schema2 = {
      properties: {
        type: 'object',
        test2: {
          type: 'string',
        },
      },
    };
    const uiSchema = {
      'ui:title': 'Blah',
    };
    const idSchema1 = {
      $id: 'root',
      test: {
        $id: 'root_test',
      },
    };
    const idSchema2 = {
      $id: 'root',
      test2: {
        $id: 'root_test2',
      },
    };
    const { container } = render(
      <div>
        <ObjectField
          formContext={formContext}
          uiSchema={uiSchema}
          schema={schema1}
          idSchema={idSchema1}
          formData={{}}
          onChange={onChange}
          onBlur={onBlur}
        />
        <ObjectField
          formContext={formContext}
          uiSchema={uiSchema}
          schema={schema2}
          idSchema={idSchema2}
          formData={{}}
          onChange={onChange}
          onBlur={onBlur}
        />
      </div>,
    );
    const formDOM = getFormDOM(container);
    const ids = formDOM.querySelectorAll('legend');
    expect(ids).to.have.length(2);

    const id0 = ids[0].id;
    const id1 = ids[1].id;
    expect(id0).to.equal('root__title');
    expect(id0).to.equal(id1);
  });
  it('should render unique IDs on review & submit page', () => {
    // This occurs on form 526 when "ratedDisabilities" &
    // "unempolyabilityDisabilities" both render the same list of rated
    // disabilities
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const schema = {
      properties: {
        type: 'object',
        test: {
          type: 'string',
        },
      },
    };
    const uiSchema = {
      'ui:title': 'Blah',
    };
    const idSchema = {
      $id: 'root',
      test: {
        $id: 'root_test',
      },
    };
    const { container } = render(
      <div>
        <ObjectField
          formContext={{ onReviewPage: true, pagePerItemIndex: 0 }}
          uiSchema={uiSchema}
          schema={schema}
          idSchema={idSchema}
          formData={{}}
          onChange={onChange}
          onBlur={onBlur}
        />
        <ObjectField
          formContext={{ onReviewPage: true, pagePerItemIndex: 1 }}
          uiSchema={uiSchema}
          schema={schema}
          idSchema={idSchema}
          formData={{}}
          onChange={onChange}
          onBlur={onBlur}
        />
      </div>,
    );
    const formDOM = getFormDOM(container);
    const inputs = formDOM.querySelectorAll('input');
    expect(inputs).to.have.length(2);
    expect(inputs[0].id).to.equal('root_test_0');
    expect(inputs[1].id).to.equal('root_test_1');
    const legends = formDOM.querySelectorAll('legend');
    expect(legends).to.have.length(2);
    expect(legends[0].id).to.equal('root_test_0__title');
    expect(legends[1].id).to.equal('root_test_1__title');
  });
  it('should render unique IDs for array items on review & submit page', () => {
    // This occurs on form 526 when "ratedDisabilities" &
    // "unempolyabilityDisabilities" both render the same list of rated
    // disabilities
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const schema = {
      type: 'object',
      properties: {
        test: {
          type: 'boolean',
        },
      },
    };
    const uiSchema = {
      'ui:title': 'Blah',
      test: {
        'ui:title': 'test',
      },
    };
    const idSchema = {
      $id: 'root',
      test: {
        $id: 'root_test',
      },
    };
    const { container } = render(
      <div>
        <ObjectField
          formContext={{
            onReviewPage: true,
            pagePerItemIndex: 0,
          }}
          uiSchema={uiSchema}
          schema={schema}
          idSchema={idSchema}
          formData={{}}
          onChange={onChange}
          onBlur={onBlur}
        />
        <ObjectField
          formContext={{
            onReviewPage: true,
            pagePerItemIndex: 1,
          }}
          uiSchema={uiSchema}
          schema={schema}
          idSchema={idSchema}
          formData={{}}
          onChange={onChange}
          onBlur={onBlur}
        />
      </div>,
    );
    const formDOM = getFormDOM(container);
    const ids = formDOM.querySelectorAll('input');
    expect(ids).to.have.length(2);
    expect(ids[0].id).to.equal('root_test_0');
    expect(ids[1].id).to.equal('root_test_1');

    const legends = formDOM.querySelectorAll('legend');
    expect(legends).to.have.length(2);
    expect(legends[0].id).to.equal('root_test_0__title');
    expect(legends[1].id).to.equal('root_test_1__title');
  });
  it('should render unique IDs for nested array items on review & submit page', () => {
    // This occurs on form 526 when "ratedDisabilities" &
    // "unempolyabilityDisabilities" both render the same list of rated
    // disabilities
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const schema = {
      properties: {
        type: 'object',
        nested: {
          type: 'object',
          properties: {
            testA: {
              type: 'boolean',
            },
            testB: {
              type: 'boolean',
            },
          },
        },
      },
    };
    const uiSchema = {
      'ui:title': 'Blah',
      nested: {
        testA: {
          'ui:title': 'test A',
        },
        testB: {
          'ui:title': 'test B',
        },
      },
    };
    const idSchema = {
      $id: 'root',
      nested: {
        testA: {
          $id: 'root_testA',
        },
        testB: {
          $id: 'root_testB',
        },
      },
    };
    const { container } = render(
      <div>
        <ObjectField
          formContext={{
            onReviewPage: true,
            pagePerItemIndex: 0,
          }}
          uiSchema={uiSchema}
          schema={schema}
          idSchema={idSchema}
          formData={{}}
          onChange={onChange}
          onBlur={onBlur}
        />
        <ObjectField
          formContext={{
            onReviewPage: true,
            pagePerItemIndex: 1,
          }}
          uiSchema={uiSchema}
          schema={schema}
          idSchema={idSchema}
          formData={{}}
          onChange={onChange}
          onBlur={onBlur}
        />
      </div>,
    );
    const formDOM = getFormDOM(container);
    const ids = formDOM.querySelectorAll('input');
    expect(ids).to.have.length(4);
    expect(ids[0].id).to.equal('root_testA_0');
    expect(ids[1].id).to.equal('root_testB_0');
    expect(ids[2].id).to.equal('root_testA_1');
    expect(ids[3].id).to.equal('root_testB_1');
  });

  it('should render with a fieldset and legend when forceDivWrapper is false', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const schema = {
      type: 'object',
      properties: {
        prop1: {
          type: 'boolean',
        },
        prop2: {
          type: 'boolean',
        },
        prop3: {
          type: 'boolean',
        },
        prop4: {
          type: 'boolean',
        },
      },
    };
    const uiSchema = {
      'ui:title': 'Test title',
      'ui:options': {
        forceDivWrapper: false,
      },
      prop1: { 'ui:title': 'title1' },
      prop2: { 'ui:title': 'title2' },
      prop3: { 'ui:title': 'title3' },
      prop4: { 'ui:title': 'title4' },
    };

    const { container } = render(
      <div>
        <ObjectField
          uiSchema={uiSchema}
          schema={schema}
          idSchema={{}}
          formData={{}}
          onChange={onChange}
          onBlur={onBlur}
        />
      </div>,
    );
    const formDOM = getFormDOM(container);
    const fieldsets = formDOM.querySelectorAll('fieldset');
    const legends = formDOM.querySelectorAll('legend');
    expect(fieldsets.length).to.equal(1);
    expect(legends.length).to.equal(1);
  });
  it('should render without a fieldset and legend when forceDivWrapper is true', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const schema = {
      type: 'object',
      properties: {
        prop1: {
          type: 'boolean',
        },
        prop2: {
          type: 'boolean',
        },
        prop3: {
          type: 'boolean',
        },
        prop4: {
          type: 'boolean',
        },
      },
    };
    const uiSchema = {
      'ui:title': () => <p>Test Title</p>,
      'ui:options': {
        forceDivWrapper: true,
      },
      prop1: { 'ui:title': 'title1' },
      prop2: { 'ui:title': 'title2' },
      prop3: { 'ui:title': 'title3' },
      prop4: { 'ui:title': 'title4' },
    };

    const { container } = render(
      <div>
        <ObjectField
          uiSchema={uiSchema}
          schema={schema}
          idSchema={{}}
          formData={{}}
          onChange={onChange}
          onBlur={onBlur}
        />
      </div>,
    );
    const formDOM = getFormDOM(container);
    const fieldsets = formDOM.querySelectorAll('fieldset');
    const legends = formDOM.querySelectorAll('legend');
    expect(fieldsets.length).to.equal(0);
    expect(legends.length).to.equal(0);
  });

  it('should not wrap legend tags in divs', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const schema = {
      type: 'object',
      properties: {
        prop1: {
          type: 'boolean',
        },
        prop2: {
          type: 'boolean',
        },
        prop3: {
          type: 'boolean',
        },
        prop4: {
          type: 'boolean',
        },
      },
    };
    const uiSchema = {
      'ui:title': () => <p>Test Title</p>,
      'ui:options': {
        forceDivWrapper: true,
      },
      prop1: { 'ui:title': 'title1' },
      prop2: { 'ui:title': 'title2' },
      prop3: { 'ui:title': 'title3' },
      prop4: { 'ui:title': 'title4' },
    };

    const { container } = render(
      <div>
        <ObjectField
          uiSchema={uiSchema}
          schema={schema}
          idSchema={{}}
          formData={{}}
          onChange={onChange}
          onBlur={onBlur}
        />
      </div>,
    );
    const formDOM = getFormDOM(container);
    // There are no `div`s between fieldset and legend
    const divBetween = formDOM.querySelectorAll('fieldset div legend');
    expect(divBetween.length).to.equal(0);
  });
});
