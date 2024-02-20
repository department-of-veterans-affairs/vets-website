import React from 'react';
import moment from 'moment';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';
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
    const tree = SkinDeep.shallowRender(
      <ApplicationStatus
        formId="21P-527EZ"
        login={{}}
        profile={{
          loading: true,
        }}
        formConfig={formConfigDefaultData}
      />,
    );

    expect(tree.subTree('va-loading-indicator')).to.not.be.false;
  });
  it('should render apply link', () => {
    const tree = SkinDeep.shallowRender(
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

    expect(tree.subTree('.vads-c-action-link--green').text()).to.equal(
      'Apply for benefit',
    );
  });
  it('should render saved form', () => {
    const tree = SkinDeep.shallowRender(
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
                expiresAt: moment()
                  .add(1, 'day')
                  .unix(),
              },
            },
          ],
        }}
        formConfig={formConfigDefaultData}
      />,
    );

    expect(tree.subTree('.usa-alert-info')).to.not.be.false;
    expect(tree.subTree('.usa-button-primary').text()).to.equal(
      'Continue your application',
    );
    expect(tree.subTree('.form-title').text()).to.contain(
      'Your application is in progress',
    );
  });
  it('should set wizard complete on continuing the application', () => {
    const wizardStatus = 'testKey';
    const tree = SkinDeep.shallowRender(
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
                expiresAt: moment()
                  .add(1, 'day')
                  .unix(),
              },
            },
          ],
        }}
        formConfig={formConfigDefaultData}
      />,
    );

    tree.subTree('.usa-button-primary').props.onClick();
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
                expiresAt: moment()
                  .add(1, 'day')
                  .unix(),
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
    const tree = SkinDeep.shallowRender(
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
                expiresAt: moment()
                  .add(-1, 'day')
                  .unix(),
              },
            },
          ],
        }}
        formConfig={formConfigDefaultData}
      />,
    );
    expect(tree.subTree('.usa-alert-warning')).to.not.be.false;
    expect(tree.text()).to.include('start a new application');
  });
  it('should render saved form from ids', () => {
    const tree = SkinDeep.shallowRender(
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
                expiresAt: moment()
                  .add(1, 'day')
                  .unix(),
              },
            },
          ],
        }}
        formConfig={formConfigDefaultData}
      />,
    );
    expect(tree.subTree('.usa-alert-info')).to.not.be.false;
    expect(tree.subTree('.usa-button-primary').text()).to.equal(
      'Continue your application',
    );
    expect(tree.subTree('.form-title').text()).to.contain(
      'Your application is in progress',
    );
  });
  it('should render multiple forms message', () => {
    const tree = SkinDeep.shallowRender(
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
                expiresAt: moment()
                  .add(1, 'day')
                  .unix(),
              },
            },
            {
              form: VA_FORM_IDS.FORM_22_1995,
              metadata: {
                expiresAt: moment()
                  .add(1, 'day')
                  .unix(),
              },
            },
          ],
        }}
        formConfig={formConfigDefaultData}
      />,
    );

    expect(tree.subTree('.usa-alert-info')).to.not.be.false;
    expect(tree.subTree('.usa-alert-info').text()).to.contain(
      'more than one in-progress application',
    );
  });
  it('should display a custom button message when passing in startNewAppButtonText', () => {
    const formConfigCustomMsgData = {
      customText: {
        startNewAppButtonText: 'Custom start app message',
      },
    };
    const tree = SkinDeep.shallowRender(
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
                expiresAt: moment()
                  .subtract(1, 'day')
                  .unix(),
              },
            },
          ],
        }}
        formConfig={formConfigCustomMsgData}
      />,
    );
    expect(tree.text()).to.include('Custom start app message');
  });
  it('should display a custom button message when passing in continueAppButtonText', () => {
    const formConfigContinueAppMsgData = {
      customText: {
        continueAppButtonText: 'Custom continue app message',
      },
    };
    const tree = SkinDeep.shallowRender(
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
                expiresAt: moment()
                  .add(+1, 'day')
                  .unix(),
                lastUpdated: moment()
                  .subtract(1, 'hour')
                  .unix(),
              },
            },
          ],
        }}
        formConfig={formConfigContinueAppMsgData}
      />,
    );
    expect(tree.text()).to.include('Custom continue app message');
  });
});
