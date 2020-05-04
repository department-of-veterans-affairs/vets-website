import PropTypes from 'prop-types';
import React from 'react';

import recordEvent from 'platform/monitoring/record-event';
import { formatCurrency } from '../../utils/helpers';
import { ariaLabels } from '../../constants';
import Dropdown from '../Dropdown';
import { calculatorInputChange } from '../../actions';
import { connect } from 'react-redux';
import RadioButtons from '../RadioButtons';

class EybVetTecCalculatorForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tuitionFees: 0,
      scholarships: 0,
    };
  }

  handleInputChange = event => {
    const { name: field, value } = event.target;
    this.props.calculatorInputChange({ field, value });
  };

  setProgramFields = programName => {
    if (programName) {
      const program = this.props.institution.programs.find(
        p => p.description.toLowerCase() === programName.toLowerCase(),
      );
      if (program) {
        const field = 'vetTecProgram';
        const value = {
          vetTecTuitionFees: program.tuitionAmount,
          vetTecProgramName: program.description,
          vetTecProgramFacilityCode: this.props.institution.facilityCode,
        };
        this.props.calculatorInputChange({ field, value });
      }
    }
  };

  handleApprovedProgramsChange = event => {
    const vetTecProgramName = event.target.value;
    this.setProgramFields(vetTecProgramName);
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
        Scholarships (excluding Pell)
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
        className="vads-u-display--inline-block"
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

  renderApprovedProgramsSelector = institution => {
    const selectedProgram =
      this.props.selectedProgram !== ''
        ? this.props.selectedProgram
        : this.props.preSelectedProgram;

    const options = institution.programs.map(program => ({
      value: program.description,
      label: program.description,
    }));
    return options.length <= 6 ? (
      <RadioButtons
        label="Choose the training program you'd like to attend"
        name="approvedPrograms"
        options={options}
        value={selectedProgram}
        onChange={e => this.handleApprovedProgramsChange(e)}
      />
    ) : (
      <Dropdown
        label="Choose the training program you'd like to attend"
        name="approvedPrograms"
        alt="Choose the training program you'd like to attend"
        options={options}
        value={selectedProgram}
        onChange={e => this.handleApprovedProgramsChange(e)}
        visible
      />
    );
  };

  calculateBenefitsOnClick = event => {
    event.preventDefault();
    const selectedProgram =
      this.props.selectedProgram !== ''
        ? this.props.selectedProgram
        : this.props.preSelectedProgram;
    this.setProgramFields(selectedProgram);
    document.getElementById('estimated-benefits-header').focus();
  };

  render() {
    return (
      <div className="calculator-form">
        <p>Use the fields below to calculate your benefits</p>
        {this.renderApprovedProgramsSelector(this.props.institution)}
        {this.renderTuitionFees(this.props.onShowModal)}
        {this.renderScholarships(this.props.onShowModal)}
        <button
          type="button"
          className="vads-u-margin-top--2p5"
          onClick={this.calculateBenefitsOnClick}
        >
          Calculate benefits
        </button>
      </div>
    );
  }
}

EybVetTecCalculatorForm.propTypes = {
  inputs: PropTypes.object,
  displayedInputs: PropTypes.object,
  onShowModal: PropTypes.func,
  institution: PropTypes.object,
  selectedProgram: PropTypes.string,
  preSelectedProgram: PropTypes.string,
};

const mapDispatchToProps = { calculatorInputChange };

export default connect(
  null,
  mapDispatchToProps,
)(EybVetTecCalculatorForm);
