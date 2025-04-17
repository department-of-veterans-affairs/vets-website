import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getFormNumber } from '../utilities/helpers';

const AddressAuthorizationPolicy = props => {
  const { formData } = props;

  return (
    <div className="vads-u-margin-y--3">
      <va-accordion uswds bordered open-single>
        <va-accordion-item bordered header="Our address authorization policy">
          {getFormNumber(formData) === '21-22' ? (
            <p data-testid="address-authorization-policy-2122">
              <strong>I authorize</strong> any official representative of the
              organization named in Item 15 to act on my behalf to change my
              address in my VA records. This authorization does not extend to
              any other organization without my further written consent. This
              authorization will remain in effect until the earlier of the
              following events: (1) I revoke this authorization by filing a
              written revocation with VA; or (2) I appoint another
              representative, or (3) I have been determined unable to manage my
              financial affairs and the individual or organization named in Item
              16A is not my appointed fiduciary.
            </p>
          ) : (
            <p data-testid="address-authorization-policy-2122a">
              <strong>I authorize</strong> the individual named in Item 16A to
              act on my behalf to change my address in my VA records. This
              authorization does not extend to any other individual without my
              further written consent. This authorization will remain in effect
              until the earlier of the following events: (1) I revoke this
              authorization by filing a written revocation with VA; or (2) I
              revoke the appointment of the individual named in Item 16A, either
              by explicit revocation or the appointment of another
              representative.
            </p>
          )}
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

export default connect(mapStateToProps, null)(AddressAuthorizationPolicy);
