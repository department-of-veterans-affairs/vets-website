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

  renderScholarships = () => (
    <div>
      <label
        htmlFor="vetTecScholarships"
        className="vads-u-display--inline-block"
      >
        Scholarships (excluding Pell)
      </label>{' '}
      <a href="" target="_blank" rel="noopener noreferrer">
        (Learn more)
      </a>
      <input
        type="text"
        name="vetTecScholarships"
        value={formatCurrency(this.props.inputs.vetTecScholarships)}
        onChange={this.handleInputChange}
      />
    </div>
  );

  renderTuitionFees = () => (
    <div>
      <label
        htmlFor="vetTecTuitionFees"
        className="vads-u-display--inline-block"
      >
        Tuition and fees for program
      </label>{' '}
      <a href="" target="_blank" rel="noopener noreferrer">
        (Learn more)
      </a>
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
          If you need to modify your tuition and fees or include a scholarship,
          you can do so below.
        </p>
        {this.renderTuitionFees()}
        {this.renderScholarships()}
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
