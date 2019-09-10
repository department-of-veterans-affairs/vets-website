import PropTypes from 'prop-types';
import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

import Dropdown from '../Dropdown';
import RadioButtons from '../RadioButtons';
import { formatCurrency } from '../../utils/helpers';
import ErrorableTextInput from '@department-of-veterans-affairs/formation-react/ErrorableTextInput';
import environment from 'platform/utilities/environment';
import OnlineClassesFilter from '../search/OnlineClassesFilter';

class CalculatorForm extends React.Component {
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

  createExtensionOption = extension => {
    const {
      facilityCode,
      physicalCity,
      physicalState,
      physicalZip,
      institution,
    } = extension;
    const extensionOption = {
      value: `${facilityCode}-${physicalZip}`,
      label: institution,
    };

    if (physicalCity && physicalState) {
      extensionOption.label = `${
        extensionOption.label
      } (${physicalCity}, ${physicalState})`;
    } else if (physicalCity) {
      extensionOption.label = `${extensionOption.label} (${physicalCity})`;
    } else if (physicalState) {
      extensionOption.label = `${extensionOption.label} (${physicalState})`;
    }
    return extensionOption;
  };

  handleBeneficiaryZIPCodeChanged = event => {
    if (!event.dirty) {
      this.props.onBeneficiaryZIPCodeChanged(event.value);
    }
  };

  handleExtensionChange = event => {
    const value = event.target.value;
    const zipCode = value.slice(value.indexOf('-') + 1);
    if (!event.dirty) {
      if (event.target.value !== 'other') {
        this.props.onBeneficiaryZIPCodeChanged(zipCode);
      } else {
        this.props.onBeneficiaryZIPCodeChanged('');
      }
      this.handleInputChange(event);
    }
  };

  handleInputChange = event => {
    const { name: field, value } = event.target;
    this.props.onInputChange({ field, value });
  };

  resetBuyUp = event => {
    event.preventDefault();
    if (this.props.inputs.buyUpAmount > 600) {
      this.props.onInputChange({
        field: 'buyUpAmount',
        value: 600,
      });
    }
  };

  renderLearnMoreLabel = ({ text, modal }) => (
    <span>
      {text} (
      <button
        type="button"
        className="va-button-link learn-more-button"
        onClick={this.props.onShowModal.bind(this, modal)}
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

  renderGbBenefit = () => {
    if (!this.props.displayedInputs.giBillBenefit) {
      return null;
    }
    return (
      <div>
        <RadioButtons
          label={this.renderLearnMoreLabel({
            text:
              'Did you use your Post-9/11 GI Bill benefits for tuition, housing, or books for a term that started before January 1, 2018?',
            modal: 'whenUsedGiBill',
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

  renderTuition = () => {
    if (!this.props.displayedInputs.tuition) return null;

    const inStateTuitionFeesId = 'inStateTuitionFees';
    const inStateTuitionInput = this.props.inputs.inState === 'no' && (
      <div>
        <label htmlFor={inStateTuitionFeesId}>
          {this.renderLearnMoreLabel({
            text: 'In-state tuition and fees per year',
            modal: 'calcInStateTuition',
          })}
        </label>
        <input
          type="text"
          name={inStateTuitionFeesId}
          id={inStateTuitionFeesId}
          value={formatCurrency(this.props.inputs.inStateTuitionFees)}
          onChange={this.handleInputChange}
        />
      </div>
    );

    const tuitionFeesId = 'tuitionFees';
    return (
      <div>
        <label htmlFor={tuitionFeesId} className="vads-u-display--inline-block">
          Tuition and fees per year
        </label>
        <button
          type="button"
          className="va-button-link learn-more-button vads-u-margin-left--0p5"
          onClick={this.props.onShowModal.bind(this, 'calcTuition')}
        >
          (Learn more)
        </button>
        <input
          type="text"
          name={tuitionFeesId}
          id={tuitionFeesId}
          value={formatCurrency(this.props.inputs.tuitionFees)}
          onChange={this.handleInputChange}
        />
        {inStateTuitionInput}
      </div>
    );
  };

  renderBooks = () => {
    if (!this.props.displayedInputs.books) return null;
    const booksId = 'books';
    return (
      <div>
        <label htmlFor={booksId}>Books and supplies per year</label>
        <input
          type="text"
          name={booksId}
          id={booksId}
          value={formatCurrency(this.props.inputs.books)}
          onChange={this.handleInputChange}
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

    return (
      <div>
        <RadioButtons
          label={this.renderLearnMoreLabel({
            text: 'Will you be a Yellow Ribbon recipient?',
            modal: 'calcYr',
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
            <div>
              <label htmlFor="yellowRibbonContributionAmount">
                Yellow Ribbon amount from school per year
              </label>
              <input
                id="yellowRibbonContributionAmount"
                type="text"
                name="yellowRibbonAmount"
                value={formatCurrency(this.props.inputs.yellowRibbonAmount)}
                onChange={this.handleInputChange}
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
    return (
      <div>
        <label htmlFor={scholarshipsId}>
          {this.renderLearnMoreLabel({
            text: 'Scholarships (excluding Pell)',
            modal: 'calcScholarships',
          })}
        </label>
        <input
          type="text"
          name={scholarshipsId}
          id={scholarshipsId}
          value={formatCurrency(this.props.inputs.scholarships)}
          onChange={this.handleInputChange}
        />
      </div>
    );
  };

  renderTuitionAssist = () => {
    if (!this.props.displayedInputs.tuitionAssist) return null;
    const tuitionAssistId = 'tuitionAssist';
    return (
      <div>
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
      amountInput = (
        <div>
          <label htmlFor={kickerAmountId}>How much is your kicker?</label>
          <input
            type="text"
            name={kickerAmountId}
            id={kickerAmountId}
            value={formatCurrency(this.props.inputs.kickerAmount)}
            onChange={this.handleInputChange}
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

  renderBeneficiaryZIP = () => {
    if (!this.props.displayedInputs.beneficiaryLocationQuestion) {
      return null;
    }

    if (!environment.isProduction()) {
      return this.renderExtensionBeneficiaryZIP();
    }

    let amountInput;

    if (this.props.inputs.beneficiaryLocationQuestion === 'no') {
      amountInput = (
        <div>
          <ErrorableTextInput
            errorMessage={this.props.inputs.beneficiaryZIPError}
            label={
              <span>
                At what ZIP Code will you be taking the majority of classes?
              </span>
            }
            name="beneficiaryZIPCode"
            field={{ value: this.props.inputs.beneficiaryZIP }}
            onValueChange={this.handleBeneficiaryZIPCodeChanged}
          />
        </div>
      );
    }

    return (
      <div>
        <RadioButtons
          label={this.renderLearnMoreLabel({
            text: 'Will the majority of your classes be on the main campus?',
            modal: 'calcBeneficiaryLocationQuestion',
          })}
          name="beneficiaryLocationQuestion"
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
          value={this.props.inputs.beneficiaryLocationQuestion}
          onChange={this.handleInputChange}
        />
        {amountInput}
      </div>
    );
  };

  renderExtensionBeneficiaryZIP = () => {
    const { profile, inputs, onShowModal } = this.props;
    const extensions = this.getExtensions();

    let amountInput;
    let extensionSelector;
    let extensionOptions = [];
    const zipcodeRadioOptions = [
      {
        value: 'yes',
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
      amountInput = (
        <div>
          <ErrorableTextInput
            errorMessage={inputs.beneficiaryZIPError}
            label="Please enter the Postal code where you'll take your classes"
            name="beneficiaryZIPCode"
            field={{ value: inputs.beneficiaryZIP }}
            onValueChange={this.handleBeneficiaryZIPCodeChanged}
            charMax={5}
          />
          <p>
            <strong>{inputs.housingAllowanceCity}</strong>
          </p>
        </div>
      );
    }

    return (
      <div>
        <RadioButtons
          label={
            <span>
              {'Where will you take the majority of your classes? '}
              <button
                type="button"
                className="va-button-link learn-more-button"
                onClick={onShowModal.bind(
                  this,
                  'calcBeneficiaryLocationQuestion',
                )}
              >
                (Learn more)
              </button>
            </span>
          }
          name="beneficiaryLocationQuestion"
          options={zipcodeRadioOptions}
          value={inputs.beneficiaryLocationQuestion}
          onChange={this.handleInputChange}
        />
        {extensionSelector}
        {amountInput}
      </div>
    );
  };

  renderBuyUp = () => {
    if (!this.props.displayedInputs.buyUp) return null;

    let amountInput;

    if (this.props.inputs.buyUp === 'yes') {
      const buyUpAmountId = 'buyUpAmount';
      amountInput = (
        <div>
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
      showModal={this.props.onShowModal}
    />
  );

  render() {
    if (!this.props.displayedInputs) return null;
    if (environment.isProduction()) {
      return (
        <div className="calculator-form">
          {this.renderInState()}
          {this.renderTuition()}
          {this.renderBooks()}
          {this.renderYellowRibbon()}
          {this.renderScholarships()}
          {this.renderTuitionAssist()}
          {this.renderEnrolled()}
          {this.renderCalendar()}
          {this.renderKicker()}
          {this.renderGbBenefit()}
          {this.renderBeneficiaryZIP()}
          {this.renderBuyUp()}
          {this.renderWorking()}
        </div>
      );
    }
    return (
      <div className="calculator-form">
        {this.renderInState()}
        {this.renderTuition()}
        {this.renderBooks()}
        {this.renderYellowRibbon()}
        {this.renderScholarships()}
        {this.renderTuitionAssist()}
        {this.renderEnrolled()}
        {this.renderCalendar()}
        {this.renderOnlineClasses()}
        {this.renderBeneficiaryZIP()}
        {this.renderKicker()}
        {this.renderGbBenefit()}
        {this.renderBuyUp()}
        {this.renderWorking()}
      </div>
    );
  }
}

CalculatorForm.propTypes = {
  inputs: PropTypes.object,
  displayedInputs: PropTypes.object,
  onShowModal: PropTypes.func,
  onInputChange: PropTypes.func,
  profile: PropTypes.object,
};

export default CalculatorForm;
