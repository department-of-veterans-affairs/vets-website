import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { selectFeatureFeSourceOfTruth } from '../../../redux/selectors';
import AppointmentRow from '../../../components/AppointmentRow';
import {
  selectAppointmentLocality,
  selectIsCanceled,
  selectModalityText,
  selectModalityIcon,
  selectStartDate,
  selectTimeZoneAbbr,
  selectApptDetailAriaText,
  selectApptDateAriaText,
  selectIsCommunityCare,
} from '../../redux/selectors';
import AppointmentColumn from '../../../components/AppointmentColumn';

export default function AppointmentColumnLayout({
  data,
  first,
  grouped,
  link,
}) {
  const appointmentLocality = useSelector(() =>
    selectAppointmentLocality(data),
  );
  const useFeSourceOfTruth = useSelector(state =>
    selectFeatureFeSourceOfTruth(state),
  );
  const isCanceled = useSelector(() => selectIsCanceled(data));
  const isCommunityCare = useSelector(() => selectIsCommunityCare(data));
  const modalityText = useSelector(() => selectModalityText(data));
  const modalityIcon = useSelector(() => selectModalityIcon(data));
  const startDate = useSelector(() =>
    selectStartDate(data, useFeSourceOfTruth),
  );
  const timezoneAbbr = useSelector(() => selectTimeZoneAbbr(data));

  const detailAriaLabel = useSelector(() => selectApptDetailAriaText(data));
  const dateAriaLabel = useSelector(() => selectApptDateAriaText(data));

  return (
    <>
      {/* Column 1 */}
      <AppointmentColumn
        size="1"
        className={classNames(
          'vads-u-flex--auto',
          'mobile:vads-u-padding-top--1',
          'medium-screen:vads-u-padding-top--0',
        )}
      >
        <span className="sr-only">{dateAriaLabel}</span>
        <AppointmentRow
          className={classNames(
            'vaos-appts__column--alignItems',
            'vaos-appts__column-gap--1',
            'mobile:vads-u-text-align--center',
            'mobile-lg:vads-u-flex-direction--row',
            'medium-screen:vads-u-padding-y--2',
          )}
        >
          <AppointmentColumn
            size="1"
            className={classNames(
              'mobile-lg:vads-u-flex--auto',
              'small-screen:vads-u-order--first',
              'mobile-lg:vads-u-padding-top--0',
              'medium-screen:vaos-appts__minWidth',
              'medium-screen:vaos-appts__maxWidth',
            )}
          >
            <h3
              className={classNames(
                'vads-u-text-align--center',
                'vads-u-margin-top--0',
                'vads-u-margin-bottom--0',
                { 'vads-u-display--none': !first },
              )}
            >
              <span aria-hidden="false">{format(startDate, 'd')}</span>
            </h3>
          </AppointmentColumn>
          <AppointmentColumn
            className={classNames(
              'vads-u-text-align--left',
              'xsmall-screen:vads-u-order--first',
              'xsmall-screen:margin-top--1',
            )}
            size="1"
            style={{
              minWidth: '30px',
              maxWidth: '30px',
              alignSelf: 'center',
            }}
          >
            <span
              className={classNames({ 'vads-u-display--none': !first })}
              aria-hidden="true"
              data-testid="day"
            >
              {format(startDate, 'EEE')}
            </span>
          </AppointmentColumn>
        </AppointmentRow>
      </AppointmentColumn>

      {/* Column 2 */}
      <AppointmentColumn
        className={classNames(
          'vads-u-padding-right--1',
          'vads-u-border-color--gray-medium',
          'mobile:vads-u-padding-top--1',
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
            'mobile-lg:vads-u-flex-direction--row',
            'small-screen:vaos-appts__column-gap--3',
            // padding below determines the appointment row height
            'medium-screen:vads-u-padding-y--2',
          )}
        >
          <AppointmentColumn
            size="1"
            canceled={isCanceled}
            style={{ minWidth: '100px', maxWidth: '100px' }}
          >
            <span aria-hidden="true">
              {`${format(startDate, 'h:mm')} ${format(
                startDate,
                'aaa',
              )} ${timezoneAbbr}`}{' '}
            </span>
          </AppointmentColumn>

          <AppointmentColumn size="1" className="vads-u-flex--4">
            <AppointmentRow
              className={classNames(
                'vaos-appts__column-gap--3',
                'mobile-lg:vads-u-flex-direction--column',
              )}
            >
              <AppointmentColumn
                padding="0"
                size="2"
                className="vads-u-font-weight--bold vaos-appts__display--table"
                canceled={isCanceled}
              >
                <span
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
                size="3"
                className="vaos-appts__display--table"
                canceled={isCanceled}
              >
                <span className="vaos-appts__display--table-cell vads-u-display--flex vads-u-align-items--center">
                  {!isCommunityCare && (
                    <span
                      className={classNames(
                        'vads-u-color--gray',
                        'icon-width',
                        {
                          'vaos-appts__text--line-through': isCanceled,
                        },
                      )}
                    >
                      <va-icon
                        icon={modalityIcon}
                        size="3"
                        aria-hidden="true"
                      />
                    </span>
                  )}
                  <span className="vaos-appts__text--truncate">
                    {modalityText}
                  </span>
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
            <a
              className="vaos-appts__focus--hide-outline"
              aria-label={detailAriaLabel}
              href={link}
              onClick={e => e.preventDefault()}
            >
              Details
            </a>
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
