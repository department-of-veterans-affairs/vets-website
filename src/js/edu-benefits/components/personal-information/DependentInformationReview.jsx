import React from 'react';
import { showYesNo } from '../../utils/helpers';

export default class DependentInformationReview extends React.Component {
  render() {
    return (
      <table className="review usa-table-borderless">
        <tbody>
          <tr>
            <td>Are you married?</td>
            <td>{showYesNo(this.props.data.serviceBefore1977.married)}</td>
          </tr>
          <tr>
            <td>Do you have any children who are under age 18? Or do you have any children who are over age 18 but under 23, not married, and attending school? Or do you have any children of any age who are permanently disabled for mental or physical reasons?</td>
            <td>{showYesNo(this.props.data.serviceBefore1977.haveDependents)}</td>
          </tr>
          <tr>
            <td>Do you have a parent who is dependent on your financial support?</td>
            <td>{showYesNo(this.props.data.serviceBefore1977.parentDependent)}</td>
          </tr>
        </tbody>
      </table>
    );
  }
}

DependentInformationReview.propTypes = {
  data: React.PropTypes.object.isRequired
};
