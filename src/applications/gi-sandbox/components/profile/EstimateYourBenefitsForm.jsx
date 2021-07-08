import PropTypes from 'prop-types';
import React, { useState } from 'react';
import _ from 'lodash';
import { scroller } from 'react-scroll';
import classNames from 'classnames';

import ExpandingGroup from '@department-of-veterans-affairs/component-library/ExpandingGroup';
import TextInput from '@department-of-veterans-affairs/component-library/TextInput';
import recordEvent from 'platform/monitoring/record-event';
import { getScrollOptions, focusElement } from 'platform/utilities/ui';
import AlertBox from '../AlertBox';
import Dropdown from '../Dropdown';
import RadioButtons from '../RadioButtons';
import {
  createId,
  formatCurrency,
  isCountryInternational,
  locationInfo,
  handleInputFocusWithPotentialOverLap,
  isURL,
} from '../../utils/helpers';
import { renderLearnMoreLabel } from '../../utils/render';
import OnlineClassesFilter from '../search/OnlineClassesFilter';
import Checkbox from '../Checkbox';
import { ariaLabels } from '../../constants';
import AccordionItem from '../AccordionItem';
import BenefitsForm from './BenefitsForm';

function EstimateYourBenefitsForm({
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
}) {
  const [invalidZip, setInvalidZip] = useState('');
  const [inputUpdated, setInputUpdated] = useState(false);
  const [expanded, setExpanded] = useState({
    yourBenefitsExpanded: false,
    aboutYourSchoolExpanded: false,
    learningFormatAndScheduleExpanded: false,
    scholarshipsAndOtherFundingExpanded: false,
  });

  const displayExtensionBeneficiaryZipcode = !inputs.classesOutsideUS;

  const getExtensions = () => {
    const facilityMap = profile.attributes.facilityMap;
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

  const isFullZipcode = zipCode => {
    if (zipCode.length === 5) {
      recordEvent({
        event: 'gibct-form-change',
        'gibct-form-field': 'gibctExtensionSearchZipCode',
        'gibct-form-value': zipCode,
      });
    }
  };

  const handleBeneficiaryZIPCodeChanged = event => {
    if (!event.dirty) {
      onBeneficiaryZIPCodeChanged(event.value);
      isFullZipcode(event.value);
      setInvalidZip('');
      setInputUpdated(true);
    } else if (event.dirty && inputs.beneficiaryZIP.length < 5) {
      setInvalidZip('Postal code must be a 5-digit number');
    }
  };

  const handleAccordionFocus = () => {
    const field = document.getElementById('estimate-your-benefits-accordion');
    if (field) {
      field.scrollIntoView();
    }
  };

  const handleInputChange = event => {
    const { name: field, value } = event.target;
    setInputUpdated(true);
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
  };

  const toggleExpanded = (expandedName, isExpanded) => {
    const newExpanded = {};
    Object.keys(expanded).forEach(key => {
      const flipped = expanded[expandedName] ? false : expanded[expandedName];
      newExpanded[key] = expandedName === key ? isExpanded : flipped;
    });
    setExpanded(newExpanded);
    handleAccordionFocus();
  };

  const displayExtensionBeneficiaryInternationalCheckbox = () => {
    const { beneficiaryLocationQuestion, extension } = inputs;
    return (
      beneficiaryLocationQuestion === 'other' ||
      (beneficiaryLocationQuestion === 'extension' && extension === 'other')
    );
  };

  const handleCalculateBenefitsClick = childSection => {
    const accordionButtonId = `${createId(childSection)}-accordion-button`;
    const { beneficiaryZIPError, beneficiaryZIP } = inputs;

    if (
      eligibility.giBillChapter === '33' &&
      displayExtensionBeneficiaryInternationalCheckbox() &&
      displayExtensionBeneficiaryZipcode &&
      (beneficiaryZIPError || beneficiaryZIP.length !== 5)
    ) {
      toggleExpanded('learningFormatAndScheduleExpanded', true);
      setTimeout(() => {
        scroller.scrollTo('beneficiary-zip-question', getScrollOptions());
        focusElement('input[name=beneficiaryZIPCode]');
      }, 50);
    } else {
      setInputUpdated(false);
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

  const updateEligibility = e => {
    setInputUpdated(true);
    eligibilityChange(e);
  };

  const handleExtensionBlur = event => {
    recordEvent({
      event: 'gibct-form-change',
      'gibct-form-field': 'gibctExtensionCampusDropdown',
      'gibct-form-value': event.target.options[event.target.selectedIndex].text,
    });
  };

  const handleExtensionChange = event => {
    const value = event.target.value;
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
    setInputUpdated(true);
    calculatorInputChange({ field, value });
  };

  const handleHasClassesOutsideUSChange = e => {
    handleBeneficiaryZIPCodeChanged({ value: '' });
    handleCheckboxChange(e);

    recordEvent({
      event: 'gibct-form-change',
      'gibct-form-field': 'gibctInternationalCheckbox',
      'gibct-form-value': 'Classes outside the U.S. & U.S. territories',
    });
  };

  const handleInputBlur = event => {
    const { name: field, value } = event.target;
    recordEvent({
      event: 'gibct-form-change',
      'gibct-form-field': field,
      'gibct-form-value': value,
    });
  };

  const handleEYBInputFocus = fieldId => {
    const eybSheetFieldId = 'eyb-summary-sheet';
    handleInputFocusWithPotentialOverLap(fieldId, eybSheetFieldId);
  };

  const resetBuyUp = event => {
    event.preventDefault();
    handleInputBlur(event);
    if (inputs.buyUpAmount > 600) {
      setInputUpdated(true);
      calculatorInputChange({
        field: 'buyUpAmount',
        value: 600,
      });
    }
  };

  /**
   * Renders a learn more label with common props for this component being set
   * @param text
   * @param modal
   * @param ariaLabel
   * @returns {*}
   */
  const learnMoreLabel = ({ text, modal, ariaLabel, labelFor }) =>
    renderLearnMoreLabel({
      text,
      modal,
      ariaLabel,
      showModal,
      labelFor,
    });

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

    const label = learnMoreLabel({
      text: 'Are you an in-state student?',
      modal:
        isURL(inStateTuitionInformation) &&
        inStateTuitionInformation !==
          'Contact the School Certifying Official (SCO) for requirements'
          ? 'inStateWithLink'
          : 'inStateWithoutLink',
      ariaLabel: ariaLabels.learnMore.inState,
    });
    return (
      <ExpandingGroup open={displayedInputs.tuition && inputs.inState === 'no'}>
        <RadioButtons
          label={label}
          name="inState"
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
          value={inputs.inState}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onFocus={handleEYBInputFocus}
        />
        {renderInStateTuition()}
      </ExpandingGroup>
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
      value => ({ value, label: value }),
    );
    yellowRibbonDegreeLevelOptions.push({
      value: 'customAmount',
      label: 'Enter an amount',
    });
    yellowRibbonDivisionOptions = yellowRibbonDivisionOptions.map(value => ({
      value,
      label: value,
    }));
    const showYellowRibbonOptions = yellowRibbonDegreeLevelOptions.length > 1;
    const showYellowRibbonDetails = yellowRibbonDivisionOptions.length > 0;
    const yellowRibbonFieldId = 'yellowRibbonField';

    return (
      <ExpandingGroup open={inputs.yellowRibbonRecipient === 'yes'}>
        <RadioButtons
          label={learnMoreLabel({
            text: 'Will you be a Yellow Ribbon recipient?',
            modal: 'calcYr',
            ariaLabel: ariaLabels.learnMore.yellowRibbonProgram,
          })}
          name="yellowRibbonRecipient"
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
          value={inputs.yellowRibbonRecipient}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onFocus={handleEYBInputFocus}
        />

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
            name={'yellowRibbonDivision'}
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
      </ExpandingGroup>
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
          { value: 'full', label: 'Full Time' },
          { value: 'three quarters', label: '¾ Time' },
          { value: 'more than half', label: 'More than ½ time' },
          { value: 'half or less', label: '½ Time or less' },
        ]
      : [
          { value: 'full', label: 'Full Time' },
          { value: 'three quarters', label: '¾ Time' },
          { value: 'half', label: '½ Time' },
          {
            value: 'less than half',
            label: 'Less than ½ time more than ¼ time',
          },
          { value: 'quarter', label: '¼ Time or less' },
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
            { value: '3', label: 'Three' },
            { value: '2', label: 'Two' },
            { value: '1', label: 'One' },
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
            { value: '1', label: '1 month' },
            { value: '2', label: '2 months' },
            { value: '3', label: '3 months' },
            { value: '4', label: '4 months' },
            { value: '5', label: '5 months' },
            { value: '6', label: '6 months' },
            { value: '7', label: '7 months' },
            { value: '8', label: '8 months' },
            { value: '9', label: '9 months' },
            { value: '10', label: '10 months' },
            { value: '11', label: '11 months' },
            { value: '12', label: '12 months' },
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
        <ExpandingGroup open={inputs.calendar === 'nontraditional'}>
          <Dropdown
            label={learnMoreLabel({
              text: 'School Calendar',
              modal: 'calcSchoolCalendar',
              ariaLabel: ariaLabels.learnMore.calcSchoolCalendar,
              labelFor: 'calendar',
            })}
            name="calendar"
            alt="School calendar"
            options={[
              { value: 'semesters', label: 'Semesters' },
              { value: 'quarters', label: 'Quarters' },
              { value: 'nontraditional', label: 'Non-Traditional' },
            ]}
            visible
            value={inputs.calendar}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onFocus={handleEYBInputFocus}
          />

          {dependentDropdowns}
        </ExpandingGroup>
      </div>
    );
  };

  const renderKicker = () => {
    if (!displayedInputs.kicker) return null;

    const kickerAmountId = 'kickerAmount';
    const kickerFieldId = `${kickerAmountId}-field`;
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
      <ExpandingGroup open={inputs.kickerEligible === 'yes'}>
        <RadioButtons
          label={learnMoreLabel({
            text: 'Eligible for kicker bonus?',
            modal: 'calcKicker',
            ariaLabel: ariaLabels.learnMore.kickerEligible,
          })}
          name="kickerEligible"
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
          value={inputs.kickerEligible}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onFocus={handleEYBInputFocus}
        />
        {amountInput}
      </ExpandingGroup>
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
      extensionOptions = [{ value: '', label: 'Please choose a location' }];
      extensions.forEach(extension => {
        extensionOptions.push(createExtensionOption(extension));
      });
      extensionOptions.push({ value: 'other', label: 'Other...' });

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
            <TextInput
              autoFocus
              errorMessage={errorMessageCheck}
              label={label}
              name="beneficiaryZIPCode"
              field={{ value: inputs.beneficiaryZIP }}
              onValueChange={handleBeneficiaryZIPCodeChanged}
              charMax={5}
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
          checked={inputs.classesOutsideUS}
          name={'classesOutsideUS'}
        />
      );
    }
    const selectedBeneficiaryLocationQuestion = inputs.beneficiaryLocationQuestion
      ? inputs.beneficiaryLocationQuestion
      : profile.attributes.name;

    return (
      <ExpandingGroup
        open={
          displayExtensionSelector ||
          displayExtensionBeneficiaryInternationalCheckbox()
        }
      >
        <RadioButtons
          label={learnMoreLabel({
            text: 'Where will you take the majority of your classes?',
            modal: 'calcBeneficiaryLocationQuestion',
            ariaLabel: ariaLabels.learnMore.majorityOfClasses,
          })}
          name="beneficiaryLocationQuestion"
          options={beneficiaryLocationQuestionOptions}
          value={selectedBeneficiaryLocationQuestion}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onFocus={handleEYBInputFocus}
        />
        <div>
          {extensionSelector}
          {zipcodeInput}
          {zipcodeLocation}
          {internationalCheckbox}
        </div>
      </ExpandingGroup>
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
      <ExpandingGroup open={inputs.buyUp === 'yes'}>
        <RadioButtons
          label="Participate in buy-up program?"
          name="buyUp"
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
          value={inputs.buyUp}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
        />
        {amountInput}
      </ExpandingGroup>
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
        })}
        name="working"
        alt="Will be working"
        options={[
          { value: '30', label: '30 plus hours per week' },
          { value: '28', label: '28 hours per week' },
          { value: '26', label: '26 hours per week' },
          { value: '24', label: '24 hours per week' },
          { value: '22', label: '22 hours per week' },
          { value: '20', label: '20 hours per week' },
          { value: '18', label: '18 hours per week' },
          { value: '16', label: '16 hours per week' },
          { value: '14', label: '14 hours per week' },
          { value: '12', label: '12 hours per week' },
          { value: '10', label: '10 hours per week' },
          { value: '8', label: '8 hours per week' },
          { value: '6', label: '6 hours per week' },
          { value: '4', label: '4 hours per week' },
          { value: '2', label: '2 hours per week' },
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

  const renderGbBenefit = () => {
    if (!displayedInputs?.giBillBenefit) {
      return null;
    }

    return (
      <RadioButtons
        label={learnMoreLabel({
          text:
            'Did you use your Post-9/11 GI Bill benefits for tuition, housing, or books for a term that started before January 1, 2018?',
          modal: 'whenUsedGiBill',
          ariaLabel: ariaLabels.learnMore.whenUsedGiBill,
        })}
        name="giBillBenefit"
        options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
        value={inputs.giBillBenefit}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onFocus={handleEYBInputFocus}
      />
    );
  };

  const renderEYBSkipLink = () => {
    return (
      <div className="vads-u-padding-top--1 ">
        <a
          className="va-button-link learn-more-button eyb-skip-link vads-u-display--block"
          aria-label="Skip to your estimated benefits"
          href="#estimated-benefits"
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
        expanded={expanded.yourBenefitsExpanded}
        onClick={isExpanded =>
          toggleExpanded('yourBenefitsExpanded', isExpanded)
        }
      >
        <div>
          <BenefitsForm
            eligibilityChange={updateEligibility}
            {...eligibility}
            hideModal={hideModal}
            showModal={showModal}
            inputs={inputs}
            displayedInputs={displayedInputs}
            handleInputFocus={handleEYBInputFocus}
            giBillChapterOpen={[displayedInputs?.giBillBenefit]}
          >
            {renderGbBenefit()}
          </BenefitsForm>
        </div>
        <button
          id="update-benefits-button"
          className="calculate-button"
          onClick={() => handleCalculateBenefitsClick(name)}
          disabled={!inputUpdated}
        >
          Update benefits
        </button>
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
        expanded={expanded.aboutYourSchoolExpanded}
        section
        onClick={isExpanded =>
          toggleExpanded('aboutYourSchoolExpanded', isExpanded)
        }
      >
        <div className="calculator-form">
          {renderInState()}
          {renderTuition()}
          {renderBooks()}
          {renderCalendar()}
          {renderEnrolled()}
        </div>
        <button
          id="update-benefits-button"
          className="calculate-button"
          onClick={() => handleCalculateBenefitsClick(name)}
          disabled={!inputUpdated}
        >
          Update benefits
        </button>
        {renderEYBSkipLink()}
      </AccordionItem>
    );
  };

  const renderLearningFormat = isOjt => {
    const name = isOjt
      ? 'Learning format and schedule'
      : 'Learning format and location';

    return (
      <AccordionItem
        button={name}
        expanded={expanded.learningFormatAndScheduleExpanded}
        section
        onClick={isExpanded =>
          toggleExpanded('learningFormatAndScheduleExpanded', isExpanded)
        }
      >
        <div className="calculator-form">
          {renderOnlineClasses()}
          {renderExtensionBeneficiaryZIP()}
          {renderWorking()}
        </div>
        <button
          id="update-benefits-button"
          className="calculate-button"
          onClick={() => handleCalculateBenefitsClick(name)}
          disabled={!inputUpdated}
        >
          Update benefits
        </button>
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
        expanded={expanded.scholarshipsAndOtherFundingExpanded}
        section
        onClick={isExpanded =>
          toggleExpanded('scholarshipsAndOtherFundingExpanded', isExpanded)
        }
      >
        <div className="calculator-form">
          {renderYellowRibbon()}
          {renderTuitionAssist()}
          {renderKicker()}
          {renderBuyUp()}
          {renderScholarships()}
        </div>
        <button
          id="update-benefits-button"
          className="calculate-button"
          onClick={() => handleCalculateBenefitsClick(name)}
          disabled={!inputUpdated}
        >
          Update benefits
        </button>
        {renderEYBSkipLink()}
      </AccordionItem>
    );
  };

  const isOjt = _.get(profile, 'attributes.type', '').toLowerCase() === 'ojt';

  let sectionCount = 2;
  if (!hideSchoolCostsAndCalendar()) sectionCount += 1;
  if (!hideScholarshipsAndOtherVAFunding()) sectionCount += 1;

  const className = classNames(
    'estimate-your-benefits-form',
    'medium-5',
    'columns',
    'small-screen:vads-u-padding-right--0',
  );

  return (
    <div aria-live="off" className={className}>
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
        {renderLearningFormat(isOjt)}
        {renderScholarshipsAndOtherVAFunding()}
      </ul>
    </div>
  );
}

EstimateYourBenefitsForm.propTypes = {
  profile: PropTypes.object,
  eligibility: PropTypes.object,
  eligibilityChange: PropTypes.func,
  inputs: PropTypes.object,
  displayedInputs: PropTypes.object,
  showModal: PropTypes.func,
  calculatorInputChange: PropTypes.func,
  onBeneficiaryZIPCodeChanged: PropTypes.func,
  estimatedBenefits: PropTypes.object,
  updateEstimatedBenefits: PropTypes.func.isRequired,
  updateBenefitsButtonEnabled: PropTypes.bool,
};

export default EstimateYourBenefitsForm;
