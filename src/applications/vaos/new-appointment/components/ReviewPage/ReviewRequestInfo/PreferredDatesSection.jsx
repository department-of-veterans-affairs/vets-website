import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import PreferredDates from './PreferredDates';
import { FACILITY_TYPES, FLOW_TYPES } from '../../../../utils/constants';
import getNewAppointmentFlow from '../../../newAppointmentFlow';
import { getFlowType } from '../../../redux/selectors';

function handleClick(history, home, requestDateTimeUrl) {
  return e => {
    // Stop default behavior for anchor tag since we are using React routing.
    e.preventDefault();

    if (
      history.location.pathname.endsWith('/') ||
      (requestDateTimeUrl.endsWith('/') && requestDateTimeUrl !== home.url)
    )
      history.push(`../${requestDateTimeUrl}`);
    else history.push(requestDateTimeUrl);
  };
}

export default function PreferredDatesSection(props) {
  const history = useHistory();
  const { home, ccRequestDateTime, requestDateTime } = useSelector(
    getNewAppointmentFlow,
  );
  const flowType = useSelector(getFlowType);

  const isCommunityCare =
    props.data.facilityType === FACILITY_TYPES.COMMUNITY_CARE;
  const url = isCommunityCare ? ccRequestDateTime.url : requestDateTime.url;

  return (
    <>
      <div className="vads-l-grid-container vads-u-padding--0">
        <div className="vads-l-row vads-u-justify-content--space-between">
          <div className="vads-u-flex--1 vads-u-padding-right--1">
            <h2
              className={classNames({
                'vads-u-font-size--base': FLOW_TYPES.DIRECT === flowType,
                'vaos-appts__block-label': FLOW_TYPES.DIRECT === flowType,
                'vads-u-font-size--h3': FLOW_TYPES.REQUEST === flowType,
                'vads-u-margin-top--0': FLOW_TYPES.REQUEST === flowType,
              })}
            >
              Preferred date and timeframe
            </h2>
            {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
            <ul className="usa-unstyled-list" role="list">
              <PreferredDates dates={props.data.selectedDates} />
            </ul>
          </div>
          <div>
            <va-link
              href={`../${url}`}
              aria-label="Edit preferred date"
              text="Edit"
              data-testid="edit-new-appointment"
              onClick={handleClick(history, home, url)}
            />
          </div>
        </div>
      </div>
    </>
  );
}

PreferredDatesSection.propTypes = {
  data: PropTypes.object,
};
