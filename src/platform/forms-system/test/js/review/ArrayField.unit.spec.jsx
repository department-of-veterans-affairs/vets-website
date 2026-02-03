import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';

import ArrayField from '../../../src/js/review/ArrayField';

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
    expect(container.querySelectorAll('form').length).to.equal(0);
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

    expect(container.querySelectorAll('form').length).to.equal(2);
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

    // Click the Add another button to trigger handleAdd
    const addButton = container.querySelector('.add-btn');
    fireEvent.click(addButton);

    expect(
      container.querySelector('.schemaform-array-row-title').textContent,
    ).to.equal('New item name');
    const buttons = container.querySelectorAll('button');
    expect(buttons[2].textContent).to.equal('Add another item name');
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

    // componentDidMount calls handleAdd when arrayData is empty and onReviewPage
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

    // Duplicates should be in edit mode with edit controls
    // Non-duplicates should be in review mode
    // First two items (a, b) are not duplicates - should be in review mode
    // Items 3, 4, 5 (A, a, B) are duplicates - should be in edit mode
    const editingRows = container.querySelectorAll('.va-growable-expanded');
    expect(editingRows.length).to.equal(3);
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

    // Click on Edit va-button to put second item (bar) in edit mode
    const editVaButtons = container.querySelectorAll('va-button');
    // Find the edit button for the second row
    const barEditButton = Array.from(editVaButtons).find(
      btn => btn.getAttribute('label') === 'Edit bar',
    );
    if (barEditButton) {
      fireEvent.click(barEditButton);
    }

    // Click Add another button
    const addButton = container.querySelector('.add-btn');
    fireEvent.click(addButton);

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
    let setData;
    beforeEach(() => {
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
      const arrayData = [{}];
      setData = sinon.spy();
      const rendered = render(
        <ArrayField
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
    });
    it('edit', () => {
      // Initially in review mode
      const form = container.querySelector('form');
      expect(form.querySelector('.review')).to.not.be.null;

      // Click Edit va-button to switch to edit mode
      const editVaButton = container.querySelector('va-button');
      fireEvent.click(editVaButton);

      // Now in edit mode (expanded view)
      expect(container.querySelector('.va-growable-expanded')).to.not.be.null;
    });
    it('update', () => {
      // Click Edit va-button to switch to edit mode
      const editVaButton = container.querySelector('va-button');
      fireEvent.click(editVaButton);
      expect(container.querySelector('.va-growable-expanded')).to.not.be.null;

      // Click update (submit the form)
      const form = container.querySelector('form');
      fireEvent.submit(form);

      // Back to review mode
      expect(container.querySelector('.review')).to.not.be.null;
    });
    it('add', () => {
      expect(container.querySelectorAll('form').length).to.equal(1);

      const addButton = container.querySelector('.add-btn');
      fireEvent.click(addButton);

      expect(container.querySelectorAll('form').length).to.equal(2);
    });
    it('enforces max items', () => {
      const addButton = container.querySelector('.add-btn');
      expect(addButton.disabled).to.be.false;

      fireEvent.click(addButton);

      expect(container.querySelector('.add-btn').disabled).to.be.true;
    });
    it('remove', () => {
      expect(container.querySelectorAll('form').length).to.equal(1);

      // Click Edit va-button to get access to remove button
      const editVaButton = container.querySelector('va-button');
      fireEvent.click(editVaButton);

      // Click remove button
      const removeButton = container.querySelector(
        'button[aria-label="Remove Item"]',
      );
      fireEvent.click(removeButton);

      expect(container.querySelectorAll('form').length).to.equal(0);
    });
    it('setData', () => {
      // The original test called onChange directly on SchemaForm
      // With RTL, we test that setData is called during remove operation
      // First, click edit to get access to the remove button
      const editVaButton = container.querySelector('va-button');
      fireEvent.click(editVaButton);

      // Click remove button which triggers handleRemove
      const removeButton = container.querySelector(
        'button[aria-label="Remove Item"]',
      );
      fireEvent.click(removeButton);

      // handleRemove calls setData
      expect(setData.called).to.be.true;
    });
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
    expect(container.querySelectorAll('form').length).to.equal(0);
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
    expect(container.querySelectorAll('form').length).to.equal(0);
  });
});
