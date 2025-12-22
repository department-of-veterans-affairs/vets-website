import React from 'react';

const parseConnectedDisabilities = value => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.filter(item => typeof item === 'string' && item.trim().length);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map(entry => entry.trim())
      .filter(item => item.length);
  }

  if (typeof value === 'object') {
    return Object.entries(value)
      .filter(([, isSelected]) => !!isSelected)
      .map(([key]) => key)
      .filter(item => item && item.trim().length);
  }

  return [];
};

const renderConnectedDisabilities = value => {
  const connected = parseConnectedDisabilities(value);

  if (!connected.length) {
    return null;
  }

  if (connected.length === 1) {
    return <p>Connected disabilities: {connected[0]}</p>;
  }

  return (
    <div>
      <p className="vads-u-margin-bottom--0">Connected disabilities:</p>
      <ul className="vads-u-margin-top--0 vads-u-margin-bottom--0">
        {connected.map((item, index) => (
          <li key={`${item}-${index}`}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

const renderTreatmentDates = dates => {
  if (!Array.isArray(dates) || !dates.length) {
    return null;
  }

  return (
    <div>
      <p className="vads-u-margin-bottom--0">Treatment dates:</p>
      <ul className="vads-u-margin-top--0 vads-u-margin-bottom--0">
        {dates.map((range, index) => (
          <li key={`treatment-${index}`}>
            {range?.startDate || 'Not provided'} &mdash;{' '}
            {range?.endDate || 'Not provided'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export const DisabilityView = ({ formData }) => {
  const disability =
    typeof formData === 'string' ? formData : formData?.disability;

  return (
    <div className="vads-u-padding--2">
      <strong>{disability || 'Disability not provided'}</strong>
    </div>
  );
};

export const DateRangeView = ({ formData }) => {
  return (
    <div className="vads-u-padding--2">
      <p>
        Duration: {formData.startDate || 'Not provided'} &mdash;{' '}
        {formData.endDate || 'Not provided'}
      </p>
    </div>
  );
};

export const DoctorView = ({ formData }) => {
  return (
    <div className="vads-u-padding--2">
      <strong>{formData.doctorName || 'Doctor name not provided'}</strong>
      <p>
        Address: {formData.doctorAddress?.street || ''}{' '}
        {formData.doctorAddress?.street2 || ''}
        {formData.doctorAddress?.city ? `, ${formData.doctorAddress.city}` : ''}
        {formData.doctorAddress?.state
          ? `, ${formData.doctorAddress.state}`
          : ''}
        {formData.doctorAddress?.postalCode
          ? ` ${formData.doctorAddress.postalCode}`
          : ''}
      </p>
      {renderConnectedDisabilities(formData.connectedDisabilities)}
      {renderTreatmentDates(formData.treatmentDates)}
    </div>
  );
};

export const HospitalView = ({ formData }) => {
  const hospitalTypeMap = {
    va: 'VA Hospital',
    nonVa: 'Non-VA Hospital',
  };
  const hospitalTypeLabel =
    hospitalTypeMap[formData.hospitalType] || 'Hospital type not provided';

  return (
    <div className="vads-u-padding--2">
      <p>Type: {hospitalTypeLabel}</p>
      <strong>{formData.hospitalName || 'Hospital name not provided'}</strong>
      <p>
        Address: {formData.hospitalAddress?.street || ''}{' '}
        {formData.hospitalAddress?.street2 || ''}
        {formData.hospitalAddress?.city
          ? `, ${formData.hospitalAddress.city}`
          : ''}
        {formData.hospitalAddress?.state
          ? `, ${formData.hospitalAddress.state}`
          : ''}
        {formData.hospitalAddress?.postalCode
          ? ` ${formData.hospitalAddress.postalCode}`
          : ''}
      </p>
      {renderConnectedDisabilities(formData.connectedDisabilities)}
      {renderTreatmentDates(formData.treatmentDates)}
    </div>
  );
};

export const EmployerView = ({ formData }) => (
  <div className="vads-u-padding--2">
    <strong>{formData.employerName || 'Employer name not provided'}</strong>
    <p>
      Type of work: {formData.typeOfWork || 'Not provided'}
      <br />
      Date applied: {formData.dateApplied || 'Not provided'}
    </p>
    <p>
      Address: {formData.employerAddress?.street || ''}{' '}
      {formData.employerAddress?.street2 || ''}
      {formData.employerAddress?.city
        ? `, ${formData.employerAddress.city}`
        : ''}
      {formData.employerAddress?.state
        ? `, ${formData.employerAddress.state}`
        : ''}
      {formData.employerAddress?.postalCode
        ? ` ${formData.employerAddress.postalCode}`
        : ''}
    </p>
  </div>
);

export const EmploymentHistoryView = ({ formData }) => (
  <div className="vads-u-padding--2">
    <strong>{formData.employerName || 'Employer name not provided'}</strong>
    <p>
      Type of work: {formData.typeOfWork || 'Not provided'}
      <br />
      Hours per week: {formData.hoursPerWeek || 'Not provided'}
      <br />
      Employment dates: {formData.startDate || 'Start date not provided'} -{' '}
      {formData.endDate || 'End date not provided'}
    </p>
    <p>
      Time lost from illness: {formData.lostTime ?? 'Not provided'} hours
      <br />
      Highest gross earnings per month: $
      {formData.highestIncome ?? 'Not provided'}
    </p>
    <p>
      Address: {formData.employerAddress?.street || ''}{' '}
      {formData.employerAddress?.street2 || ''}
      {formData.employerAddress?.city
        ? `, ${formData.employerAddress.city}`
        : ''}
      {formData.employerAddress?.state
        ? `, ${formData.employerAddress.state}`
        : ''}
      {formData.employerAddress?.postalCode
        ? ` ${formData.employerAddress.postalCode}`
        : ''}
    </p>
  </div>
);

export const EducationView = ({ formData }) => (
  <div className="vads-u-padding--2">
    <strong>{formData.typeOfEducation || 'Education type not provided'}</strong>
    <p>
      Training dates:{' '}
      {formData.datesOfTraining?.from || 'Start date not provided'} -{' '}
      {formData.datesOfTraining?.to || 'End date not provided'}
    </p>
  </div>
);
