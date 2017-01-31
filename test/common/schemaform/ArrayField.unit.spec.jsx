import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';
import sinon from 'sinon';

import ArrayField from '../../../src/js/common/schemaform/ArrayField';

const registry = {
  definitions: {},
  fields: {
    TitleField: f => f,
    SchemaField: f => f
  }
};
const formContext = {};
const touchedSchema = {};
const requiredSchema = {};

describe('Schemaform ArrayField', () => {
  it('should render', () => {
    const idSchema = {};
    const schema = {
      type: 'array',
      items: {
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
          idSchema={idSchema}
          registry={registry}
          formContext={formContext}
          touchedSchema={touchedSchema}
          requiredSchema={requiredSchema}/>
    );

    expect(tree.subTree('TitleField').props.title).to.equal(uiSchema['ui:title']);
    expect(tree.everySubTree('SchemaField')).not.to.be.empty;
  });
  it('should render items', () => {
    const idSchema = {};
    const schema = {
      type: 'array',
      items: {
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
      {},
      {}
    ];
    const tree = SkinDeep.shallowRender(
      <ArrayField
          schema={schema}
          uiSchema={uiSchema}
          idSchema={idSchema}
          registry={registry}
          formData={formData}
          formContext={formContext}
          touchedSchema={touchedSchema}
          requiredSchema={requiredSchema}/>
    );

    expect(tree.everySubTree('SchemaField').length).to.equal(1);
    expect(tree.everySubTree('.va-growable-background').length).to.equal(2);
  });
  describe('should handle', () => {
    let tree;
    let errorSchema;
    let onChange;
    beforeEach(() => {
      const idSchema = {};
      const schema = {
        type: 'array',
        items: {
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
        {},
        {}
      ];
      errorSchema = {};
      onChange = sinon.spy();
      tree = SkinDeep.shallowRender(
        <ArrayField
            schema={schema}
            errorSchema={errorSchema}
            uiSchema={uiSchema}
            idSchema={idSchema}
            registry={registry}
            formData={formData}
            onChange={onChange}
            formContext={formContext}
            touchedSchema={touchedSchema}
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
  });
});
