import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useMediaQuery } from 'react-responsive';
import AppointmentColumn from './AppointmentColum';

export function AppointmentColumnLayout({ data, first, grouped }) {
  const isMobile = useMediaQuery({ query: '(max-width: 360px)' });

  return (
    <>
      <AppointmentColumn
        id="column 1"
        classNameOverride="vads-u-flex--auto vaos-appts__flex--basis vads-u-margin-left--1p5 vads-u-margin-right--5 vads-u-padding-y--2"
        style={{ minWidth: isMobile ? 26 : 60 }}
      >
        {first && (
          <div
            className={classNames('vads-l-row', {
              'vads-u-flex-direction--column': isMobile,
            })}
          >
            <div className="vads-l-col">
              <h3
                className="vads-u-display--inline-block vads-u-text-align--center vads-u-margin-top--0 vads-u-margin-bottom--0"
                style={{ width: '24px' }}
              >
                {data.appointmentDate.format('D')}
              </h3>
            </div>
            <div
              className={classNames('vads-l-col', 'vads-u-padding-top--0p25', {
                'vads-u-order--first': isMobile,
              })}
            >
              <span
                className={classNames({
                  'vads-u-margin-left--1': !isMobile,
                })}
              >
                {data.appointmentDate.format('ddd')}
              </span>
              <span className="sr-only"> {data.description}</span>
            </div>
          </div>
        )}
      </AppointmentColumn>

      <AppointmentColumn
        id="column 2"
        classNameOverride={classNames(
          'vads-l-col',
          'vads-u-padding-y--2',
          'vads-u-padding-right--1',
          'vads-u-border-color--gray-lighter',
          {
            'vads-u-border-top--1px': grouped && !first,
          },
        )}
        style={{ minWidth: 60 }}
      >
        <div
          className={classNames('vads-l-row', {
            'vads-u-flex-direction--column': isMobile,
          })}
        >
          <AppointmentColumn
            classNameOverride={classNames(
              'vads-u-flex--auto',
              'vads-u-padding-top--0p25',
              'vaos-appts__flex--basis',
            )}
            canceled={data.canceled}
          >
            {`${data.appointmentDate.format(
              'h:mm',
            )} ${data.appointmentDate.format('a').replace(/\./g, '')} ${
              data.abbreviation
            }`}{' '}
          </AppointmentColumn>

          <AppointmentColumn
            className={classNames(
              'vads-u-font-weight--bold',
              'vads-u-padding-right--0p5',
              'vaos-appts__text--truncate',
              {
                'vads-l-col--4': !isMobile,
                'vads-l-col--12': isMobile,
              },
            )}
            canceled={data.canceled}
          >
            {data.appointmentDetails}
          </AppointmentColumn>

          <AppointmentColumn
            className={classNames('vaos-appts__text--truncate', {
              'vads-l-col--5': !isMobile,
              'vads-l-col--11': isMobile,
            })}
            icon={data.icon}
            canceled={data.canceled}
          >
            {data.appointmentType}
          </AppointmentColumn>

          <AppointmentColumn
            className={classNames('vaos-hide-for-print', {
              'vads-l-col': !isMobile,
              'vads-l-col--11': isMobile,
              'vads-u-margin-right--1': !isMobile,
              'vads-u-text-align--right': !isMobile,
            })}
          >
            <Link
              className="vaos-appts__focus--hide-outline"
              aria-label={data.ariaLabel}
              to={data.link}
              onClick={e => e.preventDefault()}
            >
              Details
            </Link>
          </AppointmentColumn>
        </div>
      </AppointmentColumn>
    </>
  );
}

AppointmentColumnLayout.propTypes = {
  /** Layout data */
  data: PropTypes.object,

  /** Is this the 1st column/ */
  first: PropTypes.bool,

  /** Is this row of data part of a group? Ex. Multiply appointments on the same day. */
  grouped: PropTypes.bool,

  /** Is this the last column? */
  last: PropTypes.bool,
};
