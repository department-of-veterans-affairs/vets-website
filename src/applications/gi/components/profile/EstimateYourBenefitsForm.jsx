import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import { scroller } from 'react-scroll';
import classNames from 'classnames';

import ExpandingGroup from '@department-of-veterans-affairs/formation-react/ExpandingGroup';
import ErrorableTextInput from '@department-of-veterans-affairs/formation-react/ErrorableTextInput';
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
} from '../../utils/helpers';
import { renderLearnMoreLabel } from '../../utils/render';
import OnlineClassesFilter from '../search/OnlineClassesFilter';
import Checkbox from '../Checkbox';
import { ariaLabels, SMALL_SCREEN_WIDTH } from '../../constants';
import AccordionItem from '../AccordionItem';
import BenefitsForm from './BenefitsForm';

class EstimateYourBenefitsForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      invalidZip: '',
      yourBenefitsExpanded: true,
      aboutYourSchoolExpanded: false,
      learningFormatAndScheduleExpanded: false,
      scholarshipsAndOtherFundingExpanded: false,
      inputUpdated: false,
    };
  }

  getExtensions = () => {
    const { profile } = this.props;
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

  isCountryInternational = () =>
    isCountryInternational(this.props.profile.attributes.physicalCountry);

  createExtensionOption = extension => {
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

  isFullZipcode = zipCode => {
    if (zipCode.length === 5) {
      recordEvent({
        event: 'gibct-form-change',
        'gibct-form-field': 'gibctExtensionSearchZipCode',
        'gibct-form-value': zipCode,
      });
    }
  };

  handleBeneficiaryZIPCodeChanged = event => {
    if (!event.dirty) {
      this.setState({ inputUpdated: true });
      this.props.onBeneficiaryZIPCodeChanged(event.value);
      this.isFullZipcode(event.value);
      this.setState({ invalidZip: '' });
    } else if (event.dirty && this.props.inputs.beneficiaryZIP.length < 5) {
      this.setState({ invalidZip: 'Postal code must be a 5-digit number' });
    }
  };

  handleCalculateBenefitsClick = () => {
    const { beneficiaryZIPError, beneficiaryZIP } = this.props.inputs;

    if (
      this.props.eligibility.giBillChapter === '33' &&
      this.displayExtensionBeneficiaryInternationalCheckbox() &&
      this.displayExtensionBeneficiaryZipcode() &&
      (beneficiaryZIPError || beneficiaryZIP.length !== 5)
    ) {
      this.toggleLearningFormatAndSchedule(true);
      setTimeout(() => {
        scroller.scrollTo('beneficiary-zip-question', getScrollOptions());
        focusElement('input[name=beneficiaryZIPCode]');
      }, 1);
    } else {
      this.setState({ inputUpdated: false });
      this.props.updateEstimatedBenefits();
    }
  };

  updateEligibility = e => {
    this.setState({ inputUpdated: true });
    this.props.eligibilityChange(e);
  };

  handleExtensionChange = event => {
    const value = event.target.value;
    const zipCode = value.slice(value.indexOf('-') + 1);

    recordEvent({
      event: 'gibct-form-change',
      'gibct-form-field': 'gibctExtensionCampusDropdown',
      'gibct-form-value': event.target.options[event.target.selectedIndex].text,
    });
    if (!event.dirty) {
      if (event.target.value !== 'other') {
        this.props.onBeneficiaryZIPCodeChanged(zipCode);
      } else {
        this.props.onBeneficiaryZIPCodeChanged('');
      }
      this.handleInputChange(event);
    }
  };

  handleHasClassesOutsideUSChange = e => {
    this.handleBeneficiaryZIPCodeChanged({ value: '' });
    this.handleCheckboxChange(e);

    recordEvent({
      event: 'gibct-form-change',
      'gibct-form-field': 'gibctInternationalCheckbox',
      'gibct-form-value': 'Classes outside the U.S. & U.S. territories',
    });
  };

  handleCheckboxChange = e => {
    const { name: field, checked: value } = e.target;
    this.setState({ inputUpdated: true });
    this.props.calculatorInputChange({ field, value });
  };

  handleInputChange = event => {
    const { name: field, value } = event.target;
    const { profile } = this.props;

    this.setState({ inputUpdated: true });
    this.props.calculatorInputChange({ field, value });

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
  };

  handleAccordionFocus = () => {
    const field = document.getElementById('estimate-your-benefits-accordion');
    if (field) {
      field.scrollIntoView();
    }
  };

  handleEYBInputFocus = fieldId => {
    const eybSheetFieldId = 'eyb-summary-sheet';
    handleInputFocusWithPotentialOverLap(fieldId, eybSheetFieldId);
  };

  resetBuyUp = event => {
    event.preventDefault();
    if (this.props.inputs.buyUpAmount > 600) {
      this.setState({ inputUpdated: true });
      this.props.calculatorInputChange({
        field: 'buyUpAmount',
        value: 600,
      });
    }
  };

  /**
   * Expands "Your benefits" section and collapses other sections
   * @param expanded
   */
  toggleYourBenefits = expanded => {
    this.setState({
      ...this.state,
      yourBenefitsExpanded: expanded,
      aboutYourSchoolExpanded: expanded
        ? false
        : this.state.aboutYourSchoolExpanded,
      learningFormatAndScheduleExpanded: expanded
        ? false
        : this.state.learningFormatAndScheduleExpanded,
      scholarshipsAndOtherFundingExpanded: expanded
        ? false
        : this.state.scholarshipsAndOtherFundingExpanded,
    });
    this.handleAccordionFocus();
  };

  /**
   * Expands "About your school" section and collapses other sections
   * @param expanded
   */
  toggleAboutYourSchool = expanded => {
    this.setState({
      ...this.state,
      yourBenefitsExpanded: expanded ? false : this.state.yourBenefitsExpanded,
      aboutYourSchoolExpanded: expanded,
      learningFormatAndScheduleExpanded: expanded
        ? false
        : this.state.learningFormatAndScheduleExpanded,
      scholarshipsAndOtherFundingExpanded: expanded
        ? false
        : this.state.scholarshipsAndOtherFundingExpanded,
    });
    this.handleAccordionFocus();
  };

  /**
   * Expands "Learning format and schedule" section and collapses other sections
   * @param expanded
   */
  toggleLearningFormatAndSchedule = expanded => {
    this.setState({
      ...this.state,
      yourBenefitsExpanded: expanded ? false : this.state.yourBenefitsExpanded,
      aboutYourSchoolExpanded: expanded
        ? false
        : this.state.aboutYourSchoolExpanded,
      learningFormatAndScheduleExpanded: expanded,
      scholarshipsAndOtherFundingExpanded: expanded
        ? false
        : this.state.scholarshipsAndOtherFundingExpanded,
    });
    this.handleAccordionFocus();
  };

  /**
   * Expands "Scholarships and other funding" section and collapses other sections
   * @param expanded
   */
  toggleScholarshipsAndOtherFunding = expanded => {
    this.setState({
      ...this.state,
      yourBenefitsExpanded: expanded ? false : this.state.yourBenefitsExpanded,
      aboutYourSchoolExpanded: expanded
        ? false
        : this.state.aboutYourSchoolExpanded,
      learningFormatAndScheduleExpanded: expanded
        ? false
        : this.state.learningFormatAndScheduleExpanded,
      scholarshipsAndOtherFundingExpanded: expanded,
    });
    this.handleAccordionFocus();
  };

  /**
   * Renders a learn more label with common props for this component being set
   * @param text
   * @param modal
   * @param ariaLabel
   * @returns {*}
   */
  renderLearnMoreLabel = ({ text, modal, ariaLabel }) =>
    renderLearnMoreLabel({
      text,
      modal,
      ariaLabel,
      showModal: this.props.showModal,
      component: this,
    });

  /**
   * Displays question related to in-state
   * to display inState institutionType needs to be PUBLIC
   * to display tuition institutionType needs to not be OJT
   * @returns {null|*}
   */
  renderInState = () => {
    if (!this.props.displayedInputs.inState) return null;
    return (
      <ExpandingGroup
        open={
          this.props.displayedInputs.tuition &&
          this.props.inputs.inState === 'no'
        }
      >
        <RadioButtons
          label="Are you an in-state student?"
          name="inState"
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
          value={this.props.inputs.inState}
          onChange={this.handleInputChange}
          onFocus={this.handleEYBInputFocus}
        />
        {this.renderInStateTuition()}
      </ExpandingGroup>
    );
  };

  /**
   * Displays question about how a much an institution's in-state tuition is
   * @returns {*}
   */
  renderInStateTuition = () => {
    const inStateTuitionFeesId = 'inStateTuitionFees';
    const inStateFieldId = `${inStateTuitionFeesId}-fields`;
    return (
      <div id={inStateFieldId}>
        <label htmlFor={inStateTuitionFeesId}>
          {this.renderLearnMoreLabel({
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
          value={formatCurrency(this.props.inputs.inStateTuitionFees)}
          onChange={this.handleInputChange}
          onFocus={this.handleEYBInputFocus.bind(this, inStateFieldId)}
        />
      </div>
    );
  };

  renderTuition = () => {
    if (!this.props.displayedInputs.tuition) return null;

    const tuitionFeesId = 'tuitionFees';
    const tuitionFeesFieldId = `${tuitionFeesId}-field`;
    return (
      <div id={tuitionFeesFieldId}>
        <label htmlFor={tuitionFeesId} className="vads-u-display--inline-block">
          Tuition and fees per year
        </label>
        {this.renderLearnMoreLabel({
          modal: 'calcTuition',
          ariaLabel: ariaLabels.learnMore.tuitionFeesPerYear,
        })}
        <input
          inputMode="decimal"
          pattern="(\d*\d+)(?=\,)"
          type="text"
          name={tuitionFeesId}
          id={tuitionFeesId}
          value={formatCurrency(this.props.inputs.tuitionFees)}
          onChange={this.handleInputChange}
          onFocus={this.handleEYBInputFocus.bind(this, tuitionFeesFieldId)}
        />
      </div>
    );
  };

  renderBooks = () => {
    if (!this.props.displayedInputs.books) return null;
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
          value={formatCurrency(this.props.inputs.books)}
          onChange={this.handleInputChange}
          onFocus={this.handleEYBInputFocus.bind(this, booksFieldId)}
        />
      </div>
    );
  };

  renderYellowRibbon = () => {
    if (!this.props.displayedInputs.yellowRibbon) return null;

    let {
      yellowRibbonDegreeLevelOptions,
      yellowRibbonDivisionOptions,
    } = this.props.inputs;

    yellowRibbonDegreeLevelOptions = yellowRibbonDegreeLevelOptions.map(
      value => ({ value, label: value }),
    );
    yellowRibbonDegreeLevelOptions.unshift({
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
      <ExpandingGroup open={this.props.inputs.yellowRibbonRecipient === 'yes'}>
        <RadioButtons
          label={this.renderLearnMoreLabel({
            text: 'Will you be a Yellow Ribbon recipient?',
            modal: 'calcYr',
            ariaLabel: ariaLabels.learnMore.yellowRibbonProgram,
          })}
          name="yellowRibbonRecipient"
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
          value={this.props.inputs.yellowRibbonRecipient}
          onChange={this.handleInputChange}
          onFocus={this.handleEYBInputFocus}
        />
        <div>
          <Dropdown
            label="Degree Level"
            name="yellowRibbonDegreeLevel"
            alt="Degree Level"
            hideArrows={yellowRibbonDegreeLevelOptions.length <= 1}
            options={yellowRibbonDegreeLevelOptions}
            visible={showYellowRibbonOptions}
            value={this.props.inputs.yellowRibbonDegreeLevel}
            onChange={this.handleInputChange}
            onFocus={this.handleEYBInputFocus}
          />
          <Dropdown
            label="Division or school"
            name={'yellowRibbonDivision'}
            alt="Division or school"
            hideArrows={yellowRibbonDivisionOptions.length <= 1}
            options={yellowRibbonDivisionOptions}
            visible={showYellowRibbonDetails}
            value={this.props.inputs.yellowRibbonDivision}
            onChange={this.handleInputChange}
            onFocus={this.handleEYBInputFocus}
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
              value={formatCurrency(this.props.inputs.yellowRibbonAmount)}
              onChange={this.handleInputChange}
              onFocus={this.handleEYBInputFocus.bind(this, yellowRibbonFieldId)}
            />
          </div>
          <AlertBox
            isVisible={showYellowRibbonDetails}
            key={this.props.inputs.yellowRibbonProgramIndex}
            status="info"
          >
            <div>
              Maximum amount per student:{' '}
              <strong>
                {formatCurrency(this.props.inputs.yellowRibbonMaxAmount)}
                /yr
              </strong>
              <br />
              Number of students:{' '}
              <strong>
                {this.props.inputs.yellowRibbonMaxNumberOfStudents}
              </strong>
            </div>
          </AlertBox>
        </div>
      </ExpandingGroup>
    );
  };

  renderScholarships = () => {
    if (!this.props.displayedInputs.scholarships) return null;
    const scholarshipsId = 'scholarships';
    const scholarshipsFieldId = `${scholarshipsId}-field`;
    return (
      <div id={scholarshipsFieldId}>
        <label htmlFor={scholarshipsId}>
          {this.renderLearnMoreLabel({
            text: 'Scholarships (excluding Pell)',
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
          value={formatCurrency(this.props.inputs.scholarships)}
          onChange={this.handleInputChange}
          onFocus={this.handleEYBInputFocus.bind(this, scholarshipsFieldId)}
        />
      </div>
    );
  };

  renderTuitionAssist = () => {
    if (!this.props.displayedInputs.tuitionAssist) return null;
    const tuitionAssistId = 'tuitionAssist';
    const tuitionAssistFieldId = `${tuitionAssistId}-field`;
    return (
      <div id={tuitionAssistFieldId}>
        <label htmlFor={tuitionAssistId}>
          {this.renderLearnMoreLabel({
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
          value={formatCurrency(this.props.inputs.tuitionAssist)}
          onChange={this.handleInputChange}
          onFocus={this.handleEYBInputFocus.bind(this, tuitionAssistFieldId)}
        />
      </div>
    );
  };

  renderEnrolled = () => {
    const {
      enrolled: shouldRenderEnrolled,
      enrolledOld: shouldRenderEnrolledOld,
    } = this.props.displayedInputs;

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

    const {
      enrolled: enrolledValue,
      enrolledOld: enrolledOldValue,
    } = this.props.inputs;

    const name = shouldRenderEnrolled ? 'enrolled' : 'enrolledOld';
    const value = shouldRenderEnrolled ? enrolledValue : enrolledOldValue;

    return (
      <Dropdown
        label={this.renderLearnMoreLabel({
          text: 'Enrolled',
          modal: 'calcEnrolled',
          ariaLabel: ariaLabels.learnMore.calcEnrolled,
        })}
        name={name}
        alt="Enrolled"
        options={options}
        visible
        value={value}
        onChange={this.handleInputChange}
        onFocus={this.handleEYBInputFocus}
      />
    );
  };

  renderCalendar = () => {
    if (!this.props.displayedInputs.calendar) return null;

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
          value={this.props.inputs.numberNontradTerms}
          onChange={this.handleInputChange}
          onFocus={this.handleEYBInputFocus}
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
          value={this.props.inputs.lengthNontradTerms}
          onChange={this.handleInputChange}
          onFocus={this.handleEYBInputFocus}
        />
      </div>
    );

    return (
      <div>
        <ExpandingGroup open={this.props.inputs.calendar === 'nontraditional'}>
          <Dropdown
            label={this.renderLearnMoreLabel({
              text: 'School Calendar',
              modal: 'calcSchoolCalendar',
              ariaLabel: ariaLabels.learnMore.calcSchoolCalendar,
            })}
            name="calendar"
            alt="School calendar"
            options={[
              { value: 'semesters', label: 'Semesters' },
              { value: 'quarters', label: 'Quarters' },
              { value: 'nontraditional', label: 'Non-Traditional' },
            ]}
            visible
            value={this.props.inputs.calendar}
            onChange={this.handleInputChange}
            onFocus={this.handleEYBInputFocus}
          />
          {dependentDropdowns}
        </ExpandingGroup>
      </div>
    );
  };

  renderKicker = () => {
    if (!this.props.displayedInputs.kicker) return null;

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
          value={formatCurrency(this.props.inputs.kickerAmount)}
          onChange={this.handleInputChange}
          onFocus={this.handleEYBInputFocus.bind(this, kickerFieldId)}
        />
      </div>
    );

    return (
      <ExpandingGroup open={this.props.inputs.kickerEligible === 'yes'}>
        <RadioButtons
          label={this.renderLearnMoreLabel({
            text: 'Eligible for kicker bonus?',
            modal: 'calcKicker',
            ariaLabel: ariaLabels.learnMore.kickerEligible,
          })}
          name="kickerEligible"
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
          value={this.props.inputs.kickerEligible}
          onChange={this.handleInputChange}
          onFocus={this.handleEYBInputFocus}
        />
        {amountInput}
      </ExpandingGroup>
    );
  };

  displayExtensionBeneficiaryInternationalCheckbox = () => {
    const { beneficiaryLocationQuestion, extension } = this.props.inputs;
    return (
      beneficiaryLocationQuestion === 'other' ||
      (beneficiaryLocationQuestion === 'extension' && extension === 'other')
    );
  };

  displayExtensionBeneficiaryZipcode = () =>
    !this.props.inputs.classesOutsideUS;

  renderExtensionBeneficiaryZIP = () => {
    if (!this.props.displayedInputs.beneficiaryLocationQuestion) {
      return null;
    }
    const { profile, inputs } = this.props;
    const extensions = this.getExtensions();

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
        extensionOptions.push(this.createExtensionOption(extension));
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
          onChange={this.handleExtensionChange}
          onFocus={this.handleEYBInputFocus}
        />
      );
    }

    if (this.displayExtensionBeneficiaryInternationalCheckbox()) {
      const errorMessage = this.state.invalidZip;

      const errorMessageCheck =
        errorMessage !== '' ? errorMessage : inputs.beneficiaryZIPError;

      if (this.displayExtensionBeneficiaryZipcode()) {
        const label = this.isCountryInternational()
          ? "If you're taking classes in the U.S., enter the location's postal code"
          : "Please enter the postal code where you'll take your classes";

        zipcodeInput = (
          <div name="beneficiary-zip-question">
            <ErrorableTextInput
              autoFocus
              errorMessage={errorMessageCheck}
              label={label}
              name="beneficiaryZIPCode"
              field={{ value: inputs.beneficiaryZIP }}
              onValueChange={this.handleBeneficiaryZIPCodeChanged}
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
          onChange={this.handleHasClassesOutsideUSChange}
          checked={inputs.classesOutsideUS}
          name={'classesOutsideUS'}
          id={'classesOutsideUS'}
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
          this.displayExtensionBeneficiaryInternationalCheckbox()
        }
      >
        <RadioButtons
          label={this.renderLearnMoreLabel({
            text: 'Where will you take the majority of your classes?',
            modal: 'calcBeneficiaryLocationQuestion',
            ariaLabel: ariaLabels.learnMore.majorityOfClasses,
          })}
          name="beneficiaryLocationQuestion"
          options={beneficiaryLocationQuestionOptions}
          value={selectedBeneficiaryLocationQuestion}
          onChange={this.handleInputChange}
          onFocus={this.handleEYBInputFocus}
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

  renderBuyUp = () => {
    if (!this.props.displayedInputs.buyUp) return null;

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
          value={formatCurrency(this.props.inputs.buyUpAmount)}
          onChange={this.handleInputChange}
          onBlur={this.resetBuyUp}
          onFocus={this.handleEYBInputFocus.bind(this, buyUpFieldId)}
        />
      </div>
    );

    return (
      <ExpandingGroup open={this.props.inputs.buyUp === 'yes'}>
        <RadioButtons
          label="Participate in buy-up program?"
          name="buyUp"
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
          value={this.props.inputs.buyUp}
          onChange={this.handleInputChange}
        />
        {amountInput}
      </ExpandingGroup>
    );
  };

  renderWorking = () => {
    if (!this.props.displayedInputs.working) return null;
    return (
      <Dropdown
        label={this.renderLearnMoreLabel({
          text: 'Will be working',
          modal: 'calcWorking',
          ariaLabel: ariaLabels.learnMore.calcWorking,
        })}
        name="working"
        alt="Will be working"
        options={[
          { value: '30', label: '30+ hrs / week' },
          { value: '28', label: '28 hrs / week' },
          { value: '26', label: '26 hrs / week' },
          { value: '24', label: '24 hrs / week' },
          { value: '22', label: '22 hrs / week' },
          { value: '20', label: '20 hrs / week' },
          { value: '18', label: '18 hrs / week' },
          { value: '16', label: '16 hrs / week' },
          { value: '14', label: '14 hrs / week' },
          { value: '12', label: '12 hrs / week' },
          { value: '10', label: '10 hrs / week' },
          { value: '8', label: '8 hrs / week' },
          { value: '6', label: '6 hrs / week' },
          { value: '4', label: '4 hrs / week' },
          { value: '2', label: '2 hrs / week' },
        ]}
        visible
        value={this.props.inputs.working}
        onChange={this.handleInputChange}
        onFocus={this.handleEYBInputFocus}
      />
    );
  };

  renderOnlineClasses = () => (
    <OnlineClassesFilter
      onlineClasses={this.props.eligibility.onlineClasses}
      onChange={this.updateEligibility}
      showModal={this.props.showModal}
    />
  );

  renderGbBenefit = () => {
    if (!this.props.displayedInputs?.giBillBenefit) {
      return null;
    }

    return (
      <RadioButtons
        label={this.renderLearnMoreLabel({
          text:
            'Did you use your Post-9/11 GI Bill benefits for tuition, housing, or books for a term that started before January 1, 2018?',
          modal: 'whenUsedGiBill',
          ariaLabel: ariaLabels.learnMore.whenUsedGiBill,
        })}
        name="giBillBenefit"
        options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
        value={this.props.inputs.giBillBenefit}
        onChange={this.handleInputChange}
        onFocus={this.handleEYBInputFocus}
      />
    );
  };

  renderMilitaryDetails = () => {
    const name = 'Your military details';
    return (
      <AccordionItem
        button={name}
        id={`eyb-${createId(name)}`}
        section
        expanded={this.state.yourBenefitsExpanded}
        onClick={this.toggleYourBenefits}
      >
        <div>
          <BenefitsForm
            eligibilityChange={this.updateEligibility}
            {...this.props.eligibility}
            hideModal={this.props.hideModal}
            showModal={this.props.showModal}
            inputs={this.props.inputs}
            displayedInputs={this.props.displayedInputs}
            handleInputFocus={this.handleEYBInputFocus}
            giBillChapterOpen={[this.props.displayedInputs?.giBillBenefit]}
          >
            {this.renderGbBenefit()}
          </BenefitsForm>
        </div>
        <button
          className="calculate-button"
          onClick={this.handleCalculateBenefitsClick}
          disabled={!this.state.inputUpdated}
        >
          Update benefits
        </button>
      </AccordionItem>
    );
  };

  hideSchoolCostsAndCalendar = () => {
    const {
      inState,
      tuition,
      books,
      calendar,
      enrolled,
      enrolledOld,
    } = this.props.displayedInputs;

    return !(
      inState ||
      tuition ||
      books ||
      calendar ||
      enrolled ||
      enrolledOld
    );
  };

  renderSchoolCostsAndCalendar = () => {
    if (this.hideSchoolCostsAndCalendar()) return null;

    const name = 'School costs and calendar';

    return (
      <AccordionItem
        button={name}
        id={`eyb-${createId(name)}`}
        expanded={this.state.aboutYourSchoolExpanded}
        section
        onClick={this.toggleAboutYourSchool}
      >
        <div className="calculator-form">
          {this.renderInState()}
          {this.renderTuition()}
          {this.renderBooks()}
          {this.renderCalendar()}
          {this.renderEnrolled()}
        </div>
        <button
          className="calculate-button"
          onClick={this.handleCalculateBenefitsClick}
          disabled={!this.state.inputUpdated}
        >
          Update benefits
        </button>
      </AccordionItem>
    );
  };

  renderLearningFormat = isOjt => {
    const name = isOjt
      ? 'Learning format and schedule'
      : 'Learning format and location';
    return (
      <AccordionItem
        button={name}
        id={`eyb-${createId(name)}`}
        expanded={this.state.learningFormatAndScheduleExpanded}
        section
        onClick={this.toggleLearningFormatAndSchedule}
      >
        <div className="calculator-form">
          {this.renderOnlineClasses()}
          {this.renderExtensionBeneficiaryZIP()}
          {this.renderWorking()}
        </div>
        <button
          className="calculate-button"
          onClick={this.handleCalculateBenefitsClick}
          disabled={!this.state.inputUpdated}
        >
          Update benefits
        </button>
      </AccordionItem>
    );
  };

  hideScholarshipsAndOtherVAFunding = () => {
    const {
      yellowRibbon,
      tuitionAssist,
      kicker,
      buyUp,
      scholarships,
    } = this.props.displayedInputs;
    return !(yellowRibbon || tuitionAssist || kicker || buyUp || scholarships);
  };

  renderScholarshipsAndOtherVAFunding = () => {
    if (this.hideScholarshipsAndOtherVAFunding()) return null;
    const name = 'Scholarships and other VA funding';
    return (
      <AccordionItem
        button={name}
        id={`eyb-${createId(name)}`}
        expanded={this.state.scholarshipsAndOtherFundingExpanded}
        section
        onClick={this.toggleScholarshipsAndOtherFunding}
      >
        <div className="calculator-form">
          {this.renderYellowRibbon()}
          {this.renderTuitionAssist()}
          {this.renderKicker()}
          {this.renderBuyUp()}
          {this.renderScholarships()}
        </div>
        <button
          className="calculate-button"
          onClick={this.handleCalculateBenefitsClick}
          disabled={!this.state.inputUpdated}
        >
          Update benefits
        </button>
      </AccordionItem>
    );
  };

  render() {
    const isOjt =
      _.get(this.props, 'profile.attributes.type', '').toLowerCase() === 'ojt';

    let sectionCount = 2;
    if (!this.hideSchoolCostsAndCalendar()) sectionCount += 1;
    if (!this.hideScholarshipsAndOtherVAFunding()) sectionCount += 1;

    const className = classNames(
      'estimate-your-benefits-form',
      'medium-5',
      'columns',
      'small-screen:vads-u-padding-right--0',
    );

    return (
      <div className={className}>
        <p className="vads-u-margin-bottom--3 vads-u-margin-top--0">
          The {sectionCount} sections below include questions that will refine
          your benefits estimate. Use the fields in each section to make your
          updates.
        </p>
        <ul className="vads-u-padding--0">
          {this.renderMilitaryDetails()}
          {this.renderSchoolCostsAndCalendar()}
          {this.renderLearningFormat(isOjt)}
          {this.renderScholarshipsAndOtherVAFunding()}
        </ul>
      </div>
    );
  }
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
