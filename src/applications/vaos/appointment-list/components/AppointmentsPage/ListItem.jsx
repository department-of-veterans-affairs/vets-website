import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default function ListItem({
  appointment,
  borderTop,
  borderBottom,
  children,
  status,
}) {
  const idClickable = `id-${appointment.id.replace('.', '\\.')}`;

  return (
    <li
      id={idClickable}
      data-request-id={appointment.id}
      data-status={status}
      className={classNames(
        'vaos-appts__listItem--clickable',
        'vads-u-margin--0',
        {
          'vads-u-border-top--1px': borderTop,
          'vads-u-border-bottom--1px': borderBottom,
          'vads-u-border-color--gray-medium': borderBottom,
        },
      )}
      data-testid="appointment-list-item"
    >
      {children}
    </li>
  );
}

ListItem.propTypes = {
  appointment: PropTypes.object.isRequired,
  borderBottom: PropTypes.bool,
  borderTop: PropTypes.bool,
  children: PropTypes.object,
  grouped: PropTypes.bool,
  index: PropTypes.number,
  status: PropTypes.string,
};
