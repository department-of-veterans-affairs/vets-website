import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import PropTypes from 'prop-types';

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

export default class ClaimPhaseV2 extends React.Component {
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
              <h5 className="vads-u-margin-top--2p5">
                {`Past updates (${activityList.length - 1})`}
              </h5>
              <button
                type="button"
                className="claim-older-updates usa-button-secondary"
                aria-controls={`older-updates-${phase}`}
                aria-expanded={showOlder}
                onClick={this.showOlderActivity}
              >
                {`${showOlder ? 'Hide' : 'Show'} past updates`}
              </button>
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

    const titleText = getUserPhaseDescription(phase);
    const title =
      current < phase ? (
        <div className="section-header-title">{titleText}</div>
      ) : (
        <button
          type="button"
          className="section-header-button"
          aria-expanded={open}
          onClick={handler.getDescriptionClick}
        >
          {expandCollapseIcon}
          {titleText}
        </button>
      );

    return (
      <va-process-list-item header={title}>
        {open || (current !== COMPLETE_PHASE && phase === COMPLETE_PHASE) ? (
          <div>
            {children}
            {this.displayActivity()}
          </div>
        ) : null}
      </va-process-list-item>
      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
      // <li className={`${getClasses(phase, current)}`}>
      //   <h4 className="section-header vads-u-font-size--h4">{title}</h4>
      //   {open || (current !== COMPLETE_PHASE && phase === COMPLETE_PHASE) ? (
      //     <div>
      //       {children}
      //       {this.displayActivity()}
      //     </div>
      //   ) : null}
      // </li>
    );
  }
}

ClaimPhaseV2.propTypes = {
  id: PropTypes.string.isRequired,
  phase: PropTypes.number.isRequired,
  activity: PropTypes.object,
  children: PropTypes.any,
  current: PropTypes.number,
};
