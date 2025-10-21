import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectFeatureCCDirectScheduling } from '../redux/selectors';
import AppointmentColumn from './AppointmentColumn';
import AppointmentFlexGrid from './AppointmentFlexGrid';
import AppointmentRow from './AppointmentRow';
import ListItem from './ListItem';

export default function RequestAppointmentLayout({ appointment, index }) {
  const { appointmentLocality } = appointment;
  const first = index === 0;
  const idClickable = `id-${appointment.id.replace('.', '\\.')}`;
  const { isCanceled } = appointment;
  const { isCommunityCare } = appointment.vaos;
  const modality = isCommunityCare
    ? 'Community care'
    : appointment?.preferredModality;
  const { modalityIcon } = appointment;
  const { typeOfCareName } = appointment;

  const detailAriaLabel = appointment.appointmentDetailAriaText;

  const featureCCDirectScheduling = useSelector(state =>
    selectFeatureCCDirectScheduling(state),
  );

  const displayNewTypeOfCareHeading = `${typeOfCareName} request`;
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
                    {' '}
                    {featureCCDirectScheduling
                      ? displayNewTypeOfCareHeading
                      : typeOfCareName}
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
                id={`vaos-appts__detail-${appointment.id}`}
                className="vaos-hide-for-print"
                padding="0"
                size="1"
                aria-label={detailAriaLabel}
              >
                <a
                  className="vaos-appts__focus--hide-outline"
                  aria-describedby={`vaos-appts__detail-${appointment.id}`}
                  href={link}
                  onClick={e => e.preventDefault()}
                >
                  Details
                </a>
              </AppointmentColumn>
            </AppointmentRow>
          </AppointmentColumn>{' '}
        </AppointmentRow>
      </AppointmentFlexGrid>
    </ListItem>
  );
}

RequestAppointmentLayout.propTypes = {
  appointment: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};
