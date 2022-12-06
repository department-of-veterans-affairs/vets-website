import React from 'react';
import { useSelector } from 'react-redux';
import { selectFeatureAppointmentList } from '../../../redux/selectors';

export function Label(label) {
  const featureAppointmentList = useSelector(state =>
    selectFeatureAppointmentList(state),
  );

  if (featureAppointmentList) return null;

  return (
    <div className="vads-u-margin-bottom--1">
      <span className="usa-label">{label}</span>
    </div>
  );
}
