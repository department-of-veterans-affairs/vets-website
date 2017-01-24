import React from 'react';

import { showYesNo } from '../../../utils/helpers';

export default class MilitaryServiceReview extends React.Component {
  render() {
    return (
      <div>
        <table className="review usa-table-borderless">
          <tbody>
            <tr>
              <td>If you received a commission from a military service academy, what year did you graduate?</td>
              <td>{this.props.data.serviceAcademyGraduationYear.value}</td>
            </tr>
            <tr>
              <td>Are you on active duty now?</td>
              <td>{showYesNo(this.props.data.currentlyActiveDuty.yes)}</td>
            </tr>
          </tbody>
          {this.props.data.currentlyActiveDuty.yes.value === 'Y'
            ? <tbody>
              <tr>
                <td>Are you on terminal leave now?</td>
                <td>{showYesNo(this.props.data.currentlyActiveDuty.onTerminalLeave)}</td>
              </tr>
            </tbody>
            : null}
        </table>
      </div>
    );
  }
}

MilitaryServiceReview.propTypes = {
  data: React.PropTypes.object.isRequired
};
