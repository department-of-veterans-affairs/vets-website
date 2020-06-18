import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';

import { getFormDOM } from '../../../testing/unit/schemaform-utils';
import { FormStartControls } from '../../save-in-progress/FormStartControls';

describe('Schemaform <FormStartControls>', () => {
  const startPage = 'testing';
  const oldDataLayer = global.window.dataLayer;
  let defaultRoutes;

  beforeEach(() => {
    defaultRoutes = [
      'dummyProp',
      {
        formConfig: {
          savedFormMessages: {
            startNewAppButtonText: '',
            continueAppButtonText: '',
          },
        },
      },
    ];
  });

  afterEach(() => {
    global.window.dataLayer = oldDataLayer;
  });

  it('should render 1 button when not logged in', () => {
    const routerSpy = {
      push: sinon.spy(),
    };
    const fetchSpy = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <FormStartControls
        formId="1010ez"
        migrations={[]}
        formSaved={false}
        startPage={startPage}
        router={routerSpy}
        fetchInProgressForm={fetchSpy}
        routes={defaultRoutes}
      />,
    );

    expect(tree.everySubTree('ProgressButton').length).to.equal(1);
  });
  it('should render 1 button when logged in with no saved form', () => {
    const routerSpy = {
      push: sinon.spy(),
    };
    const fetchSpy = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <FormStartControls
        formId="1010ez"
        migrations={[]}
        formSaved={false}
        startPage={startPage}
        router={routerSpy}
        fetchInProgressForm={fetchSpy}
        routes={defaultRoutes}
      />,
    );

    expect(tree.everySubTree('ProgressButton').length).to.equal(1);
  });
  it('should render 3 buttons when logged in with an expired form', () => {
    const routerSpy = {
      push: sinon.spy(),
    };
    const fetchSpy = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <FormStartControls
        formId="1010ez"
        migrations={[]}
        isExpired
        formSaved
        startPage={startPage}
        router={routerSpy}
        fetchInProgressForm={fetchSpy}
        routes={defaultRoutes}
      />,
    );
    expect(tree.everySubTree('ProgressButton').length).to.equal(3);
  });
  it('should render 4 buttons when logged in with a saved form', () => {
    const routerSpy = {
      push: sinon.spy(),
    };
    const fetchSpy = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <FormStartControls
        formId="1010ez"
        migrations={[]}
        formSaved
        startPage={startPage}
        router={routerSpy}
        fetchInProgressForm={fetchSpy}
        routes={defaultRoutes}
      />,
    );

    expect(tree.everySubTree('ProgressButton').length).to.equal(4);
    expect(
      tree.subTree('Modal').everySubTree('ProgressButton').length,
    ).to.equal(2);
  });
  it('should go to the first page when "Continue" is clicked', () => {
    const routerSpy = {
      push: sinon.spy(),
    };
    const fetchSpy = sinon.spy();
    const tree = ReactTestUtils.renderIntoDocument(
      <FormStartControls
        formId="1010ez"
        migrations={[]}
        formSaved
        startPage={startPage}
        router={routerSpy}
        fetchInProgressForm={fetchSpy}
        routes={defaultRoutes}
      />,
    );
    const findDOM = findDOMNode(tree);
    findDOM.querySelector('.usa-button-primary').click();

    expect(routerSpy.push.calledWith(startPage));
  });

  it('should go to the first page when "Start over" is clicked', () => {
    const routerSpy = {
      push: sinon.spy(),
    };
    const fetchSpy = sinon.spy();
    const tree = ReactTestUtils.renderIntoDocument(
      <FormStartControls
        formId="1010ez"
        migrations={[]}
        formSaved
        startPage={startPage}
        router={routerSpy}
        fetchInProgressForm={fetchSpy}
        routes={defaultRoutes}
      />,
    );
    const findDOM = findDOMNode(tree);
    findDOM.querySelector('.usa-button-secondary').click();

    expect(routerSpy.push.calledWith(startPage));
  });
  it('should go to the returnUrl when "Resume previous application" is clicked', () => {
    const routerSpy = {
      push: sinon.spy(),
    };
    const fetchSpy = sinon.stub();
    fetchSpy.returns(Promise.resolve('return/url'));
    const tree = ReactTestUtils.renderIntoDocument(
      <FormStartControls
        formId="1010ez"
        migrations={[]}
        formSaved
        startPage={startPage}
        router={routerSpy}
        fetchInProgressForm={fetchSpy}
        routes={defaultRoutes}
      />,
    );
    const findDOM = findDOMNode(tree);
    findDOM.querySelector('.usa-button-primary').click();

    expect(routerSpy.push.calledWith('return/url'));
  });

  it('should do prefill when "Continue" is clicked', () => {
    const routerSpy = {
      push: sinon.spy(),
    };
    const fetchSpy = sinon.spy();
    const tree = ReactTestUtils.renderIntoDocument(
      <FormStartControls
        formId="1010ez"
        migrations={[]}
        startPage={startPage}
        router={routerSpy}
        fetchInProgressForm={fetchSpy}
        prefillAvailable
        routes={defaultRoutes}
      />,
    );
    const formDOM = getFormDOM(tree);
    formDOM.click('.usa-button-primary');

    expect(fetchSpy.firstCall.args[2]).to.be.true;
  });

  it('should show modal and remove form when starting over', () => {
    const routerSpy = {
      push: sinon.spy(),
    };
    const fetchSpy = sinon.spy();
    const tree = ReactTestUtils.renderIntoDocument(
      <FormStartControls
        formId="1010ez"
        migrations={[]}
        router={routerSpy}
        formSaved
        removeInProgressForm={fetchSpy}
        prefillAvailable
        routes={defaultRoutes}
      />,
    );
    const formDOM = getFormDOM(tree);
    document.body.appendChild(formDOM);
    formDOM.click('.usa-button-secondary');

    expect(formDOM.querySelector('.va-modal-body')).to.not.be.null;

    formDOM.click('.va-modal-body .usa-button-primary');

    expect(fetchSpy.called).to.be.true;
    expect(formDOM.querySelector('.va-modal-body')).to.be.null;
  });

  it('should not capture analytics events when starting the form if the `gaStartEventName` prop is explicitly removed', () => {
    const routerSpy = {
      push: sinon.spy(),
    };
    global.window.dataLayer = [];
    const fetchSpy = sinon.spy();
    const tree = ReactTestUtils.renderIntoDocument(
      <FormStartControls
        formId="1010ez"
        migrations={[]}
        startPage={startPage}
        router={routerSpy}
        fetchInProgressForm={fetchSpy}
        gaStartEventName={null}
        prefillAvailable
        routes={defaultRoutes}
      />,
    );
    const formDOM = getFormDOM(tree);
    formDOM.click('.usa-button-primary');

    expect(global.window.dataLayer).to.eql([]);
  });

  it('should capture analytics events with the default event name when starting the form  if a custom `gaStartEventName` is not set', () => {
    const routerSpy = {
      push: sinon.spy(),
    };
    global.window.dataLayer = [];
    const fetchSpy = sinon.spy();
    const tree = ReactTestUtils.renderIntoDocument(
      <FormStartControls
        formId="1010ez"
        migrations={[]}
        startPage={startPage}
        router={routerSpy}
        fetchInProgressForm={fetchSpy}
        prefillAvailable
        routes={defaultRoutes}
      />,
    );
    const formDOM = getFormDOM(tree);
    formDOM.click('.usa-button-primary');

    expect(global.window.dataLayer).to.eql([
      {
        event: 'login-successful-start-form',
      },
    ]);
  });

  it('should capture analytics events with a custom event name when starting the form if a custom `gaStartEventName` is set', () => {
    const routerSpy = {
      push: sinon.spy(),
    };
    global.window.dataLayer = [];
    const fetchSpy = sinon.spy();
    const tree = ReactTestUtils.renderIntoDocument(
      <FormStartControls
        formId="1010ez"
        migrations={[]}
        startPage={startPage}
        router={routerSpy}
        fetchInProgressForm={fetchSpy}
        gaStartEventName="testing, testing"
        prefillAvailable
        routes={defaultRoutes}
      />,
    );
    const formDOM = getFormDOM(tree);
    formDOM.click('.usa-button-primary');

    expect(global.window.dataLayer).to.eql([
      {
        event: 'testing, testing',
      },
    ]);
  });

  it('should display the startNewAppButtonText', () => {
    const routerSpy = {
      push: sinon.spy(),
    };
    const fetchSpy = sinon.spy();
    const startNewMsgRoute = [
      defaultRoutes[0],
      {
        formConfig: {
          savedFormMessages: {
            startNewAppButtonText: 'A custom starting new app message',
            continueAppButtonText: '',
          },
        },
      },
    ];
    const tree = SkinDeep.shallowRender(
      <FormStartControls
        formId="1010ez"
        migrations={[]}
        formSaved
        startPage={startPage}
        router={routerSpy}
        fetchInProgressForm={fetchSpy}
        routes={startNewMsgRoute}
        resumeOnly={false}
        isExpired
      />,
    );
    expect(
      tree.dive(['ProgressButton', '.usa-button-primary']).text(),
    ).to.include('A custom starting new app message');
  });
  it('should display the continueAppButtonText', () => {
    const routerSpy = {
      push: sinon.spy(),
    };
    const fetchSpy = sinon.spy();
    const startNewMsgRoute = [
      defaultRoutes[0],
      {
        formConfig: {
          savedFormMessages: {
            startNewAppButtonText: '',
            continueAppButtonText: 'A custom continue app message',
          },
        },
      },
    ];
    const tree = SkinDeep.shallowRender(
      <FormStartControls
        formId="1010ez"
        migrations={[]}
        formSaved
        startPage={startPage}
        router={routerSpy}
        fetchInProgressForm={fetchSpy}
        routes={startNewMsgRoute}
        resumeOnly
        isExpired={false}
      />,
    );
    expect(
      tree.dive(['ProgressButton', '.usa-button-primary']).text(),
    ).to.include('A custom continue app message');
  });
});
