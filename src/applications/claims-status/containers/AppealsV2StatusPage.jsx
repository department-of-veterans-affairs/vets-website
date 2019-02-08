import React from 'react';
import PropTypes from 'prop-types';

import {
  getAlertContent,
  getStatusContents,
  getNextEvents,
  ALERT_TYPES,
  APPEAL_ACTIONS,
  APPEAL_TYPES,
  STATUS_TYPES,
} from '../utils/appeals-v2-helpers';

import Timeline from '../components/appeals-v2/Timeline';
import CurrentStatus from '../components/appeals-v2/CurrentStatus';
import AlertsList from '../components/appeals-v2/AlertsList';
import WhatsNext from '../components/appeals-v2/WhatsNext';
import Docket from '../components/appeals-v2/Docket';

/**
 * AppealsV2StatusPage is in charge of the layout of the status page
 */
const AppealsV2StatusPage = ({ appeal, fullName }) => {
  const {
    events,
    alerts,
    status,
    docket,
    incompleteHistory,
    location,
    aod,
    active: appealIsActive,
    type: appealAction,
  } = appeal.attributes;
  const currentStatus = getStatusContents(
    status.type,
    status.details,
    fullName,
  );
  const nextEvents = getNextEvents(status.type, status.details);

  // Gates the What's Next and Docket chunks
  const hideDocketStatusTypes = [
    STATUS_TYPES.pendingSoc,
    STATUS_TYPES.pendingForm9,
    STATUS_TYPES.decisionInProgress,
    STATUS_TYPES.bvaDevelopment,
  ];
  const hideDocketAppealActions = [
    APPEAL_ACTIONS.reconsideration,
    APPEAL_ACTIONS.cue,
  ];

  let shouldShowDocket;

  switch (appeal.type) {
    case APPEAL_TYPES.legacy:
      shouldShowDocket =
        appealIsActive &&
        !hideDocketStatusTypes.includes(status.type) &&
        !hideDocketAppealActions.includes(appealAction);
      break;
    case APPEAL_TYPES.appeal:
      shouldShowDocket = appealIsActive && location === 'bva';
      break;
    default:
      shouldShowDocket = false;
  }

  const filteredAlerts = alerts.filter(a => a.type !== ALERT_TYPES.cavcOption);
  const afterNextAlerts = (
    <div>
      {alerts.filter(a => a.type === ALERT_TYPES.cavcOption).map((a, i) => {
        const alert = getAlertContent(a, appealIsActive);
        return (
          <div key={`after-next-alert-${i}`}>
            <h2>{alert.title}</h2>
            <div>{alert.description}</div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div aria-labelledby="tabv2status" id="tabPanelv2status" role="tabpanel">
      <Timeline events={events} missingEvents={incompleteHistory} />
      <CurrentStatus
        title={currentStatus.title}
        description={currentStatus.description}
        isClosed={!appealIsActive}
      />
      <AlertsList alerts={filteredAlerts} appealIsActive />
      {appealIsActive && <WhatsNext nextEvents={nextEvents} />}
      {shouldShowDocket && (
        <Docket {...docket} aod={aod} appealAction={appealAction} />
      )}
      {!appealIsActive && (
        <div className="closed-appeal-notice">This appeal is now closed</div>
      )}
      {afterNextAlerts}
    </div>
  );
};

AppealsV2StatusPage.propTypes = {
  appeal: PropTypes.shape({
    attributes: PropTypes.shape({
      events: PropTypes.array,
      alerts: PropTypes.array,
      status: PropTypes.shape({
        type: PropTypes.string,
        details: PropTypes.object,
      }).isRequired,
      docket: PropTypes.object,
    }).isRequired,
  }),
  fullName: PropTypes.shape({
    first: PropTypes.string,
    middle: PropTypes.string,
    last: PropTypes.string,
  }),
};

export default AppealsV2StatusPage;
