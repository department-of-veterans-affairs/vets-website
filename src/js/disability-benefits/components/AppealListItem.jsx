import _ from 'lodash';
import { Link } from 'react-router';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';

import { appealStatusDescriptions } from '../utils/appeal-helpers.jsx';

export default function AppealListItem({ appeal }) {
  const events = _.orderBy(appeal.attributes.events, [(e) => {
    return moment(e.date).unix();
  }]);
  const lastEvent = events.slice(-1)[0];
  const firstEvent = events[0];

  return (
    <Link className="claim-list-item" to={`appeals/${appeal.id}/status`}>
      <h4 className="claim-list-item-header">Compensation Appeal – Last updated {moment(lastEvent.date).format('MMMM D, YYYY')}</h4>
      <p className="status"><span className="claim-item-label">Status:</span> {appealStatusDescriptions(lastEvent.type).status.title}</p>
      <div className="communications">
        {appealStatusDescriptions(lastEvent.type).nextAction.title}
      </div>
      <p><span className="claim-item-label">Appeal received:</span> {moment(firstEvent.date).format('MMM D, YYYY')}</p>
    </Link>
  );
}

AppealListItem.propTypes = {
  appeal: PropTypes.object
};
