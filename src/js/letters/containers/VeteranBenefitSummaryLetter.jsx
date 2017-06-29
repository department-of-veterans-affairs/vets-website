import React from 'react';
import { connect } from 'react-redux';

import _ from 'lodash';

import { veteranBenefitSummaryOptionText } from '../utils/helpers';
import { updateBenefitSummaryOptionsStatus } from '../actions/letters';

class VeteranBenefitSummaryLetter extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(domEvent) {
    this.props.updateBenefitSummaryOptionsStatus(domEvent.target.id, domEvent.target.checked);
  }

  render() {
    const benefitInfo = this.props.benefitSummaryOptions.benefitInfo;
    const optionsToInclude = this.props.optionsToInclude;
    let militaryServiceInfo;
    let vaBenefitInfoRows = [];

    _.forIn(benefitInfo, (value, key) => {
      const optionText = veteranBenefitSummaryOptionText(benefitInfo, key);

      // There are 2 conditions this is checking for
      // 1. If the current benefit is not in the option text list from helpers,
      // it means this benefit is not for veterans, and therefore it shouldn't
      // be displayed.
      // 2. If the value of the current benefit is false, we don't want to
      // display it.
      if (optionText && value !== false) {
        vaBenefitInfoRows.push(
          <tr key={`option${key}`}>
            <th scope="row">
              <input
                  autoComplete="false"
                  checked={optionsToInclude[key]}
                  id={key}
                  name={key}
                  type="checkbox"
                  onChange={this.handleChange}/>
            </th>
            <td>{veteranBenefitSummaryOptionText(benefitInfo, key)}</td>
          </tr>
        );
      }
    });

    return (
      <div>
        <p>
          This letter shows what benefits you're receiving from the VA,
          military service and disability status. Below, you can choose
          if you want military service and disability stauts to be included.
        </p>
        <h2>Choose the information you want to include.</h2>
        <p>
          Our system shows the most recent periods of service. There may be later
          periods of service that aren't displayed here.
        </p>
        <p>
          <strong>Please note:</strong>This letter can only show up to the 3 most
          recent periods of service.
        </p>
        <h2>Military Service Information</h2>
        {militaryServiceInfo}
        <h2>VA Benefit Information</h2>
        <table className="usa-table-borderless">
          <thead>
            <tr>
              <th scope="col">Include</th>
              <th scope="col">Something</th>
            </tr>
          </thead>
          <tbody>
            {vaBenefitInfoRows}
          </tbody>
        </table>
        <p>
          If you see incorrect information for service periods or disability status,
          please send a question using VA's <a href="/">Inquiry Routing & Information
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
  updateBenefitSummaryOptionsStatus
};

export default connect(mapStateToProps, mapDispatchToProps)(VeteranBenefitSummaryLetter);
