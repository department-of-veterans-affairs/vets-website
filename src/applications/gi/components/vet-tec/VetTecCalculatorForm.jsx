import PropTypes from 'prop-types';
import React from 'react';

import { formatCurrency } from '../../utils/helpers';

class VetTecCalculatorForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tuitionFees: 0,
      scholarships: 0,
    };
  }

  handleInputChange = event => {
    const { name: field, value } = event.target;
    this.props.onInputChange({ field, value });
  };

  renderScholarships = onShowModal => (
    <div>
      <label
        htmlFor="vetTecScholarships"
        className="vads-u-display--inline-block"
      >
        Scholarships (excluding Pell)
      </label>{' '}
      <a onClick={() => onShowModal('scholarships')}>(Learn more)</a>
      <input
        type="text"
        name="vetTecScholarships"
        value={formatCurrency(this.props.inputs.vetTecScholarships)}
        onChange={this.handleInputChange}
      />
    </div>
  );

  renderTuitionFees = onShowModal => (
    <div>
      <label
        htmlFor="vetTecTuitionFees"
        className="vads-u-display--inline-block"
      >
        Tuition and fees for program
      </label>{' '}
      <a onClick={() => onShowModal('tuitionAndFees')}>(Learn more)</a>
      <input
        type="text"
        name="vetTecTuitionFees"
        value={formatCurrency(this.props.inputs.vetTecTuitionFees)}
        onChange={this.handleInputChange}
      />
    </div>
  );

  render() {
    return (
      <div className="calculator-form">
        <p>
          Use the fields below to modify your tuition and fees or to include a
          scholarship.
        </p>
        {this.renderTuitionFees(this.props.onShowModal)}
        {this.renderScholarships(this.props.onShowModal)}
      </div>
    );
  }
}

VetTecCalculatorForm.propTypes = {
  inputs: PropTypes.object,
  displayedInputs: PropTypes.object,
  onShowModal: PropTypes.func,
  onInputChange: PropTypes.func,
};

export default VetTecCalculatorForm;
