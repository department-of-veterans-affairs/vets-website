import PropTypes from 'prop-types';
import React from 'react';
import AlertBox from '../AlertBox';

import Dropdown from '../Dropdown';
import RadioButtons from '../RadioButtons';
import {
  createId,
  formatCurrency,
  isCountryInternational,
  locationInfo,
  checkForEmptyFocusableElement,
} from '../../utils/helpers';
import ErrorableTextInput from '@department-of-veterans-affairs/formation-react/ErrorableTextInput';
import OnlineClassesFilter from '../search/OnlineClassesFilter';
import Checkbox from '../Checkbox';
import recordEvent from 'platform/monitoring/record-event';
import { ariaLabels, SMALL_SCREEN_WIDTH } from '../../constants';
import AccordionItem from '../AccordionItem';
import BenefitsForm from './BenefitsForm';
import { scroller } from 'react-scroll';
import { getScrollOptions } from 'platform/utilities/ui';

class EstimateYourBenefitsForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      invalidZip: '',
      yourBenefitsExpanded: true,
      aboutYourSchoolExpanded: false,
      learningFormatAndScheduleExpanded: false,
      scholarshipsAndOtherFundingExpanded: false,
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
      this.props.onBeneficiaryZIPCodeChanged(event.value);
      this.isFullZipcode(event.value);
      this.setState({ invalidZip: '' });
    } else if (event.dirty && this.props.inputs.beneficiaryZIP.length < 5) {
      this.setState({ invalidZip: 'Postal code must be a 5-digit number' });
    }
  };

  handleCalculateBenefitsClick = () => {
    const beneficiaryZIPError = this.props.inputs.beneficiaryZIPError;
    const zipcode = this.props.inputs.beneficiaryZIP;

    if (beneficiaryZIPError || zipcode.length !== 5) {
      this.toggleLearningFormatAndSchedule(true);
      setTimeout(() => {
        const CheckNameOfElement = checkForEmptyFocusableElement(
          'beneficiaryZIPCode',
        );
        scroller.scrollTo('zip-question', getScrollOptions());
        CheckNameOfElement[0].focus();
      }, 1);
    } else {
      this.props.updateEstimatedBenefits();
    }
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
    this.props.calculatorInputChange({ field, value });
  };

  handleInputChange = event => {
    const { name: field, value } = event.target;
    const { profile } = this.props;
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

  handleInputFocus = fieldId => {
    const field = document.getElementById(fieldId);
    if (field && window.innerWidth <= SMALL_SCREEN_WIDTH) {
      field.scrollIntoView();
    }
  };

  handleInputFocusByName = name => {
    const elements = document.getElementsByName(name);
    if (elements.length > 0) {
      elements[0].scrollIntoView();
    }
  };

  resetBuyUp = event => {
    event.preventDefault();
    if (this.props.inputs.buyUpAmount > 600) {
      this.props.calculatorInputChange({
        field: 'buyUpAmount',
        value: 600,
      });
    }
  };

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
    this.handleInputFocus('estimate-your-benefits-accordion');
  };

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
    this.handleInputFocus('estimate-your-benefits-accordion');
  };

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

    this.handleInputFocus('estimate-your-benefits-accordion');
  };

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
    this.handleInputFocus('estimate-your-benefits-accordion');
  };

  renderLearnMoreLabel = ({ text, modal, ariaLabel }) => (
    <span>
      {text} (
      <button
        type="button"
        className="va-button-link learn-more-button"
        onClick={this.props.showModal.bind(this, modal)}
        aria-label={ariaLabel || ''}
      >
        Learn more
      </button>
      )
    </span>
  );

  renderInState = () => {
    if (!this.props.displayedInputs.inState) return null;
    return (
      <RadioButtons
        label="Are you an in-state student?"
        name="inState"
        options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
        value={this.props.inputs.inState}
        onChange={this.handleInputChange}
      />
    );
  };

  renderTuition = () => {
    if (!this.props.displayedInputs.tuition) return null;

    const inStateTuitionFeesId = 'inStateTuitionFees';
    const inStateFieldId = `${inStateTuitionFeesId}-fields`;
    const inStateTuitionInput = this.props.inputs.inState === 'no' && (
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
          name={inStateTuitionFeesId}
          id={inStateTuitionFeesId}
          value={formatCurrency(this.props.inputs.inStateTuitionFees)}
          onChange={this.handleInputChange}
          onFocus={this.handleInputFocus.bind(this, inStateFieldId)}
        />
      </div>
    );

    const tuitionFeesId = 'tuitionFees';
    const tuitionFeesFieldId = `${tuitionFeesId}-field`;
    return (
      <div id={tuitionFeesFieldId}>
        {inStateTuitionInput}
        <label htmlFor={tuitionFeesId} className="vads-u-display--inline-block">
          Tuition and fees per year
        </label>
        <button
          type="button"
          className="va-button-link learn-more-button vads-u-margin-left--0p5"
          onClick={this.props.showModal.bind(this, 'calcTuition')}
          aria-label={ariaLabels.learnMore.tuitionFeesPerYear}
        >
          (Learn more)
        </button>
        <input
          type="text"
          name={tuitionFeesId}
          id={tuitionFeesId}
          value={formatCurrency(this.props.inputs.tuitionFees)}
          onChange={this.handleInputChange}
          onFocus={this.handleInputFocus.bind(this, tuitionFeesFieldId)}
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
          type="text"
          name={booksId}
          id={booksId}
          value={formatCurrency(this.props.inputs.books)}
          onChange={this.handleInputChange}
          onFocus={this.handleInputFocus.bind(this, booksFieldId)}
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
      <div>
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
        />
        {this.props.inputs.yellowRibbonRecipient === 'yes' ? (
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
            />
            <div id={yellowRibbonFieldId}>
              <label htmlFor="yellowRibbonContributionAmount">
                Yellow Ribbon amount from school per year
              </label>
              <input
                id="yellowRibbonContributionAmount"
                type="text"
                name="yellowRibbonAmount"
                value={formatCurrency(this.props.inputs.yellowRibbonAmount)}
                onChange={this.handleInputChange}
                onFocus={this.handleInputFocus.bind(this, yellowRibbonFieldId)}
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
        ) : null}
      </div>
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
          type="text"
          name={scholarshipsId}
          id={scholarshipsId}
          value={formatCurrency(this.props.inputs.scholarships)}
          onChange={this.handleInputChange}
          onFocus={this.handleInputFocus.bind(this, scholarshipsFieldId)}
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
          })}
        </label>
        <input
          type="text"
          name={tuitionAssistId}
          id={tuitionAssistId}
          value={formatCurrency(this.props.inputs.tuitionAssist)}
          onChange={this.handleInputChange}
          onFocus={this.handleInputFocus.bind(this, tuitionAssistFieldId)}
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
      <div>
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
        />
      </div>
    );
  };

  renderCalendar = () => {
    if (!this.props.displayedInputs.calendar) return null;

    let dependentDropdowns;

    if (this.props.inputs.calendar === 'nontraditional') {
      dependentDropdowns = (
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
          />
        </div>
      );
    }

    return (
      <div>
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
        />
        {dependentDropdowns}
      </div>
    );
  };

  renderKicker = () => {
    if (!this.props.displayedInputs.kicker) return null;

    let amountInput;

    if (this.props.inputs.kickerEligible === 'yes') {
      const kickerAmountId = 'kickerAmount';
      const kickerFieldId = `${kickerAmountId}-field`;
      amountInput = (
        <div id={kickerFieldId}>
          <label htmlFor={kickerAmountId}>How much is your kicker?</label>
          <input
            type="text"
            name={kickerAmountId}
            id={kickerAmountId}
            value={formatCurrency(this.props.inputs.kickerAmount)}
            onChange={this.handleInputChange}
            onFocus={this.handleInputFocus.bind(this, kickerFieldId)}
          />
        </div>
      );
    }

    return (
      <div>
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
        />
        {amountInput}
      </div>
    );
  };

  renderExtensionBeneficiaryZIP = () => {
    if (!this.props.displayedInputs.beneficiaryLocationQuestion) {
      return null;
    }
    const { profile, inputs, showModal } = this.props;
    const extensions = this.getExtensions();

    let amountInput;
    let internationalCheckbox;
    let extensionSelector;
    let zipcodeLocation;
    let extensionOptions = [];
    const zipcodeRadioOptions = [
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

      zipcodeRadioOptions.push({
        value: 'extension',
        label: 'An extension campus',
      });
    } else {
      zipcodeRadioOptions.push({ value: 'other', label: 'Other location' });
    }

    if (inputs.beneficiaryLocationQuestion === 'extension') {
      extensionSelector = (
        <div>
          <Dropdown
            label="Choose the location where you'll take your classes"
            name="extension"
            alt="Extension Location"
            visible
            options={extensionOptions}
            value={inputs.extension}
            onChange={this.handleExtensionChange}
          />
        </div>
      );
    }

    if (
      inputs.beneficiaryLocationQuestion === 'other' ||
      (inputs.beneficiaryLocationQuestion === 'extension' &&
        inputs.extension === 'other')
    ) {
      const errorMessage = this.state.invalidZip;

      const errorMessageCheck =
        errorMessage !== '' ? errorMessage : inputs.beneficiaryZIPError;

      if (!inputs.classesOutsideUS) {
        const label = this.isCountryInternational()
          ? "If you're taking classes in the U.S., enter the location's postal code"
          : "Please enter the postal code where you'll take your classes";

        amountInput = (
          <div name="zip-question">
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
        <div>
          <Checkbox
            label={
              "I'll be taking classes outside of the U.S. and U.S. territories"
            }
            onChange={this.handleHasClassesOutsideUSChange}
            checked={inputs.classesOutsideUS}
            name={'classesOutsideUS'}
            id={'classesOutsideUS'}
          />
        </div>
      );
    }
    const selectedValue = inputs.beneficiaryLocationQuestion
      ? inputs.beneficiaryLocationQuestion
      : profile.attributes.name;

    return (
      <div>
        <RadioButtons
          label={
            <span>
              {'Where will you take the majority of your classes? '}
              <button
                aria-live="polite"
                aria-atomic="true"
                type="button"
                className="va-button-link learn-more-button"
                onClick={showModal.bind(
                  this,
                  'calcBeneficiaryLocationQuestion',
                )}
              >
                <span className="sr-only">
                  Learn more about the location-based housing allowance
                </span>
                (Learn more)
              </button>
            </span>
          }
          name="beneficiaryLocationQuestion"
          options={zipcodeRadioOptions}
          value={selectedValue}
          onChange={this.handleInputChange}
        />
        {extensionSelector}
        {amountInput}
        {zipcodeLocation}
        {internationalCheckbox}
      </div>
    );
  };

  renderBuyUp = () => {
    if (!this.props.displayedInputs.buyUp) return null;

    let amountInput;

    if (this.props.inputs.buyUp === 'yes') {
      const buyUpAmountId = 'buyUpAmount';
      const buyUpFieldId = `${buyUpAmountId}-field`;
      amountInput = (
        <div id={buyUpFieldId}>
          <label htmlFor={buyUpAmountId}>
            How much did you pay toward buy-up (up to $600)?
          </label>
          <input
            type="text"
            name={buyUpAmountId}
            id={buyUpAmountId}
            value={formatCurrency(this.props.inputs.buyUpAmount)}
            onChange={this.handleInputChange}
            onBlur={this.resetBuyUp}
            onFocus={this.handleInputFocus.bind(this, buyUpFieldId)}
          />
        </div>
      );
    }

    return (
      <div>
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
      </div>
    );
  };

  renderWorking = () => {
    if (!this.props.displayedInputs.working) return null;
    return (
      <div>
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
        />
      </div>
    );
  };

  renderOnlineClasses = () => (
    <OnlineClassesFilter
      onlineClasses={this.props.eligibility.onlineClasses}
      onChange={this.props.eligibilityChange}
      showModal={this.props.showModal}
    />
  );

  renderGbBenefit = () => {
    if (!this.props.displayedInputs?.giBillBenefit) {
      return null;
    }

    return (
      <div>
        <RadioButtons
          label={this.renderLearnMoreLabel({
            text:
              'Did you use your Post-9/11 GI Bill benefits for tuition, housing, or books for a term that started before January 1, 2018?',
            modal: 'whenUsedGiBill',
            ariaLabel: ariaLabels.learnMore.whenUsedGiBill,
          })}
          name="giBillBenefit"
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
          value={this.props.inputs.giBillBenefit}
          onChange={this.handleInputChange}
        />
      </div>
    );
  };

  renderYourBenefits = () => {
    const name = 'Your benefits';
    return (
      <AccordionItem
        button={name}
        id={`eyb-${createId(name)}`}
        section
        expanded={this.state.yourBenefitsExpanded}
        onClick={this.toggleYourBenefits}
      >
        <form>
          <BenefitsForm
            eligibilityChange={this.props.eligibilityChange}
            {...this.props.eligibility}
            hideModal={this.props.hideModal}
            showModal={this.props.showModal}
            inputs={this.props.inputs}
            displayedInputs={this.props.displayedInputs}
            onInputChange={this.props.calculatorInputChange}
          >
            {this.renderGbBenefit()}
          </BenefitsForm>
        </form>
      </AccordionItem>
    );
  };

  renderAboutYourSchool = () => {
    const {
      inState,
      tuition,
      books,
      calendar,
      enrolled,
      enrolledOld,
    } = this.props.displayedInputs;

    if (!(inState || tuition || books || calendar || enrolled || enrolledOld))
      return null;

    const name = 'About your school';

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
      </AccordionItem>
    );
  };

  renderLearningFormatAndSchedule = () => {
    const name = 'Learning format and schedule';
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
      </AccordionItem>
    );
  };

  renderScholarshipsAndOtherFunding = () => {
    const {
      yellowRibbon,
      tuitionAssist,
      kicker,
      buyUp,
      scholarships,
    } = this.props.displayedInputs;
    if (!(yellowRibbon || tuitionAssist || kicker || buyUp || scholarships))
      return null;
    const name = 'Scholarships and other funding';
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
      </AccordionItem>
    );
  };

  render() {
    return (
      <div className="usa-width-one-eigth medium-5 columns">
        <p>Use the fields below to calculate your benefits:</p>
        <ul className="eyb-inputs-ul vads-u-padding--0">
          {this.renderYourBenefits()}
          {this.renderAboutYourSchool()}
          {this.renderLearningFormatAndSchedule()}
          {this.renderScholarshipsAndOtherFunding()}
        </ul>
        <button
          className="calculate-button"
          onClick={this.handleCalculateBenefitsClick}
        >
          Calculate benefits
        </button>
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
};

export default EstimateYourBenefitsForm;
