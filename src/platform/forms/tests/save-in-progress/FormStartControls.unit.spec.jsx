import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import sinon from 'sinon';

import { WIZARD_STATUS_RESTARTING } from 'platform/site-wide/wizard';
import { FormStartControls } from '../../save-in-progress/FormStartControls';

describe('Schemaform <FormStartControls>', () => {
  const startPage = 'testing';
  const wizardStorageKey = 'testKey';
  const restartDestination = '/test-page';
  const oldDataLayer = global.window.dataLayer;
  let defaultRoutes;

  beforeEach(() => {
    defaultRoutes = [
      'dummyProp',
      {
        formConfig: {
          wizardStorageKey,
          customText: {
            startNewAppButtonText: '',
            continueAppButtonText: '',
          },
        },
      },
    ];
  });

  afterEach(() => {
    global.window.dataLayer = oldDataLayer;
    global.window.sessionStorage.removeItem(wizardStorageKey);
  });

  it('should render 1 button when not logged in', () => {
    const routerSpy = {
      push: sinon.spy(),
    };
    const fetchSpy = sinon.spy();
    const tree = render(
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
    expect(
      tree.baseElement.querySelectorAll('a.vads-c-action-link--green').length,
    ).to.equal(1);
  });
  it('should render 1 button when logged in with no saved form', () => {
    const routerSpy = {
      push: sinon.spy(),
    };
    const fetchSpy = sinon.spy();
    const tree = render(
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
    expect(
      tree.baseElement.querySelectorAll('a.vads-c-action-link--green').length,
    ).to.equal(1);
  });
  it('should render 1 va-button and 1 va-button-pair when logged in with an expired form', () => {
    const routerSpy = {
      push: sinon.spy(),
    };
    const fetchSpy = sinon.spy();
    const tree = render(
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
    tree.baseElement.querySelector('va-button').click();
    const buttonSelector = 'va-button,va-button-pair';
    const buttonCount = tree.baseElement.querySelectorAll(buttonSelector)
      .length;
    expect(buttonCount).to.equal(2);
  });
  it('should render 2 buttons and a button pair when logged in with a saved form', () => {
    const routerSpy = {
      push: sinon.spy(),
    };
    const fetchSpy = sinon.spy();
    const tree = render(
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
    const buttons = tree.baseElement.querySelectorAll('va-button');
    expect(buttons.length).to.equal(2);
    buttons[1].click();
    expect(tree.baseElement.querySelectorAll('va-button-pair').length).to.equal(
      1,
    );
  });
  it('should go to the first page when "Continue" is clicked', () => {
    const routerSpy = {
      push: sinon.spy(),
    };
    const fetchSpy = sinon.spy();
    const tree = render(
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
    tree.baseElement.querySelector('va-button').click();
    expect(routerSpy.push.calledWith(startPage));
  });

  it('should go to the first page when "Start over" is clicked', () => {
    const routerSpy = {
      push: sinon.spy(),
    };
    const fetchSpy = sinon.spy();
    const tree = render(
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
    tree.baseElement.querySelectorAll('va-button')[1].click();
    expect(routerSpy.push.calledWith(startPage));
  });
  it('should go to the returnUrl when "Resume previous application" is clicked', () => {
    const routerSpy = {
      push: sinon.spy(),
    };
    const fetchSpy = sinon.stub();
    fetchSpy.returns(Promise.resolve('return/url'));
    const tree = render(
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
    tree.baseElement.querySelector('va-button').click();
    expect(routerSpy.push.calledWith('return/url'));
  });

  it('should do prefill when "Continue" is clicked', () => {
    const routerSpy = {
      push: sinon.spy(),
    };
    const fetchSpy = sinon.spy();
    const tree = render(
      <FormStartControls
        formId="1010ez"
        migrations={[]}
        startPage={startPage}
        router={routerSpy}
        fetchInProgressForm={fetchSpy}
        prefillAvailable
        routes={[{}, { formConfig: { wizardStorageKey } }]}
      />,
    );

    tree.baseElement.querySelector('a.vads-c-action-link--green').click();
    expect(fetchSpy.firstCall.args[2]).to.be.true;
  });

  it('should show modal and remove form when starting over', () => {
    const routerSpy = {
      push: sinon.spy(),
    };
    const fetchSpy = sinon.spy();
    const tree = render(
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
    tree.baseElement.querySelectorAll('va-button')[1].click();
    expect(tree.baseElement.querySelector('.va-modal-body')).to.not.be.null;
    const buttonPair = tree.baseElement.querySelector('va-button-pair');
    buttonPair.__events.primaryClick();
    expect(fetchSpy.called).to.be.true;
    expect(tree.baseElement.querySelector('.va-modal-body')).to.be.null;
  });

  it('should show modal and remove form when starting over', () => {
    const routerSpy = {
      push: sinon.spy(),
    };
    const fetchSpy = sinon.spy();
    const tree = render(
      <FormStartControls
        formId="1010ez"
        migrations={[]}
        router={routerSpy}
        formSaved
        removeInProgressForm={fetchSpy}
        prefillAvailable
        routes={[
          {},
          {
            formConfig: {
              wizardStorageKey,
              saveInProgress: {
                restartFormCallback: () => restartDestination,
              },
            },
          },
        ]}
      />,
    );
    tree.baseElement.querySelectorAll('va-button')[1].click();
    expect(tree.baseElement.querySelector('.va-modal-body')).to.not.be.null;

    const buttonPair = tree.baseElement.querySelector('va-button-pair');
    buttonPair.__events.primaryClick();

    expect(fetchSpy.called).to.be.true;
    expect(tree.baseElement.querySelector('.va-modal-body')).to.be.null;
    expect(global.window.sessionStorage.getItem(wizardStorageKey)).to.equal(
      WIZARD_STATUS_RESTARTING,
    );
  });

  it('should not capture analytics events when starting the form if the `gaStartEventName` prop is explicitly removed', () => {
    const routerSpy = {
      push: sinon.spy(),
    };
    global.window.dataLayer = [];
    const fetchSpy = sinon.spy();
    const tree = render(
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

    tree.baseElement.querySelector('a.vads-c-action-link--green').click();

    expect(global.window.dataLayer).to.eql([]);
  });

  it('should capture analytics events with the default event name when starting the form  if a custom `gaStartEventName` is not set', () => {
    const routerSpy = {
      push: sinon.spy(),
    };
    global.window.dataLayer = [];
    const fetchSpy = sinon.spy();
    const tree = render(
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
    tree.baseElement.querySelector('a.vads-c-action-link--green').click();

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
    const tree = render(
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
    tree.baseElement.querySelector('a.vads-c-action-link--green').click();

    expect(global.window.dataLayer).to.eql([
      {
        event: 'testing, testing',
      },
    ]);
  });

  it('should render the action link', () => {
    const routerSpy = {
      push: sinon.spy(),
    };
    const fetchSpy = sinon.spy();
    const tree = render(
      <FormStartControls
        formId="1010ez"
        migrations={[]}
        startPage={startPage}
        router={routerSpy}
        fetchInProgressForm={fetchSpy}
        prefillAvailable
        routes={[{}, { formConfig: { wizardStorageKey } }]}
        ariaLabel="test aria-label"
        ariaDescribedby="test-id"
      />,
    );
    const formDOM = tree.baseElement.querySelector('a');
    expect(formDOM.className).to.contain('vads-c-action-link--green');
    expect(formDOM.textContent).to.eq('Get Started');
    expect(formDOM.getAttribute('aria-label')).to.eq('test aria-label');
    expect(formDOM.getAttribute('aria-describedby')).to.eq('test-id');
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
          customText: {
            startNewAppButtonText: 'A custom starting new app message',
            continueAppButtonText: '',
          },
        },
      },
    ];
    const tree = render(
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
    const button = tree.baseElement.querySelector('va-button');
    const buttonString = 'A custom starting new app message';
    expect(button.getAttribute('text')).to.include(buttonString);
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
          customText: {
            startNewAppButtonText: '',
            continueAppButtonText: 'A custom continue app message',
          },
        },
      },
    ];
    const tree = render(
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
    const button = tree.baseElement.querySelector('va-button');
    const buttonText = button.getAttribute('text');
    expect(buttonText).to.include('A custom continue app message');
  });

  it('should include aria-label on sign in button', () => {
    const routerSpy = {
      push: sinon.spy(),
    };
    const fetchSpy = sinon.spy();
    const tree = render(
      <FormStartControls
        formId="1010ez"
        migrations={[]}
        formSaved
        startPage={startPage}
        router={routerSpy}
        fetchInProgressForm={fetchSpy}
        routes={defaultRoutes}
        ariaLabel="test aria-label"
        ariaDescribedby="test-id"
      />,
    );
    const button = tree.baseElement.querySelector('va-button');
    expect(button.getAttribute('label')).to.eq('test aria-label');
  });
  it('should include aria-label on all buttons when logged in with a saved form', () => {
    const routerSpy = {
      push: sinon.spy(),
    };
    const fetchSpy = sinon.spy();
    const tree = render(
      <FormStartControls
        formId="1010ez"
        migrations={[]}
        formSaved
        startPage={startPage}
        router={routerSpy}
        fetchInProgressForm={fetchSpy}
        routes={defaultRoutes}
        ariaLabel="test aria-label"
        ariaDescribedby="test-id"
      />,
    );
    const buttons = tree.baseElement.querySelectorAll('va-button');
    buttons[1].click();
    const buttonSelector = 'va-button, va-button-pair';
    const allButtons = tree.baseElement.querySelectorAll(buttonSelector);
    expect(allButtons.length).to.equal(3);

    // Modal buttons = last 2, do not include these aria-attributes
    expect(buttons[0].getAttribute('label')).to.eq('test aria-label');
    expect(buttons[1].getAttribute('label')).to.eq('test aria-label');
  });
  it('should not throw a JS error when routes are missing', () => {
    const tree = render(
      <FormStartControls
        formId="1010ez"
        migrations={[]}
        formSaved={false}
        startPage={startPage}
        router={null}
        fetchInProgressForm={null}
        routes={null}
      />,
    );

    expect(
      tree.baseElement.querySelectorAll('a.vads-c-action-link--green').length,
    ).to.equal(1);
  });
});
