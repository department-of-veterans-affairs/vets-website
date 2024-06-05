import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import PreferredDates from './PreferredDates';
import { FACILITY_TYPES, FLOW_TYPES } from '../../../../utils/constants';
import getNewAppointmentFlow from '../../../newAppointmentFlow';
import { getFlowType } from '../../../redux/selectors';

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
  const flowType = useSelector(getFlowType);

  const isCommunityCare =
    props.data.facilityType === FACILITY_TYPES.COMMUNITY_CARE;

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
              aria-label="Edit preferred date"
              text="Edit"
              data-testid="edit-new-appointment"
              onClick={handleClick(history, pageFlow, isCommunityCare)}
              tabindex="0"
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
