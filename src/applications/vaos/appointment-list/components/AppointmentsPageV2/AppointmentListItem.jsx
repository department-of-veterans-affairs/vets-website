import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { selectFeatureAppointmentList } from '../../../redux/selectors';

export default function AppointmentListItem({
  children,
  className,
  id,
  ...props
}) {
  const featureAppointmentList = useSelector(state =>
    selectFeatureAppointmentList(state),
  );
  return (
    <li
      id={`id-${id.replace('.', '\\.')}`}
      className={classNames(
        featureAppointmentList && `vaos-appts__listItem--lineHeight`,
        `${className}`,
      )}
      data-request-id={id}
      data-testid="appointment-list-item"
      {...props}
    >
      {children}
    </li>
  );
}

AppointmentListItem.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
};
