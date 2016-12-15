import React from 'react';

class ProfileHistory extends React.Component {

  render() {
    const school = this.props.institution;
    const number_with_delimiter = (n) => {
      return 'x,xxxx.xx';
    }
    const number_to_currency = (n) => {
      return '$xxxx.xx';
    }

    return (
      <div className="usa-width-one-whole">
        <table className="usa-table-borderless">
          <thead>
            <tr>
              <th scope="col">Benefit</th>
              <th scope="col">Recipients</th>
              <th scope="col">Paid (FY'14)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" className="text-left">Post-9/11 GI Bill:</th>
              <td>{ number_with_delimiter(school.p911_recipients) }</td>
              <td>{ number_to_currency(school.p911_tuition_fees) }</td>
            </tr>
            <tr>
              <th scope="row" className="text-left">Yellow Ribbon:</th>
              <td>{ number_with_delimiter(school.p911_yr_recipients) }</td>
              <td>{ number_to_currency(school.p911_yellow_ribbon) }</td>
            </tr>
          </tbody>
        </table>
        <table className="usa-table-borderless">
          <thead>
            <tr>
              <th scope="col">Additional Information</th>
              <th scope="col">&nbsp;</th>
              <th scope="col">&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>VA Facility Code:&nbsp;<a onClick={() => {this.props.toggleModalDisplay('facilityCode')}} className="info-icons"><i id="va-facility-code-info" className="fa fa-info-circle info-icons"></i></a></td>
              <td>{school.facility_code ? school.facility_code : 'No Data'}</td>
              <td></td>
            </tr>
            <tr>
              <td>ED IPEDS Code:&nbsp;<a onClick={() => {this.props.toggleModalDisplay('ipedsCode')}} className="info-icons"><i id="ipeds-code-info" className="fa fa-info-circle info-icons"></i></a></td>
              <td>{school.cross ? school.cross : 'No Data'}</td>
              <td></td>
            </tr>
            <tr>
              <td>ED OPE Code:&nbsp;<a onClick={() => {this.props.toggleModalDisplay('opeCode')}} className="info-icons"><i id="ed-ope-code-info" className="fa fa-info-circle info-icons"></i></a></td>
              <td>{school.ope ? school.ope : 'No Data'}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

}

ProfileHistory.propTypes = {
  institution: React.PropTypes.object.isRequired,
  toggleModalDisplay: React.PropTypes.func,
  expanded: React.PropTypes.bool.isRequired
};

ProfileHistory.defaultProps = {
  expanded: true
};

export default ProfileHistory;
