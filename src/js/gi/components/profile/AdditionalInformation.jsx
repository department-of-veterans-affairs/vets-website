import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

export class AdditionalInformation extends React.Component {

  render() {
    const it = this.props.profile.attributes;
    const accredited = !!it.cross;
    const TypeOfAccreditation = () => {
      if (!accredited) return null;
      return (
        <p>
          <strong>Type of accreditation:&nbsp;</strong>
          {it.accreditation_type.toUpperCase()}
        </p>
      );
    };
    const VetTuitionPolicy = () => {
      if (!it.vet_tuition_policy_url) return null;
      return (
        <p>
          <strong>Veterans tuition policy:&nbsp;</strong>
          <a href={`http://${it.vet_tuition_policy_url}`} target="_blank">View policy</a>
        </p>
      );
    };

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
          <div>
            <h3>Institution summary</h3>
            <p>
              <strong>Accredited:&nbsp;</strong>
              {accredited ? 'Yes' : 'No'}
            </p>
            <TypeOfAccreditation/>
            <VetTuitionPolicy/>
            <p>
              <strong>Single point of contact for veterans:&nbsp;</strong>
              {!!it.vet_poc ? 'Yes' : 'No'}
            </p>
            <p>
              <strong>Credit for military training:&nbsp;</strong>
              {!!it.credit_for_mil_training ? 'Yes' : 'No'}
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
                {formatNumber(it.p911_recipients)}
              </p>
              <p>
                <strong>Total paid (2014):&nbsp;</strong>
                {formatCurrency(it.p911_tuition_fees)}
              </p>
            </div>
            <div>
              <p>
                <strong>Benefit:&nbsp;</strong>
                Yellow Ribbon
              </p>
              <p>
                <strong>Recipients:&nbsp;</strong>
                {formatNumber(it.p911_yr_recipients)}
              </p>
              <p>
                <strong>Total paid (2014):&nbsp;</strong>
                {formatCurrency(it.p911_yellow_ribbon)}
              </p>
            </div>
          </div>
          <div>
            <h3>Institution codes</h3>
            <p>
              <strong>
                <a onClick={this.props.showModal.bind(this, 'facilityCode')}>VA facility code:</a>
                &nbsp;
              </strong>
              {+it.facility_code}
            </p>
            <p>
              <strong>
                <a onClick={this.props.showModal.bind(this, 'ipedsCode')}>ED IPEDS code:</a>
                &nbsp;
              </strong>
              {+it.cross}
            </p>
            <p>
              <strong>
                <a onClick={this.props.showModal.bind(this, 'opeCode')}>ED OPE code:</a>
                &nbsp;
              </strong>
              {+it.ope6}
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
                  <th>Total paid (2014)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Post-9/11 GI Bill</th>
                  <td>{formatNumber(it.p911_recipients)}</td>
                  <td>{formatCurrency(it.p911_tuition_fees)}</td>
                </tr>
                <tr>
                  <th>Yellow Ribbon</th>
                  <td>{formatNumber(it.p911_yr_recipients)}</td>
                  <td>{formatCurrency(it.p911_yellow_ribbon)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => state;

const mapDispatchToProps = (dispatch) => {
  return {
    showModal: (name) => {
      dispatch(actions.displayModal(name));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AdditionalInformation);
