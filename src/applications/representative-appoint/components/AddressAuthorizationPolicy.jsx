import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const AddressAuthorizationPolicy = () => {
  return (
    <div className="vads-u-margin-y--3">
      <va-accordion uswds bordered open-single>
        <va-accordion-item bordered header="Our address authorization policy">
          <p data-testid="address-authorization-policy-2122a">
            <strong>I authorize</strong> the individual named in Item 16A to act
            on my behalf to change my address in my VA records. This
            authorization does not extend to any other individual without my
            further written consent. This authorization will remain in effect
            until the earlier of the following events: (1) I revoke this
            authorization by filing a written revocation with VA; or (2) I
            revoke the appointment of the individual named in Item 16A, either
            by explicit revocation or the appointment of another representative.
          </p>
        </va-accordion-item>
      </va-accordion>
    </div>
  );
};

AddressAuthorizationPolicy.propTypes = {
  formData: PropTypes.object,
};

const mapStateToProps = state => ({
  formData: state.form?.data,
});

export default connect(
  mapStateToProps,
  null,
)(AddressAuthorizationPolicy);
