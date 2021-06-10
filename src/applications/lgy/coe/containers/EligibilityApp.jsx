import React from 'react';
import { connect } from 'react-redux';
import FormFooter from 'platform/forms/components/FormFooter';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';

import { generateCoe } from '../actions';
import formConfig from '../config/form';
import { CertificateDownload } from '../components/CertificateDownload';

const EligibilityApp = props => {
  const clickHandler = () => {
    props.generateCoe('skip');
  };
  return (
    <>
      <header className="row">
        <FormTitle title="Apply for a VA home loan Certificate of Eligibility" />
        <p>Request for a Certificate of Eligibility (VA Form 26-1880)</p>
      </header>
      <CertificateDownload clickHandler={clickHandler} />
      <FormFooter formConfig={formConfig} />
    </>
  );
};

const mapDispatchToProps = {
  generateCoe,
};

export default connect(
  null,
  mapDispatchToProps,
)(EligibilityApp);

export { EligibilityApp };
