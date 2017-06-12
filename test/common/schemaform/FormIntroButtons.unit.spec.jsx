import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';

import FormIntroButtons from '../../../src/js/common/schemaform/FormIntroButtons';

describe('Schemaform <FormIntroButtons>', () => {
  const route = {
    pageConfig: {
      pageKey: 'testPage',
      schema: {},
      uiSchema: {},
      errorMessages: {},
      title: ''
    },
    pageList: [
      {
        path: 'testing'
      }
    ]
  };
  const form = {
    pages: {
      testPage: {
        schema: {
          type: 'object',
          properties: {
            field: { type: 'string' }
          }
        },
        uiSchema: {},
      }
    },
    data: {},
    formId: 'unique id here',
    migrations: []
  };

  const formWithLoadedData = Object.assign({}, form, {
    loadedStatus: 'success',
    loadedData: {
      formData: {
        field: 'foo'
      },
      metadata: {
        returnUrl: 'some/url'
      }
    }
  });


  it('should render 1 button when not logged in', () => {
    const routerSpy = {
      push: sinon.spy()
    };
    const fetchSpy = sinon.spy();
    const loadDataSpy = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <FormIntroButtons
          form={form}
          route={route}
          router={routerSpy}
          fetchInProgressForm={fetchSpy}
          loadInProgressDataIntoForm={loadDataSpy}
          loggedIn={false}/>
    );

    expect(tree.everySubTree('ProgressButton').length).to.equal(1);
  });
  it('should render 1 button when logged in with no saved form', () => {
    const routerSpy = {
      push: sinon.spy()
    };
    const fetchSpy = sinon.spy();
    const loadDataSpy = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <FormIntroButtons
          form={form}
          route={route}
          router={routerSpy}
          fetchInProgressForm={fetchSpy}
          loadInProgressDataIntoForm={loadDataSpy}
          loggedIn/>
    );

    expect(tree.everySubTree('ProgressButton').length).to.equal(1);
  });
  it('should render 2 buttons when logged in with a saved form', () => {
    const routerSpy = {
      push: sinon.spy()
    };
    const fetchSpy = sinon.spy();
    const loadDataSpy = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <FormIntroButtons
          form={formWithLoadedData}
          route={route}
          router={routerSpy}
          fetchInProgressForm={fetchSpy}
          loadInProgressDataIntoForm={loadDataSpy}
          loggedIn/>
    );

    expect(tree.everySubTree('ProgressButton').length).to.equal(2);
  });
  it('should query for a saved form upon load', () => {
    const routerSpy = {
      push: sinon.spy()
    };
    const fetchSpy = sinon.spy();
    const loadDataSpy = sinon.spy();
    SkinDeep.shallowRender(
      <FormIntroButtons
          form={formWithLoadedData}
          route={route}
          router={routerSpy}
          fetchInProgressForm={fetchSpy}
          loadInProgressDataIntoForm={loadDataSpy}
          loggedIn/>
    );

    expect(fetchSpy.calledWith(form.formId, form.migrations));
  });
  it('should query for a saved form after logging in', () => {
    const routerSpy = {
      push: sinon.spy()
    };
    const fetchSpy = sinon.spy();
    const loadDataSpy = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <FormIntroButtons
          form={formWithLoadedData}
          route={route}
          router={routerSpy}
          fetchInProgressForm={fetchSpy}
          loadInProgressDataIntoForm={loadDataSpy}
          loggedIn={false}/>
    );

    // Log in
    tree.reRender({
      form: formWithLoadedData,
      route,
      router: routerSpy,
      fetchInProgressForm: fetchSpy,
      loadInProgressDataIntoForm: loadDataSpy,
      loggedIn: true
    });
    expect(fetchSpy.calledTwice).to.be.true;
  });
  it('should go to the first page when "Continue" is clicked', () => {
    const routerSpy = {
      push: sinon.spy()
    };
    const fetchSpy = sinon.spy();
    const loadDataSpy = sinon.spy();
    const tree = ReactTestUtils.renderIntoDocument(
      <FormIntroButtons
          form={form}
          route={route}
          router={routerSpy}
          fetchInProgressForm={fetchSpy}
          loadInProgressDataIntoForm={loadDataSpy}
          loggedIn/>
    );
    const findDOM = findDOMNode(tree);
    findDOM.querySelector('.usa-button-primary').click();

    expect(routerSpy.push.calledWith(route.pageList[0].path));
  });
  // This test is probably extraneous
  it('should go to the first page when "Start over" is clicked', () => {
    const routerSpy = {
      push: sinon.spy()
    };
    const fetchSpy = sinon.spy();
    const loadDataSpy = sinon.spy();
    const tree = ReactTestUtils.renderIntoDocument(
      <FormIntroButtons
          form={formWithLoadedData}
          route={route}
          router={routerSpy}
          fetchInProgressForm={fetchSpy}
          loadInProgressDataIntoForm={loadDataSpy}
          loggedIn/>
    );
    const findDOM = findDOMNode(tree);
    findDOM.querySelector('.usa-button-outline').click();

    expect(routerSpy.push.calledWith(route.pageList[0].path));
  });
  it('should go to the returnUrl when "Resume previous application" is clicked', () => {
    const routerSpy = {
      push: sinon.spy()
    };
    const fetchSpy = sinon.spy();
    const loadDataSpy = sinon.spy();
    const tree = ReactTestUtils.renderIntoDocument(
      <FormIntroButtons
          form={formWithLoadedData}
          route={route}
          router={routerSpy}
          fetchInProgressForm={fetchSpy}
          loadInProgressDataIntoForm={loadDataSpy}
          loggedIn/>
    );
    const findDOM = findDOMNode(tree);
    findDOM.querySelector('.usa-button-primary').click();

    expect(routerSpy.push.calledWith(formWithLoadedData.loadedData.metadata.returnUrl));
  });
});
