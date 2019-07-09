import React from 'react';
import moment from 'moment';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import { VA_FORM_IDS } from 'platform/forms/constants';

import { ApplicationStatus } from '../../save-in-progress/ApplicationStatus';

describe('schemaform <ApplicationStatus>', () => {
  it('should render loading', () => {
    const tree = SkinDeep.shallowRender(
      <ApplicationStatus
        formId="21P-527EZ"
        login={{}}
        profile={{
          loading: true,
        }}
      />,
    );

    expect(tree.subTree('LoadingIndicator')).to.not.be.false;
  });
  it('should render apply button', () => {
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
      />,
    );

    expect(tree.subTree('.usa-button-primary').text()).to.equal(
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
      />,
    );

    expect(tree.subTree('.usa-alert-info')).to.not.be.false;
    expect(tree.subTree('.usa-button-primary').text()).to.equal(
      'Continue your application',
    );
    expect(tree.subTree('.form-title').text()).to.contain(
      'Your form is in progress',
    );
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
      />,
    );
    expect(tree.subTree('.usa-alert-warning')).to.not.be.false;
    expect(tree.subTree('.usa-button-primary').text()).to.equal(
      'Start a new application',
    );
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
      />,
    );

    expect(tree.subTree('.usa-alert-info')).to.not.be.false;
    expect(tree.subTree('.usa-button-primary').text()).to.equal(
      'Continue your application',
    );
    expect(tree.subTree('.form-title').text()).to.contain(
      'Your form is in progress',
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
      />,
    );

    expect(tree.subTree('.usa-alert-info')).to.not.be.false;
    expect(tree.subTree('.usa-alert-info').text()).to.contain(
      'more than one in-progress form',
    );
  });
});
