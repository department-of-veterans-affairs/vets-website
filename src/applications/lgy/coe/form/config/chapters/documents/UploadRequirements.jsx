import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Abbreviation keys:
// ADSM - Active Duty Service Member
// NADNA - Non Active Duty Never Activated
// DNANA - Discharged National Guard Never Activated
// DRNA - Discharged Reserves Never Activaed
const DOCUMENT_REQUIREMENTS = {
  VETERAN: ['A copy of your discharge or separation papers (DD214)'],
  ADSM: ['Statement of Service'],
  NADNA: [
    'Statement of Service AND',
    'Creditable number of years served or',
    'Retirement Points Statement',
  ],
  DNANA: [
    'Separation and Report of Service (NGB Form 22) for each period of National Guard service AND',
    'Retirement Points Statement (NGB Form 23) AND',
    'Proof of character of service',
  ],
  DRNA: ['Latest annual retirement points AND', 'Proof of honorable service'],
};

const UploadRequirements = ({ formData }) => {
  const { identity, vaLoanIndicator } = formData || {};

  return (
    <div>
      <h3 className="vads-u-font-size--h4 vads-u-margin-top--1">
        Upload your documents
      </h3>
      {identity && (
        <p className="vads-u-font-weight--bold">Upload the following</p>
      )}
      <ul>
        {identity &&
          DOCUMENT_REQUIREMENTS[identity].map((req, index) => (
            <li key={index}>{req}</li>
          ))}
        {vaLoanIndicator && (
          <li>Evidence a VA loan was paid in full (if applicable)</li>
        )}
      </ul>
    </div>
  );
};

const mapStateToProps = state => ({
  formData: state?.form?.data,
});

UploadRequirements.propTypes = {
  formData: PropTypes.object,
};

export default connect(mapStateToProps, null)(UploadRequirements);
