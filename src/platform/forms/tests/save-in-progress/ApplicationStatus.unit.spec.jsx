import React from 'react';
import { add, getUnixTime, sub } from 'date-fns';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';

import { VA_FORM_IDS } from 'platform/forms/constants';

import { WIZARD_STATUS_COMPLETE } from 'platform/site-wide/wizard';
import { ApplicationStatus } from '../../save-in-progress/ApplicationStatus';

describe('schemaform <ApplicationStatus>', () => {
  let formConfigDefaultData;
  beforeEach(() => {
    formConfigDefaultData = {};
  });

  it('should render loading', () => {
    const { container } = render(
      <ApplicationStatus
        formId="21P-527EZ"
        login={{}}
        profile={{
          loading: true,
        }}
        formConfig={formConfigDefaultData}
      />,
    );

    expect(container.querySelector('va-loading-indicator')).to.not.be.null;
  });
  it('should render apply link', () => {
    const { container } = render(
      <ApplicationStatus
        formId="21P-527EZ"
        login={{
          currentlyLoggedIn: false,
        }}
        showApplyButton
        applyText="Apply for benefit"
        profile={{
          loading: false,
          savedForms: [],
        }}
        formConfig={formConfigDefaultData}
      />,
    );

    const applyLink = container.querySelector('.vads-c-action-link--green');
    expect(applyLink.textContent).to.equal('Apply for benefit');
  });
  it('should render saved form', () => {
    const { container } = render(
      <ApplicationStatus
        formId="21P-527EZ"
        login={{
          currentlyLoggedIn: true,
        }}
        showApplyButton
        applyText="Apply for benefit"
        profile={{
          loading: false,
          savedForms: [
            {
              form: VA_FORM_IDS.FORM_21P_527EZ,
              metadata: {
                expiresAt: getUnixTime(add(Date.now(), { days: 1 })),
              },
            },
          ],
        }}
        formConfig={formConfigDefaultData}
      />,
    );

    expect(container.querySelector('.usa-alert-info')).to.not.be.null;
    expect(container.querySelector('.usa-button-primary').textContent).to.equal(
      'Continue your application',
    );
    expect(container.querySelector('.form-title').textContent).to.contain(
      'Your application is in progress',
    );
  });
  it('should set wizard complete on continuing the application', () => {
    const wizardStatus = 'testKey';
    const { container } = render(
      <ApplicationStatus
        formId="21P-527EZ"
        wizardStatus={wizardStatus}
        login={{
          currentlyLoggedIn: true,
        }}
        showApplyButton
        applyText="Apply for benefit"
        profile={{
          loading: false,
          savedForms: [
            {
              form: VA_FORM_IDS.FORM_21P_527EZ,
              metadata: {
                expiresAt: getUnixTime(add(Date.now(), { days: 1 })),
              },
            },
          ],
        }}
        formConfig={formConfigDefaultData}
      />,
    );

    container.querySelector('.usa-button-primary').click();
    expect(sessionStorage.getItem(wizardStatus)).to.equal(
      WIZARD_STATUS_COMPLETE,
    );
  });
  it('should clear wizard status when starting a new application', () => {
    const wizardStatus = 'testKey';
    const fetchSpy = sinon.stub();
    const tree = render(
      <ApplicationStatus
        formId="21P-527EZ"
        wizardStatus={wizardStatus}
        removeSavedForm={async () => fetchSpy()}
        login={{
          currentlyLoggedIn: true,
        }}
        showApplyButton
        applyText="Apply for benefit"
        profile={{
          loading: false,
          savedForms: [
            {
              form: VA_FORM_IDS.FORM_21P_527EZ,
              metadata: {
                expiresAt: getUnixTime(add(Date.now(), { days: 1 })),
              },
            },
          ],
        }}
        formConfig={formConfigDefaultData}
      />,
    );

    tree.container.querySelector('.usa-button-secondary').click(); // open modal

    expect(tree.container.querySelector('.va-modal-body')).to.not.be.null;

    tree.getByText('Start a new application').click();

    // remove form & reset wizard
    expect(sessionStorage.getItem(wizardStatus)).to.be.null;
  });

  it('should render expired form', () => {
    const { container } = render(
      <ApplicationStatus
        formId="21P-527EZ"
        login={{
          currentlyLoggedIn: true,
        }}
        showApplyButton
        applyText="Apply for benefit"
        profile={{
          loading: false,
          savedForms: [
            {
              form: VA_FORM_IDS.FORM_21P_527EZ,
              metadata: {
                expiresAt: getUnixTime(sub(Date.now(), { days: 1 })),
              },
            },
          ],
        }}
        formConfig={formConfigDefaultData}
      />,
    );
    expect(container.querySelector('.usa-alert-warning')).to.not.be.null;
    expect(container.textContent).to.include('start a new application');
  });
  it('should render saved form from ids', () => {
    const { container } = render(
      <ApplicationStatus
        formIds={new Set([VA_FORM_IDS.FORM_22_1990])}
        login={{
          currentlyLoggedIn: true,
        }}
        showApplyButton
        applyText="Apply for benefit"
        profile={{
          loading: false,
          savedForms: [
            {
              form: VA_FORM_IDS.FORM_22_1990,
              metadata: {
                expiresAt: getUnixTime(add(Date.now(), { days: 1 })),
              },
            },
          ],
        }}
        formConfig={formConfigDefaultData}
      />,
    );
    expect(container.querySelector('.usa-alert-info')).to.not.be.null;
    expect(container.querySelector('.usa-button-primary').textContent).to.equal(
      'Continue your application',
    );
    expect(container.querySelector('.form-title').textContent).to.contain(
      'Your application is in progress',
    );
  });
  it('should render multiple forms message', () => {
    const { container } = render(
      <ApplicationStatus
        formIds={new Set([VA_FORM_IDS.FORM_22_1990, VA_FORM_IDS.FORM_22_1995])}
        login={{
          currentlyLoggedIn: true,
        }}
        showApplyButton
        applyText="Apply for benefit"
        profile={{
          loading: false,
          savedForms: [
            {
              form: VA_FORM_IDS.FORM_22_1990,
              metadata: {
                expiresAt: getUnixTime(add(Date.now(), { days: 1 })),
              },
            },
            {
              form: VA_FORM_IDS.FORM_22_1995,
              metadata: {
                expiresAt: getUnixTime(add(Date.now(), { days: 1 })),
              },
            },
          ],
        }}
        formConfig={formConfigDefaultData}
      />,
    );

    expect(container.querySelector('.usa-alert-info')).to.not.be.null;
    // Normalize whitespace to handle multiple spaces from undefined formType
    const alertText = container
      .querySelector('.usa-alert-info')
      .textContent.replace(/\s+/g, ' ');
    expect(alertText).to.contain('more than one in-progress application');
  });
  it('should display a custom button message when passing in startNewAppButtonText', () => {
    const formConfigCustomMsgData = {
      customText: {
        startNewAppButtonText: 'Custom start app message',
      },
    };
    const { container } = render(
      <ApplicationStatus
        formId="21P-527EZ"
        login={{
          currentlyLoggedIn: true,
        }}
        showApplyButton
        applyText="Apply for benefit"
        profile={{
          loading: false,
          savedForms: [
            {
              form: VA_FORM_IDS.FORM_21P_527EZ,
              metadata: {
                expiresAt: getUnixTime(sub(Date.now(), { days: 1 })),
              },
            },
          ],
        }}
        formConfig={formConfigCustomMsgData}
      />,
    );
    expect(container.textContent).to.include('Custom start app message');
  });
  it('should display a custom button message when passing in continueAppButtonText', () => {
    const formConfigContinueAppMsgData = {
      customText: {
        continueAppButtonText: 'Custom continue app message',
      },
    };
    const { container } = render(
      <ApplicationStatus
        formId="21P-527EZ"
        login={{
          currentlyLoggedIn: true,
        }}
        showApplyButton
        applyText="Apply for benefit"
        profile={{
          loading: false,
          savedForms: [
            {
              form: VA_FORM_IDS.FORM_21P_527EZ,
              metadata: {
                expiresAt: getUnixTime(add(Date.now(), { days: 1 })),
                lastUpdated: getUnixTime(sub(Date.now(), { hours: 1 })),
              },
            },
          ],
        }}
        formConfig={formConfigContinueAppMsgData}
      />,
    );
    expect(container.textContent).to.include('Custom continue app message');
  });
});
