import React from 'react';
import { connect } from 'react-redux';
import Signature from './Signature';

function MultipleSignatures({ formData }) {
  return (
    <>
      <p>
        Although these fields are not required to continue the form, both
        signatures will be required for you to submit the form.
      </p>
      <Signature
        formData={formData}
        signatureKey="signature_1"
        certifiedKey="signature_1_certified"
        label="Statement of truth"
      />
      <Signature
        formData={formData}
        signatureKey="signature_2"
        certifiedKey="signature_2_certified"
        label="Statement of truth"
      />
    </>
  );
}

const mapStateToProps = state => ({
  formData: state?.form?.data,
});

export default connect(mapStateToProps)(MultipleSignatures);
