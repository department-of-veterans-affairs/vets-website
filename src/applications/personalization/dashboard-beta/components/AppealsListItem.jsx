import _ from 'lodash';
import { Link } from 'react-router';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';

import { appealStatusDescriptions } from '../../../claims-status/utils/appeal-helpers.jsx';

const renderNextAction = (lastEvent, previousHistory) => {
  if (lastEvent.type === 'ssoc' && previousHistory[0].type !== 'soc') {
    return null;
  }
  const nextAction = appealStatusDescriptions(lastEvent, previousHistory).nextAction;
  return nextAction && nextAction.title;
};

export default function AppealListItem({ appeal }) {
  // always show merged event on top
  const events = _.orderBy(appeal.attributes.events, [e => e.type === 'merged', e => moment(e.date).unix()], ['desc', 'desc']);
  const lastEvent = events[0];
  const firstEvent = events[events.length - 1];
  const previousHistory = events.slice(1);

  return (
    <div className="claim-list-item-container">
      <h4 className="claim-list-item-header">Compensation Appeal – Received {moment(firstEvent.date).format('MMM D, YYYY')}</h4>
      <p className="status"><span className="claim-item-label">{moment(lastEvent.date).format('MMMM D')} — </span> {appealStatusDescriptions(lastEvent, previousHistory).status.title}</p>
      <div className="communications">
        {renderNextAction(lastEvent, previousHistory)}
      </div>
      <p>
        <Link className="usa-button usa-button-primary" href={`/track-claims/appeals/${appeal.id}/status`}>View appeal</Link>
      </p>
    </div>
  );
}

AppealListItem.propTypes = {
  appeal: PropTypes.object
};
