import React from 'react';

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
      {formData.connectedDisabilities && (
        <p>Connected disabilities: {formData.connectedDisabilities}</p>
      )}
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
      {formData.connectedDisabilities && (
        <p>Connected disabilities: {formData.connectedDisabilities}</p>
      )}
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
      Time lost from illness: {formData.lostTime || 'Not provided'} hours
      <br />
      Highest gross earnings per month: $
      {formData.highestIncome || 'Not provided'}
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
