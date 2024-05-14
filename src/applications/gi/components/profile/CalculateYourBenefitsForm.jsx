import PropTypes from 'prop-types';
import React, { useState } from 'react';
import _ from 'lodash';
import classNames from 'classnames';

import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import recordEvent from 'platform/monitoring/record-event';
import { getScrollOptions, focusElement } from 'platform/utilities/ui';
import scrollTo from 'platform/utilities/ui/scrollTo';
import AlertBox from '../AlertBox';
import Dropdown from '../Dropdown';
import {
  createId,
  formatCurrency,
  isCountryInternational,
  locationInfo,
  handleInputFocusWithPotentialOverLap,
  isURL,
} from '../../utils/helpers';
import OnlineClassesFilter from '../search/OnlineClassesFilter';
import Checkbox from '../Checkbox';
import { ariaLabels } from '../../constants';
import AccordionItem from '../AccordionItem';
import BenefitsForm from './BenefitsForm';
import LearnMoreLabel from '../LearnMoreLabel';
import VARadioButton from '../VARadioButton';

export const issueZipCodeHintText = (
  <p className="vads-u-font-weight--normal label-description">
    Postal code must be a 5-digit number
  </p>
);

function CalculateYourBenefitsForm({
  calculatorInputChange,
  displayedInputs,
  eligibility,
  eligibilityChange,
  hideModal,
  inputs,
  onBeneficiaryZIPCodeChanged,
  profile,
  showModal,
  updateEstimatedBenefits,
  focusHandler,
}) {
  const [invalidZip, setInvalidZip] = useState('');
  const [zipDirty, setZipDirty] = useState(false);
  const handlers = {
    onZipBlur: () => {
      setZipDirty(true);
    },
  };

  const [expanded, setExpanded] = useState({
    yourBenefits: true,
    aboutYourSchool: false,
    learningFormatAndSchedule: false,
    scholarshipsAndOtherFunding: false,
  });
  const displayExtensionBeneficiaryZipcode = !inputs.classesoutsideus;

  const getExtensions = () => {
    const { facilityMap } = profile.attributes;
    const profileFacilityCode = profile.attributes.facilityCode;
    let extensions;
    if (profileFacilityCode === facilityMap.main.institution.facilityCode) {
      extensions = profile.attributes.facilityMap.main.extensions;
    } else {
      const matchedBranch = facilityMap.main.branches.find(
        branch =>
          branch.institution.facilityCode === profile.attributes.facilityCode,
      );
      ({ extensions } = matchedBranch);
    }

    return extensions;
  };

  const createExtensionOption = extension => {
    const {
      facilityCode,
      physicalCity,
      physicalState,
      physicalCountry,
      physicalZip,
      institution,
    } = extension;

    const address = locationInfo(physicalCity, physicalState, physicalCountry);

    return {
      value: `${facilityCode}-${physicalZip}`,
      label: `${institution} ${address}`,
    };
  };

  const toggleExpanded = (expandedName, isExpanded) => {
    const newExpanded = {};
    Object.keys(expanded).forEach(key => {
      const flipped = expanded[expandedName] ? false : expanded[expandedName];
      newExpanded[key] = expandedName === key ? isExpanded : flipped;
    });
    setExpanded(newExpanded);
    const field = document.getElementById('estimate-your-benefits-accordion');
    if (field) {
      field.scrollIntoView();
    }
  };

  const displayExtensionBeneficiaryInternationalCheckbox = () => {
    const { beneficiaryLocationQuestion, extension } = inputs;
    return (
      beneficiaryLocationQuestion === 'other' ||
      (beneficiaryLocationQuestion === 'extension' && extension === 'other')
    );
  };

  const recalculateBenefits = childSection => {
    const accordionButtonId = `${createId(childSection)}-accordion-button`;
    const { beneficiaryZIPError, beneficiaryZIP } = inputs;

    if (
      eligibility.giBillChapter === '33' &&
      displayExtensionBeneficiaryInternationalCheckbox() &&
      displayExtensionBeneficiaryZipcode &&
      (beneficiaryZIPError || beneficiaryZIP.length !== 5)
    ) {
      toggleExpanded('learningFormatAndSchedule', true);
      setTimeout(() => {
        scrollTo('beneficiary-zip-question', getScrollOptions());
        focusElement('input[name=beneficiaryZIPCode]');
      }, 50);
    } else {
      updateEstimatedBenefits();
      setTimeout(() => {
        focusElement(`#${accordionButtonId}`);
      }, 50);
    }

    recordEvent({
      event: 'cta-default-button-click',
      'gibct-parent-accordion-section': 'Estimate your benefits',
      'gibct-child-accordion-section': childSection,
    });
  };

  const handleBeneficiaryZIPCodeChanged = event => {
    const { value } = event.target;
    if (!zipDirty || value.length <= 5) {
      onBeneficiaryZIPCodeChanged(value);
      if (value.length === 5) {
        recordEvent({
          event: 'gibct-form-change',
          'gibct-form-field': 'gibctExtensionSearchZipCode',
          'gibct-form-value': value,
        });
      }
      setInvalidZip('');

      recalculateBenefits();
    }

    if (value.length < 5) {
      setInvalidZip('Postal code must be a 5-digit number');
    }
    setZipDirty(false);
  };

  const handleInputChange = (event, target, name) => {
    const { value } = event ? event.target : target.detail;
    const field = event ? event.target.name : name;
    calculatorInputChange({ field, value });

    if (field === 'beneficiaryLocationQuestion' || field === 'extension') {
      if (value === 'extension' || value === profile.attributes.name) {
        recordEvent({
          event: 'gibct-form-change',
          'gibct-form-field': 'gibctExtensionCampusSelection',
          'gibct-form-value':
            value === 'extension'
              ? 'An extension campus'
              : profile.attributes.name,
        });
      }
      if (value === 'other') {
        recordEvent({
          event: 'gibct-form-change',
          'gibct-form-field': 'gibctOtherCampusLocation ',
          'gibct-form-value': 'other location',
        });
      }
    }
    if (
      field === 'buyUp' ||
      field === 'inState' ||
      field === 'kickerEligible' ||
      field === 'yellowRibbonRecipient' ||
      field === 'giBillBenefit'
    ) {
      recordEvent({
        event: 'gibct-form-change',
        'gibct-form-field': field,
        'gibct-form-value': value,
      });
    }

    recalculateBenefits();
  };

  const [isDisabled] = useState(false);

  const updateEligibility = (e, name, number) => {
    if (number === 2) {
      const { value } = e.detail;
      recordEvent({
        event: 'gibct-form-change',
        'gibct-form-field': name,
        'gibct-form-value': value,
      });
      eligibilityChange({ [name]: value });

      if (name === 'militaryStatus') {
        /*
        setIsDisabled(true);
        if (value === 'spouse' || value === 'child') {
          setIsDisabled(false);
        } */
        // eligibilityChange({ giBillChapter: '33a' });
      }
      recalculateBenefits();
    }

    const field = e.target.name;
    const { value } = e.target;
    recordEvent({
      event: 'gibct-form-change',
      'gibct-form-field': field,
      'gibct-form-value': value,
    });
    eligibilityChange({ [field]: value });

    if (field === 'militaryStatus') {
      /*
      setIsDisabled(true);
      if (value === 'spouse' || value === 'child') {
        setIsDisabled(false);
      } */
      // eligibilityChange({ giBillChapter: '33a' });
    }
    recalculateBenefits();
  };

  const handleExtensionBlur = event => {
    recordEvent({
      event: 'gibct-form-change',
      'gibct-form-field': 'gibctExtensionCampusDropdown',
      'gibct-form-value': event.target.options[event.target.selectedIndex].text,
    });
  };

  const handleExtensionChange = event => {
    const { value } = event.target;
    const zipCode = value.slice(value.indexOf('-') + 1);

    if (!event.dirty) {
      if (event.target.value !== 'other') {
        onBeneficiaryZIPCodeChanged(zipCode);
      } else {
        onBeneficiaryZIPCodeChanged('');
      }
      handleInputChange(event);
    }
  };

  const handleCheckboxChange = e => {
    const { name: field, checked: value } = e.target;
    calculatorInputChange({ field, value });

    recalculateBenefits();
  };

  const handleHasClassesOutsideUSChange = e => {
    handleBeneficiaryZIPCodeChanged({ target: { value: '' } });
    // handleBeneficiaryZIPCodeChanged({ value: '' });
    handleCheckboxChange(e);

    recordEvent({
      event: 'gibct-form-change',
      'gibct-form-field': 'gibctInternationalCheckbox',
      'gibct-form-value': 'Classes outside the U.S. & U.S. territories',
    });

    recalculateBenefits();
  };

  const handleInputBlur = event => {
    const { name: field, value } = event.target;
    recordEvent({
      event: 'gibct-form-change',
      'gibct-form-field': field,
      'gibct-form-value': value,
    });

    recalculateBenefits();
  };

  const handleEYBInputFocus = fieldId => {
    const eybSheetFieldId = 'eyb-summary-sheet';
    handleInputFocusWithPotentialOverLap(fieldId, eybSheetFieldId);
  };

  const resetBuyUp = event => {
    event.preventDefault();
    handleInputBlur(event);
    if (inputs.buyUpAmount > 600) {
      calculatorInputChange({
        field: 'buyUpAmount',
        value: 600,
      });

      recalculateBenefits();
    }
  };

  const learnMoreLabel = ({ text, modal, ariaLabel, labelFor, buttonId }) => (
    <LearnMoreLabel
      text={text}
      onClick={() => {
        showModal(modal);
      }}
      ariaLabel={ariaLabel}
      labelFor={labelFor}
      buttonId={buttonId}
    />
  );

  /**
   * Displays question about how a much an institution's in-state tuition is
   * @returns {*}
   */
  const renderInStateTuition = () => {
    const inStateTuitionFeesId = 'inStateTuitionFees';
    const inStateFieldId = `${inStateTuitionFeesId}-fields`;
    return (
      <div id={inStateFieldId}>
        <label htmlFor={inStateTuitionFeesId}>
          {learnMoreLabel({
            text: 'In-state tuition and fees per year',
            modal: 'calcInStateTuition',
            ariaLabel: ariaLabels.learnMore.inStateTuitionFeesPerYear,
            buttonId: 'tuition-and-fees-learn-more',
          })}
        </label>
        <input
          type="text"
          inputMode="decimal"
          pattern="(\d*\d+)(?=\,)"
          name={inStateTuitionFeesId}
          id={inStateTuitionFeesId}
          value={formatCurrency(inputs.inStateTuitionFees)}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onFocus={() => handleEYBInputFocus(inStateFieldId)}
        />
      </div>
    );
  };

  /**
   * Displays question related to in-state
   * to display inState institutionType needs to be PUBLIC
   * to display tuition institutionType needs to not be OJT
   * @returns {null|*}
   */
  const renderInState = () => {
    if (!displayedInputs.inState) return null;
    const { inStateTuitionInformation } = profile.attributes;
    const radioButtonsLabelText = 'Are you an in-state student?';
    const options = [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
    ];
    const modal =
      isURL(inStateTuitionInformation) &&
      inStateTuitionInformation !==
        'Contact the School Certifying Official (SCO) for requirements'
        ? 'inStateWithLink'
        : 'inStateWithoutLink';

    return (
      <>
        <>
          <LearnMoreLabel
            text={radioButtonsLabelText}
            onClick={() => showModal(modal)}
            ariaLabel={ariaLabels.learnMore.inState}
          />
          <VARadioButton
            radioLabel=""
            name="inState"
            initialValue={inputs.inState}
            options={options}
            onVaValueChange={(target, name) =>
              handleInputChange(null, target, name)
            }
          />
        </>
        {inputs.inState === 'no' && <>{renderInStateTuition()}</>}
      </>
    );
  };

  const renderTuition = () => {
    if (!displayedInputs.tuition) return null;

    const tuitionFeesId = 'tuitionFees';
    const tuitionFeesFieldId = `${tuitionFeesId}-field`;
    return (
      <div id={tuitionFeesFieldId}>
        <label htmlFor={tuitionFeesId} className="vads-u-display--inline-block">
          Tuition and fees per year
        </label>{' '}
        {learnMoreLabel({
          modal: 'calcTuition',
          ariaLabel: ariaLabels.learnMore.tuitionFeesPerYear,
          buttonId: 'tuition-and-fees-per-year-learn-more',
        })}
        <input
          inputMode="decimal"
          pattern="(\d*\d+)(?=\,)"
          type="text"
          name={tuitionFeesId}
          id={tuitionFeesId}
          value={formatCurrency(inputs.tuitionFees)}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onFocus={() => handleEYBInputFocus.bind(tuitionFeesFieldId)}
        />
      </div>
    );
  };

  const renderBooks = () => {
    if (!displayedInputs.books) return null;
    const booksId = 'books';
    const booksFieldId = 'books-field';
    return (
      <div id={booksFieldId}>
        <label htmlFor={booksId}>Books and supplies per year</label>
        <input
          inputMode="decimal"
          pattern="(\d*\d+)(?=\,)"
          type="text"
          name={booksId}
          id={booksId}
          value={formatCurrency(inputs.books)}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onFocus={() => handleEYBInputFocus(booksFieldId)}
        />
      </div>
    );
  };

  const renderYellowRibbon = () => {
    if (!displayedInputs.yellowRibbon) return null;

    let {
      yellowRibbonDegreeLevelOptions,
      yellowRibbonDivisionOptions,
    } = inputs;

    yellowRibbonDegreeLevelOptions = yellowRibbonDegreeLevelOptions.map(
      value => ({ optionValue: value, optionLabel: value }),
    );
    yellowRibbonDegreeLevelOptions.push({
      optionValue: 'customAmount',
      optionLabel: 'Enter an amount',
    });
    yellowRibbonDivisionOptions = yellowRibbonDivisionOptions.map(value => ({
      optionValue: value,
      optionLabel: value,
    }));
    const showYellowRibbonOptions = yellowRibbonDegreeLevelOptions.length > 1;
    const showYellowRibbonDetails = yellowRibbonDivisionOptions.length > 0;
    const yellowRibbonFieldId = 'yellowRibbonField';

    return (
      <>
        <>
          <LearnMoreLabel
            text="Will you be a Yellow Ribbon recipient?"
            onClick={() => showModal('calcYr')}
            ariaLabel={ariaLabels.learnMore.yellowRibbonProgram}
          />
          <VARadioButton
            radioLabel=""
            name="yellowRibbonRecipient"
            initialValue={inputs.yellowRibbonRecipient}
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ]}
            onVaValueChange={(target, name) =>
              handleInputChange(null, target, name)
            }
          />
        </>

        <div>
          <Dropdown
            label="Degree Level"
            name="yellowRibbonDegreeLevel"
            alt="Degree Level"
            hideArrows={yellowRibbonDegreeLevelOptions.length <= 1}
            options={yellowRibbonDegreeLevelOptions}
            visible={showYellowRibbonOptions}
            value={inputs.yellowRibbonDegreeLevel}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onFocus={handleEYBInputFocus}
          />
          <Dropdown
            label="Division or school"
            name="yellowRibbonDivision"
            alt="Division or school"
            disabled={yellowRibbonDivisionOptions.length <= 1}
            hideArrows={yellowRibbonDivisionOptions.length <= 1}
            options={yellowRibbonDivisionOptions}
            visible={showYellowRibbonDetails}
            value={inputs.yellowRibbonDivision}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onFocus={handleEYBInputFocus}
          />
          <div id={yellowRibbonFieldId}>
            <label htmlFor="yellowRibbonContributionAmount">
              Yellow Ribbon amount from school per year
            </label>
            <input
              inputMode="decimal"
              pattern="(\d*\d+)(?=\,)"
              id="yellowRibbonContributionAmount"
              type="text"
              name="yellowRibbonAmount"
              value={formatCurrency(inputs.yellowRibbonAmount)}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onFocus={() => handleEYBInputFocus(yellowRibbonFieldId)}
            />
          </div>
          <AlertBox
            isVisible={showYellowRibbonDetails}
            key={inputs.yellowRibbonProgramIndex}
            status="info"
          >
            <div>
              Maximum amount per student:{' '}
              <strong>
                {formatCurrency(inputs.yellowRibbonMaxAmount)}
                /yr
              </strong>
              <br />
              Number of students:{' '}
              <strong>{inputs.yellowRibbonMaxNumberOfStudents}</strong>
            </div>
          </AlertBox>
        </div>
      </>
    );
  };

  const renderScholarships = () => {
    if (!displayedInputs.scholarships) return null;
    const scholarshipsId = 'scholarships';
    const scholarshipsFieldId = `${scholarshipsId}-field`;
    return (
      <div id={scholarshipsFieldId}>
        <label htmlFor={scholarshipsId}>
          {learnMoreLabel({
            text: 'Scholarships (excluding Pell Grants)',
            modal: 'calcScholarships',
            ariaLabel: ariaLabels.learnMore.calcScholarships,
            buttonId: 'scholarships-learn-more',
          })}
        </label>
        <input
          inputMode="decimal"
          type="text"
          pattern="(\d*\d+)(?=\,)"
          name={scholarshipsId}
          id={scholarshipsId}
          value={formatCurrency(inputs.scholarships)}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onFocus={() => handleEYBInputFocus(scholarshipsFieldId)}
        />
      </div>
    );
  };

  const renderTuitionAssist = () => {
    if (!displayedInputs.tuitionAssist) return null;
    const tuitionAssistId = 'tuitionAssist';
    const tuitionAssistFieldId = `${tuitionAssistId}-field`;
    return (
      <div id={tuitionAssistFieldId}>
        <label htmlFor={tuitionAssistId}>
          {learnMoreLabel({
            text: 'How much are you receiving in military tuition assistance',
            modal: 'calcTuitionAssist',
            ariaLabel: ariaLabels.learnMore.militaryTuitionAssistance,
            buttonId: 'military-tuition-assistance-learn-more',
          })}
        </label>
        <input
          inputMode="decimal"
          pattern="(\d*\d+)(?=\,)"
          type="text"
          name={tuitionAssistId}
          id={tuitionAssistId}
          value={formatCurrency(inputs.tuitionAssist)}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onFocus={() => handleEYBInputFocus(tuitionAssistFieldId)}
        />
      </div>
    );
  };

  const renderEnrolled = () => {
    const {
      enrolled: shouldRenderEnrolled,
      enrolledOld: shouldRenderEnrolledOld,
    } = displayedInputs;

    if (!shouldRenderEnrolled && !shouldRenderEnrolledOld) {
      return null;
    }

    const options = shouldRenderEnrolled
      ? [
          { optionValue: 'full', optionLabel: 'Full Time' },
          { optionValue: 'three quarters', optionLabel: '¾ Time' },
          { optionValue: 'more than half', optionLabel: 'More than ½ time' },
          { optionValue: 'half or less', optionLabel: '½ Time or less' },
        ]
      : [
          { optionValue: 'full', optionLabel: 'Full Time' },
          { optionValue: 'three quarters', optionLabel: '¾ Time' },
          { optionValue: 'half', optionLabel: '½ Time' },
          {
            optionValue: 'less than half',
            optionLabel: 'Less than ½ time more than ¼ time',
          },
          { optionValue: 'quarter', optionLabel: '¼ Time or less' },
        ];

    const { enrolled: enrolledValue, enrolledOld: enrolledOldValue } = inputs;

    const name = shouldRenderEnrolled ? 'enrolled' : 'enrolledOld';
    const value = shouldRenderEnrolled ? enrolledValue : enrolledOldValue;

    return (
      <Dropdown
        label={learnMoreLabel({
          text: 'Enrolled',
          modal: 'calcEnrolled',
          ariaLabel: ariaLabels.learnMore.calcEnrolled,
          labelFor: name,
          buttonId: 'enrolled-learn-more',
        })}
        name={name}
        alt="Enrolled"
        options={options}
        visible
        value={value}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onFocus={handleEYBInputFocus}
      />
    );
  };

  const renderCalendar = () => {
    if (!displayedInputs.calendar) return null;

    const dependentDropdowns = (
      <div>
        <Dropdown
          label="How many terms per year?"
          name="numberNontradTerms"
          alt="How many terms per year?"
          options={[
            { optionValue: '3', optionLabel: 'Three' },
            { optionValue: '2', optionLabel: 'Two' },
            { optionValue: '1', optionLabel: 'One' },
          ]}
          visible
          value={inputs.numberNontradTerms}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onFocus={handleEYBInputFocus}
        />
        <Dropdown
          label="How long is each term?"
          name="lengthNontradTerms"
          alt="How long is each term?"
          options={[
            { optionValue: '1', optionLabel: '1 month' },
            { optionValue: '2', optionLabel: '2 months' },
            { optionValue: '3', optionLabel: '3 months' },
            { optionValue: '4', optionLabel: '4 months' },
            { optionValue: '5', optionLabel: '5 months' },
            { optionValue: '6', optionLabel: '6 months' },
            { optionValue: '7', optionLabel: '7 months' },
            { optionValue: '8', optionLabel: '8 months' },
            { optionValue: '9', optionLabel: '9 months' },
            { optionValue: '10', optionLabel: '10 months' },
            { optionValue: '11', optionLabel: '11 months' },
            { optionValue: '12', optionLabel: '12 months' },
          ]}
          visible
          value={inputs.lengthNontradTerms}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onFocus={handleEYBInputFocus}
        />
      </div>
    );

    return (
      <div>
        <>
          <Dropdown
            label={learnMoreLabel({
              text: 'School Calendar',
              modal: 'calcSchoolCalendar',
              ariaLabel: ariaLabels.learnMore.calcSchoolCalendar,
              labelFor: 'calendar',
              buttonId: 'school-calendar-learn-more',
            })}
            name="calendar"
            alt="School calendar"
            options={[
              { optionValue: 'semesters', optionLabel: 'Semesters' },
              { optionValue: 'quarters', optionLabel: 'Quarters' },
              { optionValue: 'nontraditional', optionLabel: 'Non-Traditional' },
            ]}
            visible
            value={inputs.calendar}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onFocus={handleEYBInputFocus}
          />
          {inputs.calendar === 'nontraditional' && <>{dependentDropdowns}</>}
        </>
      </div>
    );
  };

  const renderKicker = () => {
    if (!displayedInputs.kicker) return null;
    const radioButtonsLabelText = 'Eligible for kicker bonus?';
    const kickerAmountId = 'kickerAmount';
    const kickerFieldId = `${kickerAmountId}-field`;
    const options = [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
    ];
    const amountInput = (
      <div id={kickerFieldId}>
        <label htmlFor={kickerAmountId}>How much is your kicker?</label>
        <input
          inputMode="decimal"
          pattern="(\d*\d+)(?=\,)"
          type="text"
          name={kickerAmountId}
          id={kickerAmountId}
          value={formatCurrency(inputs.kickerAmount)}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onFocus={() => handleEYBInputFocus(kickerFieldId)}
        />
      </div>
    );

    return (
      <>
        <>
          <LearnMoreLabel
            text={radioButtonsLabelText}
            onClick={() => showModal('calcKicker')}
            ariaLabel={ariaLabels.learnMore.kickerEligible}
          />
          <VARadioButton
            radioLabel=""
            name="kickerEligible"
            initialValue={inputs.kickerEligible}
            options={options}
            onVaValueChange={(target, name) => {
              handleInputChange(null, target, name);
            }}
          />
        </>
        {inputs.kickerEligible === 'yes' && <>{amountInput}</>}
      </>
    );
  };

  const renderExtensionBeneficiaryZIP = () => {
    if (!displayedInputs.beneficiaryLocationQuestion) {
      return null;
    }
    const extensions = getExtensions();

    let zipcodeInput;
    let internationalCheckbox;
    let extensionSelector;
    let zipcodeLocation;
    let extensionOptions = [];
    const beneficiaryLocationQuestionOptions = [
      {
        value: profile.attributes.name,
        label: profile.attributes.name,
      },
    ];

    if (extensions && extensions.length) {
      extensionOptions = [
        { optionValue: '', optionLabel: 'Please choose a location' },
      ];
      extensions.forEach(extension => {
        extensionOptions.push(createExtensionOption(extension));
      });
      extensionOptions.push({ optionValue: 'other', optionLabel: 'Other...' });

      beneficiaryLocationQuestionOptions.push({
        value: 'extension',
        label: 'An extension campus',
      });
    } else {
      beneficiaryLocationQuestionOptions.push({
        value: 'other',
        label: 'Other location',
      });
    }

    const displayExtensionSelector =
      inputs.beneficiaryLocationQuestion === 'extension';
    if (displayExtensionSelector) {
      extensionSelector = (
        <Dropdown
          label="Choose the location where you'll take your classes"
          name="extension"
          alt="Extension Location"
          visible
          options={extensionOptions}
          value={inputs.extension}
          onChange={handleExtensionChange}
          onBlur={handleExtensionBlur}
          onFocus={handleEYBInputFocus}
        />
      );
    }

    if (displayExtensionBeneficiaryInternationalCheckbox()) {
      const errorMessage = invalidZip;

      const errorMessageCheck =
        errorMessage !== '' ? errorMessage : inputs.beneficiaryZIPError;

      if (displayExtensionBeneficiaryZipcode) {
        const label = isCountryInternational(profile.attributes.physicalCountry)
          ? "If you're taking classes in the U.S., enter the location's postal code"
          : "Please enter the postal code where you'll take your classes";

        zipcodeInput = (
          <div name="beneficiary-zip-question">
            <VaTextInput
              id="beneficiaryZIPCode"
              name="beneficiaryZIPCode"
              type="text"
              label={label}
              required
              value={inputs.beneficiaryZIP}
              onInput={handleBeneficiaryZIPCodeChanged}
              onBlur={handlers.onZipBlur}
              maxlength="5"
              error={errorMessageCheck}
              charcount
            />
          </div>
        );

        zipcodeLocation = (
          <p aria-live="polite" aria-atomic="true">
            <span className="sr-only">Your postal code is located in</span>
            <strong>{inputs.housingAllowanceCity}</strong>
          </p>
        );
      }

      internationalCheckbox = (
        <Checkbox
          label={
            "I'll be taking classes outside of the U.S. and U.S. territories"
          }
          onChange={handleHasClassesOutsideUSChange}
          checked={inputs.classesoutsideus}
          name="classesOutsideUS"
        />
      );
    }
    const radioButtonsLabelText =
      'Where will you take the majority of your classes?';
    const selectedBeneficiaryLocationQuestion = inputs.beneficiaryLocationQuestion
      ? inputs.beneficiaryLocationQuestion
      : profile.attributes.name;

    return (
      <>
        {displayExtensionSelector ||
          displayExtensionBeneficiaryInternationalCheckbox()}
        <>
          <LearnMoreLabel
            text={radioButtonsLabelText}
            onClick={() => showModal('calcBeneficiaryLocationQuestion')}
            ariaLabel={ariaLabels.learnMore.majorityOfClasses}
          />
          <VARadioButton
            radioLabel=""
            name="beneficiaryLocationQuestion"
            initialValue={selectedBeneficiaryLocationQuestion}
            options={beneficiaryLocationQuestionOptions}
            onVaValueChange={(target, name) =>
              handleInputChange(null, target, name)
            }
          />
        </>
        <div>
          {extensionSelector}
          {zipcodeInput}
          {zipcodeLocation}
          {internationalCheckbox}
        </div>
      </>
    );
  };

  const renderBuyUp = () => {
    if (!displayedInputs.buyUp) return null;

    const buyUpAmountId = 'buyUpAmount';
    const buyUpFieldId = `${buyUpAmountId}-field`;
    const amountInput = (
      <div id={buyUpFieldId}>
        <label htmlFor={buyUpAmountId}>
          How much did you pay toward buy-up (up to $600)?
        </label>
        <input
          inputMode="decimal"
          pattern="(\d*\d+)(?=\,)"
          type="text"
          name={buyUpAmountId}
          id={buyUpAmountId}
          value={formatCurrency(inputs.buyUpAmount)}
          onChange={handleInputChange}
          onBlur={resetBuyUp}
          onFocus={() => handleEYBInputFocus(buyUpFieldId)}
        />
      </div>
    );

    return (
      <>
        <VARadioButton
          radioLabel="Participate in buy-up program?"
          name="buyUp"
          initialValue={inputs.buyUp}
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
          onVaValueChange={(target, name) =>
            handleInputChange(null, target, name)
          }
        />
        {amountInput}
      </>
    );
  };

  const renderWorking = () => {
    if (!displayedInputs.working) return null;
    return (
      <Dropdown
        label={learnMoreLabel({
          text: 'Will be working',
          modal: 'calcWorking',
          ariaLabel: ariaLabels.learnMore.calcWorking,
          labelFor: 'working',
          buttonId: 'working-learn-more',
        })}
        name="working"
        alt="Will be working"
        options={[
          { optionValue: '30', optionLabel: '30 plus hours per week' },
          { optionValue: '28', optionLabel: '28 hours per week' },
          { optionValue: '26', optionLabel: '26 hours per week' },
          { optionValue: '24', optionLabel: '24 hours per week' },
          { optionValue: '22', optionLabel: '22 hours per week' },
          { optionValue: '20', optionLabel: '20 hours per week' },
          { optionValue: '18', optionLabel: '18 hours per week' },
          { optionValue: '16', optionLabel: '16 hours per week' },
          { optionValue: '14', optionLabel: '14 hours per week' },
          { optionValue: '12', optionLabel: '12 hours per week' },
          { optionValue: '10', optionLabel: '10 hours per week' },
          { optionValue: '8', optionLabel: '8 hours per week' },
          { optionValue: '6', optionLabel: '6 hours per week' },
          { optionValue: '4', optionLabel: '4 hours per week' },
          { optionValue: '2', optionLabel: '2 hours per week' },
        ]}
        visible
        value={inputs.working}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onFocus={handleEYBInputFocus}
      />
    );
  };

  const renderOnlineClasses = () => (
    <OnlineClassesFilter
      onlineClasses={eligibility.onlineClasses}
      onChange={updateEligibility}
      showModal={showModal}
    />
  );

  const radioButtonsLabelText =
    'Did you use your Post-9/11 GI Bill benefits for tuition, housing, or books for a term that started before January 1, 2018?';
  const renderGbBenefit = () => {
    if (!displayedInputs?.giBillBenefit) {
      return null;
    }

    return (
      <>
        <LearnMoreLabel
          text={radioButtonsLabelText}
          onClick={() => showModal('onlineOnlyDistanceLearning')}
          ariaLabel={ariaLabels.learnMore.onlineOnlyDistanceLearning}
        />
        <VARadioButton
          radioLabel=""
          name="giBillBenefit"
          initialValue={inputs.giBillBenefit}
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
          onVaValueChange={(target, name) => {
            handleInputChange(null, target, name);
          }}
        />
      </>
    );
  };

  const renderEYBSkipLink = () => {
    return (
      <div className="vads-u-padding-top--1 ">
        <a
          className="eyb-skip-link vads-u-display--block"
          aria-label="Skip to your estimated benefits"
          href="#estimated-benefits"
          id="skip-to-eyb"
          tabIndex="0"
          role="button"
          onClick={focusHandler}
        >
          Skip to your estimated benefits
        </a>
      </div>
    );
  };

  const renderMilitaryDetails = () => {
    const name = 'Your military details';

    return (
      <AccordionItem
        button={name}
        section
        expanded={expanded.yourBenefits}
        onClick={isExpanded => toggleExpanded('yourBenefits', isExpanded)}
      >
        <div>
          <BenefitsForm
            eligibilityChange={updateEligibility}
            eligibilityChangeRedux={eligibilityChange}
            {...eligibility}
            hideModal={hideModal}
            showModal={showModal}
            inputs={inputs}
            optionDisabled={isDisabled}
            displayedInputs={displayedInputs}
            handleInputFocus={handleEYBInputFocus}
            giBillChapterOpen={[displayedInputs?.giBillBenefit]}
          >
            {renderGbBenefit()}
            {renderOnlineClasses()}
          </BenefitsForm>
        </div>
        {renderEYBSkipLink()}
      </AccordionItem>
    );
  };

  const hideSchoolCostsAndCalendar = () => {
    const {
      inState,
      tuition,
      books,
      calendar,
      enrolled,
      enrolledOld,
    } = displayedInputs;

    return !(
      inState ||
      tuition ||
      books ||
      calendar ||
      enrolled ||
      enrolledOld
    );
  };

  const renderSchoolCostsAndCalendar = () => {
    if (hideSchoolCostsAndCalendar()) return null;

    const name = 'School costs and calendar';
    return (
      <AccordionItem
        button={name}
        expanded={expanded.aboutYourSchool}
        section
        onClick={isExpanded => toggleExpanded('aboutYourSchool', isExpanded)}
      >
        <div className="calculator-form">
          {renderInState()}
          {renderTuition()}
          {renderBooks()}
          {renderCalendar()}
          {renderEnrolled()}
        </div>
        {renderEYBSkipLink()}
      </AccordionItem>
    );
  };

  const renderLearningFormat = () => {
    const isOjt = _.get(profile, 'attributes.type', '').toLowerCase() === 'ojt';
    const name = isOjt
      ? 'Learning format and schedule'
      : 'Learning format and location';

    return (
      <AccordionItem
        button={name}
        expanded={expanded.learningFormatAndSchedule}
        section
        onClick={isExpanded =>
          toggleExpanded('learningFormatAndSchedule', isExpanded)
        }
      >
        <div className="calculator-form">
          {renderExtensionBeneficiaryZIP()}
          {renderWorking()}
        </div>
        {renderEYBSkipLink()}
      </AccordionItem>
    );
  };

  const hideScholarshipsAndOtherVAFunding = () => {
    const {
      yellowRibbon,
      tuitionAssist,
      kicker,
      buyUp,
      scholarships,
    } = displayedInputs;
    return !(yellowRibbon || tuitionAssist || kicker || buyUp || scholarships);
  };

  const renderScholarshipsAndOtherVAFunding = () => {
    if (hideScholarshipsAndOtherVAFunding()) return null;
    const name = 'Scholarships and other VA funding';

    return (
      <AccordionItem
        button={name}
        expanded={expanded.scholarshipsAndOtherFunding}
        section
        onClick={isExpanded =>
          toggleExpanded('scholarshipsAndOtherFunding', isExpanded)
        }
      >
        <div className="calculator-form">
          {renderYellowRibbon()}
          {renderTuitionAssist()}
          {renderKicker()}
          {renderBuyUp()}
          {renderScholarships()}
        </div>
        {renderEYBSkipLink()}
      </AccordionItem>
    );
  };

  let sectionCount = 2;
  if (!hideSchoolCostsAndCalendar()) sectionCount += 1;
  if (!hideScholarshipsAndOtherVAFunding()) sectionCount += 1;

  return (
    <div
      aria-live="off"
      className={classNames(
        'estimate-your-benefits-form',
        'medium-5',
        'columns',
        'small-screen:vads-u-padding-right--0',
      )}
    >
      <div>
        <p className="vads-u-margin-bottom--3 vads-u-margin-top--0">
          The {sectionCount} sections below include questions that will refine
          your benefits estimate. Use the fields in each section to make your
          updates.
        </p>
      </div>
      <ul className="vads-u-padding--0">
        {renderMilitaryDetails()}
        {renderSchoolCostsAndCalendar()}
        {renderLearningFormat()}
        {renderScholarshipsAndOtherVAFunding()}
      </ul>
    </div>
  );
}

CalculateYourBenefitsForm.propTypes = {
  updateEstimatedBenefits: PropTypes.func.isRequired,
  calculatorInputChange: PropTypes.func,
  displayedInputs: PropTypes.object,
  eligibility: PropTypes.object,
  eligibilityChange: PropTypes.func,
  estimatedBenefits: PropTypes.object,
  focusHandler: PropTypes.func,
  hideModal: PropTypes.func,
  inputs: PropTypes.object,
  profile: PropTypes.object,
  showModal: PropTypes.func,
  updateBenefitsButtonEnabled: PropTypes.bool,
  onBeneficiaryZIPCodeChanged: PropTypes.func,
};

export default CalculateYourBenefitsForm;
