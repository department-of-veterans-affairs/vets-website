import React from 'react';
import { connect } from 'react-redux';

import _ from 'lodash';

import { veteranBenefitSummaryOptionText } from '../utils/helpers';
import { updateBenefitSummaryOption } from '../actions/letters';

class VeteranBenefitSummaryLetter extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(domEvent) {
    this.props.updateBenefitSummaryOption(domEvent.target.id, domEvent.target.checked);
  }

  render() {
    const benefitInfo = this.props.benefitSummaryOptions.benefitInfo;
    const optionsToInclude = this.props.optionsToInclude;
    let militaryServiceInfo;
    let vaBenefitInformation;
    let vaBenefitInfoRows = [];

    _.forIn(benefitInfo, (value, key) => {
      const optionText = veteranBenefitSummaryOptionText(key, value);

      // There are 2 conditions this is checking for
      // 1. If the current benefit is not in the option text list from helpers,
      // it means this benefit is not for veterans, and therefore it shouldn't
      // be displayed.
      // 2. If the value of the current benefit is false, we don't want to
      // display it. Values can be either true, false, or some other value,
      // which is why we're checking that it's not false.
      if (optionText && value !== false) {
        vaBenefitInfoRows.push(
          <tr key={`option${key}`}>
            <th scope="row">
              <input
                  aria-labelledby={`${key}Label`}
                  autoComplete="false"
                  checked={optionsToInclude[key]}
                  id={key}
                  name={key}
                  type="checkbox"
                  onChange={this.handleChange}/>
            </th>
            <td><label id={`${key}Label`}>{veteranBenefitSummaryOptionText(key, value)}</label></td>
          </tr>
        );
      }
    });

    if (this.props.optionsAvailable) {
      vaBenefitInformation = (
        <table className="usa-table-borderless">
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
        <h2>Military Service Information</h2>
        <p>
          The 3 most recent periods of service are available to show in your letter. Select whether or not you want them included.
        </p>

        {militaryServiceInfo}
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
    optionsToInclude: letterState.optionsToInclude
  };
}

const mapDispatchToProps = {
  updateBenefitSummaryOption
};

export default connect(mapStateToProps, mapDispatchToProps)(VeteranBenefitSummaryLetter);
