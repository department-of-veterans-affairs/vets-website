import React from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { sentenceCase } from '../../../utils/formatters';
import { getPreferredCommunityCareProviderName } from '../../../services/appointment';
import { APPOINTMENT_STATUS, SPACE_BAR } from '../../../utils/constants';
import {
  selectFeatureStatusImprovement,
  selectFeatureBreadcrumbUrlUpdate,
} from '../../../redux/selectors';

function handleClick({ history, link, idClickable }) {
  return () => {
    if (!window.getSelection().toString()) {
      focusElement(`#${idClickable}`);
      history.push(link);
    }
  };
}

function handleKeyDown({ history, link, idClickable }) {
  return event => {
    if (!window.getSelection().toString() && event.keyCode === SPACE_BAR) {
      focusElement(`#${idClickable}`);
      history.push(link);
    }
  };
}

export default function RequestListItem({ appointment, facility }) {
  const history = useHistory();
  const isCC = appointment.vaos.isCommunityCare;
  const typeOfCareText = sentenceCase(appointment.type?.coding?.[0]?.display);
  const ccFacilityName = getPreferredCommunityCareProviderName(appointment);
  const canceled = appointment.status === APPOINTMENT_STATUS.cancelled;
  const preferredDate = moment(appointment.requestedPeriod[0].start).format(
    'MMMM D, YYYY',
  );
  const idClickable = `id-${appointment.id?.replace('.', '\\.')}`;
  const featureStatusImprovement = useSelector(state =>
    selectFeatureStatusImprovement(state),
  );

  const featureBreadcrumbUrlUpdate = useSelector(state =>
    selectFeatureBreadcrumbUrlUpdate(state),
  );
  const link = `${featureBreadcrumbUrlUpdate ? 'pending' : 'requests'}/${
    appointment.id
  }`;

  return (
    <li
      id={idClickable}
      data-request-id={appointment.id}
      className="vaos-appts__card--clickable vads-u-margin-bottom--3"
      data-cy="requested-appointment-list-item"
    >
      {/* Disabling for now since add role=button and tab=0 fails another accessiblity check: */}
      {/* Nested interactive controls are not announced by screen readers */}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        className="vads-u-padding--2 vads-u-display--flex vads-u-align-items--left vads-u-flex-direction--column medium-screen:vads-u-padding--3 medium-screen:vads-u-flex-direction--row medium-screen:vads-u-align-items--center"
        onClick={handleClick({
          history,
          link,
          idClickable,
          featureStatusImprovement,
        })}
        onKeyDown={handleKeyDown({
          history,
          link,
          idClickable,
          featureStatusImprovement,
        })}
      >
        <div className="vads-u-flex--1 vads-u-margin-y--neg0p5">
          {canceled && (
            <div className="vads-u-margin-bottom--1">
              <span className="usa-label">Canceled</span>
            </div>
          )}
          <h3 className="vads-u-margin-y--0 vads-u-margin-bottom--0p25">
            {sentenceCase(typeOfCareText)}
          </h3>
          {!!facility && !isCC && facility.name}
          {isCC && ccFacilityName}
        </div>
        <div className="vads-u-flex--auto vads-u-padding-top--0p5 medium-screen:vads-u-padding-top--0 vaos-hide-for-print">
          <va-link
            className="vaos-appts__focus--hide-outline"
            aria-label={`Details for ${
              canceled ? 'canceled ' : ''
            }${typeOfCareText}request for ${preferredDate}`}
            href={link}
            text="Details"
            data-testid="appointment-detail-link"
          />
          <i
            aria-hidden="true"
            className="fas fa-chevron-right vads-u-color--link-default vads-u-margin-left--1"
          />
        </div>
      </div>
    </li>
  );
}
RequestListItem.propTypes = {
  appointment: PropTypes.object.isRequired,
  facility: PropTypes.object,
};
