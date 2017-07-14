import React from 'react';
import { connect } from 'react-redux';

import { updateBenefitSummaryRequestOption } from '../actions/letters';
import {
  benefitOptionsMap,
  characterOfServiceContent,
  optionsToAlwaysDisplay,
  getBenefitOptionText
} from '../utils/helpers';
import { formatDateShort } from '../../common/utils/helpers';

export class VeteranBenefitSummaryLetter extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(domEvent) {
    window.dataLayer.push({
      event: 'letter-benefit-option-clicked',
      'letter-benefit-option': domEvent.target.id,
      'letter-benefit-option-status': domEvent.target.checked ? 'checked' : 'unchecked'
    });
    this.props.updateBenefitSummaryRequestOption(
      benefitOptionsMap[domEvent.target.id],
      domEvent.target.checked);
  }

  render() {
    const serviceInfo = this.props.benefitSummaryOptions.serviceInfo || [];
    const militaryServiceRows = serviceInfo.map((service, index) => {
      return (
        <tr key={`service${index}`}>
          <th scope="row" className="service-info">{(service.branch || '').toLowerCase()}</th>
          <td className="service-info">
            {characterOfServiceContent[(service.characterOfService).toLowerCase()]}
          </td>
          <td>{formatDateShort(service.enteredDate)}</td>
          <td>{formatDateShort(service.releasedDate)}</td>
        </tr>
      );
    });

    const benefitInfo = this.props.benefitSummaryOptions.benefitInfo;
    const requestOptions = this.props.requestOptions;
    let vaBenefitInformation;
    let vaBenefitInfoRows = [];

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
      const displayOption = optionsToAlwaysDisplay.includes(key) || value !== false;
      // TODO: find out if there is anything in the profile or from EVSS that can tell
      // us whether the user is a veteran or a user. For now we just pass in
      // true for the isVeteran parameter
      const optionText = getBenefitOptionText(key, value, true);
      if (optionText && displayOption) {
        vaBenefitInfoRows.push(
          <tr key={`option${key}`}>
            <th scope="row">
              <input
                  aria-labelledby={`${key}Label`}
                  autoComplete="false"
                  checked={requestOptions[benefitOptionsMap[key]]}
                  id={key}
                  name={key}
                  type="checkbox"
                  onChange={this.handleChange}/>
            </th>
            <td><label id={`${key}Label`}>{optionText}</label></td>
          </tr>
        );
      }
    });

    if (this.props.optionsAvailable) {
      vaBenefitInformation = (
        <table className="usa-table-borderless" id="benefitInfoTable">
          <thead>
            <tr>
              <th scope="col">Include</th>
              <th scope="col">Statement</th>
            </tr>
          </thead>
          <tbody>
            {vaBenefitInfoRows}
          </tbody>
        </table>
      );
    } else {
      vaBenefitInformation = (
        <div className="feature">
          <h4>Your VA Benefit Summary letter is currently unavailable</h4>
          <div>We weren't able to retrieve your VA Benefit Summary letter. Please call 1-855-574-7286 between Monday‒Friday, 8:00 a.m.‒8:00 p.m. (ET).</div>
        </div>
      );
    }

    return (
      <div>
        <p>
          This letter shows the benefits you're receiving from VA,
          your military service history, and statements regarding your disability status. You can choose
          what information you want to include in your letter.
        </p>
        <h2>Choose the information you want to include.</h2>
        <p>
          The 3 most recent periods of service are available to show in your letter. Select whether or not you want them included.
        </p>
        <h2>Military Service Information</h2>
        <div className="form-checkbox">
          <input
              autoComplete="false"
              checked={requestOptions.militaryService}
              id="militaryService"
              name="militaryService"
              type="checkbox"
              onChange={this.handleChange}/>
          <label
              className="schemaform-label"
              name="militaryService-label"
              htmlFor="militaryService">
            Include all periods of service
          </label>
        </div>
        <table className="usa-table-borderless" id="militaryServiceTable">
          <thead>
            <tr>
              <th scope="col">Branch of Service</th>
              <th scope="col">Discharge Type</th>
              <th scope="col">Began Active Duty</th>
              <th scope="col">Separated</th>
            </tr>
          </thead>
          <tbody>
            {militaryServiceRows}
          </tbody>
        </table>
        <h2>VA Benefit Information</h2>
        <p>
          Select which statements you want to include in your letter.
        </p>
        {vaBenefitInformation}
        <p>
          If you see incorrect information for service periods or disability status,
          please send a question using VA's <a target="_blank" href="https://iris.custhelp.com/app/ask">Inquiry Routing & Information
          System (IRIS)</a>. You should expect a response from VA in 5 business days.
        </p>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const letterState = state.letters;
  return {
    benefitSummaryOptions: {
      benefitInfo: letterState.benefitInfo,
      serviceInfo: letterState.serviceInfo
    },
    optionsAvailable: letterState.optionsAvailable,
    requestOptions: letterState.requestOptions
  };
}

const mapDispatchToProps = {
  updateBenefitSummaryRequestOption
};

export default connect(mapStateToProps, mapDispatchToProps)(VeteranBenefitSummaryLetter);
