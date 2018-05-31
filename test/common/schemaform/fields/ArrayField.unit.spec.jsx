import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';
import sinon from 'sinon';

import ArrayField from '../../../../src/applications/common/schemaform/fields/ArrayField';

const registry = {
  definitions: {},
  fields: {
    TitleField: f => f,
    SchemaField: f => f
  }
};
const formContext = {
  setTouched: sinon.spy()
};
const requiredSchema = {};
const errorSchema = {
  0: { __errors: [] },
  1: { __errors: [] }
};

describe('Schemaform <ArrayField>', () => {
  it('should render', () => {
    const idSchema = {
      $id: 'field'
    };
    const schema = {
      type: 'array',
      items: [],
      additionalItems: {
        type: 'object',
        properties: {
          field: {
            type: 'string'
          }
        }
      }
    };
    const uiSchema = {
      'ui:title': 'List of things',
      'ui:options': {
        viewField: f => f
      }
    };
    const tree = SkinDeep.shallowRender(
      <ArrayField
        schema={schema}
        uiSchema={uiSchema}
        errorSchema={errorSchema}
        idSchema={idSchema}
        registry={registry}
        formContext={formContext}
        onChange={f => f}
        requiredSchema={requiredSchema}/>
    );

    expect(tree.subTree('TitleField').props.title).to.equal(uiSchema['ui:title']);
    expect(tree.everySubTree('SchemaField')).not.to.be.empty;
    expect(tree.everySubTree('.va-growable-background')).to.be.empty;
  });
  it('should render an empty form', () => {
    const idSchema = {
      $id: 'field'
    };
    const schema = {
      type: 'array',
      items: [],
      additionalItems: {
        type: 'object',
        properties: {
          field: {
            type: 'string'
          }
        }
      }
    };
    const uiSchema = {
      'ui:title': 'List of things',
      'ui:options': {
        viewField: f => f
      }
    };
    const tree = SkinDeep.shallowRender(
      <ArrayField
        schema={schema}
        uiSchema={uiSchema}
        errorSchema={errorSchema}
        idSchema={idSchema}
        registry={registry}
        formContext={formContext}
        onChange={f => f}
        requiredSchema={requiredSchema}/>
    );
    expect(tree.everySubTree('SchemaField').length).to.equal(1);
  });
  it('should render valid prefilled items', () => {
    const idSchema = {
      $id: 'field'
    };
    const schema = {
      type: 'array',
      items: [],
      additionalItems: {
        type: 'object',
        properties: {
          field: {
            type: 'string'
          }
        }
      }
    };
    const uiSchema = {
      'ui:title': 'List of things',
      'ui:options': {
        viewField: f => f
      }
    };
    const formData = [
      { field: 'information' },
      { field: 'information' }
    ];

    const tree = SkinDeep.shallowRender(
      <ArrayField
        schema={schema}
        uiSchema={uiSchema}
        errorSchema={errorSchema}
        idSchema={idSchema}
        registry={registry}
        formContext={formContext}
        formData={formData}
        onChange={f => f}
        requiredSchema={requiredSchema}/>
    );
    expect(tree.everySubTree('.va-growable-background').length).to.equal(2);
  });
  it('should render invalid prefilled items', () => {
    const idSchema = {
      $id: 'field'
    };
    const schema = {
      type: 'array',
      items: [],
      additionalItems: {
        type: 'object',
        properties: {
          field: {
            type: 'string'
          }
        }
      }
    };
    const ViewField = f => f;
    const uiSchema = {
      'ui:title': 'List of things',
      'ui:options': {
        viewField: ViewField
      }
    };
    const fullErrorSchema = {
      0: { __errors: ['Test error'] },
      1: { __errors: [] }
    };
    const formData = [
      { field: 'information' },
      { field: 'information' }
    ];

    const tree = SkinDeep.shallowRender(
      <ArrayField
        schema={schema}
        uiSchema={uiSchema}
        errorSchema={fullErrorSchema}
        idSchema={idSchema}
        registry={registry}
        formContext={formContext}
        formData={formData}
        onChange={f => f}
        requiredSchema={requiredSchema}/>
    );

    expect(tree.everySubTree('SchemaField').length).to.equal(1);
    expect(tree.everySubTree('ViewField').length).to.equal(1);
  });
  describe('should handle', () => {
    let tree;
    let onChange;
    let onBlur;
    beforeEach(() => {
      const idSchema = {
        $id: 'root_field'
      };
      const schema = {
        type: 'array',
        items: [],
        additionalItems: {
          type: 'object',
          properties: {
            field: {
              type: 'string'
            }
          }
        }
      };
      const ViewField = f => f;
      const uiSchema = {
        'ui:title': 'List of things',
        'ui:options': {
          viewField: ViewField
        }
      };
      errorSchema[0] = { __errors: [] };
      errorSchema[1] = { __errors: [] };
      const formData = [
        { field: 'information' },
        { field: 'information' }
      ];
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
          requiredSchema={requiredSchema}/>
      );
    });
    it('edit', () => {
      expect(tree.everySubTree('ViewField').length).to.equal(2);

      tree.getMountedInstance().handleEdit(0);

      expect(tree.everySubTree('SchemaField').length).to.equal(1);
    });
    it('update when valid', () => {
      tree.getMountedInstance().handleEdit(0);

      expect(tree.everySubTree('SchemaField').length).to.equal(1);

      tree.getMountedInstance().handleUpdate(0);

      expect(tree.everySubTree('SchemaField').length).to.equal(0);
    });
    it('not update when invalid', () => {
      tree.getMountedInstance().handleEdit(0);

      expect(tree.everySubTree('SchemaField').length).to.equal(1);

      errorSchema[0] = { __errors: ['Testing'] };

      tree.getMountedInstance().handleUpdate(0);

      expect(tree.everySubTree('SchemaField').length).to.equal(1);
    });
    it('add', () => {
      expect(tree.everySubTree('ViewField').length).to.equal(2);

      tree.getMountedInstance().handleAdd();

      expect(onChange.firstCall.args[0].length).to.equal(3);
      expect(tree.getMountedInstance().state.itemModes[2]).to.equal('adding');
    });
    it('add when invalid', () => {
      formContext.setTouched.reset();
      errorSchema[1] = { __errors: ['Test error'] };
      tree.getMountedInstance().handleAdd();

      expect(formContext.setTouched.called).to.be.true;
    });
    it('remove', () => {
      expect(tree.everySubTree('ViewField').length).to.equal(2);
      const instance = tree.getMountedInstance();
      instance.handleEdit(0);
      instance.handleRemove(0);

      expect(onChange.firstCall.args[0].length).to.equal(1);
      expect(instance.state.itemModes.length).to.equal(1);
    });
    it('item change', () => {
      const newItem = {};
      tree.getMountedInstance().onItemChange(0, newItem);

      expect(onChange.called).to.be.true;
    });
  });
  it('should disable add when data has not been changed', () => {
    const idSchema = {};
    const schema = {
      type: 'array',
      items: [],
      additionalItems: {
        type: 'object',
        properties: {
          field: {
            type: 'string'
          }
        }
      }
    };
    const uiSchema = {
      'ui:title': 'List of things',
      'ui:options': {
        viewField: f => f
      }
    };
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
        requiredSchema={requiredSchema}/>
    );

    expect(tree.subTree('button').props.disabled).to.be.true;
  });
});
