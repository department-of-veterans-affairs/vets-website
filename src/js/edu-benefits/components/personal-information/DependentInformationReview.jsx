import React from 'react';

export default class DependentInformationReview extends React.Component {
  render() {
    return (
      <table className="review usa-table-borderless">
        <tbody>
          <tr>
            <td>Are you married?</td>
            <td>{this.props.data.serviceBefore1977.married.value === 'Y' ? 'Yes' : 'No'}</td>
          </tr>
          <tr>
            <td>Do you have any children who are under age 18, or over age 18 but under 23, not married and attending school, or of any age permanently disabled for mental or physical reasons?</td>
            <td>{this.props.data.serviceBefore1977.haveDependents.value === 'Y' ? 'Yes' : 'No'}</td>
          </tr>
          <tr>
            <td>Do you have a parent who is dependent upon your financial support?</td>
            <td>{this.props.data.serviceBefore1977.parentDependent.value === 'Y' ? 'Yes' : 'No'}</td>
          </tr>
        </tbody>
      </table>
    );
  }
}

DependentInformationReview.propTypes = {
  data: React.PropTypes.object.isRequired
};
