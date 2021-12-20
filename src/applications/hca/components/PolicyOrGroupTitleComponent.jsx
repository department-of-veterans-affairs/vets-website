import React from 'react';
import { connect } from 'react-redux';
import { NO_POLICY_OR_GROUP_ERROR } from '../helpers';

const PolicyOrGroupTitleComponent = ({ form }) => {
  // const hasPolicyOrGroup =
  //   (form &&
  //     form.data &&
  //     form.data.providers &&
  //     form.data.providers[form.data.providers.length - 1].insuranceGroupCode) ||
  //   (form &&
  //     form.data &&
  //     form.data.providers &&
  //     form.data.providers[form.data.providers.length - 1]
  //       .insurancePolicyNumber);

  const hasPolicyOrGroup = !(
    form &&
    form.data &&
    form.data.providers &&
    form.data.providers[form.data.providers.length - 1][
      'view:policyOrGroupDesc'
    ] &&
    form.data.providers[form.data.providers.length - 1][
      'view:policyOrGroupDesc'
    ][NO_POLICY_OR_GROUP_ERROR]
  );

  const policyOrGroupTitle = (
    <div className="vads-u-margin-top--6 vads-u-margin-bottom--2 schemaform-block-title schemaform-block-subtitle">
      {' '}
      Provide either your insurance policy number or group code.
      <span className="schemaform-required-span" style={{ fontWeight: '400' }}>
        (*Required)
      </span>
    </div>
  );

  const policyOrGroupTitleWithError = (
    <div className="vads-u-margin-top--6 vads-u-margin-bottom--2 schemaform-block-title schemaform-block-subtitle">
      {' '}
      Provide either your insurance policy number or group code.
      <span className="schemaform-required-span">(*Required)</span>
      <div>
        <span className="schemaform-required-span">
          {' '}
          Please provide a response.
        </span>
      </div>
    </div>
  );

  return (
    <div>
      {hasPolicyOrGroup ? policyOrGroupTitle : policyOrGroupTitleWithError}
    </div>
  );
};

const mapStateToProps = state => ({
  form: state.form,
});

export default connect(mapStateToProps)(PolicyOrGroupTitleComponent);
