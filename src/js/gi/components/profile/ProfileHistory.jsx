import React from 'react';

class ProfileHistory extends React.Component {

  render() {
    const school = this.props.institution;
    const numberWithDelimiter = (n) => {
      const number = String(n);
      const delimiter = ',';
      let $1;
      const split = number.split('.');
      split[0] = split[0].replace(
        /(\d)(?=(\d\d\d)+(?!\d))/g,
        [$1, delimiter].join()
      );
      return split.join('.');
    };
    const numberToCurrency = (n) => {
      try {
        const precision = 2;
        const unit = '$';
        const separator = '.';
        const parts = parseFloat(n).toFixed(precision).split('.');
        return unit + numberWithDelimiter(parts[0]) + separator + parts[1].toString();
      } catch (e) {
        return n;
      }
    };

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
              <td>{numberWithDelimiter(school.p911Recipients)}</td>
              <td>{numberToCurrency(school.p911TuitionFees)}</td>
            </tr>
            <tr>
              <th scope="row" className="text-left">Yellow Ribbon:</th>
              <td>{numberWithDelimiter(school.p911YrRecipients)}</td>
              <td>{numberToCurrency(school.p911YellowRibbon)}</td>
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
              <td>VA Facility Code:&nbsp;<a onClick={() => {this.props.toggleModalDisplay('facilityCode');}} className="info-icons"><i id="va-facility-code-info" className="fa fa-info-circle info-icons"></i></a></td>
              <td>{school.facilityCode ? school.facilityCode : 'No Data'}</td>
              <td></td>
            </tr>
            <tr>
              <td>ED IPEDS Code:&nbsp;<a onClick={() => {this.props.toggleModalDisplay('ipedsCode');}} className="info-icons"><i id="ipeds-code-info" className="fa fa-info-circle info-icons"></i></a></td>
              <td>{school.cross ? school.cross : 'No Data'}</td>
              <td></td>
            </tr>
            <tr>
              <td>ED OPE Code:&nbsp;<a onClick={() => {this.props.toggleModalDisplay('opeCode');}} className="info-icons"><i id="ed-ope-code-info" className="fa fa-info-circle info-icons"></i></a></td>
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
