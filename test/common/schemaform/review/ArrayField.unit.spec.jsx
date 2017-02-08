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
          touchedSchema={touchedSchema}
          requiredSchema={requiredSchema}/>
    );

    expect(tree.subTree('.form-review-panel-page-header').text()).to.equal(uiSchema['ui:title']);
    expect(tree.everySubTree('FormPage')).to.be.empty;
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
          touchedSchema={touchedSchema}
          requiredSchema={requiredSchema}/>
    );

    expect(tree.everySubTree('FormPage').length).to.equal(2);
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
            touchedSchema={touchedSchema}
            requiredSchema={requiredSchema}/>
      );
    });
    it('edit', () => {
      expect(tree.subTree('FormPage').props.reviewMode).to.be.true;

      tree.getMountedInstance().handleEdit(0, true);

      expect(tree.subTree('FormPage').props.reviewMode).to.be.undefined;
    });
    it('update', () => {
      tree.getMountedInstance().handleEdit(0, true);
      expect(tree.subTree('FormPage').props.reviewMode).to.be.undefined;

      tree.getMountedInstance().handleSave(0, true);

      expect(tree.subTree('FormPage').props.reviewMode).to.be.true;
    });
    it('add', () => {
      expect(tree.everySubTree('FormPage').length).to.equal(1);

      tree.getMountedInstance().handleAdd();

      expect(tree.everySubTree('FormPage').length).to.equal(2);
    });
    it('setData', () => {
      tree.getMountedInstance().handleSetData(0, { test: 1 });
      expect(setData.calledWith('page1', { thingList: [{ test: 1 }] })).to.be.true;
    });
  });
});
