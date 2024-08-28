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
  selectModalityIcon,
  selectTypeOfCareName,
  selectApptDetailAriaText,
  selectIsCommunityCare,
} from '../../redux/selectors';
import {
  selectFeatureBreadcrumbUrlUpdate,
  selectFeatureCCDirectScheduling,
} from '../../../redux/selectors';

export default function RequestAppointmentLayout({ appointment }) {
  const appointmentLocality = useSelector(() =>
    selectAppointmentLocality(appointment, true),
  );
  const first = true;
  const grouped = true;
  const idClickable = `id-${appointment.id.replace('.', '\\.')}`;
  const isCanceled = useSelector(() => selectIsCanceled(appointment));
  const isCommunityCare = useSelector(() => selectIsCommunityCare(appointment));
  const modality = isCommunityCare
    ? 'Community care'
    : appointment?.preferredModality;
  const modalityIcon = useSelector(() => selectModalityIcon(appointment));
  const typeOfCareName = useSelector(() => selectTypeOfCareName(appointment));

  const detailAriaLabel = useSelector(() =>
    selectApptDetailAriaText(appointment, true),
  );
  const featureBreadcrumbUrlUpdate = useSelector(state =>
    selectFeatureBreadcrumbUrlUpdate(state),
  );

  const featureCCDirectScheduling = useSelector(state =>
    selectFeatureCCDirectScheduling(state),
  );

  const displayNewTypeOfCareHeading = `${typeOfCareName} request`;
  const link = `${featureBreadcrumbUrlUpdate ? 'pending' : 'requests'}/${
    appointment.id
  }`;

  return (
    <ListItem appointment={appointment} borderBottom status="pending">
      <AppointmentFlexGrid idClickable={idClickable} link={link}>
        <AppointmentRow className="vads-u-margin-x--1p5 xsmall-screen:vads-u-flex-direction--row">
          <AppointmentColumn
            className={classNames(
              'vads-u-border-color--gray-medium',
              'vads-u-padding-y--2',
              {
                'vads-u-border-top--1px': grouped && !first,
              },
            )}
            size="1"
          >
            <AppointmentRow className="vaos-appts__column-gap--3 small-screen:vads-u-flex-direction--row">
              <AppointmentColumn size="1" className="vads-u-flex--4">
                <AppointmentRow className="vaos-appts__column-gap--3 vaos-appts__display--table xsmall-screen:vads-u-flex-direction--column small-screen:vads-u-flex-direction--row">
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
};
