import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import {
  YourApplications,
  mapStateToProps,
} from '../../containers/YourApplications';

const defaultProps = {
  getEnrollmentStatus: sinon.stub(),
  getDismissedHCANotification: sinon.stub(),
  setDismissedHCANotification: sinon.stub(),
  savedForms: [],
};

const singleForm = {
  form: '1010ez',
  metadata: {
    lastUpdated: '2019-04-24T00:00:00.000-06:00',
    expiresAt: '2019-07-24T00:00:00.000-06:00',
  },
};

const enrollmentStatus = {
  enrollmentStatus: 'enrolled',
  applicationDate: '2019-04-24T00:00:00.000-06:00',
};

describe('mapStateToProps', () => {
  let state;
  beforeEach(() => {
    state = {
      user: {
        profile: {
          savedForms: [],
        },
      },
      hcaEnrollmentStatus: {
        isLoadingApplicationStatus: false,
        isLoadingDismissedNotification: false,
        dismissedNotificationDate: null,
        enrollmentStatusEffectiveDate: null,
        enrollmentStatus: null,
      },
    };
  });
  it('should set `shouldRenderContent` to false if there are saved forms but the HCA status is loading', () => {
    state.user.profile.savedForms = [singleForm];
    state.hcaEnrollmentStatus.isLoadingApplicationStatus = true;
    const mappedProps = mapStateToProps(state);
    expect(mappedProps.shouldRenderContent).to.be.false;
  });
  it('should set `shouldRenderContent` to false if there are saved forms but the dismissed notifications is loading', () => {
    state.user.profile.savedForms = [singleForm];
    state.hcaEnrollmentStatus.isLoadingDismissedNotification = true;
    const mappedProps = mapStateToProps(state);
    expect(mappedProps.shouldRenderContent).to.be.false;
  });
  it('should set `shouldRenderContent` to false if there are saved forms but the dismissed notifications is loading', () => {
    state.user.profile.savedForms = [singleForm];
    state.hcaEnrollmentStatus.isLoadingDismissedNotification = true;
    const mappedProps = mapStateToProps(state);
    expect(mappedProps.shouldRenderContent).to.be.false;
  });
});

describe('<YourApplications>', () => {
  it('should not render if `shouldRenderContent` is false', () => {
    const tree = shallow(
      <YourApplications {...defaultProps} shouldRenderContent={false} />,
    );

    expect(tree.html()).to.be.null;
    tree.unmount();
  });

  it('should render its default content if `shouldRenderContent` is true', () => {
    const tree = shallow(
      <YourApplications {...defaultProps} shouldRenderContent />,
    );

    expect(tree.find('div.profile-section').length).to.equal(1);
    expect(tree.find('h2.section-header').text()).to.equal('Your applications');
    tree.unmount();
  });

  it('should render a FormItem if passed a saved form', () => {
    const tree = shallow(
      <YourApplications
        {...defaultProps}
        shouldRenderContent
        savedForms={[singleForm]}
      />,
    );

    const formItem = tree.find('FormItem');
    expect(formItem.length).to.equal(1);
    expect(formItem.key()).to.equal(singleForm.form);
    expect(formItem.prop('savedFormData')).to.deep.equal(singleForm);
    tree.unmount();
  });

  it('should render a DashboardAlert', () => {
    const tree = shallow(
      <YourApplications
        {...defaultProps}
        shouldRenderContent
        shouldRenderHCAAlert
        hcaEnrollmentStatus={enrollmentStatus}
      />,
    );
    const alert = tree.find('DashboardAlert');
    expect(alert.length).to.equal(1);
    expect(alert.prop('headline')).to.equal('Application for health care');
    tree.unmount();
  });
});
