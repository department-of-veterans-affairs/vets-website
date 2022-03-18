/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import recordEvent from 'platform/monitoring/record-event';
import { formatDateShort } from 'platform/utilities/date';
import CallVBACenter from 'platform/static-data/CallVBACenter';

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
      <tr key={`service${index}`}>
        <th scope="row" className="service-info">
          {(service.branch || '').toLowerCase()}
        </th>
        <td className="service-info">
          {
            characterOfServiceContent[
              (service.characterOfService || '').toLowerCase()
            ]
          }
        </td>
        <td>{formatDateShort(stripOffTime(service.enteredDate))}</td>
        <td>{formatDateShort(stripOffTime(service.releasedDate))}</td>
      </tr>
    ));

    const vaBenefitInfoRows = [];
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
        benefitInfo.awardEffectiveDate,
      );
      if (optionText && displayOption) {
        vaBenefitInfoRows.push(
          <tr key={`option${key}`}>
            <th scope="row">
              <input
                aria-labelledby={`${key}Label`}
                checked={requestOptions[benefitOptionsMap[key]]}
                id={key}
                name={key}
                type="checkbox"
                onChange={this.handleChange}
              />
              <label htmlFor={key}>
                <div className="sr-only">{optionText}</div>
              </label>
            </th>
            <td>
              <div id={`${key}Label`}>{optionText}</div>
            </td>
          </tr>,
        );
      }
    });

    const vaBenefitInformation = vaBenefitInfoRows.length ? (
      <table id="benefitInfoTable">
        <thead>
          <tr>
            <th scope="col">Include</th>
            <th scope="col">Statement</th>
          </tr>
        </thead>
        <tbody>{vaBenefitInfoRows}</tbody>
      </table>
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
              <table id="militaryServiceTable">
                <thead>
                  <tr>
                    <th scope="col">Branch of service</th>
                    <th scope="col">Discharge type</th>
                    <th scope="col">Active duty start</th>
                    <th scope="col">Separation date</th>
                  </tr>
                </thead>
                <tbody>{militaryServiceRows}</tbody>
              </table>
            </>
          ) : null}
          <h4 className="vads-u-font-size--h2">
            VA benefit and disability information
          </h4>
          <p>
            Please choose what information you want to include in your letter.
          </p>
          {vaBenefitInformation}
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
    benefitInfo: PropTypes.shape({}),
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
