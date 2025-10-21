import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  selectAppointmentLocality,
  selectApptDetailAriaText,
  selectClinicLocationInfo,
  selectIsCanceled,
  selectIsCommunityCare,
  selectModalityIcon,
  selectTypeOfCareName,
} from '../appointment-list/redux/selectors';
import {
  selectFeatureCCDirectScheduling,
  selectFeatureListViewClinicInfo,
} from '../redux/selectors';
import AppointmentClinicInfo from './AppointmentClinicInfo';
import AppointmentColumn from './AppointmentColumn';
import AppointmentFlexGrid from './AppointmentFlexGrid';
import AppointmentRow from './AppointmentRow';
import ListItem from './ListItem';

export default function RequestAppointmentLayout({ appointment, index }) {
  const appointmentLocality = useSelector(() =>
    selectAppointmentLocality(appointment, true),
  );
  const first = index === 0;
  const idClickable = `id-${appointment.id.replace('.', '\\.')}`;
  const isCanceled = useSelector(() => selectIsCanceled(appointment));
  const isCommunityCare = useSelector(() => selectIsCommunityCare(appointment));
  const modality = isCommunityCare
    ? 'Community care'
    : appointment?.preferredModality;
  const modalityIcon = useSelector(() => selectModalityIcon(appointment));
  const typeOfCareName = useSelector(() => selectTypeOfCareName(appointment));

  // If the clinic info feature flag is on, we want to show the clinic location info
  const featureListViewClinicInfo = useSelector(state =>
    selectFeatureListViewClinicInfo(state),
  );
  const detailAriaLabel = useSelector(() =>
    selectApptDetailAriaText(appointment, false, featureListViewClinicInfo),
  );
  const clinicLocationInfo = useSelector(() =>
    selectClinicLocationInfo(appointment),
  );
  const showClinicLocationInfo = useMemo(
    () => clinicLocationInfo?.name || clinicLocationInfo?.location,
    [clinicLocationInfo],
  );

  const featureCCDirectScheduling = useSelector(state =>
    selectFeatureCCDirectScheduling(state),
  );

  const typeOfCareHeading = useMemo(
    () =>
      featureCCDirectScheduling ? `${typeOfCareName} request` : typeOfCareName,
    [featureCCDirectScheduling, typeOfCareName],
  );

  const link = `pending/${appointment.id}`;

  return (
    <ListItem
      appointment={appointment}
      borderTop={first}
      borderBottom
      status="pending"
    >
      <AppointmentFlexGrid idClickable={idClickable} link={link}>
        <AppointmentRow className="vads-u-margin-x--0p5 mobile:vads-u-flex-direction--row">
          <AppointmentColumn className="vads-u-padding-y--1" size="1">
            <AppointmentRow className="vaos-appts__column-gap--3 mobile-lg:vads-u-flex-direction--row">
              <AppointmentColumn size="1" className="vads-u-flex--4">
                <AppointmentRow className="vaos-appts__column-gap--3 vaos-appts__display--table mobile:vads-u-flex-direction--column mobile-lg:vads-u-flex-direction--row">
                  <AppointmentColumn
                    padding="0"
                    size="1"
                    canceled={isCanceled}
                    className="vads-u-font-weight--bold vaos-appts__display--table"
                  >
                    {featureListViewClinicInfo ? (
                      <a
                        href={link}
                        aria-label={detailAriaLabel}
                        className="vaos-appts__focus--hide-outline"
                        onClick={e => e.preventDefault()}
                      >
                        {typeOfCareHeading}
                      </a>
                    ) : (
                      typeOfCareHeading
                    )}
                  </AppointmentColumn>
                  <AppointmentColumn
                    padding="0"
                    size="1"
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
                      {modality}
                    </span>
                  </AppointmentColumn>
                  <AppointmentColumn
                    padding="0"
                    size="1"
                    className="vaos-appts__display--table"
                    canceled={isCanceled}
                  >
                    <span className="vaos-appts__display--table-cell vaos-appts__text--truncate">
                      {appointmentLocality}
                    </span>
                  </AppointmentColumn>
                </AppointmentRow>
              </AppointmentColumn>

              <AppointmentColumn
                id={
                  featureListViewClinicInfo
                    ? `vaos-appts__namelocation-${appointment.id}`
                    : `vaos-appts__detail-${appointment.id}`
                }
                className={
                  featureListViewClinicInfo
                    ? 'vads-u-display--none'
                    : 'vaos-hide-for-print'
                }
                padding="0"
                size="1"
              >
                {featureListViewClinicInfo ? (
                  <AppointmentClinicInfo
                    show={showClinicLocationInfo}
                    clinicLocationInfo={clinicLocationInfo}
                    apptId={appointment.id}
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
        </AppointmentRow>
      </AppointmentFlexGrid>
    </ListItem>
  );
}

RequestAppointmentLayout.propTypes = {
  appointment: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};
