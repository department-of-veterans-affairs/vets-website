import React from 'react';

export default class BenefitsHistoryReview extends React.Component {
  render() {
    return (
      <table className="review usa-table-borderless">
        <tbody>
          <tr>
            <td>I am receiving benefits from the US Government as a civilian employee for the same term I am seeking benefits from the VA:</td>
            <td>{this.props.data.civilianBenefitsAssistance ? 'Yes' : 'No'}</td>
          </tr>
          <tr>
            <td>I made contributions (up to $600.00) to increase the amount of my monthly benefits:</td>
            <td>{this.props.data.additionalContributions ? 'Yes' : 'No'}</td>
          </tr>
          <tr>
            <td>I qualify for an Active Duty Kicker (sometimes called a 'college fund'):</td>
            <td>{this.props.data.activeDutyKicker ? 'Yes' : 'No'}</td>
          </tr>
          <tr>
            <td>I qualify for a Reserve Kicker (sometimes called a 'college fund'):</td>
            <td>{this.props.data.reserveKicker ? 'Yes' : 'No'}</td>
          </tr>
          <tr>
            <td>Do you have a period of active duty that the department of defense counts for purposes of repaying an education loan?</td>
            <td>{this.props.data.activeDutyRepaying.value === 'Y' ? 'Yes' : 'No'}</td>
          </tr>
        </tbody>
        {this.props.data.activeDutyRepaying.value === 'Y'
          ? <tbody>
            <tr>
              <td>Start date:</td>
              <td>{this.props.data.activeDutyRepayingPeriod.fromDate.month.value ? `${this.props.data.activeDutyRepayingPeriod.fromDate.month.value}/${this.props.data.activeDutyRepayingPeriod.fromDate.day.value}/${this.props.data.activeDutyRepayingPeriod.fromDate.year.value}` : null}</td>
            </tr>
            <tr>
              <td>End date:</td>
              <td>{this.props.data.activeDutyRepayingPeriod.toDate.month.value ? `${this.props.data.activeDutyRepayingPeriod.toDate.month.value}/${this.props.data.activeDutyRepayingPeriod.toDate.day.value}/${this.props.data.activeDutyRepayingPeriod.toDate.year.value}` : null}</td>
            </tr>
          </tbody>
          : null}
      </table>
    );
  }
}

BenefitsHistoryReview.propTypes = {
  data: React.PropTypes.object.isRequired
};
