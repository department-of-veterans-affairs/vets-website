import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getFormNumber } from '../utilities/helpers';

const MedicalAuthorizationPolicy = props => {
  const { formData } = props;

  return (
    <div className="vads-u-margin-y--3">
      <va-accordion uswds bordered open-single>
        <va-accordion-item bordered header="Our records authorization policy">
          {getFormNumber(formData) === '21-22' ? (
            <p data-testid="medical-authorization-policy-2122">
              <strong>I authorize</strong> the VA facility having custody of my
              VA claimant records to disclose to the service organization named
              in Item 15 all treatment records relating to drug abuse,
              alcoholism or alcohol abuse, infection with the human
              immunodeficiency virus (HIV), or sickle cell anemia. Redisclosure
              of these records by my service organization representative, other
              than to VA or the Court of Appeals for Veterans Claims, is not
              authorized without my further written consent. This authorization
              will remain in effect until the earlier of the following events:
              (1) I revoke this authorization by filing a written revocation
              with VA; or (2) I revoke the appointment of the service
              organization named in Item 15, by explicit revocation or the
              appointment of another representative.
            </p>
          ) : (
            <p data-testid="medical-authorization-policy-2122a">
              <strong>I authorize</strong> the VA facility having custody of my
              VA claimant records to disclose to the individual named in Item
              16A, and the firm/organization/individual(s) named in Item 19 (if
              approved by VA for affiliated access) all treatment records
              relating to drug abuse, alcoholism or alcohol abuse, infection
              with the human immunodeficiency virus (HIV), or sickle cell
              anemia. Redisclosure of further written consent. This
              authorization will remain in effect until the earlier of the
              following events: (1) I revoke this authorization by filing a
              written revocation with VA; or (2) I revoke the appointment of the
              individual named in Item 16A, either by explicit revocation or the
              appointment of another representative. representative.
            </p>
          )}
        </va-accordion-item>
      </va-accordion>
    </div>
  );
};

MedicalAuthorizationPolicy.propTypes = {
  formData: PropTypes.object,
};

const mapStateToProps = state => ({
  formData: state.form?.data,
});

export default connect(
  mapStateToProps,
  null,
)(MedicalAuthorizationPolicy);
