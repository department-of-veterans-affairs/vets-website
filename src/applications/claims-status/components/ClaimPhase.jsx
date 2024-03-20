import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import PropTypes from 'prop-types';

import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';

import { getUserPhaseDescription } from '../utils/helpers';

const stepClasses = {
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five last',
};

function getClasses(phase, current) {
  const processClass = 'process-step';
  const stepClass = stepClasses[phase];
  if (phase === current) {
    return `${processClass} list-${stepClass} section-current`;
  }
  if (current > phase) {
    return `${processClass} list-${stepClass} section-complete`;
  }

  return `${processClass} list-${stepClass}`;
}

export default class ClaimPhase extends React.Component {
  constructor(props) {
    super();
    this.state = { open: props.current === props.phase, showOlder: false };
    this.expandCollapse = this.expandCollapse.bind(this);
    this.displayActivity = this.displayActivity.bind(this);
    this.showOlderActivity = this.showOlderActivity.bind(this);
    this.getEventDescription = this.getEventDescription.bind(this);
  }

  getEventDescription(event) {
    const { id, phase } = this.props;
    const filesPath = `your-claims/${id}/document-request/${event.id}`;
    const file = event.originalFileName || event.documentTypeLabel || '';

    switch (event.type) {
      case 'phase_entered':
        return (
          <div className="claims-evidence-item">
            Your claim moved to {getUserPhaseDescription(phase)}
          </div>
        );

      case 'filed':
        return (
          <div className="claims-evidence-item">
            Thank you. VA received your claim
          </div>
        );

      case 'completed':
        return <div className="claims-evidence-item">Your claim is closed</div>;

      case 'tracked_item':
        switch (event.status) {
          case 'NEEDED_FROM_YOU':
          case 'NEEDED_FROM_OTHERS':
            return (
              <div className="claims-evidence-item">
                We added a notice for:{' '}
                <Link to={filesPath}>{event.displayName}</Link>
              </div>
            );
          case 'SUBMITTED_AWAITING_REVIEW':
            return (
              <div className="claims-evidence-item">
                You or someone else submitted {event.displayName}.
              </div>
            );
          case 'INITIAL_REVIEW_COMPLETE':
          case 'ACCEPTED':
            return (
              <div className="claims-evidence-item">
                We have reviewed your submitted evidence for {event.displayName}
                . We will notify you if we need additional information.
              </div>
            );
          case 'NO_LONGER_REQUIRED':
            return (
              <div className="claims-evidence-item">
                We closed the notice for {event.displayName}
              </div>
            );
          default:
            return null;
        }

      case 'supporting_document':
        return (
          <div className="claims-evidence-item">
            You or someone else submitted {file ? `"${file}"` : 'a file'}.
          </div>
        );

      default:
        return null;
    }
  }

  displayActivity() {
    const { activity, phase } = this.props;
    const { showOlder } = this.state;
    const activityList = activity[phase] || [];
    const hasMoreActivity = activityList.length > 1;

    if (activityList.length) {
      return (
        <>
          <h5 className="vads-u-margin-bottom--1">Latest update</h5>
          <ol className="claims-evidence-list">
            <li>
              <div className="claims-evidence vads-u-padding--0">
                <div className="claims-evidence-date">
                  {moment(activityList[0].date).format('MMMM D, YYYY')}
                </div>
                {this.getEventDescription(activityList[0])}
              </div>
            </li>
          </ol>
          {hasMoreActivity ? (
            <>
              <h5 className="vads-u-margin-top--2p5 vads-u-margin-bottom--2">
                {`Past updates (${activityList.length - 1})`}
              </h5>
              <va-button
                secondary
                text={`${showOlder ? 'Hide' : 'Show'} past updates`}
                onClick={this.showOlderActivity}
                uswds
              />
            </>
          ) : null}
          {showOlder && hasMoreActivity ? (
            <ol id={`older-updates-${phase}`} className="claims-evidence-list">
              {activityList.slice(1).map((event, index) => (
                <li key={index}>
                  <div className="claims-evidence">
                    <div className="claims-evidence-date">
                      {moment(event.date).format('MMMM D, YYYY')}
                    </div>
                    {this.getEventDescription(event)}
                  </div>
                </li>
              ))}
            </ol>
          ) : null}
        </>
      );
    }

    return null;
  }

  showOlderActivity(event) {
    event.stopPropagation();
    this.setState(prev => ({ showOlder: !prev.showOlder }));
  }

  expandCollapse() {
    recordEvent({
      event: 'claims-expandcollapse',
    });
    const { phase, current } = this.props;
    const { open } = this.state;
    if (phase <= current) {
      this.setState({ open: !open });
    }
  }

  render() {
    const { children, current, phase } = this.props;
    const titleText = getUserPhaseDescription(phase);
    const title = <div className="section-header-title">{titleText}</div>;

    return (
      <li className={`${getClasses(phase, current)}`}>
        <h4 className="section-header vads-u-font-size--h4">{title}</h4>
        <div>
          {children}
          {this.displayActivity()}
        </div>
      </li>
    );
  }
}

ClaimPhase.propTypes = {
  id: PropTypes.string.isRequired,
  phase: PropTypes.number.isRequired,
  activity: PropTypes.object,
  children: PropTypes.any,
  current: PropTypes.number,
};
