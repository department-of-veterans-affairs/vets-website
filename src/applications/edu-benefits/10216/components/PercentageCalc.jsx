import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

function PercentageCalc({ formData }) {
  const numOfStudent = Number(formData?.studentRatioCalcChapter?.numOfStudent);
  const beneficiaryStudent = Number(
    formData?.studentRatioCalcChapter?.beneficiaryStudent,
  );
  const percentage =
    numOfStudent >= 0 && beneficiaryStudent >= 0
      ? `${Math.floor((beneficiaryStudent / numOfStudent) * 100)}%`
      : '---';
  return (
    <div className="schemaform-field-template">
      <span className="vads-u-font-weight--bold vads-u-font-size--lg">
        {percentage}
      </span>
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
