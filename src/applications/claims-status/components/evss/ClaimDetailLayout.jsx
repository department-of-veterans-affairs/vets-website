import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';

import TabNav from '../TabNav';
import ClaimSyncWarning from '../ClaimSyncWarning';
import AskVAQuestions from '../AskVAQuestions';
import AddingDetails from '../AddingDetails';
import Notification from '../Notification';
import ClaimsBreadcrumbs from '../ClaimsBreadcrumbs';
import ClaimsUnavailable from '../ClaimsUnavailable';
import { getClaimType } from '../../utils/helpers';

const MAX_CONTENTIONS = 3;

export const isPopulatedClaim = ({ attributes }) =>
  !!attributes.claimType &&
  (attributes.contentionList && !!attributes.contentionList.length) &&
  !!attributes.dateFiled;

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
  const tabs = ['Status', 'Files', 'Details'];
  const claimsPath = `your-claims/${id}`;

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
  } else if (claim !== null) {
    const claimTitle = `Your ${claimType} claim`;

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
        <h1 className="claim-title">{claimTitle}</h1>
        {!synced && <ClaimSyncWarning olderVersion={!synced} />}
        <div className="claim-contentions">
          <h2 className="claim-contentions-header vads-u-font-size--h6">
            What you’ve claimed:
          </h2>
          <span>
            {claim?.attributes?.contentionList &&
            claim.attributes.contentionList.length
              ? claim.attributes.contentionList
                  .slice(0, MAX_CONTENTIONS)
                  .map(cond => cond.trim())
                  .join(', ')
              : 'Not available'}
          </span>
          {claim?.attributes?.contentionList &&
          claim.attributes.contentionList.length > MAX_CONTENTIONS ? (
            <span>
              <br />
              <Link to={`your-claims/${claim.id}/details`}>
                See all your claimed contentions
              </Link>
              .
            </span>
          ) : null}
        </div>
      </>
    );

    bodyContent = (
      <div className="claim-container">
        <TabNav id={props.claim.id} />
        {tabs.map(tab => (
          <div key={tab} id={`tabPanel${tab}`}>
            {currentTab === tab && (
              <div className="tab-content claim-tab-content">
                {isPopulatedClaim(claim || {}) ||
                !claim?.attributes.open ? null : (
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
