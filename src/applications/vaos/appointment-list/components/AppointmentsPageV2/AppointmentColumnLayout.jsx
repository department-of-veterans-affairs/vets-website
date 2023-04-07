import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import AppointmentColumn from './AppointmentColumn';
import AppointmentRow from './AppointmentRow';
import {
  selectAppointmentLocality,
  selectIsCanceled,
  selectModalityText,
  selectModalityIcon,
  selectStartDate,
  selectTimeZoneAbbr,
  selectApptDetailAriaText,
  selectApptDateAriaText,
  selectTypeOfCareAriaText,
  selectModalityAriaText,
  selectIsCommunityCare,
} from '../../redux/selectors';

export default function AppointmentColumnLayout({
  data,
  first,
  grouped,
  link,
}) {
  const appointmentLocality = useSelector(() =>
    selectAppointmentLocality(data),
  );
  const isCanceled = useSelector(() => selectIsCanceled(data));
  const isCommunityCare = useSelector(() => selectIsCommunityCare(data));
  const modalityText = useSelector(() => selectModalityText(data));
  const modalityIcon = useSelector(() => selectModalityIcon(data));
  const startDate = useSelector(() => selectStartDate(data));
  const timezoneAbbr = useSelector(() => selectTimeZoneAbbr(data));

  const detailAriaLabel = useSelector(() => selectApptDetailAriaText(data));
  const dateAriaLabel = useSelector(() => selectApptDateAriaText(data));
  const typeOfCareAriaLabel = useSelector(() => selectTypeOfCareAriaText(data));
  const modalityAriaLabel = useSelector(() => selectModalityAriaText(data));

  return (
    <>
      <AppointmentColumn
        size="1"
        className="vaos-appts__column--1 vads-u-flex--auto vads-u-padding-y--2"
      >
        <span className="sr-only">{dateAriaLabel}</span>
        {first && (
          <AppointmentRow className="xsmall-screen:vads-u-text-align--center small-screen:vads-u-flex-direction--row">
            <AppointmentColumn
              size="1"
              className="small-screen:vads-u-flex--auto small-screen:vads-u-order--first small-screen:vads-u-padding-top--0"
              style={{
                minWidth: '25px',
                maxWidth: '25px',
                alignSelf: 'center',
              }}
            >
              <h3 className="vads-u-display--inline-block vads-u-text-align--center vads-u-margin-top--0 vads-u-margin-bottom--0">
                <span aria-hidden="true">{startDate.format('D')}</span>
              </h3>
            </AppointmentColumn>
            <AppointmentColumn
              className="vads-u-text-align--left xsmall-screen:vads-u-order--first small-screen:vads-u-margin-left--1"
              size="1"
              style={{
                minWidth: '25px',
                maxWidth: '25px',
              }}
            >
              <span aria-hidden="true">{startDate.format('ddd')}</span>
            </AppointmentColumn>
          </AppointmentRow>
        )}
      </AppointmentColumn>

      <AppointmentColumn
        className={classNames(
          'vaos-appts__column--2',
          'vads-u-border-color--gray-medium',
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
            <span aria-hidden="true">
              {`${startDate.format('h:mm')} ${startDate.format(
                'a',
              )} ${timezoneAbbr}`}{' '}
            </span>
          </AppointmentColumn>

          <AppointmentColumn size="1" className="vads-u-flex--4">
            <AppointmentRow className="medium-screen:vads-u-flex-direction--column small-desktop-screen:vads-u-flex-direction--row">
              <AppointmentColumn
                padding="0"
                size="1"
                className="vads-u-font-weight--bold vaos-appts__text--truncate"
                canceled={isCanceled}
                aria-label={typeOfCareAriaLabel}
              >
                <span aria-hidden="true">{appointmentLocality}</span>
              </AppointmentColumn>

              <AppointmentColumn
                padding="0"
                size="1"
                className="vaos-appts__text--truncate small-desktop-screen:vads-u-margin-left--5"
                canceled={isCanceled}
                aria-label={modalityAriaLabel}
              >
                <>
                  <i
                    aria-hidden="true"
                    className={classNames(
                      'fas',
                      'vads-u-margin-right--1',
                      'vads-u-color--gray',
                      modalityIcon,
                      {
                        'vaos-appts__text--line-through':
                          isCanceled && !isCommunityCare,
                      },
                    )}
                  />
                  <span aria-hidden="true">{`${modalityText}`}</span>
                </>
              </AppointmentColumn>
            </AppointmentRow>
          </AppointmentColumn>

          <AppointmentColumn
            id={`vaos-appts__detail-${data.id}`}
            className="vaos-hide-for-print"
            // className="vads-u-display--flex vads-u-flex--auto vads-u-justify-content--right vads-u-align-items--center vads-u-text-align--right vaos-hide-for-print"
            padding="0"
            size="1"
          >
            <va-link
              className="vaos-appts__focus--hide-outline"
              aria-label={detailAriaLabel}
              href={link}
              onClick={e => e.preventDefault()}
              text="Details"
              role="link"
            />
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
