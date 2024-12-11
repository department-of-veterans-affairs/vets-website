import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { calculatedPercentage } from '../utilities';

const gaRatioCalculationText = () => {
  window.dataLayer.push({
    event: 'edu-10216--form-help-text-clicked',
    'help-text-label': 'How is this calculated?',
  });
};
function PercentageCalc({ formData }) {
  return (
    <div className="schemaform-field-template">
      <span className="vads-u-font-weight--bold vads-u-font-size--lg">
        {calculatedPercentage(formData)}
      </span>
      <va-additional-info
        class="vads-u-margin-top--1p5"
        trigger="How is this calculated?"
        onClick={gaRatioCalculationText}
      >
        <>
          <p>
            (Number of VA beneficiary students divided by Total number of
            students) multiplied by 100 = Percentage of VA beneficiary students
          </p>
          <p>
            If this percentage seems incorrect, please check the numbers you
            entered above.
          </p>
        </>
      </va-additional-info>
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
