import PropTypes from 'prop-types';
import React from 'react';

import recordEvent from 'platform/monitoring/record-event';
import {
  removeNonNumberCharacters,
  formatDollarAmount,
  handleScrollOnInputFocus,
} from '../../utils/helpers';
import { ariaLabels } from '../../constants';
import Dropdown from '../Dropdown';
import RadioButtons from '../RadioButtons';
import { focusElement } from 'platform/utilities/ui';
import environment from 'platform/utilities/environment';
import { renderLearnMoreLabel } from '../../utils/render';

class VetTecEstimateYourBenefitsForm extends React.Component {
  constructor(props) {
    super(props);
    const selectedProgramName = this.props.selectedProgram;

    const selectedProgram = this.props.institution.programs.filter(
      program => program.description === selectedProgramName,
    );
    this.state = {
      tuitionFees: selectedProgram[0].tuitionAmount,
      scholarships: 0,
      programName: selectedProgramName,
    };
    this.setProgramFields(this.props.selectedProgram);
  }

  disableUpdateBenefits = () => {
    const {
      vetTecTuitionFees,
      vetTecProgramName,
      vetTecScholarships,
    } = this.props.inputs;

    const { tuitionFees, programName, scholarships } = this.state;
    return (
      vetTecTuitionFees === tuitionFees &&
      vetTecProgramName === programName &&
      vetTecScholarships === scholarships
    );
  };

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
    this.trackChange('Approved Programs Field', event);
  };

  trackChange = (fieldName, event) => {
    const value = +event.target.value.replace(/[^0-9.]+/g, '');

    recordEvent({
      event: 'gibct-form-change',
      'gibct-form-field': fieldName,
      'gibct-form-value': value,
    });
  };

  updateBenefitsOnClick = event => {
    event.preventDefault();
    this.setProgramFields(this.state.programName);
    focusElement('.estimated-benefits-header');
  };

  renderLearnMoreLabel = ({ text, modal, ariaLabel }) =>
    renderLearnMoreLabel({
      text,
      modal,
      ariaLabel,
      showModal: this.props.showModal,
      component: this,
    });

  renderScholarships = () => (
    <div id="scholarships-field">
      <label
        htmlFor="vetTecScholarships"
        className="vads-u-display--inline-block"
        id="scholarships-label"
      >
        {this.renderLearnMoreLabel({
          text: 'Scholarships (excluding Pell)',
          modal: 'scholarships',
          ariaLabel: ariaLabels.learnMore.scholarships,
        })}
      </label>
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
        onFocus={
          // prod flag for bah-8821
          !environment.isProduction() &&
          handleScrollOnInputFocus.bind(this, 'scholarships-field')
        }
        onBlur={event => this.trackChange('Scholarships Text Field', event)}
      />
    </div>
  );

  renderTuitionFees = () => (
    <div id="tuition-field">
      <label
        htmlFor="vetTecTuitionFees"
        className="vads-u-display--inline-block"
        id="tuition-fees-label"
      >
        {this.renderLearnMoreLabel({
          text: 'Tuition and fees for program',
          modal: 'tuitionAndFees',
          ariaLabel: ariaLabels.learnMore.tuitionAndFees,
        })}
      </label>
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
        onFocus={
          !environment.isProduction() &&
          handleScrollOnInputFocus.bind(this, 'tuition-field')
        }
        onBlur={event => this.trackChange('Tuition & Fees Text Field', event)}
      />
    </div>
  );

  renderApprovedProgramsSelector = () => {
    const options = this.props.institution.programs.map(program => ({
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
        <p>Use the fields below to update your benefits.</p>
        {this.renderApprovedProgramsSelector()}
        {this.renderTuitionFees()}
        {this.renderScholarships()}
        <button
          type="button"
          className="vads-u-margin-top--2p5"
          onClick={this.updateBenefitsOnClick}
          disabled={this.disableUpdateBenefits()}
        >
          Update benefits
        </button>
      </div>
    );
  }
}

VetTecEstimateYourBenefitsForm.propTypes = {
  inputs: PropTypes.object,
  displayedInputs: PropTypes.object,
  showModal: PropTypes.func,
  institution: PropTypes.object,
  selectedProgram: PropTypes.string,
  calculatorInputChange: PropTypes.func,
};

export default VetTecEstimateYourBenefitsForm;
