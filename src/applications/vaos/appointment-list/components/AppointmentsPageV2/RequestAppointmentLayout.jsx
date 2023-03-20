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
  selectTypeOfCareName,
  selectApptDetailAriaText,
  selectIsCommunityCare,
} from '../../redux/selectors';

export default function RequestAppointmentLayout({ appointment }) {
  const appointmentLocality = useSelector(() =>
    selectAppointmentLocality(appointment),
  );
  const first = true;
  const grouped = true;
  const idClickable = `id-${appointment.id.replace('.', '\\.')}`;
  const isCanceled = useSelector(() => selectIsCanceled(appointment));
  const isCommunityCare = useSelector(() => selectIsCommunityCare(appointment));
  const link = `requests/${appointment.id}`;
  const modality = useSelector(() => selectModalityText(appointment));
  const modalityIcon = useSelector(() => selectModalityIcon(appointment));
  const typeOfCareName = useSelector(() => selectTypeOfCareName(appointment));

  const detailAriaLabel = useSelector(() =>
    selectApptDetailAriaText(appointment, true),
  );

  return (
    <ListItem appointment={appointment} borderTop status="pending">
      <AppointmentFlexGrid idClickable={idClickable} link={link}>
        <AppointmentColumn
          className={classNames(
            'vaos-appts__column--2',
            'vads-u-border-color--gray-medium',
            'vads-u-padding-y--2',
            {
              'vads-u-border-top--1px': grouped && !first,
            },
          )}
          size="1"
        >
          <AppointmentRow className="small-screen:vads-u-flex-direction--row">
            <AppointmentColumn size="1" className="vads-u-flex--4">
              <AppointmentRow className="xsmall-screen:vads-u-flex-direction--column small-screen:vads-u-flex-direction--row">
                <AppointmentColumn
                  padding="0"
                  size="1"
                  canceled={isCanceled}
                  className="vads-u-font-weight--bold"
                >
                  {typeOfCareName}
                </AppointmentColumn>
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
                        'vads-u-color--gray',
                        modalityIcon,
                        {
                          'vaos-appts__text--line-through':
                            isCanceled && !isCommunityCare,
                        },
                      )}
                    />

                    {`${modality}`}
                  </>
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
              id={`vaos-appts__detail-${appointment.id}`}
              className="vaos-hide-for-print"
              padding="0"
              size="1"
              aria-label={detailAriaLabel}
            >
              <va-link
                className="vaos-appts__focus--hide-outline"
                aria-describedby={`vaos-appts__detail-${appointment.id}`}
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
