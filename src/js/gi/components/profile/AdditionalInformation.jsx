import React from 'react';

export class AdditionalInformation extends React.Component {

  render() {
    const it = this.props.institution;

    const typeOfAccreditation =
      it.accredited &&
      it.accreditationType && (
        <p>
          <strong>
            <a onClick={this.props.onShowModal.bind(this, 'typeAccredited')}>
              Type of accreditation:
            </a>
          </strong>
          &nbsp;{it.accreditationType.toUpperCase()}
        </p>
      );

    const vetTuitionPolicy =
      it.vetWebsiteLink && (
        <p>
          <strong>
            <a onClick={this.props.onShowModal.bind(this, 'tuitionPolicy')}>
              Veterans tuition policy:
            </a>
          </strong>
          &nbsp;<a href={`http://${it.vetWebsiteLink}`} target="_blank">
            View policy
          </a>
        </p>
      );

    // Formats positive and negative currency values in USD
    const formatCurrency = (num) => {
      const str = Number(num).toFixed(2).toString().split('.');
      // Match a digit if it's followed by 3 other digits,
      // appending a comma to each match.
      const regex = /\d(?=(\d{3})+$)/g;
      return [
        '$',
        [str[0].replace(regex, '$&,'), str[1]].join('.')
      ].join('').replace('$-', '-$');
    };

    const formatNumber = (num) => {
      const str = Math.round(Number(num)).toString();
      // Match a digit if it's followed by 3 other digits,
      // appending a comma to each match.
      const regex = /\d(?=(\d{3})+$)/g;
      return str.replace(regex, '$&,');
    };

    return (
      <div className="additional-information row">
        <div className="medium-6 columns">
          <div className="institution-summary">
            <h3>Institution summary</h3>
            <p>
              <strong>
                <a onClick={this.props.onShowModal.bind(this, 'accredited')}>
                  Accredited:
                </a>
              </strong>
              &nbsp;{it.accredited ?
                <span>Yes (<a href={`http://nces.ed.gov/collegenavigator/?id=${it.cross}#accred`} target="_blank">
                  See accreditors
                </a>)</span> : 'No'}
            </p>
            {typeOfAccreditation}
            {vetTuitionPolicy}
            <p>
              <strong>
                <a onClick={this.props.onShowModal.bind(this, 'singleContact')}>
                  Single point of contact for veterans:
                </a>
              </strong>
              &nbsp;{!!it.vetPoc ? 'Yes' : 'No'}
            </p>
            <p>
              <strong>
                <a onClick={this.props.onShowModal.bind(this, 'creditTraining')}>
                  Credit for military training:
                </a>
              </strong>
              &nbsp;{!!it.creditForMilTraining ? 'Yes' : 'No'}
            </p>
          </div>
          <div className="historical-information list">
            <h3>Historical Information</h3>
            <div>
              <p>
                <strong>Benefit:&nbsp;</strong>
                Post-9/11 GI Bill
              </p>
              <p>
                <strong>Recipients:&nbsp;</strong>
                {formatNumber(it.p911Recipients)}
              </p>
              <p>
                <strong>Total paid (FY 2016):&nbsp;</strong>
                {formatCurrency(it.p911TuitionFees)}
              </p>
            </div>
            <div>
              <p>
                <strong>Benefit:&nbsp;</strong>
                Yellow Ribbon
              </p>
              <p>
                <strong>Recipients:&nbsp;</strong>
                {formatNumber(it.p911YrRecipients)}
              </p>
              <p>
                <strong>Total paid (FY 2016):&nbsp;</strong>
                {formatCurrency(it.p911YellowRibbon)}
              </p>
            </div>
          </div>
          <div className="institution-codes">
            <h3>Institution codes</h3>
            <p>
              <strong>
                <a onClick={this.props.onShowModal.bind(this, 'facilityCode')}>VA facility code:</a>
                &nbsp;
              </strong>
              {it.facilityCode || 'N/A'}
            </p>
            <p>
              <strong>
                <a onClick={this.props.onShowModal.bind(this, 'ipedsCode')}>ED IPEDS code:</a>
                &nbsp;
              </strong>
              {it.cross || 'N/A'}
            </p>
            <p>
              <strong>
                <a onClick={this.props.onShowModal.bind(this, 'opeCode')}>ED OPE code:</a>
                &nbsp;
              </strong>
              {it.ope || 'N/A'}
            </p>
          </div>
        </div>
        <div className="medium-6 columns">
          <div className="historical-information table">
            <h3>Historical Information</h3>
            <table className="usa-table-borderless">
              <thead>
                <tr>
                  <th>Benefit</th>
                  <th>Recipients</th>
                  <th>Total paid (FY 2016)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Post-9/11 GI Bill</th>
                  <td>{formatNumber(it.p911Recipients)}</td>
                  <td>{formatCurrency(it.p911TuitionFees)}</td>
                </tr>
                <tr>
                  <th>Yellow Ribbon</th>
                  <td>{formatNumber(it.p911YrRecipients)}</td>
                  <td>{formatCurrency(it.p911YellowRibbon)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

AdditionalInformation.propTypes = {
  institution: React.PropTypes.object,
  onShowModal: React.PropTypes.func
};

export default AdditionalInformation;
