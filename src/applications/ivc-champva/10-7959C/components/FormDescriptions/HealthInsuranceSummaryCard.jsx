import React from 'react';
import PropTypes from 'prop-types';
import { format, parseISO } from 'date-fns';
import { SCHEMA_LABELS } from '../../chapters/healthInsurance/planTypes';
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
  const { insuranceType, effectiveDate, expirationDate } = item ?? {};
  return (
    <ul className="no-bullets">
      <li>
        <strong>Type:</strong> {SCHEMA_LABELS[insuranceType]}
      </li>
      <li>
        <strong>Dates:</strong> {formatDateRange(effectiveDate, expirationDate)}
      </li>
    </ul>
  );
};

HealthInsuranceSummaryCard.propTypes = {
  effectiveDate: PropTypes.string,
  expirationDate: PropTypes.string,
  insuranceType: PropTypes.string,
};

export default HealthInsuranceSummaryCard;
