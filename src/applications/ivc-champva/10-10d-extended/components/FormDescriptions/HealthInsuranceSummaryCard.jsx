import React from 'react';
import { useSelector } from 'react-redux';
import { format, parseISO } from 'date-fns';
import { SCHEMA_LABELS } from '../../chapters/healthInsuranceInformation/planTypes';
import { generateParticipantNames } from '../../helpers';
import content from '../../locales/en/content.json';

const TEXT_PRESENT = content['health-insurance--summary-date-present'];
const TEXT_NOT_SPECIFIED = content['health-insurance--summary-date-missing'];

const formatDate = dateStr => {
  if (!dateStr) return null;
  try {
    return format(parseISO(dateStr), 'MM/dd/yyyy');
  } catch (e) {
    return null;
  }
};

const formatDateRange = (startDate, endDate) => {
  const start = formatDate(startDate);
  const end = formatDate(endDate) || TEXT_PRESENT;
  return start ? `${start} - ${end}` : TEXT_NOT_SPECIFIED;
};

const HealthInsuranceSummaryCard = item => {
  const applicants = useSelector(state => state.form.data.applicants);
  const { insuranceType, effectiveDate, expirationDate } = item ?? {};
  return (
    <ul className="no-bullets">
      <li>
        <strong>Type:</strong> {SCHEMA_LABELS[insuranceType]}
      </li>
      <li>
        <strong>Dates:</strong> {formatDateRange(effectiveDate, expirationDate)}
      </li>
      <li>
        <strong>Policy members:</strong>{' '}
        {generateParticipantNames({ item, applicants })}
      </li>
    </ul>
  );
};

export default HealthInsuranceSummaryCard;
