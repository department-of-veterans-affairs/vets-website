import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import take from 'lodash/take';

import recordEvent from 'platform/monitoring/record-event';
import { getUserPhaseDescription } from '../utils/helpers';

const stepClasses = {
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five last',
};

const COMPLETE_PHASE = 5;
const INITIAL_ACTIVITY_ROWS = 5;

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
    this.state = { open: props.current === props.phase, showAll: false };
    this.expandCollapse = this.expandCollapse.bind(this);
    this.displayActivity = this.displayActivity.bind(this);
    this.showAllActivity = this.showAllActivity.bind(this);
    this.getEventDescription = this.getEventDescription.bind(this);
  }

  getEventDescription(event) {
    const { id, phase } = this.props;
    const filesPath = `your-claims/${id}/document-request/${
      event.trackedItemId
    }`;

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

      case 'still_need_from_you_list':
      case 'still_need_from_others_list':
        if (event.uploaded || event.status === 'SUBMITTED_AWAITING_REVIEW') {
          return (
            <div className="claims-evidence-item">
              You or others submitted {event.displayName}. We will notify you
              when we have reviewed it.
            </div>
          );
        }
        return (
          <div className="claims-evidence-item">
            We added a notice for:{' '}
            <Link to={filesPath}>{event.displayName}</Link>
          </div>
        );

      case 'received_from_you_list':
      case 'received_from_others_list':
        if (event.status === 'SUBMITTED_AWAITING_REVIEW') {
          return (
            <div className="claims-evidence-item">
              You or others submitted {event.displayName}. We will notify you
              when we have reviewed it.
            </div>
          );
        }
        return (
          <div className="claims-evidence-item">
            We have reviewed your submitted evidence for {event.displayName}. We
            will notify you if we need additional information.
          </div>
        );
      case 'never_received_from_you_list':
      case 'never_received_from_others_list':
        return (
          <div className="claims-evidence-item">
            We closed the notice for {event.displayName}
          </div>
        );

      case 'other_documents_list':
        return (
          <div className="claims-evidence-item">
            You or others submitted {event.fileType}. We will notify you when
            we’ve reviewed it.
          </div>
        );

      default:
        return null;
    }
  }

  displayActivity() {
    const { activity, phase } = this.props;
    const { showAll } = this.state;
    const activityList = activity[phase];

    if (activityList) {
      const limitedList =
        showAll || activityList.length <= INITIAL_ACTIVITY_ROWS
          ? activityList
          : take(activityList, INITIAL_ACTIVITY_ROWS);

      const activityListContent = limitedList.map((singleActivity, index) => (
        <div key={index} className="claims-evidence">
          <div className="claims-evidence-date">
            {moment(singleActivity.date).format('MMM D, YYYY')}
          </div>
          {this.getEventDescription(singleActivity)}
        </div>
      ));

      if (!showAll && activityList.length > INITIAL_ACTIVITY_ROWS) {
        return (
          <div>
            <div>{activityListContent}</div>
            <button
              type="button"
              className="claim-older-updates usa-button-secondary"
              onClick={this.showAllActivity}
            >
              See older updates&nbsp;
              <i className="fa fa-chevron-down" />
            </button>
          </div>
        );
      }

      return activityListContent;
    }

    return null;
  }

  showAllActivity(event) {
    this.setState({ showAll: true });
    event.stopPropagation();
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
    const { phase, current, children } = this.props;
    const { open } = this.state;
    const expandCollapseIcon =
      phase <= current ? (
        <i
          aria-hidden="true"
          className={
            open
              ? 'fa fa-minus claim-timeline-icon'
              : 'fa fa-plus claim-timeline-icon'
          }
        />
      ) : null;

    const handler = {
      getDescriptionClick: e => {
        e.preventDefault();
        this.expandCollapse();
      },
    };

    return (
      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
      <li className={`${getClasses(phase, current)}`}>
        {expandCollapseIcon}
        <h3 className="section-header vads-u-font-size--h4">
          <button
            type="button"
            className="section-header-button"
            aria-expanded={open}
            onClick={handler.getDescriptionClick}
          >
            {getUserPhaseDescription(phase)}
          </button>
        </h3>
        {open || (current !== COMPLETE_PHASE && phase === COMPLETE_PHASE) ? (
          <div>
            {children}
            {this.displayActivity()}
          </div>
        ) : null}
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
