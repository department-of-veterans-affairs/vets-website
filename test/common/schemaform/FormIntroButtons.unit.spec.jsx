import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';

import { getFormDOM } from '../../util/schemaform-utils';
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

  it('should render 1 button when not logged in', () => {
    const routerSpy = {
      push: sinon.spy()
    };
    const fetchSpy = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <FormIntroButtons
          formId="1010ez"
          migrations={[]}
          formSaved={false}
          route={route}
          router={routerSpy}
          fetchInProgressForm={fetchSpy}/>
    );

    expect(tree.everySubTree('ProgressButton').length).to.equal(1);
  });
  it('should render 1 button when logged in with no saved form', () => {
    const routerSpy = {
      push: sinon.spy()
    };
    const fetchSpy = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <FormIntroButtons
          formId="1010ez"
          migrations={[]}
          formSaved={false}
          route={route}
          router={routerSpy}
          fetchInProgressForm={fetchSpy}/>
    );

    expect(tree.everySubTree('ProgressButton').length).to.equal(1);
  });
  it('should render 2 buttons when logged in with a saved form', () => {
    const routerSpy = {
      push: sinon.spy()
    };
    const fetchSpy = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <FormIntroButtons
          formId="1010ez"
          migrations={[]}
          formSaved
          route={route}
          router={routerSpy}
          fetchInProgressForm={fetchSpy}/>
    );

    expect(tree.everySubTree('ProgressButton').length).to.equal(2);
  });
  it('should go to the first page when "Continue" is clicked', () => {
    const routerSpy = {
      push: sinon.spy()
    };
    const fetchSpy = sinon.spy();
    const tree = ReactTestUtils.renderIntoDocument(
      <FormIntroButtons
          formId="1010ez"
          migrations={[]}
          formSaved
          route={route}
          router={routerSpy}
          fetchInProgressForm={fetchSpy}/>
    );
    const findDOM = findDOMNode(tree);
    findDOM.querySelector('.usa-button-primary').click();

    expect(routerSpy.push.calledWith(route.pageList[0].path));
  });

  it('should go to the first page when "Start over" is clicked', () => {
    const routerSpy = {
      push: sinon.spy()
    };
    const fetchSpy = sinon.spy();
    const tree = ReactTestUtils.renderIntoDocument(
      <FormIntroButtons
          formId="1010ez"
          migrations={[]}
          formSaved
          route={route}
          router={routerSpy}
          fetchInProgressForm={fetchSpy}/>
    );
    const findDOM = findDOMNode(tree);
    findDOM.querySelector('.usa-button-outline').click();

    expect(routerSpy.push.calledWith(route.pageList[0].path));
  });
  it('should go to the returnUrl when "Resume previous application" is clicked', () => {
    const routerSpy = {
      push: sinon.spy()
    };
    const fetchSpy = sinon.stub();
    fetchSpy.returns(Promise.resolve('return/url'));
    const tree = ReactTestUtils.renderIntoDocument(
      <FormIntroButtons
          formId="1010ez"
          migrations={[]}
          formSaved
          route={route}
          router={routerSpy}
          fetchInProgressForm={fetchSpy}/>
    );
    const findDOM = findDOMNode(tree);
    findDOM.querySelector('.usa-button-primary').click();

    expect(routerSpy.push.calledWith('return/url'));
  });

  it('should do prefill when "Continue" is clicked', () => {
    const routerSpy = {
      push: sinon.spy()
    };
    const fetchSpy = sinon.spy();
    const tree = ReactTestUtils.renderIntoDocument(
      <FormIntroButtons
          formId="1010ez"
          migrations={[]}
          route={route}
          router={routerSpy}
          fetchInProgressForm={fetchSpy}
          prefillAvailable/>
    );
    const formDOM = getFormDOM(tree);
    formDOM.click('.usa-button-primary');

    expect(fetchSpy.firstCall.args[2]).to.be.true;
  });
});
