import classNames from 'classnames';
import { formatInTimeZone } from 'date-fns-tz';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import AppointmentColumn from '../../../components/AppointmentColumn';
import AppointmentRow from '../../../components/AppointmentRow';
import AppointmentClinicInfo from '../../../components/AppointmentClinicInfo';
import {
  selectAppointmentLocality,
  selectApptDateAriaText,
  selectApptDetailAriaText,
  selectClinicLocationInfo,
  selectIsCanceled,
  selectIsCommunityCare,
  selectModalityIcon,
  selectModalityText,
  selectStartDate,
  selectTimeZoneAbbr,
} from '../../redux/selectors';
import {
  selectFeatureListViewClinicInfo,
  selectFeatureUseBrowserTimezone,
} from '../../../redux/selectors';

export default function AppointmentColumnLayout({
  data,
  first,
  grouped,
  link,
}) {
  const featureUseBrowserTimezone = useSelector(
    selectFeatureUseBrowserTimezone,
  );
  const appointmentLocality = useSelector(() =>
    selectAppointmentLocality(data),
  );
  const isCanceled = useSelector(() => selectIsCanceled(data));
  const isCommunityCare = useSelector(() => selectIsCommunityCare(data));
  const modalityText = useSelector(() => selectModalityText(data));
  const modalityIcon = useSelector(() => selectModalityIcon(data));
  const startDate = useSelector(() => selectStartDate(data));
  const timezoneAbbr = useSelector(() =>
    selectTimeZoneAbbr(data, featureUseBrowserTimezone),
  );

  const dateAriaLabel = useSelector(() => selectApptDateAriaText(data));

  // If the clinic info feature flag is on, we want to show the clinic location info
  const featureListViewClinicInfo = useSelector(state =>
    selectFeatureListViewClinicInfo(state),
  );
  const detailAriaLabel = useSelector(() =>
    selectApptDetailAriaText(data, false, featureListViewClinicInfo),
  );
  const clinicLocationInfo = useSelector(() => selectClinicLocationInfo(data));
  const showClinicLocationInfo = useMemo(
    () => !!(clinicLocationInfo?.name || clinicLocationInfo?.location),
    [clinicLocationInfo],
  );

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
            'mobile:vads-u-align-items--center',
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
              aria-hidden="true"
              className={classNames(
                'vads-u-text-align--center',
                'vads-u-margin-top--0',
                'vads-u-margin-bottom--0',
                { 'vads-u-display--none': !first },
              )}
            >
              <span data-dd-privacy="mask">
                {formatInTimeZone(startDate, data.timezone, 'd')}
              </span>
            </h3>
          </AppointmentColumn>
          <AppointmentColumn
            className={classNames(
              'mobile-lg:vads-u-text-align--left',
              'xsmall-screen:vads-u-order--first',
              'xsmall-screen:margin-top--1',
              'vaos-appts__column--date',
            )}
            size="1"
          >
            <span
              className={classNames({
                'vads-u-display--none': !first,
              })}
              aria-hidden="true"
              data-testid="day"
              data-dd-privacy="mask"
            >
              {formatInTimeZone(startDate, data.timezone, 'EEE')}
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
          className={
            classNames(
              'vaos-appts__column--alignItems',
              'mobile-lg:vads-u-flex-direction--row',
              'small-screen:vaos-appts__column-gap--3',
              'medium-screen:vads-u-padding-y--2',
            ) // padding determines the appointment row height
          }
        >
          <AppointmentColumn
            size="1"
            canceled={isCanceled}
            style={{ minWidth: '100px', maxWidth: '100px' }}
          >
            <span aria-hidden="true" data-dd-privacy="mask">
              {`${formatInTimeZone(
                startDate,
                data.timezone,
                'h:mm aaaa',
              )} ${timezoneAbbr || ''}`}{' '}
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
                  className={classNames('vaos-appts__display--table-cell')}
                  data-dd-privacy="mask"
                >
                  {featureListViewClinicInfo ? (
                    <>
                      <a
                        href={link}
                        aria-label={detailAriaLabel}
                        className="vaos-appts__focus--hide-outline vaos-hide-for-print"
                        onClick={e => e.preventDefault()}
                      >
                        {appointmentLocality}
                      </a>
                      <span className="vaos-print-only">
                        {appointmentLocality}
                      </span>
                    </>
                  ) : (
                    appointmentLocality
                  )}
                </span>
              </AppointmentColumn>

              <AppointmentColumn
                padding="0"
                size="3"
                className="vaos-appts__display--table"
                canceled={isCanceled}
              >
                <span className="vaos-appts__display--table-cell vads-u-display--flex vads-u-align-items--flex-start">
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
                  <span
                    className={classNames({
                      'vaos-appts__text--truncate': !featureListViewClinicInfo,
                    })}
                  >
                    {modalityText}
                  </span>
                </span>
              </AppointmentColumn>
            </AppointmentRow>
          </AppointmentColumn>

          <AppointmentColumn
            id={
              featureListViewClinicInfo
                ? `vaos-appts__namelocation-${data.id}`
                : `vaos-appts__detail-${data.id}`
            }
            className={classNames({
              'vaos-hide-for-print': !featureListViewClinicInfo,
              'vads-u-display--none':
                featureListViewClinicInfo && !showClinicLocationInfo,
            })}
            padding="0"
            size={featureListViewClinicInfo ? '3' : '1'}
          >
            {featureListViewClinicInfo ? (
              <AppointmentClinicInfo
                clinicLocationInfo={clinicLocationInfo}
                apptId={data.id}
                isCanceled={isCanceled}
              />
            ) : (
              <a
                className="vaos-appts__focus--hide-outline"
                aria-label={detailAriaLabel}
                href={link}
                onClick={e => e.preventDefault()}
              >
                Details
              </a>
            )}
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
