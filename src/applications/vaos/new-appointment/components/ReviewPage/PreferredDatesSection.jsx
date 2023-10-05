import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import PreferredDates from './PreferredDates';
import { FACILITY_TYPES } from '../../../utils/constants';
import getNewAppointmentFlow from '../../newAppointmentFlow';

function handleClick(history, pageFlow, isCommunityCare) {
  const { home, ccRequestDateTime, requestDateTime } = pageFlow;
  const url = isCommunityCare ? ccRequestDateTime.url : requestDateTime.url;

  return () => {
    if (
      history.location.pathname.endsWith('/') ||
      (url.endsWith('/') && url !== home.url)
    )
      history.push(`../${url}`);
    else history.push(url);
  };
}

export default function PreferredDatesSection(props) {
  const history = useHistory();
  const pageFlow = useSelector(getNewAppointmentFlow);

  const isCommunityCare =
    props.data.facilityType === FACILITY_TYPES.COMMUNITY_CARE;

  return (
    <>
      <div className="vads-l-grid-container vads-u-padding--0">
        <div className="vads-l-row vads-u-justify-content--space-between">
          <div className="vads-u-flex--1 vads-u-padding-right--1">
            <h3 className="vaos-appts__block-label">Preferred date and time</h3>
            {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
            <ul className="usa-unstyled-list" role="list">
              <PreferredDates dates={props.data.selectedDates} />
            </ul>
          </div>
          <div>
            <va-link
              aria-label="Edit preferred date"
              text="Edit"
              data-testid="edit-new-appointment"
              onClick={handleClick(history, pageFlow, isCommunityCare)}
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
