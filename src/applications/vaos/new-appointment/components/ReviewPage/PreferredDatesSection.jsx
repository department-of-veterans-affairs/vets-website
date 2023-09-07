import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import newAppointmentFlow from '../../newAppointmentFlow';
import PreferredDates from './PreferredDates';

function handleClick(history) {
  return () => {
    history.push(newAppointmentFlow.requestDateTime.url);
  };
}

export default function PreferredDatesSection(props) {
  const history = useHistory();
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
              onClick={handleClick(history)}
            />
          </div>
        </div>
      </div>
    </>
  );
}

PreferredDatesSection.propTypes = {
  props: PropTypes.object,
};
