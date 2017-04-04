import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';
import sinon from 'sinon';

import { FormPage } from '../../../src/js/common/schemaform/FormPage';

describe('Schemaform <FormPage>', () => {
  it('should render', () => {
    const route = {
      pageConfig: {
        pageKey: 'testPage',
        schema: {},
        uiSchema: {},
        errorMessages: {}
      },
      pageList: [
        {
          path: 'testing'
        }
      ]
    };
    const form = {
      testPage: {
        data: {}
      }
    };

    const tree = SkinDeep.shallowRender(
      <FormPage form={form} route={route}/>
    );

    expect(tree.everySubTree('SchemaForm')).not.to.be.empty;
    expect(tree.everySubTree('ProgressButton').length).to.equal(2);
  });
  describe('should handle', () => {
    let tree;
    let setData;
    let router;
    let onSubmit;
    let form;
    let route;
    beforeEach(() => {
      setData = sinon.spy();
      onSubmit = sinon.spy();
      router = {
        push: sinon.spy()
      };
      route = {
        pageConfig: {
          pageKey: 'testPage',
          schema: {},
          uiSchema: {},
          errorMessages: {}
        },
        pageList: [
          {
            path: 'previous-page'
          },
          {
            path: 'testing',
            pageKey: 'testPage'
          },
          {
            path: 'next-page'
          }
        ]
      };
      form = {
        testPage: {
          data: {}
        }
      };

      tree = SkinDeep.shallowRender(
        <FormPage
            router={router}
            setData={setData}
            form={form}
            onSubmit={onSubmit}
            route={route}/>
      );
    });
    it('change', () => {
      const newData = {};
      tree.getMountedInstance().onChange(newData);

      expect(setData.calledWith('testPage', newData));
    });
    it('submit', () => {
      tree.getMountedInstance().onSubmit();

      expect(router.push.calledWith('next-page'));
    });
    it('back', () => {
      tree.getMountedInstance().goBack();

      expect(router.push.calledWith('previous-page'));
    });
  });
});
