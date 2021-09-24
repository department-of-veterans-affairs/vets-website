import React from 'react';
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
  const { identity, existingLoan } = formData;

  return (
    <div>
      <h2 className="vads-u-font-size--h4">Upload your documents</h2>
      {identity && (
        <p className="vads-u-font-weight--bold">Please upload the following</p>
      )}
      <ul>
        {identity &&
          DOCUMENT_REQUIREMENTS[identity].map((req, index) => (
            <li key={index}>{req}</li>
          ))}
        {existingLoan && <li>Evidence a VA loan was paid in full</li>}
      </ul>
    </div>
  );
};

const mapStateToProps = state => ({
  formData: state?.form?.data,
});

export default connect(
  mapStateToProps,
  null,
)(UploadRequirements);
