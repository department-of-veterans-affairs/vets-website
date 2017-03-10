import React from 'react';
import { displayDateIfValid } from '../../../utils/helpers';

export default class ContributionsReview extends React.Component {
  render() {
    const { from, to } = this.props.data.activeDutyRepayingPeriod;
    return (
      <table className="review usa-table-borderless">
        <tbody>
          <tr>
            <td>I am receiving benefits from the U.S. government as a civilian employee during the same time as I am seeking benefits from VA.</td>
            <td>{this.props.data.civilianBenefitsAssistance ? 'Yes' : 'No'}</td>
          </tr>
          <tr>
            <td>I made contributions (up to $600) to increase the amount of my monthly benefits.</td>
            <td>{this.props.data.additionalContributions ? 'Yes' : 'No'}</td>
          </tr>
          <tr>
            <td>I qualify for an Active Duty Kicker (sometimes called a college fund).</td>
            <td>{this.props.data.activeDutyKicker ? 'Yes' : 'No'}</td>
          </tr>
          <tr>
            <td>I qualify for a Reserve Kicker (sometimes called a college fund).</td>
            <td>{this.props.data.reserveKicker ? 'Yes' : 'No'}</td>
          </tr>
          <tr>
            <td>I have a period of service that the Department of Defense counts toward an education loan payment.</td>
            <td>{this.props.data.activeDutyRepaying ? 'Yes' : 'No'}</td>
          </tr>
        </tbody>
        {this.props.data.activeDutyRepaying
          ? <tbody>
            <tr>
              <td>Start date:</td>
              <td>{displayDateIfValid(from)}</td>
            </tr>
            <tr>
              <td>End date:</td>
              <td>{displayDateIfValid(to)}</td>
            </tr>
          </tbody>
          : null}
      </table>
    );
  }
}

ContributionsReview.propTypes = {
  data: React.PropTypes.object.isRequired
};
