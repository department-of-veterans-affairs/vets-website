import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';
import sinon from 'sinon';

import ArrayField from '../../../src/js/fields/ArrayField';

const registry = {
  definitions: {},
  fields: {
    TitleField: f => f,
    SchemaField: f => f,
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
        viewField: f => f,
      },
    };
    const tree = SkinDeep.shallowRender(
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

    expect(tree.subTree('TitleField').props.title).to.equal(
      uiSchema['ui:title'],
    );
    expect(tree.everySubTree('SchemaField')).not.to.be.empty;
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
        viewField: f => f,
      },
    };
    const formData = [{}, {}];
    const tree = SkinDeep.shallowRender(
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

    expect(tree.everySubTree('SchemaField').length).to.equal(1);
    expect(tree.everySubTree('.va-growable-background').length).to.equal(2);
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
        viewField: f => f,
        showSave: true,
      },
    };
    const formData = [{}];
    const tree = SkinDeep.shallowRender(
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

    expect(tree.everySubTree('SchemaField').length).to.equal(1);
    expect(tree.everySubTree('.va-growable-background').length).to.equal(1);
    const button = tree.everySubTree('button');
    // no remove button
    expect(button.length).to.equal(2);
    expect(button[0].text()).to.equal('Save');
    expect(button[1].text()).to.contain('Add another');
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
        viewField: f => f,
        showSave: true,
      },
    };
    const formData = [{}, {}];
    const tree = SkinDeep.shallowRender(
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

    expect(tree.everySubTree('SchemaField').length).to.equal(1);
    expect(tree.everySubTree('.va-growable-background').length).to.equal(2);
    const button = tree.everySubTree('button');
    expect(button.length).to.equal(4);
    expect(button[0].text()).to.equal('Edit');
    expect(button[1].text()).to.equal('Save');
    expect(button[2].text()).to.equal('Remove');
    expect(button[3].text()).to.contain('Add another');
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
        viewField: f => f,
        showSave: true,
        itemAriaLabel: data => data.field,
        itemName: 'Itemz',
      },
    };
    const formData = [{ field: 'foo' }, { field: 'bar' }];
    const tree = SkinDeep.shallowRender(
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

    expect(tree.everySubTree('SchemaField').length).to.equal(1);
    expect(tree.everySubTree('.va-growable-background').length).to.equal(2);
    const button = tree.everySubTree('button');
    expect(button.length).to.equal(4);
    expect(button[0].text()).to.equal('Edit');
    expect(button[0].props['aria-label']).to.equal('Edit foo');
    expect(button[1].text()).to.equal('Save');
    expect(button[1].props['aria-label']).to.equal('Save bar');
    expect(button[2].text()).to.equal('Remove');
    expect(button[2].props['aria-label']).to.equal('Remove bar');
    expect(button[3].text()).to.contain('Add another');
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
        viewField: f => f,
      },
    };
    const formData = [{ field: true }, {}];
    const errorSchema = [{ field: { __errors: ['Invalid type'] } }];
    const tree = SkinDeep.shallowRender(
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
    expect(tree.everySubTree('SchemaField').length).to.equal(2);
    expect(tree.everySubTree('.va-growable-background').length).to.equal(2);
  });

  describe('should handle', () => {
    let tree;
    let errorSchema;
    let onChange;
    let onBlur;
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
          viewField: f => f,
        },
      };
      const formData = [{}, {}];
      errorSchema = {};
      onChange = sinon.spy();
      onBlur = sinon.spy();
      tree = SkinDeep.shallowRender(
        <ArrayField
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
    });
    it('edit', () => {
      expect(tree.everySubTree('SchemaField').length).to.equal(1);

      tree.getMountedInstance().handleEdit(0);

      expect(tree.everySubTree('SchemaField').length).to.equal(2);
    });
    it('update when valid', () => {
      tree.getMountedInstance().handleEdit(0);

      expect(tree.everySubTree('SchemaField').length).to.equal(2);

      tree.getMountedInstance().handleUpdate(0);

      expect(tree.everySubTree('SchemaField').length).to.equal(1);
    });
    it('not update when invalid', () => {
      tree.getMountedInstance().handleEdit(0);

      expect(tree.everySubTree('SchemaField').length).to.equal(2);

      errorSchema[0] = { __errors: ['Testing'] };

      tree.getMountedInstance().handleUpdate(0);

      expect(tree.everySubTree('SchemaField').length).to.equal(2);
    });
    it('add', () => {
      expect(tree.everySubTree('SchemaField').length).to.equal(1);

      tree.getMountedInstance().handleAdd();

      expect(onChange.firstCall.args[0].length).to.equal(3);
      expect(tree.getMountedInstance().state.editing[2]).to.be.false;
    });
    it('enforces max items by hiding add and displaying an alert', () => {
      const buttons = tree.everySubTree('button');
      const alerts = tree.everySubTree('va-alert');
      expect(buttons.length).to.equal(2);
      expect(buttons[0].text()).to.equal('Edit');
      expect(buttons[1].text()).to.contain('Remove');
      expect(alerts.length).to.equal(1);
      expect(alerts[0].text()).to.equal(
        'You’ve entered the maximum number of items allowed.',
      );
    });
    it('add when invalid', () => {
      errorSchema[1] = { __errors: ['Test error'] };
      tree.getMountedInstance().handleAdd();

      expect(formContext.setTouched.called).to.be.true;
    });
    it('remove', () => {
      expect(tree.everySubTree('SchemaField').length).to.equal(1);
      const instance = tree.getMountedInstance();

      instance.handleRemove(0);

      expect(onChange.firstCall.args[0].length).to.equal(1);
      expect(instance.state.editing.length).to.equal(1);
    });
    it('item change', () => {
      const newItem = {};
      tree.getMountedInstance().onItemChange(0, newItem);

      expect(onChange.called).to.be.true;
    });
  });
  it('should hide add when data has not been changed', () => {
    const idSchema = {};
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
        viewField: f => f,
      },
    };
    const errorSchema = {};
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const tree = SkinDeep.shallowRender(
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

    expect(tree.subTree('button').length).to.be.undefined;
  });
});

describe('should handle generateIndividualItemHeaders boolean', () => {
  let tree;
  let errorSchema;
  let onChange;
  let onBlur;
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
        viewField: f => f,
        generateIndividualItemHeaders: true,
      },
    };
    const formData = [{}, {}];
    errorSchema = {};
    onChange = sinon.spy();
    onBlur = sinon.spy();
    tree = SkinDeep.shallowRender(
      <ArrayField
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
  });
  it('add with generateIndividualItemHeaders true', () => {
    expect(tree.everySubTree('SchemaField').length).to.equal(1);

    tree.getMountedInstance().handleAdd();
    tree.getMountedInstance().handleAdd();
    tree.getMountedInstance().handleEdit(0);

    expect(tree.everySubTree('.vads-u-font-size--h5')[0].text()).to.equal(
      'item',
    );
    expect(tree.everySubTree('.vads-u-font-size--h5')[1].text()).to.equal(
      'New item',
    );
  });
});
