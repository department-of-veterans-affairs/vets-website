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

// TODO: Get a proper mapping of programArea -> display output
const appealTypeMap = {
  compensation: 'Compensation',
  pension: 'Pension',
  insurance: 'Insurance',
  loan_guaranty: 'Loan Guaranty', // eslint-disable-line
  education: 'Education',
  vre: 'VRE',
  medical: 'Medical',
  burial: 'Burial',
  bva: 'BVA',
  other: 'Other',
  multiple: 'Multiple',
};


export default function AppealListItem({ appeal }) {
  // always show merged event on top
  const events = _.orderBy(appeal.attributes.events, [e => e.type === 'merged', e => moment(e.date).unix()], ['desc', 'desc']);
  const lastEvent = events[0];
  const firstEvent = events[events.length - 1];
  const previousHistory = events.slice(1);

  return (
    <div className="claim-list-item-container">
      <h3 className="claim-list-item-header-v2">
        Appeal of {appealTypeMap[appeal.attributes.programArea]}
        <br/>
        Decision Received {moment(firstEvent.date).format('MMMM D, YYYY')}
        {/* <strong>Last changed: </strong> {moment(lastEvent.date).format('MMMM D, YYYY')} */}
      </h3>
      <div className="card-status">
        <div className={`status-circle ${appeal.attributes.active ? 'open' : 'closed'}`}/>
        <p><strong>Status:</strong> {appealStatusDescriptions(lastEvent, previousHistory).status.title}</p>
      </div>
      <div className="communications">
        {renderNextAction(lastEvent, previousHistory)}
      </div>
      <Link className="usa-button usa-button-primary" to={`appeals-v2/${appeal.id}/status`}>View status<i className="fa fa-chevron-right"/></Link>
    </div>
  );
}

AppealListItem.propTypes = {
  appeal: PropTypes.object
};
