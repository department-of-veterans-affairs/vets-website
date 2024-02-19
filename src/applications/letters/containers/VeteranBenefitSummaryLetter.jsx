/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';
import CallVBACenter from '@department-of-veterans-affairs/platform-static-data/CallVBACenter';
import { formatDateShort } from 'platform/utilities/date';

import { updateBenefitSummaryRequestOption as updateBenefitSummaryRequestOptionAction } from '../actions/letters';
import {
  benefitOptionsMap,
  characterOfServiceContent,
  optionsToAlwaysDisplay,
  getBenefitOptionText,
  stripOffTime,
} from '../utils/helpers';

/* eslint jsx-a11y/label-has-associated-control: 1 */
export class VeteranBenefitSummaryLetter extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(domEvent) {
    const { updateBenefitSummaryRequestOption } = this.props;
    recordEvent({
      // For Google Analytics
      event: 'letter-benefit-option-clicked',
      'letter-benefit-option': domEvent.target.id,
      'letter-benefit-option-status': domEvent.target.checked
        ? 'checked'
        : 'unchecked',
    });
    updateBenefitSummaryRequestOption(
      benefitOptionsMap[domEvent.target.id],
      domEvent.target.checked,
    );
  }

  render() {
    const {
      benefitSummaryOptions,
      requestOptions,
      isVeteran,
      optionsAvailable,
    } = this.props;
    const { benefitInfo, serviceInfo } = benefitSummaryOptions;
    const { militaryService } = requestOptions;
    const militaryServiceRows = (serviceInfo || []).map((service, index) => (
      <va-table-row key={`service${index}`}>
        <span className="service-info">
          {(service.branch || '').toLowerCase()}
        </span>
        <span className="service-info">
          {
            characterOfServiceContent[
              (service.characterOfService || '').toLowerCase()
            ]
          }
        </span>
        <span>{formatDateShort(stripOffTime(service.enteredDate))}</span>
        <span>{formatDateShort(stripOffTime(service.releasedDate))}</span>
      </va-table-row>
    ));

    const vaBenefitInfoItems = [];
    Object.keys(benefitInfo).forEach(key => {
      // Need to verify with EVSS and vets-api: values should be true, false, or
      // some value other than null or undefined, so this check should not be
      // necessary, or should log a Sentry error.
      if (benefitInfo[key] === null) {
        return;
      }
      // For some options, the customization checkbox is only displayed
      // if the benefit information value is not false. For others, the
      // customization checkbox is always displayed.
      const value = benefitInfo[key];
      const displayOption =
        optionsToAlwaysDisplay.includes(key) || value !== false;
      const optionText = getBenefitOptionText(
        key,
        value,
        isVeteran,
        // LH_MIGRATION Change this to awardEffectiveDateTime when migration is final
        benefitInfo.awardEffectiveDate,
      );
      if (optionText && displayOption) {
        vaBenefitInfoItems.push(
          <li key={`option${key}`} className="form-checkbox">
            <input
              checked={requestOptions[benefitOptionsMap[key]]}
              id={key}
              name={key}
              type="checkbox"
              onChange={this.handleChange}
            />
            <label htmlFor={key}>{optionText}</label>
          </li>,
        );
      }
    });

    const vaBenefitInformation = vaBenefitInfoItems.length ? (
      <ul className="usa-unstyled-list" id="benefitInfoList">
        {vaBenefitInfoItems}
      </ul>
    ) : null;

    let benefitSummaryContent;
    if (optionsAvailable) {
      benefitSummaryContent = (
        <div>
          <h3 className="vads-u-font-size--h4">
            Choose the information you want to include.
          </h3>
          {militaryServiceRows.length ? (
            <>
              <h4 className="vads-u-font-size--h2">
                Military service information
              </h4>
              <p>
                Our records show the 3 most recent service periods. There may be
                additional service periods not shown here.
              </p>
              <div className="form-checkbox">
                <input
                  checked={militaryService}
                  id="militaryService"
                  name="militaryService"
                  type="checkbox"
                  onChange={this.handleChange}
                />
                <label name="militaryService-label" htmlFor="militaryService">
                  Include military service information
                </label>
              </div>
              <va-table id="militaryServiceTable">
                <va-table-row slot="headers">
                  <span>Branch of service</span>
                  <span>Discharge type</span>
                  <span>Active duty start</span>
                  <span>Separation date</span>
                </va-table-row>
                {militaryServiceRows}
              </va-table>
            </>
          ) : null}
          <h4 className="vads-u-font-size--h2">
            VA benefit and disability information
          </h4>
          <fieldset>
            <legend className="vads-u-font-size--base vads-u-font-weight--normal">
              Please choose what information you want to include in your letter
            </legend>
            {vaBenefitInformation}
          </fieldset>
        </div>
      );
    } else {
      benefitSummaryContent = (
        <div className="feature">
          <h4>Your VA Benefit Summary letter is currently unavailable</h4>
          <div>
            We weren’t able to retrieve your VA Benefit Summary letter. Please{' '}
            <CallVBACenter />
          </div>
        </div>
      );
    }

    return (
      <div>
        <p>
          This letter shows your service history and some VA benefits
          information. You can customize this letter and use it for many things,
          including to apply for housing assistance, civil service jobs, and
          state or local property and car tax relief.
        </p>
        {benefitSummaryContent}
      </div>
    );
  }
}

VeteranBenefitSummaryLetter.propTypes = {
  benefitSummaryOptions: PropTypes.shape({
    benefitInfo: PropTypes.shape({
      awardEffectiveDate: PropTypes.string,
    }),
    serviceInfo: PropTypes.array,
  }),
  isVeteran: PropTypes.bool,
  optionsAvailable: PropTypes.bool,
  requestOptions: PropTypes.shape({
    militaryService: PropTypes.bool,
  }),
  updateBenefitSummaryRequestOption: PropTypes.func,
};

function mapStateToProps(state) {
  const letterState = state.letters;

  return {
    benefitSummaryOptions: {
      benefitInfo: letterState.benefitInfo,
      serviceInfo: letterState.serviceInfo,
    },
    // default isVeteran to true for now - please see vets.gov-team issue #6250
    // isVeteran: (state.user.profile.veteranStatus.status === 'OK' ? state.user.profile.veteranStatus.isVeteran : true),
    isVeteran: true,
    optionsAvailable: letterState.optionsAvailable,
    requestOptions: letterState.requestOptions,
  };
}

const mapDispatchToProps = {
  updateBenefitSummaryRequestOption: updateBenefitSummaryRequestOptionAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VeteranBenefitSummaryLetter);
