import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

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
import LearnMoreLabel from '../LearnMoreLabel';

function VetTecEstimateYourBenefitsForm({
  showModal,
  institution,
  selectedProgram,
  calculatorInputChange,
}) {
  const [tuitionFees, setTuitionFees] = useState(0);
  const [scholarships, setScholarships] = useState(0);
  const [programName, setProgramName] = useState('');
  const [inputUpdated, setInputUpdated] = useState(false);

  const getProgramByName = () =>
    institution.programs.find(
      p => p.description.toLowerCase() === programName.toLowerCase(),
    );

  const setProgramFields = () => {
    if (programName) {
      const program = getProgramByName();
      if (program) {
        const field = 'EstimateYourBenefitsFields';
        const value = {
          vetTecTuitionFees: tuitionFees,
          vetTecProgramName: programName,
          vetTecScholarships: scholarships,
          vetTecProgramFacilityCode: institution.facilityCode,
        };
        calculatorInputChange({ field, value });
      }
    }
  };
  useEffect(() => {
    const selectedProgramName = selectedProgram;

    let programSelected = institution.programs.find(
      program => program.description === selectedProgramName,
    );
    programSelected = selectedProgram || institution.programs[0];

    setTuitionFees(programSelected.tuitionAmount);
    setScholarships(0);
    setProgramName(selectedProgramName);
    setInputUpdated(false);

    setProgramFields();
  }, []);

  const recordInputChange = event => {
    const { name: field, value } = event.target;
    recordEvent({
      event: 'gibct-form-change',
      'gibct-form-field': field,
      'gibct-form-value': value,
    });
  };

  const handleApprovedProgramsChange = event => {
    const vetTecProgramName = event.target.value;
    const program = getProgramByName();

    setProgramName(vetTecProgramName);
    setTuitionFees(program.tuitionAmount);
  };

  const updateBenefitsOnClick = event => {
    event.preventDefault();
    setInputUpdated(false);
    setProgramFields();
    // the undefined is intentional see https://github.com/department-of-veterans-affairs/va.gov-team/issues/10353
    recordEvent({
      event: 'cta-default-button-click',
      'gibct-parent-accordion-section': 'Estimate your benefits',
      'gibct-child-accordion-section': undefined,
    });
    focusElement('#estimate-your-benefits-accordion-button');
  };

  const handleEYBSkipLinkOnClick = () => {
    focusElement('.estimated-benefits-header');
  };

  const renderLearnMoreLabel = ({ text, modal, ariaLabel, labelFor }) => (
    <LearnMoreLabel
      text={text}
      onClick={() => showModal(modal)}
      ariaLabel={ariaLabel}
      labelFor={labelFor}
    />
  );

  const renderScholarships = () => (
    <div id="scholarships-field">
      <div
        htmlFor="vetTecScholarships"
        className="vads-u-margin-top--4 vads-u-display--inline-block"
        id="scholarships-label"
      >
        {renderLearnMoreLabel({
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
        value={formatDollarAmount(scholarships)}
        onChange={e => {
          setInputUpdated(true);
          setScholarships(removeNonNumberCharacters(e.target.value));

          recordInputChange(e);
        }}
        onFocus={handleScrollOnInputFocus.bind('scholarships-field')}
      />
    </div>
  );

  const renderTuitionFees = () => (
    <div id="tuition-field">
      <div
        htmlFor="vetTecTuitionFees"
        className="vads-u-margin-top--3 vads-u-display--inline-block"
        id="tuition-fees-label"
      >
        {renderLearnMoreLabel({
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
        value={formatDollarAmount(tuitionFees)}
        onChange={e => {
          setInputUpdated(true);
          setTuitionFees(removeNonNumberCharacters(e.target.value));

          recordInputChange(e);
        }}
        onFocus={handleScrollOnInputFocus.bind('tuition-field')}
      />
    </div>
  );

  const renderApprovedProgramsSelector = () => {
    const options = institution.programs.map(program => ({
      value: program.description,
      label: program.description,
    }));
    return options.length <= 5 ? (
      <RadioButtons
        label="Choose the training program you'd like to attend"
        name="approvedPrograms"
        options={options}
        value={programName}
        onChange={e => {
          setInputUpdated(true);
          handleApprovedProgramsChange(e);
          recordInputChange(e);
        }}
      />
    ) : (
      <Dropdown
        label="Choose the training program you'd like to attend"
        name="approvedPrograms"
        alt="Choose the training program you'd like to attend"
        options={options}
        value={programName}
        onChange={e => {
          setInputUpdated(true);
          handleApprovedProgramsChange(e);
          recordInputChange(e);
        }}
        visible
      />
    );
  };

  return (
    <div className="calculator-form">
      <p>Use the fields below to update your benefits.</p>
      {renderApprovedProgramsSelector()}
      {renderTuitionFees()}
      {renderScholarships()}
      <button
        type="button"
        id="calculate-button"
        className="vads-u-margin-top--2p5"
        onClick={updateBenefitsOnClick}
        disabled={!inputUpdated}
      >
        Update benefits
      </button>
      <div className="vads-u-padding-bottom--2p5">
        <button
          type="button"
          className="va-button-link learn-more-button eyb-skip-link"
          aria-label="Skip to your estimated benefits"
          onClick={handleEYBSkipLinkOnClick}
        >
          Skip to your estimated benefits
        </button>
      </div>
    </div>
  );
}

VetTecEstimateYourBenefitsForm.propTypes = {
  inputs: PropTypes.object,
  showModal: PropTypes.func,
  institution: PropTypes.object,
  selectedProgram: PropTypes.string,
  calculatorInputChange: PropTypes.func,
};

export default VetTecEstimateYourBenefitsForm;
