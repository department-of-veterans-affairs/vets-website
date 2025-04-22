import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { calculatedPercentage } from '../utilities';

function PercentageCalc({ formData }) {
  return (
    <div className="schemaform-field-template">
      <div className="vads-u-margin-bottom--2">
        <span className="vads-u-font-weight--bold vads-u-font-size--lg">
          {calculatedPercentage(formData)}
        </span>
      </div>
      <va-alert status="info" visible>
        <h4 id="calculation-info-alert" slot="headline">
          How is this calculated?
        </h4>
        <p className="vads-u-margin-top--0 vads-u-margin-bottom--2">
          (Number of VA beneficiary students divided by Total number of
          students) multiplied by 100 = Percentage of VA beneficiary students.
        </p>
        <p className="vads-u-margin-y--0">
          If this percentage seems incorrect, please check the numbers you
          entered above.
        </p>
      </va-alert>
    </div>
  );
}

PercentageCalc.propTypes = {
  formData: PropTypes.object,
};

const mapStateToProps = state => ({
  formData: state.form?.data || {},
});

export default connect(mapStateToProps)(PercentageCalc);
