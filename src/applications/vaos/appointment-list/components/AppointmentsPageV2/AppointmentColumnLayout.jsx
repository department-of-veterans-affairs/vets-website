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
      {/* Column 1 */}
      <AppointmentColumn
        size="1"
        className={classNames(
          'vads-u-flex--auto',
          'xsmall-screen:vads-u-padding-top--1',
          'medium-screen:vads-u-padding-y--0',
        )}
        aria-label={dateAriaLabel}
      >
        <AppointmentRow
          className={classNames(
            'vaos-appts__column--alignItems',
            'vaos-appts__column-gap--1',
            'xsmall-screen:vads-u-text-align--center',
            'small-screen:vads-u-flex-direction--row',
            'medium-screen:vads-u-padding-y--2',
            'small-desktop-screen:vads-u-padding-y--0',
          )}
        >
          <AppointmentColumn
            size="1"
            className={classNames(
              'small-screen:vads-u-flex--auto',
              'small-screen:vads-u-order--first',
              'small-screen:vads-u-padding-top--0',
              'medium-screen:vaos-appts__minWidth',
              'medium-screen:vaos-appts__maxWidth',
              'medium-screen:vads-u-margin-top--neg1px',
            )}
          >
            <h3
              className={classNames(
                'vads-u-display--inline-block',
                'vads-u-text-align--center',
                'vads-u-margin-top--0',
                'vads-u-margin-bottom--0',
                { 'vads-u-display--none': !first },
              )}
            >
              <span aria-hidden="true">{startDate.format('D')}</span>
            </h3>
          </AppointmentColumn>
          <AppointmentColumn
            className={classNames(
              'vads-u-text-align--left',
              'xsmall-screen:vads-u-order--first',
              'xsmall-screen:margin-top--1',
            )}
            size="1"
            style={{ minWidth: '30px', maxWidth: '30px' }}
          >
            <span
              className={classNames({ 'vads-u-display--none': !first })}
              aria-hidden="true"
            >
              {startDate.format('ddd')}
            </span>
          </AppointmentColumn>
        </AppointmentRow>
      </AppointmentColumn>

      {/* Column 2 */}
      <AppointmentColumn
        className={classNames(
          'vads-u-padding-right--1',
          'vads-u-border-color--gray-medium',
          'xsmall-screen:vads-u-padding-top--1',
          'medium-screen:vads-u-padding-top--0',
          {
            'vads-u-border-top--1px': grouped && !first,
          },
        )}
        size="1"
      >
        <AppointmentRow
          className={classNames(
            'vaos-appts__column--alignItems',
            'small-screen:vads-u-flex-direction--row',
            'small-screen:vaos-appts__column-gap--3',
            'medium-screen:vads-u-padding-y--2',
            'small-desktop-screen:vads-u-padding-y--0',
          )}
        >
          <AppointmentColumn
            size="1"
            canceled={isCanceled}
            style={{ minWidth: '95px', maxWidth: '95px' }}
          >
            <span aria-hidden="true">
              {`${startDate.format('h:mm')} ${startDate.format(
                'a',
              )} ${timezoneAbbr}`}{' '}
            </span>
          </AppointmentColumn>

          <AppointmentColumn size="1" className="vads-u-flex--4">
            <AppointmentRow
              className={classNames(
                'vaos-appts__column-gap--3',
                'small-screen:vads-u-flex-direction--column',
                'small-desktop-screen:vads-u-flex-direction--row',
              )}
            >
              <AppointmentColumn
                padding="0"
                size="1"
                className="vads-u-font-weight--bold vaos-appts__display--table vaos-appts__text--truncate"
                canceled={isCanceled}
                aria-label={typeOfCareAriaLabel}
              >
                <span
                  aria-hidden="true"
                  className={classNames(
                    'vaos-appts__display--table-cell',
                    'vaos-appts__text--truncate',
                  )}
                >
                  {appointmentLocality}
                </span>
              </AppointmentColumn>

              <AppointmentColumn
                padding="0"
                size="1"
                className="vaos-appts__display--table vaos-appts__text--truncate"
                canceled={isCanceled}
                aria-label={modalityAriaLabel}
              >
                <i
                  aria-hidden="true"
                  className={classNames(
                    'fas',
                    'vads-u-margin-right--1',
                    'vads-u-color--gray',
                    'vaos-appts__display--table-cell',
                    modalityIcon,
                    {
                      'vaos-appts__text--line-through':
                        isCanceled && !isCommunityCare,
                    },
                  )}
                  style={{ width: '30px' }}
                />
                <span
                  aria-hidden="true"
                  className="vaos-appts__display--table-cell vaos-appts__text--truncate"
                >
                  {`${modalityText}`}
                </span>
              </AppointmentColumn>
            </AppointmentRow>
          </AppointmentColumn>

          <AppointmentColumn
            id={`vaos-appts__detail-${data.id}`}
            className="vaos-hide-for-print"
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
