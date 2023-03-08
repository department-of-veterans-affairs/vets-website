import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import AppointmentFlexGrid from './AppointmentFlexGrid';
import ListItem from './ListItem';
import AppointmentRow from './AppointmentRow';
import AppointmentColumn from './AppointmentColumn';
import {
  selectAppointmentLocality,
  selectIsCanceled,
  selectModalityText,
  selectModalityIcon,
  selectStartDate,
  selectTypeOfCareName,
} from '../../redux/selectors';

export default function RequestAppointmentLayout({ appointment }) {
  const appointmentLocality = useSelector(() =>
    selectAppointmentLocality(appointment),
  );
  const first = true;
  const grouped = true;
  const idClickable = `id-${appointment.id.replace('.', '\\.')}`;
  const isCanceled = useSelector(() => selectIsCanceled(appointment));
  const link = `requests/${appointment.id}`;
  const modality = useSelector(() => selectModalityText(appointment));
  const modalityIcon = useSelector(() => selectModalityIcon(appointment));
  const preferredDate = useSelector(() => selectStartDate(appointment));
  const typeOfCareName = useSelector(() => selectTypeOfCareName(appointment));

  const detailAriaLabel = `Details for ${
    isCanceled ? 'canceled ' : ''
  }${typeOfCareName} request for ${preferredDate.format('MMMM D, YYYY')}`;

  return (
    <ListItem appointment={appointment} borderTop status="pending">
      <AppointmentFlexGrid idClickable={idClickable} link={link}>
        <AppointmentColumn
          id="vaos-appts__column--2"
          className={classNames(
            'vads-u-border-color--gray-lighter',
            'vads-u-padding-y--2',
            {
              'vads-u-border-top--1px': grouped && !first,
            },
          )}
          size="1"
        >
          <AppointmentRow className="small-screen:vads-u-flex-direction--row">
            <AppointmentColumn size="1" className="vads-u-flex--4">
              <AppointmentRow className="medium-screen:vads-u-flex-direction--column small-desktop-screen:vads-u-flex-direction--row">
                <AppointmentColumn
                  padding="0"
                  size="1"
                  className="vaos-appts__text--truncate"
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
                <AppointmentColumn padding="0" size="1" canceled={isCanceled}>
                  {typeOfCareName}
                </AppointmentColumn>
                <AppointmentColumn
                  padding="0"
                  size="1"
                  className="vaos-appts__text--truncate"
                  canceled={isCanceled}
                >
                  {appointmentLocality}
                </AppointmentColumn>
              </AppointmentRow>
            </AppointmentColumn>

            <AppointmentColumn
              id="vaos-appts__detail"
              className="vaos-hide-for-print"
              padding="0"
              size="1"
              aria-label={detailAriaLabel}
            >
              <va-link
                className="vaos-appts__focus--hide-outline"
                aria-describedby="vaos-appts__detail"
                href={link}
                onClick={e => e.preventDefault()}
                text="Details"
                role="link"
              />
            </AppointmentColumn>
          </AppointmentRow>
        </AppointmentColumn>{' '}
      </AppointmentFlexGrid>
    </ListItem>
  );
}

RequestAppointmentLayout.propTypes = {
  appointment: PropTypes.object.isRequired,
};
