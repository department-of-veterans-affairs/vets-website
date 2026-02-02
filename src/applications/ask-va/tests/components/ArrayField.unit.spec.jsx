import { expect } from 'chai';
import React, { createRef } from 'react';
import sinon from 'sinon';
import { render } from '@testing-library/react';

import ArrayField from '../../components/ArrayField';

const registry = {
  definitions: {},
  fields: {
    TitleField: f => f,
    SchemaField: f => f,
  },
};
const formContext = {};
const requiredSchema = {};

describe('Schemaform review <ArrayField>', () => {
  it('should render', () => {
    const idSchema = {};
    const schema = {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          field: {
            type: 'string',
          },
        },
      },
    };
    const uiSchema = {
      'ui:title': 'List of things',
      items: {},
      'ui:options': {
        viewField: f => f,
      },
    };
    const arrayData = [];
    const { container } = render(
      <ArrayField
        pageKey="page1"
        arrayData={arrayData}
        path={['thingList']}
        schema={schema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        registry={registry}
        formContext={formContext}
        pageTitle=""
        requiredSchema={requiredSchema}
      />,
    );

    expect(
      container.querySelector('.form-review-panel-page-header').textContent,
    ).to.equal(uiSchema['ui:title']);
    expect(container.querySelectorAll('SchemaForm').length).to.equal(0);
  });
  it('should render items', () => {
    const idSchema = {};
    const schema = {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          field: {
            type: 'string',
          },
        },
      },
      additionalItems: {},
    };
    const uiSchema = {
      'ui:title': 'List of things',
      items: {},
      'ui:options': {
        viewField: f => f,
      },
    };
    const arrayData = [{}, {}];
    const { container } = render(
      <ArrayField
        pageKey="page1"
        arrayData={arrayData}
        path={['thingList']}
        schema={schema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        registry={registry}
        formContext={formContext}
        pageTitle=""
        requiredSchema={requiredSchema}
      />,
    );

    // Check for va-growable-background divs (one for each item in review mode)
    expect(
      container.querySelectorAll('.va-growable-background').length,
    ).to.equal(2);
  });
  it('should render item name', () => {
    const idSchema = {};
    const schema = {
      type: 'array',
      items: [
        {
          type: 'object',
          properties: {
            field: {
              type: 'string',
            },
          },
        },
        {
          type: 'object',
          properties: {
            field: {
              type: 'string',
            },
          },
        },
      ],
      additionalItems: {
        type: 'object',
        properties: {
          field: {
            type: 'string',
          },
        },
      },
    };
    const uiSchema = {
      'ui:title': 'List of things',
      items: {},
      'ui:options': {
        viewField: f => f,
        itemName: 'item name',
      },
    };
    const arrayData = [{}, {}];
    const { container } = render(
      <ArrayField
        pageKey="page1"
        arrayData={arrayData}
        path={['thingList']}
        schema={schema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        registry={registry}
        formContext={formContext}
        pageTitle=""
        requiredSchema={requiredSchema}
      />,
    );

    // In review mode with 2 items, we should have 2 va-growable-background divs
    const items = container.querySelectorAll('.va-growable-background');
    expect(items.length).to.equal(2);

    // Check that the add button text contains the itemName
    const buttons = container.querySelectorAll('button');
    const addButton = Array.from(buttons).find(btn =>
      btn.textContent.includes('Add another'),
    );
    expect(addButton).to.exist;
    expect(addButton.textContent).to.equal('Add another item name');
  });

  it('should call handleAdd in edit mode with no data', () => {
    const schema = {
      type: 'array',
      items: [
        {
          type: 'object',
          properties: {
            field: {
              type: 'string',
            },
          },
        },
        {
          type: 'object',
          properties: {
            field: {
              type: 'string',
            },
          },
        },
      ],
      additionalItems: {
        type: 'object',
        properties: {
          field: {
            type: 'string',
          },
        },
      },
    };
    const uiSchema = {
      'ui:title': 'List of things',
      items: {},
      'ui:options': {
        viewField: f => f,
        itemName: 'item name',
      },
    };
    // With onReviewPage: true and empty arrayData, componentDidMount calls handleAdd
    const { container } = render(
      <ArrayField
        pageKey="page1"
        arrayData={[]}
        path={['thingList']}
        schema={schema}
        uiSchema={uiSchema}
        idSchema={{}}
        registry={registry}
        formContext={{ onReviewPage: true }}
        pageTitle=""
        editing={false} // Not already in edit mode
        requiredSchema={requiredSchema}
      />,
    );
    // componentDidMount is automatically called on render, which triggers handleAdd
    expect(
      container.querySelector('.schemaform-array-row-title').textContent,
    ).to.equal('New item name');
    const buttons = container.querySelectorAll('button');
    expect(buttons[2].textContent).to.equal('Add another item name');
  });

  it('should render array warning', () => {
    // If it's a BasicArrayField with a set minItems, make sure it doesn't break
    //  if no items are found; it should render a validation warning instead.
    const idSchema = {};
    const schema = {
      type: 'array',
      minItems: 1,
      items: [
        {
          type: 'object',
          properties: {
            field: {
              type: 'string',
            },
          },
        },
        {
          type: 'object',
          properties: {
            field: {
              type: 'string',
            },
          },
        },
      ],
      additionalItems: {
        type: 'object',
        properties: {
          field: {
            type: 'string',
          },
        },
      },
    };
    const uiSchema = {
      'ui:title': 'List of things',
      'ui:field': 'BasicArrayField',
      items: {},
      'ui:options': {
        viewField: f => f,
        itemName: 'Item name',
      },
    };
    const arrayData = undefined;
    const ref = createRef();
    const { container, rerender } = render(
      <ArrayField
        ref={ref}
        pageKey="page1"
        arrayData={arrayData}
        path={['thingList']}
        schema={schema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        registry={registry}
        formContext={formContext}
        pageTitle=""
        requiredSchema={requiredSchema}
      />,
    );

    // Call handleAdd via ref and force re-render
    ref.current.handleAdd();
    // Force re-render to reflect state change
    rerender(
      <ArrayField
        ref={ref}
        pageKey="page1"
        arrayData={arrayData}
        path={['thingList']}
        schema={schema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        registry={registry}
        formContext={formContext}
        pageTitle=""
        requiredSchema={requiredSchema}
      />,
    );

    expect(
      container.querySelectorAll('.schemaform-review-array-error').length,
    ).to.not.equal(0);
  });
  it('should render start in edit mode for duplicate items', () => {
    const idSchema = {};
    const schema = {
      type: 'array',
      items: [
        {
          type: 'object',
          properties: {
            field: {
              type: 'string',
            },
          },
        },
        {
          type: 'object',
          properties: {
            field: {
              type: 'string',
            },
          },
        },
      ],
      additionalItems: {
        type: 'object',
        properties: {
          field: {
            type: 'string',
          },
        },
      },
    };
    const uiSchema = {
      'ui:title': 'List of things',
      items: {
        test: {
          type: 'string',
        },
      },
      'ui:options': {
        viewField: f => f,
        itemName: 'Item name',
        duplicateKey: 'field',
      },
    };
    // Duplicates are case insensitive
    const arrayData = [
      { field: 'a' },
      { field: 'b' },
      { field: 'A' },
      { field: 'a' },
      { field: 'B' },
    ];
    const ref = createRef();
    render(
      <ArrayField
        ref={ref}
        pageKey="page1"
        arrayData={arrayData}
        path={['thingList']}
        schema={schema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        registry={registry}
        formContext={formContext}
        pageTitle=""
        requiredSchema={requiredSchema}
      />,
    );

    expect(ref.current.state.editing).to.deep.equal([
      false,
      false,
      true,
      true,
      true,
    ]);
  });

  it('should render unique aria-labels on buttons from ui option key in item', () => {
    const idSchema = {};
    const schema = {
      type: 'array',
      items: [
        {
          type: 'object',
          properties: {
            field: {
              type: 'string',
            },
          },
        },
        {
          type: 'object',
          properties: {
            field: {
              type: 'string',
            },
          },
        },
      ],
      additionalItems: {
        type: 'object',
        properties: {
          field: {
            type: 'string',
          },
        },
      },
    };
    const uiSchema = {
      'ui:title': 'List of things',
      items: {
        test: {},
        'ui:options': {
          itemAriaLabel: data => data.field,
        },
      },
      'ui:options': {
        viewField: f => f,
        itemAriaLabel: data => data.field,
        itemName: 'Itemz',
      },
    };
    const arrayData = [{ field: 'foo' }, { field: 'bar' }];
    const ref = createRef();
    const { container, rerender } = render(
      <ArrayField
        ref={ref}
        pageKey="page1"
        arrayData={arrayData}
        path={['thingList']}
        schema={schema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        registry={registry}
        formContext={formContext}
        pageTitle=""
        requiredSchema={requiredSchema}
      />,
    );

    ref.current.handleEdit(1, true);
    ref.current.handleAdd();
    // Force re-render to reflect state changes
    rerender(
      <ArrayField
        ref={ref}
        pageKey="page1"
        arrayData={arrayData}
        path={['thingList']}
        schema={schema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        registry={registry}
        formContext={formContext}
        pageTitle=""
        requiredSchema={requiredSchema}
      />,
    );

    expect(
      container.querySelector('.schemaform-array-row-title').textContent,
    ).to.equal('New Itemz');
    const buttons = container.querySelectorAll('button');
    expect(buttons[0].getAttribute('aria-label')).to.equal('Update bar');
    expect(buttons[1].getAttribute('aria-label')).to.equal('Remove bar');
    expect(buttons[2].getAttribute('aria-label')).to.equal('Update Itemz');
    expect(buttons[3].getAttribute('aria-label')).to.equal('Remove Itemz');
    expect(buttons[4].textContent).to.equal('Add another Itemz');
  });

  describe('should handle', () => {
    let container;
    let ref;
    let setData;
    let rerenderFn;
    const schema = {
      type: 'array',
      maxItems: 2,
      items: [
        {
          type: 'object',
          properties: {
            field: {
              type: 'string',
            },
          },
        },
      ],
      additionalItems: {
        type: 'object',
        properties: {
          field: {
            type: 'string',
          },
        },
      },
    };
    const uiSchema = {
      'ui:title': 'List of things',
      items: {},
      'ui:options': {
        viewField: f => f,
      },
    };

    beforeEach(() => {
      const arrayData = [{}];
      setData = sinon.spy();
      ref = createRef();
      const rendered = render(
        <ArrayField
          ref={ref}
          pageKey="page1"
          setData={setData}
          arrayData={arrayData}
          path={['thingList']}
          schema={schema}
          uiSchema={uiSchema}
          registry={registry}
          formContext={formContext}
          pageTitle=""
          requiredSchema={requiredSchema}
        />,
      );
      container = rendered.container;
      rerenderFn = rendered.rerender;
    });

    it('edit', () => {
      // Initially in review mode - check for the row div in review mode
      const rowDiv = container.querySelector('.row.small-collapse');
      expect(rowDiv).to.exist;
      // In review mode, the row should be inside a va-growable-background
      const reviewDiv = container.querySelector(
        '.va-growable-background .row.small-collapse',
      );
      expect(reviewDiv).to.exist;

      // Trigger edit by calling onEdit callback
      ref.current.handleEdit(0, true);
      rerenderFn(
        <ArrayField
          ref={ref}
          pageKey="page1"
          setData={setData}
          arrayData={[{}]}
          path={['thingList']}
          schema={schema}
          uiSchema={uiSchema}
          registry={registry}
          formContext={formContext}
          pageTitle=""
          requiredSchema={requiredSchema}
        />,
      );

      // After edit, should have a schemaform-array-row (edit mode row)
      const editRow = container.querySelector('.schemaform-array-row');
      expect(editRow).to.exist;
    });

    it('update', () => {
      // Enter edit mode
      ref.current.handleEdit(0, true);
      rerenderFn(
        <ArrayField
          ref={ref}
          pageKey="page1"
          setData={setData}
          arrayData={[{}]}
          path={['thingList']}
          schema={schema}
          uiSchema={uiSchema}
          registry={registry}
          formContext={formContext}
          pageTitle=""
          requiredSchema={requiredSchema}
        />,
      );
      // Should have edit row when in edit mode
      const editRow = container.querySelector('.schemaform-array-row');
      expect(editRow).to.exist;

      // Submit/save
      ref.current.handleSave(0, 'thingList');
      rerenderFn(
        <ArrayField
          ref={ref}
          pageKey="page1"
          setData={setData}
          arrayData={[{}]}
          path={['thingList']}
          schema={schema}
          uiSchema={uiSchema}
          registry={registry}
          formContext={formContext}
          pageTitle=""
          requiredSchema={requiredSchema}
        />,
      );

      // After save, should be back in review mode with va-growable-background
      const reviewDiv = container.querySelector('.va-growable-background');
      expect(reviewDiv).to.exist;
    });

    it('add', () => {
      // Should have 1 item initially
      const initialRowDivs = container.querySelectorAll(
        '.va-growable > .va-growable-background',
      );
      expect(initialRowDivs.length).to.equal(1);

      ref.current.handleAdd();

      // After handleAdd, the component's state should have 2 items
      expect(ref.current.state.items.length).to.equal(2);
      expect(ref.current.state.editing.length).to.equal(2);
      expect(ref.current.state.editing[1]).to.be.true; // New item should be in edit mode

      // Rerender to see the updated UI
      rerenderFn(
        <ArrayField
          ref={ref}
          pageKey="page1"
          setData={setData}
          arrayData={ref.current.state.items}
          path={['thingList']}
          schema={schema}
          uiSchema={uiSchema}
          registry={registry}
          formContext={formContext}
          pageTitle=""
          requiredSchema={requiredSchema}
        />,
      );

      // After adding, both items should be visible
      const allRowDivs = container.querySelectorAll(
        '.va-growable > .va-growable-background',
      );
      expect(allRowDivs.length).to.equal(2);
    });

    it('enforces max items', () => {
      expect(container.querySelector('.add-btn').disabled).to.be.false;

      ref.current.handleAdd();

      // After handleAdd, rerender with the updated state items
      rerenderFn(
        <ArrayField
          ref={ref}
          pageKey="page1"
          setData={setData}
          arrayData={ref.current.state.items}
          path={['thingList']}
          schema={schema}
          uiSchema={uiSchema}
          registry={registry}
          formContext={formContext}
          pageTitle=""
          requiredSchema={requiredSchema}
        />,
      );

      // After adding to maxItems, the button should be disabled
      expect(container.querySelector('.add-btn').disabled).to.be.true;
    });
  });

  it('should update state when props change', () => {
    // Since the ArrayField component can have render issues in tests,
    // we'll test the state update logic by directly testing the
    // UNSAFE_componentWillReceiveProps method behavior

    const componentInstance = {
      props: {
        arrayData: [],
      },
      state: {
        items: [],
        editing: [],
      },
      setState(newState) {
        // Mock setState - just update our state object
        Object.assign(this.state, newState);
      },
    };

    // Bind the method to our mock instance
    const ArrayFieldClass = require('../../components/ArrayField').default;
    const methodToTest =
      ArrayFieldClass.prototype.UNSAFE_componentWillReceiveProps;

    // Test: Update props with new arrayData
    const newProps = {
      ...componentInstance.props,
      arrayData: [{ field: 'new item' }, { field: 'another item' }],
    };

    methodToTest.call(componentInstance, newProps);

    // Verify state was updated correctly
    expect(componentInstance.state.items.length).to.equal(2);
    expect(componentInstance.state.items[0].field).to.equal('new item');
    expect(componentInstance.state.items[1].field).to.equal('another item');
    expect(componentInstance.state.editing).to.eql([false, false]);
  });
  it('should render reviewTitle first', () => {
    const idSchema = {};
    const schema = {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          field: {
            type: 'string',
          },
        },
      },
    };
    const uiSchema = {
      'ui:title': 'List of things',
      items: {},
      'ui:options': {
        viewField: f => f,
        reviewTitle: 'My List',
      },
    };
    const arrayData = [];
    const { container } = render(
      <ArrayField
        pageKey="page1"
        arrayData={arrayData}
        path={['thingList']}
        schema={schema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        registry={registry}
        formContext={formContext}
        pageTitle="Page Title"
        requiredSchema={requiredSchema}
      />,
    );

    expect(
      container.querySelector('.form-review-panel-page-header').textContent,
    ).to.equal(uiSchema['ui:options'].reviewTitle);
    expect(container.querySelectorAll('SchemaForm').length).to.equal(0);
  });
  it('should render page title', () => {
    const idSchema = {};
    const schema = {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          field: {
            type: 'string',
          },
        },
      },
    };
    const uiSchema = {
      'ui:title': ' ',
      items: {},
      'ui:options': {
        viewField: f => f,
      },
    };
    const arrayData = [];
    const { container } = render(
      <ArrayField
        pageKey="page1"
        arrayData={arrayData}
        path={['thingList']}
        schema={schema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        registry={registry}
        formContext={formContext}
        pageTitle="Page Title"
        requiredSchema={requiredSchema}
      />,
    );

    expect(
      container.querySelector('.form-review-panel-page-header').textContent,
    ).to.equal('Page Title');
    expect(container.querySelectorAll('SchemaForm').length).to.equal(0);
  });
});
