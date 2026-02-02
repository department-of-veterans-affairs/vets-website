import React, { createRef } from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import sinon from 'sinon';

import ArrayField from '../../../src/js/fields/ArrayField';

// Mock ViewField component for testing
const ViewField = (props) => (
  <div data-testid="ViewField" data-form-data={JSON.stringify(props.formData)} />
);

const registry = {
  definitions: {},
  fields: {
    TitleField: props => (
      <div data-testid="TitleField" data-title={props.title} />
    ),
    SchemaField: () => <div data-testid="SchemaField" />,
  },
};
const formContext = {
  setTouched: sinon.spy(),
};
const requiredSchema = {};

describe('Schemaform <ArrayField>', () => {
  it('should render', () => {
    const idSchema = {
      $id: 'field',
    };
    const schema = {
      type: 'array',
      items: [],
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
      'ui:options': {
        viewField: ViewField,
      },
    };
    const { container } = render(
      <ArrayField
        schema={schema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        registry={registry}
        formContext={formContext}
        onChange={f => f}
        requiredSchema={requiredSchema}
      />,
    );

    expect(
      container
        .querySelector('[data-testid="TitleField"]')
        .getAttribute('data-title'),
    ).to.equal(uiSchema['ui:title']);
    expect(container.querySelectorAll('[data-testid="SchemaField"]')).not.to.be
      .empty;
  });
  it('should render items', () => {
    const idSchema = {
      $id: 'field',
    };
    const schema = {
      type: 'array',
      items: [],
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
      'ui:options': {
        viewField: ViewField,
      },
    };
    const formData = [{}, {}];
    const { container } = render(
      <ArrayField
        schema={schema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        registry={registry}
        formData={formData}
        formContext={formContext}
        onChange={f => f}
        requiredSchema={requiredSchema}
        errorSchema={[]}
      />,
    );

    expect(
      container.querySelectorAll('[data-testid="SchemaField"]').length,
    ).to.equal(1);
    expect(container.querySelectorAll('.va-growable-background').length).to.equal(
      2,
    );
  });
  it('should render save button with showSave option', () => {
    const idSchema = {
      $id: 'field',
    };
    const schema = {
      type: 'array',
      items: [],
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
      'ui:options': {
        viewField: ViewField,
        showSave: true,
      },
    };
    const formData = [{}];
    const { container } = render(
      <ArrayField
        schema={schema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        registry={registry}
        formData={formData}
        formContext={formContext}
        onChange={f => f}
        requiredSchema={requiredSchema}
        errorSchema={[]}
      />,
    );

    expect(
      container.querySelectorAll('[data-testid="SchemaField"]').length,
    ).to.equal(1);
    expect(container.querySelectorAll('.va-growable-background').length).to.equal(
      1,
    );
    const button = container.querySelectorAll('button');
    // no remove button
    expect(button.length).to.equal(1);
    expect(container.innerHTML).to.contain('text="Save"');
    expect(button[0].textContent).to.contain('Add another');
  });
  it('should render save button with showSave option', () => {
    const idSchema = {
      $id: 'field',
    };
    const schema = {
      type: 'array',
      items: [],
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
      'ui:options': {
        viewField: ViewField,
        showSave: true,
      },
    };
    const formData = [{}, {}];
    const { container } = render(
      <ArrayField
        schema={schema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        registry={registry}
        formData={formData}
        formContext={formContext}
        onChange={f => f}
        requiredSchema={requiredSchema}
        errorSchema={[]}
      />,
    );

    expect(
      container.querySelectorAll('[data-testid="SchemaField"]').length,
    ).to.equal(1);
    expect(container.querySelectorAll('.va-growable-background').length).to.equal(
      2,
    );
    const button = container.querySelectorAll('button');
    expect(button.length).to.equal(1);

    expect(container.innerHTML).to.contain('text="Edit"');
    expect(container.innerHTML).to.contain('text="Remove"');
    expect(container.innerHTML).to.contain('text="Save"');

    expect(button[0].textContent).to.contain('Add another');
  });

  it('should render unique aria-labels on buttons from ui option key in item', () => {
    const idSchema = {
      $id: 'field',
    };
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
        'ui:options': {
          itemAriaLabel: data => data.field,
        },
      },
      'ui:options': {
        viewField: ViewField,
        showSave: true,
        itemAriaLabel: data => data.field,
        itemName: 'Itemz',
      },
    };
    const formData = [{ field: 'foo' }, { field: 'bar' }];
    const { container } = render(
      <ArrayField
        schema={schema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        registry={registry}
        formData={formData}
        formContext={formContext}
        onChange={f => f}
        requiredSchema={requiredSchema}
        errorSchema={[]}
      />,
    );

    expect(
      container.querySelectorAll('[data-testid="SchemaField"]').length,
    ).to.equal(1);
    expect(container.querySelectorAll('.va-growable-background').length).to.equal(
      2,
    );
    const button = container.querySelectorAll('button');
    expect(button.length).to.equal(1);

    expect(container.innerHTML).to.contain('label="Edit foo');
    expect(container.innerHTML).to.contain('label="Save bar');
    expect(container.innerHTML).to.contain('label="Remove bar');

    expect(button[0].textContent).to.contain('Add another');
  });

  it('should render invalid items', () => {
    const idSchema = {
      $id: 'field',
    };
    const schema = {
      type: 'array',
      items: [],
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
      'ui:options': {
        viewField: ViewField,
      },
    };
    const formData = [{ field: true }, {}];
    const errorSchema = [{ field: { __errors: ['Invalid type'] } }];
    const { container } = render(
      <ArrayField
        schema={schema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        registry={registry}
        formData={formData}
        formContext={formContext}
        onChange={f => f}
        requiredSchema={requiredSchema}
        errorSchema={errorSchema}
      />,
    );

    // First SchemaField is the invalid item, second is normally in edit mode
    expect(
      container.querySelectorAll('[data-testid="SchemaField"]').length,
    ).to.equal(2);
    expect(container.querySelectorAll('.va-growable-background').length).to.equal(
      2,
    );
  });

  describe('should handle', () => {
    let container;
    let errorSchema;
    let onChange;
    let onBlur;
    let ref;
    beforeEach(() => {
      const idSchema = {
        $id: 'root_field',
      };
      const schema = {
        type: 'array',
        items: [],
        maxItems: 2,
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
        'ui:options': {
          viewField: ViewField,
        },
      };
      const formData = [{}, {}];
      errorSchema = {};
      onChange = sinon.spy();
      onBlur = sinon.spy();
      ref = createRef();
      const result = render(
        <ArrayField
          ref={ref}
          schema={schema}
          errorSchema={errorSchema}
          uiSchema={uiSchema}
          idSchema={idSchema}
          registry={registry}
          formData={formData}
          onChange={onChange}
          onBlur={onBlur}
          formContext={formContext}
          requiredSchema={requiredSchema}
        />,
      );
      container = result.container;
    });
    it('edit', () => {
      expect(
        container.querySelectorAll('[data-testid="SchemaField"]').length,
      ).to.equal(1);

      ref.current.handleEdit(0);

      expect(
        container.querySelectorAll('[data-testid="SchemaField"]').length,
      ).to.equal(2);
    });
    it('update when valid', () => {
      ref.current.handleEdit(0);

      expect(
        container.querySelectorAll('[data-testid="SchemaField"]').length,
      ).to.equal(2);

      ref.current.handleUpdate(0);

      expect(
        container.querySelectorAll('[data-testid="SchemaField"]').length,
      ).to.equal(1);
    });
    it('not update when invalid', () => {
      ref.current.handleEdit(0);

      expect(
        container.querySelectorAll('[data-testid="SchemaField"]').length,
      ).to.equal(2);

      errorSchema[0] = { __errors: ['Testing'] };

      ref.current.handleUpdate(0);

      expect(
        container.querySelectorAll('[data-testid="SchemaField"]').length,
      ).to.equal(2);
    });
    it('add', () => {
      expect(
        container.querySelectorAll('[data-testid="SchemaField"]').length,
      ).to.equal(1);

      ref.current.handleAdd();

      expect(onChange.firstCall.args[0].length).to.equal(3);
      expect(ref.current.state.editing[2]).to.be.false;
    });
    it('enforces max items by hiding add and displaying an alert', () => {
      const alerts = container.querySelectorAll('va-alert');

      expect(container.innerHTML).to.contain('label="Edit item');
      expect(container.innerHTML).to.contain('label="Remove');

      expect(alerts.length).to.equal(1);
      // Check the text content contains the expected message (handles quote variations)
      expect(alerts[0].textContent).to.contain('entered the maximum number of items');
    });
    it('add when invalid', () => {
      errorSchema[1] = { __errors: ['Test error'] };
      ref.current.handleAdd();

      expect(formContext.setTouched.called).to.be.true;
    });
    it('remove', () => {
      expect(
        container.querySelectorAll('[data-testid="SchemaField"]').length,
      ).to.equal(1);

      ref.current.handleRemove(0);

      expect(onChange.firstCall.args[0].length).to.equal(1);
      expect(ref.current.state.editing.length).to.equal(1);
    });
    it('item change', () => {
      const newItem = {};
      ref.current.onItemChange(0, newItem);

      expect(onChange.called).to.be.true;
    });
  });
  it('should hide add when data has not been changed', () => {
    const idSchema = {};
    const schema = {
      type: 'array',
      items: [],
      maxItems: 1, // Add maxItems to limit to 1 item
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
      'ui:options': {
        viewField: ViewField,
      },
    };
    const errorSchema = {};
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const { container } = render(
      <ArrayField
        schema={schema}
        errorSchema={errorSchema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        registry={registry}
        onChange={onChange}
        onBlur={onBlur}
        formContext={formContext}
        requiredSchema={requiredSchema}
      />,
    );

    // With maxItems: 1 and a default item created, the add button should be hidden
    expect(container.querySelector('button')).to.be.null;
  });
});

describe('should handle generateIndividualItemHeaders boolean', () => {
  let container;
  let errorSchema;
  let onChange;
  let onBlur;
  let ref;
  beforeEach(() => {
    const idSchema = {
      $id: 'root_field',
    };
    const schema = {
      type: 'array',
      items: [],
      maxItems: 2,
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
      'ui:options': {
        viewField: ViewField,
        generateIndividualItemHeaders: true,
      },
    };
    const formData = [{}, {}];
    errorSchema = {};
    onChange = sinon.spy();
    onBlur = sinon.spy();
    ref = createRef();
    const result = render(
      <ArrayField
        ref={ref}
        schema={schema}
        errorSchema={errorSchema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        registry={registry}
        formData={formData}
        onChange={onChange}
        onBlur={onBlur}
        formContext={formContext}
        requiredSchema={requiredSchema}
      />,
    );
    container = result.container;
  });
  it('add with generateIndividualItemHeaders true', () => {
    expect(
      container.querySelectorAll('[data-testid="SchemaField"]').length,
    ).to.equal(1);

    ref.current.handleAdd();
    ref.current.handleAdd();
    ref.current.handleEdit(0);

    expect(
      container.querySelectorAll('.vads-u-font-size--h5')[0].textContent,
    ).to.equal('item');
    expect(
      container.querySelectorAll('.vads-u-font-size--h5')[1].textContent,
    ).to.equal('New item');
  });
});
