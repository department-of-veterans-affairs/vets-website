import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import PreferredDates from './PreferredDates';
import getNewAppointmentFlow from '../../newAppointmentFlow';

function handleClick(history, pageFlow) {
  const { home, requestDateTime } = pageFlow;

  return () => {
    if (
      history.location.pathname.endsWith('/') ||
      (requestDateTime.url.endsWith('/') && requestDateTime.url !== home.url)
    )
      history.push(`../${requestDateTime.url}`);
    else history.push(requestDateTime.url);
  };
}

export default function PreferredDatesSection(props) {
  const history = useHistory();
  const pageFlow = useSelector(getNewAppointmentFlow);

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
              onClick={handleClick(history, pageFlow)}
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
