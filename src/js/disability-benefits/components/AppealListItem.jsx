import _ from 'lodash';
import { Link } from 'react-router';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';

import { appealStatusDescriptions } from '../utils/appeal-helpers.jsx';

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
  const previousHistory = events.slice(1);
  const firstEvent = events[events.length - 1];

  return (
    <Link className="claim-list-item" to={`appeals/${appeal.id}/status`}>
      <h4 className="claim-list-item-header">Compensation Appeal – Last updated {moment(lastEvent.date).format('MMMM D, YYYY')}</h4>
      <p className="status"><span className="claim-item-label">Status:</span> {appealStatusDescriptions(lastEvent, previousHistory).status.title}</p>
      <div className="communications">
        {renderNextAction(lastEvent, previousHistory)}
      </div>
      <p><span className="claim-item-label">Appeal received:</span> {moment(firstEvent.date).format('MMM D, YYYY')}</p>
    </Link>
  );
}

AppealListItem.propTypes = {
  appeal: PropTypes.object
};
