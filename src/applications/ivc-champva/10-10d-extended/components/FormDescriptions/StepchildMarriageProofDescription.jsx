import React from 'react';
import PropTypes from 'prop-types';
import { applicantWording, privWrapper } from '../../../shared/utilities';
import FileUploadDescription from './FileUploadDescription';

const StepchildMarriageProofDescription = ({ formData }) => {
  const applicantName = privWrapper(applicantWording(formData, true, false));
  return (
    <>
      <p>
        You’ll need to submit a document showing proof of the marriage or legal
        union between {applicantName} Veteran and {applicantName}
        parent.
      </p>
      <p>
        <strong>Upload a copy of one of these documents:</strong>
      </p>
      <ul>
        <li>
          Marriage certificate, <strong>or</strong>
        </li>
        <li>
          A document showing proof of a civil union, <strong>or</strong>
        </li>
        <li>Common-law marriage affidavit</li>
      </ul>
      <FileUploadDescription />
    </>
  );
};

StepchildMarriageProofDescription.propTypes = {
  formData: PropTypes.shape({
    applicantName: PropTypes.shape({
      first: PropTypes.string,
      middle: PropTypes.string,
      last: PropTypes.string,
      suffix: PropTypes.string,
    }),
  }),
};

export default StepchildMarriageProofDescription;
