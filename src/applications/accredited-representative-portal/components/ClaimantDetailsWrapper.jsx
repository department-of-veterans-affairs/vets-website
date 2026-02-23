import React from 'react';
import PropTypes from 'prop-types';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles/useFeatureToggle';
import {
  VaSidenav,
  VaSidenavItem,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const ClaimantDetailsWrapper = ({ firstName, lastName, children }) => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const { pathname } = useLocation();
  const { claimantId } = useParams();
  const activeTab = pathname.split('/')[2];
  const isClaimantDetailsEnabled = useToggleValue(
    TOGGLE_NAMES.accreditedRepresentativePortalClaimantDetails,
  );
  if (!isClaimantDetailsEnabled) {
    return <Navigate to="/find-claimant" replace />;
  }
  const isActive = path => (activeTab === path ? true : undefined);
  const sideNavLinks = [
    { label: 'Claimant overview', route: 'claimant-overview' },
    { label: 'Submission history', route: 'submission-history' },
  ];
  const buildLink = path =>
    `/representative/find-claimant/${path}/${claimantId}`;
  return (
    <div>
      <h1>
        <div className="vads-u-font-size--h2 vads-u-font-weight--normal">
          Claimant
        </div>
        {lastName}, {firstName}
      </h1>
      <hr />
      <div className="vads-grid-container vads-u-padding-x--0">
        <div className="vads-grid-row">
          <div className="vads-u-padding-right--2p5 vads-grid-col-12 tablet:vads-grid-col-4 desktop-lg:vads-grid-col-3">
            <VaSidenav
              header="Claimant"
              icon-background-color="vads-color-primary"
              icon-name="account_circle"
            >
              {sideNavLinks.map((sideNavLink, index) => (
                <VaSidenavItem
                  key={index}
                  href={buildLink(sideNavLink.route)}
                  label={sideNavLink.label}
                  currentPage={isActive(sideNavLink.route)}
                />
              ))}
            </VaSidenav>
          </div>
          <div className="vads-u-padding-left--2p5 vads-grid-col-12 tablet:vads-grid-col-8 desktop-lg:vads-grid-col-9">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

ClaimantDetailsWrapper.propTypes = {
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default ClaimantDetailsWrapper;
