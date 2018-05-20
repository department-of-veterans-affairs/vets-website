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
const errorSchema = {};

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
  it('should render items', () => {
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
        formData={formData}
        formContext={formContext}
        onChange={f => f}
        requiredSchema={requiredSchema}/>
    );
    expect(tree.everySubTree('SchemaField').length).to.equal(1);
    expect(tree.everySubTree('.va-growable-background').length).to.equal(2);
  });
  describe('should handle', () => {
    let tree;
    let fullErrorSchema;
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
      fullErrorSchema = {};
      onChange = sinon.spy();
      onBlur = sinon.spy();
      tree = SkinDeep.shallowRender(
        <ArrayField
          schema={schema}
          errorSchema={fullErrorSchema}
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

      fullErrorSchema[0] = { __errors: ['Testing'] };

      tree.getMountedInstance().handleUpdate(0);

      expect(tree.everySubTree('SchemaField').length).to.equal(2);
    });
    it('add', () => {
      expect(tree.everySubTree('SchemaField').length).to.equal(1);

      tree.getMountedInstance().handleAdd();

      expect(onChange.firstCall.args[0].length).to.equal(3);
      expect(tree.getMountedInstance().state.editing[2]).to.equal('adding');
    });
    it('add when invalid', () => {
      formContext.setTouched.reset();
      fullErrorSchema[1] = { __errors: ['Test error'] };
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
  it('should render review mode when showLastItemInViewMode is configured and has valid data', () => {
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
    const formData = [
      { field: 'information' }
    ];
    const ViewField = f => f;
    const uiSchema = {
      'ui:title': 'List of things',
      'ui:options': {
        showLastItemInViewMode: true,
        viewField: ViewField
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
        formData={formData}
        formContext={formContext}
        requiredSchema={requiredSchema}/>
    );
    expect(tree.everySubTree('SchemaField').length).to.equal(0);
    expect(tree.everySubTree('ViewField').length).to.equal(1);
  });
  it('should render edit mode when showLastItemInViewMode is configured and has no data', () => {
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
    const formData = [];
    const uiSchema = {
      'ui:title': 'List of things',
      'ui:options': {
        showLastItemInViewMode: true,
        viewField: f => f
      }
    };
    const fullErrorSchema = {};
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <ArrayField
        schema={schema}
        errorSchema={fullErrorSchema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        registry={registry}
        onChange={onChange}
        onBlur={onBlur}
        formData={formData}
        formContext={formContext}
        requiredSchema={requiredSchema}/>
    );

    expect(tree.everySubTree('SchemaField').length).to.equal(1);
  });
  it('should render edit mode when showLastItemInViewMode is configured and has invalid data', () => {
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
    const formData = [
      { field: 'information' },
    ];
    const uiSchema = {
      'ui:title': 'List of things',
      'ui:options': {
        showLastItemInViewMode: true,
        viewField: f => f
      }
    };
    const fullErrorSchema = {
      0: { thing: { __errors: ['some error'] } },
    };
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <ArrayField
        schema={schema}
        errorSchema={fullErrorSchema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        registry={registry}
        onChange={onChange}
        onBlur={onBlur}
        formData={formData}
        formContext={formContext}
        requiredSchema={requiredSchema}/>
    );
    // White background shouldn't be default style for last items if showLastItemInViewMode selected
    expect(tree.everySubTree('.va-growable-background').length).to.equal(1);
    expect(tree.everySubTree('SchemaField').length).to.equal(1);
  });
  it('should not render review mode until valid data is submitted', () => {
    const idSchema = {};
    const schema = {
      type: 'array',
      items: [],
      additionalItems: {
        type: 'object',
        required: ['field'],
        properties: {
          field: {
            type: 'string'
          }
        }
      }
    };
    const formData = [
      {},
    ];
    const uiSchema = {
      'ui:title': 'List of things',
      'ui:options': {
        showLastItemInViewMode: true,
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
        formData={formData}
        formContext={formContext}
        requiredSchema={requiredSchema}/>
    );
    expect(tree.everySubTree('SchemaField').length).to.equal(1);
    const newItem = { field: 'abc' };
    tree.getMountedInstance().onItemChange(0, newItem);
    expect(tree.everySubTree('SchemaField').length).to.equal(1);
    // check new in title here?
    console.log(tree.toString());
    // do we need to update the tree or something here? is there a similar test above?
    expect(tree.everySubTree('SchemaField').length).to.equal(0);
  });
});
