import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AppointmentColumn from './AppointmentColumn';
import AppointmentRow from './AppointmentRow';
import {
  selectAppointmentLocality,
  selectIsCanceled,
  selectModality,
  selectModalityIcon,
  selectStartDate,
  selectTimeZoneAbbr,
} from '../../redux/selectors';

export default function AppointmentColumnLayout({
  data,
  first,
  grouped,
  link,
}) {
  const appointmentDate = useSelector(() => selectStartDate(data));
  const appointmentLocality = useSelector(() =>
    selectAppointmentLocality(data),
  );
  const isCanceled = useSelector(() => selectIsCanceled(data));
  const modality = useSelector(() => selectModality(data));
  const modalityIcon = useSelector(() => selectModalityIcon(data));
  const startDate = useSelector(() => selectStartDate(data));
  const timezoneAbbr = useSelector(() => selectTimeZoneAbbr(data));

  const detailAriaLabel = `Details for ${
    isCanceled ? 'canceled ' : ''
  }appointment on ${appointmentDate.format('dddd, MMMM D h:mm a')}`;

  return (
    <>
      <AppointmentColumn
        id="vaos-appts__column--1"
        size="1"
        className="vads-u-flex--auto vads-u-padding-y--2"
      >
        {first && (
          <AppointmentRow className="xsmall-screen:vads-u-text-align--center small-screen:vads-u-flex-direction--row">
            <AppointmentColumn
              size="1"
              className="small-screen:vads-u-flex--auto small-screen:vads-u-order--first small-screen:vads-u-padding-top--0"
              style={{ minWidth: '25px', maxWidth: '25px' }}
            >
              <h3 className="vads-u-display--inline-block vads-u-text-align--center vads-u-margin-top--0 vads-u-margin-bottom--0">
                {startDate.format('D')}
              </h3>
            </AppointmentColumn>
            <AppointmentColumn
              className="xsmall-screen:vads-u-order--first small-screen:vads-u-margin-left--1"
              size="1"
              style={{ minWidth: '25px', maxWidth: '25px' }}
            >
              <span>{startDate.format('ddd')}</span>
              <span className="sr-only"> {timezoneAbbr}</span>
            </AppointmentColumn>
          </AppointmentRow>
        )}
      </AppointmentColumn>

      <AppointmentColumn
        id="vaos-appts__column--2"
        className={classNames(
          'vads-u-border-color--gray-lighter',
          'vads-u-margin-left--2',
          'vads-u-padding-y--2',
          'small-screen:vads-u-margin-left--4',
          {
            'vads-u-border-top--1px': grouped && !first,
          },
        )}
        size="1"
      >
        <AppointmentRow className="small-screen:vads-u-flex-direction--row">
          <AppointmentColumn
            size="1"
            canceled={isCanceled}
            style={{ minWidth: '108px', maxWidth: '108px' }}
          >
            {`${startDate.format('h:mm')} ${startDate
              .format('a')
              .replace(/\./g, '')} ${timezoneAbbr}`}{' '}
          </AppointmentColumn>

          <AppointmentColumn size="1" className="vads-u-flex--4">
            <AppointmentRow className="medium-screen:vads-u-flex-direction--column small-desktop-screen:vads-u-flex-direction--row">
              <AppointmentColumn
                padding="0"
                size="1"
                className="vaos-appts__text--truncate"
                canceled={isCanceled}
              >
                {appointmentLocality}
              </AppointmentColumn>

              <AppointmentColumn
                padding="0"
                size="1"
                className="vaos-appts__text--truncate small-desktop-screen:vads-u-margin-left--5"
                canceled={isCanceled}
              >
                <>
                  <i
                    aria-hidden="true"
                    className={classNames(
                      'fas',
                      'vads-u-margin-right--1',
                      modalityIcon,
                    )}
                  />

                  {`${modality}`}
                </>
              </AppointmentColumn>
            </AppointmentRow>
          </AppointmentColumn>

          <AppointmentColumn
            id="vaos-appts__detail"
            className="vaos-hide-for-print"
            // className="vads-u-display--flex vads-u-flex--auto vads-u-justify-content--right vads-u-align-items--center vads-u-text-align--right vaos-hide-for-print"
            padding="0"
            size="1"
          >
            <Link
              className="vaos-appts__focus--hide-outline"
              aria-label={detailAriaLabel}
              to={link}
              onClick={e => e.preventDefault()}
            >
              Details
            </Link>
          </AppointmentColumn>
        </AppointmentRow>
      </AppointmentColumn>
    </>
  );
}

AppointmentColumnLayout.propTypes = {
  /** Appointment data */
  data: PropTypes.object,

  /** First column flag */
  first: PropTypes.bool,

  /** Is this row of appointments part of a group? Ex. Multiply appointments on the same day. */
  grouped: PropTypes.bool,

  /** Last column flag */
  last: PropTypes.bool,

  /** Link to appointment detail */
  link: PropTypes.string,
};
