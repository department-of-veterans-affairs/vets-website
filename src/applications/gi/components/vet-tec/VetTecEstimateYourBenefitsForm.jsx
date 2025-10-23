import PropTypes from 'prop-types';
import React from 'react';

import recordEvent from 'platform/monitoring/record-event';
import { focusElement } from 'platform/utilities/ui';
import {
  removeNonNumberCharacters,
  formatDollarAmount,
  handleScrollOnInputFocus,
} from '../../utils/helpers';
import { ariaLabels } from '../../constants';
import Dropdown from '../Dropdown';
import VARadioButton from '../VARadioButton';
import LearnMoreLabel from '../LearnMoreLabel';

class VetTecEstimateYourBenefitsForm extends React.Component {
  constructor(props) {
    super(props);
    const selectedProgramName = this.props.selectedProgram;

    let selectedProgram = this.props.institution.programs.find(
      program => program.description === selectedProgramName,
    );
    selectedProgram = selectedProgram || this.props.institution.programs[0];

    this.state = {
      tuitionFees: selectedProgram.tuitionAmount,
      scholarships: 0,
      programName: selectedProgramName,
      inputUpdated: false,
    };
    this.setProgramFields(this.props.selectedProgram);
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

  recordInputChange = (event, target, name) => {
    const { value } = event ? event.target : target.detail;
    const field = event ? event.target.name : name;

    recordEvent({
      event: 'gibct-form-change',
      'gibct-form-field': field,
      'gibct-form-value': value,
    });
  };

  handleApprovedProgramsChange = (event, target) => {
    const vetTecProgramName = event ? event.target.value : target.detail.value;
    const program = this.getProgramByName(vetTecProgramName);

    this.setState({
      programName: vetTecProgramName,
      tuitionFees: program.tuitionAmount,
    });
  };

  updateBenefitsOnClick = event => {
    event?.preventDefault();
    this.setState({ inputUpdated: false });
    this.setProgramFields(this.state.programName);
    // the undefined is intentional see https://github.com/department-of-veterans-affairs/va.gov-team/issues/10353
    recordEvent({
      event: 'cta-default-button-click',
      'gibct-parent-accordion-section': 'Estimate your benefits',
      'gibct-child-accordion-section': undefined,
    });
    focusElement('#estimate-your-benefits-accordion-button');
  };

  handleEYBSkipLinkOnClick = () => {
    focusElement('.estimated-benefits-header');
  };

  renderLearnMoreLabel = ({ text, modal, ariaLabel, labelFor }) => (
    <LearnMoreLabel
      text={text}
      onClick={() => this.props.showModal(modal)}
      ariaLabel={ariaLabel}
      labelFor={labelFor}
    />
  );

  renderScholarships = () => (
    <div id="scholarships-field">
      <div
        htmlFor="vetTecScholarships"
        className="vads-u-margin-top--4 vads-u-display--inline-block"
        id="scholarships-label"
      >
        {this.renderLearnMoreLabel({
          text: 'Scholarships (excluding Pell Grants)',
          modal: 'scholarships',
          ariaLabel: ariaLabels.learnMore.scholarships,
          labelFor: 'vetTecScholarships',
        })}
      </div>
      <input
        aria-labelledby="scholarships-label"
        inputMode="decimal"
        type="text"
        pattern="(\d*\d+)(?=\,)"
        name="vetTecScholarships"
        id="vetTecScholarships"
        value={formatDollarAmount(this.state.scholarships)}
        onChange={e => {
          this.setState({
            inputUpdated: true,
            scholarships: removeNonNumberCharacters(e.target.value),
          });
          this.recordInputChange(e);
        }}
        onFocus={handleScrollOnInputFocus.bind(this, 'scholarships-field')}
      />
    </div>
  );

  renderTuitionFees = () => (
    <div id="tuition-field">
      <div
        htmlFor="vetTecTuitionFees"
        className="vads-u-margin-top--3 vads-u-display--inline-block"
        id="tuition-fees-label"
      >
        {this.renderLearnMoreLabel({
          text: 'Tuition and fees for program',
          modal: 'tuitionAndFees',
          ariaLabel: ariaLabels.learnMore.tuitionAndFees,
          labelFor: 'vetTecTuitionFees',
        })}
      </div>
      <input
        aria-labelledby="tuition-fees-label"
        name="vetTecTuitionFees"
        id="vetTecTuitionFees"
        pattern="(\d*\d+)(?=\,)"
        type="text"
        inputMode="decimal"
        value={formatDollarAmount(this.state.tuitionFees)}
        onChange={e => {
          this.setState({
            inputUpdated: true,
            tuitionFees: removeNonNumberCharacters(e.target.value),
          });
          this.recordInputChange(e);
        }}
        onFocus={handleScrollOnInputFocus.bind(this, 'tuition-field')}
      />
    </div>
  );

  renderApprovedProgramsSelector = () => {
    const options = this.props.institution.programs.map(program => ({
      value: program.description,
      label: program.description,
    }));
    return options.length <= 5 ? (
      <VARadioButton
        radioLabel="Choose the training program you'd like to attend"
        name="approvedPrograms"
        initialValue={this.state.programName}
        options={options}
        onVaValueChange={(target, name) => {
          this.setState({ inputUpdated: true });
          this.handleApprovedProgramsChange(null, target);
          this.recordInputChange(null, target, name);
        }}
      />
    ) : (
      <Dropdown
        label="Choose the training program you'd like to attend"
        name="approvedPrograms"
        alt="Choose the training program you'd like to attend"
        options={options}
        value={this.state.programName}
        onChange={e => {
          this.setState({ inputUpdated: true });
          this.handleApprovedProgramsChange(e);
          this.recordInputChange(e);
        }}
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
        {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component, react/button-has-type */}
        <button
          type="button"
          id="calculate-button"
          className="vads-u-margin-top--2p5"
          onClick={this.updateBenefitsOnClick}
          disabled={!this.state.inputUpdated}
        >
          Update benefits
        </button>
        <div className="vads-u-padding-bottom--2p5">
          {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component, react/button-has-type */}
          <button
            type="button"
            className="va-button-link learn-more-button eyb-skip-link"
            aria-label="Skip to your estimated benefits"
            onClick={this.handleEYBSkipLinkOnClick}
          >
            Skip to your estimated benefits
          </button>
        </div>
      </div>
    );
  }
}

VetTecEstimateYourBenefitsForm.propTypes = {
  calculatorInputChange: PropTypes.func,
  institution: PropTypes.object,
  selectedProgram: PropTypes.string,
  showModal: PropTypes.func,
};

export default VetTecEstimateYourBenefitsForm;
