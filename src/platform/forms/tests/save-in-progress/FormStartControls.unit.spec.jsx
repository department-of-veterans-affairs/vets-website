import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import sinon from 'sinon';

import { WIZARD_STATUS_RESTARTING } from '../../../site-wide/wizard';
import { FormStartControls } from '../../save-in-progress/FormStartControls';

describe('Schemaform <FormStartControls>', () => {
  const startPage = 'testing';
  const wizardStorageKey = 'testKey';
  const oldDataLayer = global.window.dataLayer;
  let defaultRoutes;

  beforeEach(() => {
    defaultRoutes = [
      'dummyProp',
      {
        formConfig: {
          wizardStorageKey,
          customText: {
            startNewAppButtonText: 'Start new app',
            continueAppButtonText: 'Continue app',
          },
        },
      },
    ];
  });

  afterEach(() => {
    global.window.dataLayer = oldDataLayer;
    global.window.sessionStorage.removeItem(wizardStorageKey);
  });

  it('should render start action link when logged in with no saved form', () => {
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
    const link = tree.baseElement.querySelector('a.vads-c-action-link--green');
    expect(link).to.exist;
    expect(link.textContent).to.contain('Get Started');
  });
  it('should render start a new app button when logged in with an expired form & clear in progress form & set wizard restart', async () => {
    const routerSpy = {
      push: sinon.spy(),
    };
    const fetchSpy = sinon.spy();
    const removeSpy = sinon.spy();
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
        removeInProgressForm={removeSpy}
      />,
    );
    const button = tree.baseElement.querySelector('va-button');
    expect(button).to.exist;
    expect(button.getAttribute('text')).to.contain('Start new app');

    await button.click();
    const modal = await tree.baseElement.querySelector(
      'va-modal[visible="true"]',
    );
    expect(modal).to.exist;

    await modal.__events.primaryButtonClick();
    await waitFor(() => {
      expect(removeSpy.called).to.be.true;
      expect(global.window.sessionStorage.getItem(wizardStorageKey)).to.eq(
        WIZARD_STATUS_RESTARTING,
      );
      expect(tree.baseElement.querySelector('va-modal[visible="false"]')).to
        .exist;
    });
  });
  it('should render continue & start new app buttons with a saved form', () => {
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
    expect(tree.baseElement.querySelector('va-modal[visible="true"]')).to.exist;
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

  it('should show modal and remove form when starting over', async () => {
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
    await tree.baseElement.querySelectorAll('va-button')[1].click();
    const modal = await tree.baseElement.querySelector(
      'va-modal[visible="true"]',
    );
    expect(modal).to.exist;

    await modal.__events.primaryButtonClick();
    await waitFor(() => {
      expect(fetchSpy.called).to.be.true;
      expect(global.window.sessionStorage.getItem(wizardStorageKey)).to.eq(
        WIZARD_STATUS_RESTARTING,
      );
      expect(tree.baseElement.querySelector('va-modal[visible="false"]')).to
        .exist;
    });
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
    const buttonSelector = 'va-button';
    const allButtons = tree.baseElement.querySelectorAll(buttonSelector);
    expect(allButtons.length).to.equal(2);

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
