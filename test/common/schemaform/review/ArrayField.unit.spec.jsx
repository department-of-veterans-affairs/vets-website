import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';
import sinon from 'sinon';

import ArrayField from '../../../../src/js/common/schemaform/review/ArrayField';

const registry = {
  definitions: {},
  fields: {
    TitleField: f => f,
    SchemaField: f => f
  }
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
    const arrayData = [];
    const tree = SkinDeep.shallowRender(
      <ArrayField
          pageKey="page1"
          arrayData={arrayData}
          path={['thingList']}
          schema={schema}
          uiSchema={uiSchema}
          idSchema={idSchema}
          registry={registry}
          formContext={formContext}
          requiredSchema={requiredSchema}/>
    );

    expect(tree.subTree('.form-review-panel-page-header').text()).to.equal(uiSchema['ui:title']);
    expect(tree.everySubTree('SchemaForm')).to.be.empty;
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
    const arrayData = [{}, {}];
    const tree = SkinDeep.shallowRender(
      <ArrayField
          pageKey="page1"
          arrayData={arrayData}
          path={['thingList']}
          schema={schema}
          uiSchema={uiSchema}
          idSchema={idSchema}
          registry={registry}
          formContext={formContext}
          requiredSchema={requiredSchema}/>
    );

    expect(tree.everySubTree('SchemaForm').length).to.equal(2);
  });
  it('should render item name', () => {
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
        viewField: f => f,
        itemName: 'Item name'
      }
    };
    const arrayData = [{}, {}];
    const tree = SkinDeep.shallowRender(
      <ArrayField
          pageKey="page1"
          arrayData={arrayData}
          path={['thingList']}
          schema={schema}
          uiSchema={uiSchema}
          idSchema={idSchema}
          registry={registry}
          formContext={formContext}
          requiredSchema={requiredSchema}/>
    );

    tree.getMountedInstance().handleAdd();

    expect(tree.everySubTree('h5')[1].text()).to.equal('New Item name');
  });
  describe('should handle', () => {
    let tree;
    let setData;
    beforeEach(() => {
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
      const arrayData = [{}];
      setData = sinon.spy();
      tree = SkinDeep.shallowRender(
        <ArrayField
            pageKey="page1"
            setData={setData}
            arrayData={arrayData}
            path={['thingList']}
            schema={schema}
            uiSchema={uiSchema}
            registry={registry}
            formContext={formContext}
            requiredSchema={requiredSchema}/>
      );
    });
    it('edit', () => {
      expect(tree.subTree('SchemaForm').props.reviewMode).to.be.true;

      tree.subTree('SchemaForm').props.onEdit();

      expect(tree.subTree('SchemaForm').props.reviewMode).to.be.undefined;
    });
    it('update', () => {
      tree.subTree('SchemaForm').props.onEdit();
      expect(tree.subTree('SchemaForm').props.reviewMode).to.be.undefined;

      tree.subTree('SchemaForm').props.onSubmit();

      expect(tree.subTree('SchemaForm').props.reviewMode).to.be.true;
    });
    it('add', () => {
      expect(tree.everySubTree('SchemaForm').length).to.equal(1);

      tree.getMountedInstance().handleAdd();

      expect(tree.everySubTree('SchemaForm').length).to.equal(2);
    });
    it('remove', () => {
      expect(tree.everySubTree('SchemaForm').length).to.equal(1);

      tree.getMountedInstance().handleRemove(0);

      expect(tree.everySubTree('SchemaForm').length).to.equal(0);
    });
    it('setData', () => {
      tree.subTree('SchemaForm').props.onChange({ test: 1 });
      expect(setData.calledWith('page1', { thingList: [{ test: 1 }] })).to.be.true;
    });
  });
});
