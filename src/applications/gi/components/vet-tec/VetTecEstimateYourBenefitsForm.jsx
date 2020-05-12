import PropTypes from 'prop-types';
import React from 'react';

import recordEvent from 'platform/monitoring/record-event';
import {
  removeNonNumberCharacters,
  formatDollarAmount,
} from '../../utils/helpers';
import { ariaLabels } from '../../constants';
import Dropdown from '../Dropdown';
import RadioButtons from '../RadioButtons';
import { focusElement } from 'platform/utilities/ui';

class VetTecEstimateYourBenefitsForm extends React.Component {
  constructor(props) {
    super(props);
    const selectedProgramName =
      this.props.selectedProgram !== ''
        ? this.props.selectedProgram
        : this.props.preSelectedProgram;

    const selectedProgram = this.props.institution.programs.filter(
      program => program.description === selectedProgramName,
    );
    this.state = {
      tuitionFees: selectedProgram[0].tuitionAmount,
      scholarships: 0,
      programName: selectedProgramName,
    };
    this.setProgramFields(this.props.preSelectedProgram);
  }

  getProgramByName = programName =>
    this.props.institution.programs.find(
      p => p.description.toLowerCase() === programName.toLowerCase(),
    );

  setProgramFields = programName => {
    if (programName) {
      const program = this.getProgramByName(programName);
      if (program) {
        const field = 'EstimateYourBenefitsFields';
        const value = {
          vetTecTuitionFees: this.state.tuitionFees,
          vetTecProgramName: this.state.programName,
          vetTecScholarships: this.state.scholarships,
          vetTecProgramFacilityCode: this.props.institution.facilityCode,
        };
        this.props.calculatorInputChange({ field, value });
      }
    }
  };

  handleApprovedProgramsChange = event => {
    const vetTecProgramName = event.target.value;
    const program = this.getProgramByName(vetTecProgramName);

    this.setState({
      programName: vetTecProgramName,
      tuitionFees: program.tuitionAmount,
    });

    this.props.calculatorInputChange({ vetTecProgramName });
  };

  trackChange = (fieldName, event) => {
    const value = +event.target.value.replace(/[^0-9.]+/g, '');

    recordEvent({
      event: 'gibct-form-change',
      'gibct-form-field': fieldName,
      'gibct-form-value': value,
    });
  };

  calculateBenefitsOnClick = event => {
    event.preventDefault();
    this.setProgramFields(this.state.programName);
    focusElement('.estimated-benefits-header');
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
        value={formatDollarAmount(this.state.scholarships)}
        onChange={e =>
          this.setState({
            scholarships: removeNonNumberCharacters(e.target.value),
          })
        }
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
        name="vetTecTuitionFees"
        type="text"
        value={formatDollarAmount(this.state.tuitionFees)}
        onChange={e =>
          this.setState({
            tuitionFees: removeNonNumberCharacters(e.target.value),
          })
        }
        onBlur={event => this.trackChange('Tuition & Fees Text Field', event)}
      />
    </div>
  );

  renderApprovedProgramsSelector = institution => {
    const options = institution.programs.map(program => ({
      value: program.description,
      label: program.description,
    }));
    return options.length <= 5 ? (
      <RadioButtons
        label="Choose the training program you'd like to attend"
        name="approvedPrograms"
        options={options}
        value={this.state.programName}
        onChange={e => this.handleApprovedProgramsChange(e)}
      />
    ) : (
      <Dropdown
        label="Choose the training program you'd like to attend"
        name="approvedPrograms"
        alt="Choose the training program you'd like to attend"
        options={options}
        value={this.state.programName}
        onChange={e => this.handleApprovedProgramsChange(e)}
        visible
      />
    );
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

VetTecEstimateYourBenefitsForm.propTypes = {
  inputs: PropTypes.object,
  displayedInputs: PropTypes.object,
  onShowModal: PropTypes.func,
  institution: PropTypes.object,
  selectedProgram: PropTypes.string,
  preSelectedProgram: PropTypes.string,
  calculatorInputChange: PropTypes.func,
};

export default VetTecEstimateYourBenefitsForm;
