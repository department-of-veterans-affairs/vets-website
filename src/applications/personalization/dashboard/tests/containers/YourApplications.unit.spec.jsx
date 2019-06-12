import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import {
  YourApplications,
  mapStateToProps,
} from '../../containers/YourApplications';
import { HCA_ENROLLMENT_STATUSES } from 'applications/hca/constants';

const defaultProps = {
  getEnrollmentStatus: sinon.stub(),
  getDismissedHCANotification: sinon.stub(),
  setDismissedHCANotification: sinon.stub(),
  savedForms: [],
};

const sipEnabledForm = {
  form: '1010ez',
  metadata: {
    lastUpdated: '2019-04-24T00:00:00.000-06:00',
    expiresAt: '2019-07-24T00:00:00.000-06:00',
  },
};

const nonSIPEnabledForm = {
  form: 'a-non-sip-enabled-form',
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

  describe('`hcaEnrollmentStatus`', () => {
    it('is pulled directly out of the state', () => {
      let mappedProps = mapStateToProps(state);
      expect(mappedProps.hcaEnrollmentStatus).to.deep.equal(
        state.hcaEnrollmentStatus,
      );
      state.hcaEnrollmentStatus.isLoadingApplicationStatus = true;
      mappedProps = mapStateToProps(state);
      expect(mappedProps.hcaEnrollmentStatus).to.deep.equal(
        state.hcaEnrollmentStatus,
      );
    });
  });

  describe('`savedForms`', () => {
    it('is the filtered version of `profile.savedForms`', () => {
      let mappedProps = mapStateToProps(state);
      expect(mappedProps.savedForms).to.deep.equal([]);
      state.user.profile.savedForms = [nonSIPEnabledForm];
      mappedProps = mapStateToProps(state);
      expect(mappedProps.savedForms).to.deep.equal([]);
      state.user.profile.savedForms = [sipEnabledForm];
      mappedProps = mapStateToProps(state);
      expect(mappedProps.savedForms).to.deep.equal([sipEnabledForm]);
      state.user.profile.savedForms = [nonSIPEnabledForm, sipEnabledForm];
      mappedProps = mapStateToProps(state);
      expect(mappedProps.savedForms).to.deep.equal([sipEnabledForm]);
    });
  });

  // The value of `shouldRenderHCAAlert` is based on a lot of different factors,
  // so these unit tests cover a lot of the possible scenarios
  describe('`shouldRenderHCAAlert`', () => {
    beforeEach(() => {
      state = {
        user: {
          profile: {
            savedForms: [sipEnabledForm],
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
    it('should be false if the user is not in ESR', () => {
      let mappedProps = mapStateToProps(state);
      expect(mappedProps.shouldRenderHCAAlert).to.be.false;
      state.hcaEnrollmentStatus.enrollmentStatus =
        HCA_ENROLLMENT_STATUSES.noneOfTheAbove;
      mappedProps = mapStateToProps(state);
      expect(mappedProps.shouldRenderHCAAlert).to.be.false;
    });
    it('should be false if the HCA status is canceled/declined', () => {
      state.hcaEnrollmentStatus.enrollmentStatus =
        HCA_ENROLLMENT_STATUSES.canceledDeclined;
      const mappedProps = mapStateToProps(state);
      expect(mappedProps.shouldRenderHCAAlert).to.be.false;
    });
    it('should be false if the HCA status is deceased', () => {
      state.hcaEnrollmentStatus.enrollmentStatus =
        HCA_ENROLLMENT_STATUSES.deceased;
      const mappedProps = mapStateToProps(state);
      expect(mappedProps.shouldRenderHCAAlert).to.be.false;
    });
    describe('when the HCA status is `enrolled`', () => {
      beforeEach(() => {
        state.hcaEnrollmentStatus.enrollmentStatus =
          HCA_ENROLLMENT_STATUSES.enrolled;
        state.hcaEnrollmentStatus.enrollmentStatusEffectiveDate =
          '2019-05-01T00:00:00.000-06:00';
      });
      it('should be true if there is not `dismissedNotificationDate`', () => {
        const mappedProps = mapStateToProps(state);
        expect(mappedProps.shouldRenderHCAAlert).to.be.true;
      });
      it('should be true if the `dismissedNotificationDate` is before the `enrollmentStatusEffectiveDate`', () => {
        state.hcaEnrollmentStatus.enrollmentStatusEffectiveDate =
          '2019-04-01T00:00:00.000-06:00';
        const mappedProps = mapStateToProps(state);
        expect(mappedProps.shouldRenderHCAAlert).to.be.true;
      });
      it('should be false if the `dismissedNotificationDate` is equal to or after the `enrollmentStatusEffectiveDate`', () => {
        state.hcaEnrollmentStatus.dismissedNotificationDate =
          '2019-05-01T00:00:00.000-06:00';
        let mappedProps = mapStateToProps(state);
        expect(mappedProps.shouldRenderHCAAlert).to.be.false;
        state.hcaEnrollmentStatus.dismissedNotificationDate =
          '2019-06-01T00:00:00.000-06:00';
        mappedProps = mapStateToProps(state);
        expect(mappedProps.shouldRenderHCAAlert).to.be.false;
      });
    });
  });

  // The value of `shouldRenderContent` is based on a lot of different factors,
  // so these unit tests cover a lot of the possible scenarios
  describe('`shouldRenderContent`', () => {
    describe('when there are no saved forms and no HCA status', () => {
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
      it('should be false if the dismissed notifications and HCA status are loading', () => {
        state.hcaEnrollmentStatus.isLoadingDismissedNotification = true;
        state.hcaEnrollmentStatus.isLoadingApplicationStatus = true;
        const mappedProps = mapStateToProps(state);
        expect(mappedProps.shouldRenderContent).to.be.false;
      });
      it('should be false if the HCA status is loading', () => {
        state.hcaEnrollmentStatus.isLoadingApplicationStatus = true;
        const mappedProps = mapStateToProps(state);
        expect(mappedProps.shouldRenderContent).to.be.false;
      });
      it('should be false if the dismissed notifications is loading', () => {
        state.hcaEnrollmentStatus.isLoadingDismissedNotification = true;
        const mappedProps = mapStateToProps(state);
        expect(mappedProps.shouldRenderContent).to.be.false;
      });
      it('should be false if the dismissed notifications and HCA status have loaded', () => {
        const mappedProps = mapStateToProps(state);
        expect(mappedProps.shouldRenderContent).to.be.false;
      });
    });

    describe('when there is a saved form but no HCA status', () => {
      beforeEach(() => {
        state = {
          user: {
            profile: {
              savedForms: [sipEnabledForm],
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
      it('should be true if the dismissed notifications and HCA status have loaded', () => {
        const mappedProps = mapStateToProps(state);
        expect(mappedProps.shouldRenderContent).to.be.true;
      });
      it('should be false if the dismissed notifications and HCA status are loading', () => {
        state.hcaEnrollmentStatus.isLoadingDismissedNotification = true;
        state.hcaEnrollmentStatus.isLoadingApplicationStatus = true;
        const mappedProps = mapStateToProps(state);
        expect(mappedProps.shouldRenderContent).to.be.false;
      });
      it('should be false if the HCA status is loading', () => {
        state.hcaEnrollmentStatus.isLoadingApplicationStatus = true;
        const mappedProps = mapStateToProps(state);
        expect(mappedProps.shouldRenderContent).to.be.false;
      });
      it('should be false if the dismissed notifications is loading', () => {
        state.hcaEnrollmentStatus.isLoadingDismissedNotification = true;
        const mappedProps = mapStateToProps(state);
        expect(mappedProps.shouldRenderContent).to.be.false;
      });
      it('should be false if the dismissed notifications and HCA status have loaded but the saved form in not SIP-enabled', () => {
        state.user.profile.savedForms = [nonSIPEnabledForm];
        const mappedProps = mapStateToProps(state);
        expect(mappedProps.shouldRenderContent).to.be.false;
      });
    });

    describe('when there are no saved forms but there is an HCA status', () => {
      describe('when the dismissed notifications and HCA status have loaded', () => {
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
              enrollmentStatusEffectiveDate: '2019-05-01T00:00:00.000-06:00',
              enrollmentStatus: HCA_ENROLLMENT_STATUSES.enrolled,
            },
          };
        });
        it('should be true if the dismissedNotificationDate is not set', () => {
          const mappedProps = mapStateToProps(state);
          expect(mappedProps.shouldRenderContent).to.be.true;
        });
        it('should be true if the dismissedNotificationDate is before the enrollmentStatusEffectiveDate', () => {
          state.hcaEnrollmentStatus.dismissedNotificationDate =
            '2019-04-01T00:00:00.000-06:00';
          const mappedProps = mapStateToProps(state);
          expect(mappedProps.shouldRenderContent).to.be.true;
        });
        it('should be false if the dismissedNotificationDate is equal to the enrollmentStatusEffectiveDate', () => {
          state.hcaEnrollmentStatus.dismissedNotificationDate =
            '2019-05-01T00:00:00.000-06:00';
          const mappedProps = mapStateToProps(state);
          expect(mappedProps.shouldRenderContent).to.be.false;
        });
      });
    });
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
        savedForms={[sipEnabledForm]}
      />,
    );

    const formItem = tree.find('FormItem');
    expect(formItem.length).to.equal(1);
    expect(formItem.key()).to.equal(sipEnabledForm.form);
    expect(formItem.prop('savedFormData')).to.deep.equal(sipEnabledForm);
    tree.unmount();
  });

  it('should render a HCAStatusAlert', () => {
    const tree = shallow(
      <YourApplications
        {...defaultProps}
        shouldRenderContent
        shouldRenderHCAAlert
        hcaEnrollmentStatus={enrollmentStatus}
      />,
    );
    const alert = tree.find('HCAStatusAlert');
    expect(alert.length).to.equal(1);
    expect(alert.prop('enrollmentStatus')).to.equal(
      enrollmentStatus.enrollmentStatus,
    );
    tree.unmount();
  });
});
