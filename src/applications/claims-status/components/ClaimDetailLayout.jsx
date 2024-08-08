import React from 'react';
import PropTypes from 'prop-types';

import {
  buildDateFormatter,
  claimAvailable,
  getClaimType,
  isClaimOpen,
  isPopulatedClaim,
} from '../utils/helpers';
import { setFocus } from '../utils/page';
import AddingDetails from './AddingDetails';
import NeedHelp from './NeedHelp';
import ClaimsBreadcrumbs from './ClaimsBreadcrumbs';
import ClaimsUnavailable from './ClaimsUnavailable';
import ClaimContentionList from './ClaimContentionList';
import Notification from './Notification';
import TabNav from './TabNav';

const focusHeader = () => {
  setFocus('.claim-contentions-header');
};

const getBreadcrumbText = (currentTab, claimType) => {
  let joiner;
  if (currentTab === 'Status' || currentTab === 'Details') {
    joiner = 'of';
  } else {
    joiner = 'for';
  }

  return `${currentTab} ${joiner} your ${claimType} claim`;
};

export default function ClaimDetailLayout(props) {
  const { claim, clearNotification, currentTab, loading, message } = props;

  const tabs = ['Status', 'Files', 'Details', 'Overview'];
  const claimType = getClaimType(claim).toLowerCase();

  let bodyContent;
  let headingContent;
  if (loading) {
    bodyContent = (
      <va-loading-indicator
        set-focus
        message="Loading your claim information..."
      />
    );
  } else if (claimAvailable(claim)) {
    const claimTitle = `Your ${claimType} claim`;
    const { claimDate, closeDate, contentions, status } =
      claim.attributes || {};

    const isOpen = isClaimOpen(status, closeDate);
    const formattedClaimDate = buildDateFormatter()(claimDate);
    const claimSubheader = `Received on ${formattedClaimDate}`;

    headingContent = (
      <>
        {message && (
          <Notification
            title={message.title}
            body={message.body}
            type={message.type}
            onClose={clearNotification}
          />
        )}
        <h1 className="claim-title">
          {claimTitle}
          <span className="vads-u-font-family--sans vads-u-margin-top--1">
            {claimSubheader}
          </span>
        </h1>
        <div className="claim-contentions">
          <h2 className="claim-contentions-header vads-u-font-size--h3">
            What you’ve claimed
          </h2>
          <ClaimContentionList
            contentions={contentions}
            onClick={focusHeader}
          />
        </div>
      </>
    );

    bodyContent = (
      <div className="claim-container">
        <TabNav id={claim.id} />
        {tabs.map(tab => (
          <div key={tab} id={`tabPanel${tab}`} className="tab-panel">
            {currentTab === tab && (
              <div className="tab-content claim-tab-content">
                {isPopulatedClaim(claim.attributes || {}) || !isOpen ? null : (
                  <AddingDetails />
                )}
                {props.children}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  } else {
    bodyContent = (
      <>
        <h1>We encountered a problem</h1>
        <ClaimsUnavailable headerLevel={2} />
      </>
    );
  }

  const crumb = {
    href: `../status`,
    label: getBreadcrumbText(currentTab, claimType),
    isRouterLink: true,
  };

  return (
    <div>
      <div name="topScrollElement" />
      <div className="row">
        <div className="usa-width-two-thirds medium-8 columns">
          <ClaimsBreadcrumbs crumbs={[crumb]} />
          {!!headingContent && <div>{headingContent}</div>}
          <div>{bodyContent}</div>
          <NeedHelp />
        </div>
      </div>
    </div>
  );
}

ClaimDetailLayout.propTypes = {
  children: PropTypes.any,
  claim: PropTypes.object,
  clearNotification: PropTypes.func,
  currentTab: PropTypes.string,
  loading: PropTypes.bool,
  message: PropTypes.object,
};
