import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';
import sinon from 'sinon';
import _ from 'lodash/fp';

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

    expect(tree.everySubTree('Form')).not.to.be.empty;
  });
  it('should transform errors', () => {
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

    const errors = tree.getMountedInstance().transformErrors([
      {
        name: 'required',
        property: 'instance',
        argument: 'test'
      }
    ]);

    expect(errors[0].property).to.equal('instance.test');
  });
  it('should call ui schema validation', () => {
    const route = {
      pageConfig: {
        pageKey: 'testPage',
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
        schema: {},
        uiSchema: {
          'ui:validations': [
            (errors) => errors.addError('test error')
          ]
        },
        data: {}
      }
    };

    const tree = SkinDeep.shallowRender(
      <FormPage form={form} route={route}/>
    );

    const errors = tree.getMountedInstance().validate(form.testPage.data, {
      __errors: [],
      addError: function addError(msg) { this.__errors.push(msg); }
    });

    expect(errors.__errors[0]).to.equal('test error');
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
    it('error', () => {
      tree.getMountedInstance().onError();

      expect(tree.getMountedInstance().state.formContext.submitted).to.be.true;
    });
    it('submit', () => {
      tree.getMountedInstance().onSubmit();

      expect(router.push.calledWith('next-page'));
    });
    it('submit on review', () => {
      tree = SkinDeep.shallowRender(
        <FormPage
            reviewPage
            router={router}
            setData={setData}
            form={form}
            onSubmit={onSubmit}
            route={route}/>
      );
      tree.getMountedInstance().onSubmit();

      expect(onSubmit.called).to.be.true;
    });
    it('back', () => {
      tree.getMountedInstance().goBack();

      expect(router.push.calledWith('previous-page'));
    });
  });
  it('should reset start on page change', () => {
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

    const instance = tree.getMountedInstance();

    instance.onError();

    expect(instance.state.formContext.submitted).to.be.true;

    instance.componentWillReceiveProps({
      form,
      route: _.set('pageConfig.pageKey', 'testPage2', route)
    });

    expect(instance.state.formContext.submitted).to.be.false;
  });
});
