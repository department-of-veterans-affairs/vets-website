import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

import { DATE_FORMATS } from '../constants';
import {
  buildDateFormatter,
  getClaimType,
  isPopulatedClaim,
} from '../utils/helpers';
import { setFocus } from '../utils/page';
import AddingDetails from './AddingDetails';
import AskVAQuestions from './AskVAQuestions';
import ClaimsBreadcrumbs from './ClaimsBreadcrumbs';
import ClaimSyncWarning from './ClaimSyncWarning';
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
  const {
    claim,
    loading,
    message,
    clearNotification,
    currentTab,
    synced,
    id,
  } = props;
  const tabs = ['Status', 'Files', 'Details', 'Overview'];
  const claimsPath = `your-claims/${id}`;

  const claimType = getClaimType(claim).toLowerCase();

  let bodyContent;
  let headingContent;
  if (loading) {
    bodyContent = (
      <va-loading-indicator
        set-focus
        message="Loading your claim information..."
        uswds="false"
      />
    );
  } else if (claim !== null) {
    const claimTitle = `Your ${claimType} claim`;
    const { closeDate, contentions, status } = claim.attributes || {};

    const isOpen = status !== 'COMPLETE' && closeDate === null;

    const formatDate = buildDateFormatter(DATE_FORMATS.LONG_DATE);
    const formattedClaimDate = formatDate(claim.attributes.claimDate);
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
        {!synced && <ClaimSyncWarning olderVersion={!synced} />}
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
        <TabNav id={props.claim.id} />
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

  return (
    <div>
      <div name="topScrollElement" />
      <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
        <div className="vads-l-row vads-u-margin-x--neg1p5 medium-screen:vads-u-margin-x--neg2p5">
          <div className="vads-l-col--12">
            <ClaimsBreadcrumbs>
              <Link to={claimsPath}>
                {getBreadcrumbText(currentTab, claimType)}
              </Link>
            </ClaimsBreadcrumbs>
          </div>
        </div>
        {!!headingContent && (
          <div className="vads-l-row vads-u-margin-x--neg2p5">
            <div className="vads-l-col--12 vads-u-padding-x--2p5">
              {headingContent}
            </div>
          </div>
        )}
        <div className="vads-l-row vads-u-margin-x--neg2p5">
          <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--8">
            {bodyContent}
          </div>
          <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--4 help-sidebar">
            <AskVAQuestions />
          </div>
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
  id: PropTypes.string,
  loading: PropTypes.bool,
  message: PropTypes.object,
  synced: PropTypes.bool,
};
