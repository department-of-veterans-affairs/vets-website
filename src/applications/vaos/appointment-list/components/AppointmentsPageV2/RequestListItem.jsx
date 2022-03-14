import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import moment from 'moment';
import { focusElement } from 'platform/utilities/ui';
import { useDispatch, useSelector } from 'react-redux';
import { sentenceCase } from '../../../utils/formatters';
import { getPreferredCommunityCareProviderName } from '../../../services/appointment';
import { APPOINTMENT_STATUS, SPACE_BAR } from '../../../utils/constants';
import { updateBreadcrumb } from '../../redux/actions';
import { selectFeatureStatusImprovement } from '../../../redux/selectors';

function handleClick({
  dispatch,
  history,
  link,
  idClickable,
  featureStatusImprovement,
}) {
  return () => {
    if (!window.getSelection().toString()) {
      focusElement(`#${idClickable}`);
      history.push(link);

      if (featureStatusImprovement) {
        dispatch(updateBreadcrumb({ title: 'Pending', path: '/pending' }));
      }
    }
  };
}

function handleKeyDown({
  dispatch,
  history,
  link,
  idClickable,
  featureStatusImprovement,
}) {
  return event => {
    if (!window.getSelection().toString() && event.keyCode === SPACE_BAR) {
      focusElement(`#${idClickable}`);
      history.push(link);

      if (featureStatusImprovement) {
        dispatch(updateBreadcrumb({ title: 'Pending', path: '/pending' }));
      }
    }
  };
}

function handleLinkClicked(featureStatusImprovement, dispatch) {
  return e => {
    e.preventDefault();
    if (featureStatusImprovement) {
      dispatch(updateBreadcrumb({ title: 'Pending', path: '/pending' }));
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
  const link = `requests/${appointment.id}`;
  const idClickable = `id-${appointment.id.replace('.', '\\.')}`;
  const dispatch = useDispatch();
  const featureStatusImprovement = useSelector(state =>
    selectFeatureStatusImprovement(state),
  );

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
          dispatch,
          history,
          link,
          idClickable,
          featureStatusImprovement,
        })}
        onKeyDown={handleKeyDown({
          dispatch,
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
          <Link
            className="vaos-appts__focus--hide-outline"
            aria-label={`Details for ${
              canceled ? 'canceled ' : ''
            }${typeOfCareText}request for ${preferredDate}`}
            to={link}
            onClick={handleLinkClicked(featureStatusImprovement, dispatch)}
          >
            Details
          </Link>
          <i
            aria-hidden="true"
            className="fas fa-chevron-right vads-u-color--link-default vads-u-margin-left--1"
          />
        </div>
      </div>
    </li>
  );
}
