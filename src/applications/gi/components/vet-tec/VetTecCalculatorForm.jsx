import PropTypes from 'prop-types';
import React from 'react';

import recordEvent from 'platform/monitoring/record-event';
import { formatCurrency } from '../../utils/helpers';
import { ariaLabels } from '../../constants';

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

  trackChange = (fieldName, event) => {
    const value = +event.target.value.replace(/[^0-9.]+/g, '');

    recordEvent({
      event: 'gibct-form-change',
      'gibct-form-field': fieldName,
      'gibct-form-value': value,
    });
  };

  renderScholarships = onShowModal => (
    <div>
      <label
        htmlFor="vetTecScholarships"
        className="vads-u-display--inline-block"
        id="scholarships-label"
      >
        Scholarships (excluding Pell Grants)
      </label>{' '}
      <button
        aria-label={ariaLabels.learnMore.scholarships}
        type="button"
        className="va-button-link learn-more-button"
        onClick={() => onShowModal('scholarships')}
      >
        (Learn more)
      </button>
      <input
        aria-labelledby="scholarships-label"
        type="text"
        name="vetTecScholarships"
        value={formatCurrency(this.props.inputs.vetTecScholarships)}
        onChange={this.handleInputChange}
        onBlur={event => this.trackChange('Scholarships Text Field', event)}
      />
    </div>
  );

  renderTuitionFees = onShowModal => (
    <div>
      <label
        htmlFor="vetTecTuitionFees"
        className="vads-u-display--inline-block vads-u-margin-y--0"
        id="tuition-fees-label"
      >
        {' '}
        Tuition and fees for program
      </label>{' '}
      <button
        aria-label={ariaLabels.learnMore.tuitionAndFees}
        type="button"
        className="va-button-link learn-more-button"
        onClick={() => onShowModal('tuitionAndFees')}
      >
        (Learn more)
      </button>
      <input
        aria-labelledby="tuition-fees-label"
        type="text"
        name="vetTecTuitionFees"
        value={formatCurrency(this.props.inputs.vetTecTuitionFees)}
        onChange={this.handleInputChange}
        onBlur={event => this.trackChange('Tuition & Fees Text Field', event)}
      />
    </div>
  );

  render() {
    return (
      <div className="calculator-form">
        <p>
          Use the fields below to update your tuition and fees or to add a
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
