import React from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { connect } from 'react-redux';

import { RequiredLoginView } from '~/platform/user/authorization/components/RequiredLoginView';
import backendServices from '~/platform/user/profile/constants/backendServices';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import environment from 'platform/utilities/environment';
import IconCTALink from '../../dashboard/components/IconCTALink';

const VeteranOnboarding = ({ ...props }) => {
  const {
    useToggleValue,
    useToggleLoadingValue,
    TOGGLE_NAMES,
  } = useFeatureToggle();
  const togglesLoading = useToggleLoadingValue();
  const toggleValue = useToggleValue(TOGGLE_NAMES.veteranOnboardingBetaFlow);

  if (togglesLoading) {
    return null;
  }

  if (!toggleValue) {
    window.location.href = `${environment.BASE_URL}/my-va/`;
    return null;
  }

  return (
    <RequiredLoginView
      serviceRequired={[backendServices.USER_PROFILE]}
      user={props.user}
    >
      <div className="dashboard">
        <div className="vads-l-grid-container vads-u-padding-x--1 vads-u-padding-bottom--3 medium-screen:vads-u-padding-x--2 medium-screen:vads-u-padding-bottom--4">
          <VaAlert status="info" visible>
            <h2> Welcome to VA, {props.user.profile.userFullName.first}</h2>
            <p>
              Welcome to VA.gov, where our mission is to help you make a
              transition smooth transition from military life by providing easy
              access to all the benefits you have earned and are entitled to. We
              understand that transitioning out of the military can a daunting
              experience, which is why we offer a range of resources to help you
              discover and apply discover and apply for the benefits you
              deserve. deserve. hesitate to contct us if you need any
              assistance. We are help you get the most out of your benefits and
              make this new journey as seamless as possible.
            </p>
          </VaAlert>

          <div className="vads-u-margin-top--6 vads-u-margin-bottom-3">
            <h2>Quick Start with VA</h2>
            <div className="vads-l-row">
              <va-link
                active
                href="https://www.va.gov"
                text="Review your profile information"
              />
            </div>
            <div className="vads-l-row">
              Finish filling out your profile so we can better connect you with
              benefits
            </div>
            <div className="vads-l-row">
              <va-link
                active
                href="https://www.va.gov"
                text="Explore MyVA Benefits Status"
              />
            </div>
            <div className="vads-l-row">
              When you start an application or claim, they will live on your
              MyVA page.
            </div>
          </div>

          <div className="vads-u-margin-top--6 vads-u-margin-bottom-3">
            <h2>Access your benefits</h2>
            <div className="vads-l-row">
              <h3>Get VA Healthcare</h3>
            </div>
            <div className="vads-l-row">
              <ul>
                <li>
                  <va-link href="#" text="Find out if you're eligible" /> for
                  Veterans health care benefits and how priority groups work
                </li>
                <li>
                  <va-link href="#" text="Apply now" /> for the health care you
                  earned
                </li>
              </ul>
            </div>
            <div className="vads-l-row">
              <h3>Get VA disability compensation</h3>
            </div>
            <div className="vads-l-row">
              <ul>
                <li>
                  <va-link href="#" text="Find out if you're eligible" /> for
                  Veterans health care benefits and how priority groups work
                </li>
                <li>
                  <va-link href="#" text="Apply now" /> for the health care you
                  earned
                </li>
              </ul>
            </div>
            <div className="vads-l-row">
              <h3>Get VA Education benefits</h3>
            </div>
            <div className="vads-l-row">
              <ul>
                <li>
                  <va-link href="#" text="Find out if you're eligible" /> for
                  Veterans health care benefits and how priority groups work
                </li>
                <li>
                  <va-link href="#" text="Apply now" /> for the health care you
                  earned
                </li>
              </ul>
            </div>
            <div className="vads-l-row">Explore MyVA Benefits Status</div>
          </div>

          <div className="vads-u-margin-top--6 vads-u-margin-bottom-3">
            <h2>Get help with benefits</h2>
            <div className="vads-l-row">
              Review your profile information Finish filling out your profile so
              we can better connect you with benefits
            </div>
            <div className="vads-l-row">Explore MyVA Benefits Status</div>
          </div>

          <div className="vads-u-margin-top--6 vads-u-margin-bottom-3">
            <h2>Make the most of your VA experience</h2>
            <IconCTALink
              text="Download the VA Health and Benefits app"
              icon="file-medical"
              href="#"
            />
            <IconCTALink
              text="Download your Veteran Status Card"
              icon="file-medical"
              href="#"
            />
          </div>
        </div>
      </div>
    </RequiredLoginView>
  );
};

const mapStateToProps = state => {
  return {
    user: state.user,
  };
};

export default connect(
  mapStateToProps,
  undefined,
)(VeteranOnboarding);
