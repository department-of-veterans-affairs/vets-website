import React from 'react';

import { getLabel, showSomeoneElseServiceQuestion } from '../../utils/helpers';
import { claimTypes } from '../../utils/options-for-select';

export default class PreviousClaimsReview extends React.Component {
  render() {
    return (
      <div>{this.props.data.previousVaClaims.map((claim, index) => {
        return (<table key={index} className="review usa-table-borderless">
          <thead>
            <tr>
              <td scope="col">Claim - {getLabel(claimTypes, claim.claimType.value)}</td>
              <td scope="col"></td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>File number:</td>
              <td>{claim.fileNumber.value}</td>
            </tr>
            {showSomeoneElseServiceQuestion(claim.claimType.value)
              ? <tr>
                <td>Was this claim for education benefits filed using someone else's service?</td>
                <td>{claim.previouslyAppliedWithSomeoneElsesService.value === 'Y' ? 'Yes' : 'No'}</td>
              </tr>
              : null}
          </tbody>
          {showSomeoneElseServiceQuestion(claim.claimType.value)
            && claim.previouslyAppliedWithSomeoneElsesService.value === 'Y'
              ? <tbody>
                <tr>
                  <td>Name:</td>
                  <td>{claim.sponsorVeteran.fullName.first.value} {claim.sponsorVeteran.fullName.middle.value} {claim.sponsorVeteran.fullName.last.value} {claim.sponsorVeteran.fullName.suffix.value}</td>
                </tr>
                <tr>
                  <td>File number:</td>
                  <td>{claim.sponsorVeteran.fileNumber.value}</td>
                </tr>
                <tr>
                  <td>Payee number:</td>
                  <td>{claim.sponsorVeteran.payeeNumber.value}</td>
                </tr>
              </tbody>
              : null}
        </table>
        );
      })}
      </div>
    );
  }
}

PreviousClaimsReview.propTypes = {
  data: React.PropTypes.object.isRequired
};
