import PropTypes from 'prop-types';
import React from 'react';

export class AdditionalInformation extends React.Component {
  renderInstitutionSummary() {
    const it = this.props.institution;
    const isOJT = it.type.toLowerCase() === 'ojt';

    if (isOJT) return null;

    const typeOfAccreditation = it.accredited &&
      it.accreditationType && (
        <div>
          <strong>
            <button
              type="button"
              className="va-button-link learn-more-button"
              onClick={this.props.onShowModal.bind(this, 'typeAccredited')}
            >
              Type of accreditation:
            </button>
          </strong>
          &nbsp;
          {it.accreditationType.toUpperCase()}
        </div>
      );

    const vetTuitionPolicy = it.vetWebsiteLink && (
      <div>
        <strong>Veterans tuition policy:</strong>
        &nbsp;
        <a href={it.vetWebsiteLink} target="_blank" rel="noopener noreferrer">
          View policy
        </a>
      </div>
    );

    return (
      <div className="institution-summary">
        <h3>Institution summary</h3>
        <div>
          <strong>
            <button
              type="button"
              className="va-button-link learn-more-button"
              onClick={this.props.onShowModal.bind(this, 'accredited')}
            >
              Accredited:
            </button>
          </strong>
          &nbsp;
          {it.accredited ? (
            <span>
              Yes (
              <a
                href={`http://nces.ed.gov/collegenavigator/?id=${
                  it.cross
                }#accred`}
                target="_blank"
                rel="noopener noreferrer"
              >
                See accreditors
              </a>
              )
            </span>
          ) : (
            'No'
          )}
        </div>
        {typeOfAccreditation}
        {vetTuitionPolicy}
        <div>
          <strong>
            <button
              type="button"
              className="va-button-link learn-more-button"
              onClick={this.props.onShowModal.bind(this, 'singleContact')}
            >
              Single point of contact for veterans:
            </button>
          </strong>
          &nbsp;
          {it.vetPoc ? 'Yes' : 'No'}
        </div>
        <div>
          <strong>
            <button
              type="button"
              className="va-button-link learn-more-button"
              onClick={this.props.onShowModal.bind(this, 'creditTraining')}
            >
              Credit for military training:
            </button>
          </strong>
          &nbsp;
          {it.creditForMilTraining ? 'Yes' : 'No'}
        </div>
        <div>
          <strong>
            <button
              type="button"
              className="va-button-link learn-more-button"
              onClick={this.props.onShowModal.bind(this, 'iStudy')}
            >
              Independent study:
            </button>
          </strong>
          &nbsp;
          {it.independentStudy ? 'Yes' : 'No'}
        </div>
      </div>
    );
  }

  render() {
    const it = this.props.institution;

    // Formats positive and negative currency values in USD
    const formatCurrency = num => {
      const str = Number(num)
        .toFixed(2)
        .toString()
        .split('.');
      // Match a digit if it’s followed by 3 other digits,
      // appending a comma to each match.
      const regex = /\d(?=(\d{3})+$)/g;
      return ['$', [str[0].replace(regex, '$&,'), str[1]].join('.')]
        .join('')
        .replace('$-', '-$');
    };

    const formatNumber = num => {
      const str = Math.round(Number(num)).toString();
      // Match a digit if it’s followed by 3 other digits,
      // appending a comma to each match.
      const regex = /\d(?=(\d{3})+$)/g;
      return str.replace(regex, '$&,');
    };

    return (
      <div className="additional-information row">
        <div className="usa-width-one-half medium-6 columns">
          {this.renderInstitutionSummary()}
          <div className="historical-information list">
            <h3>Historical Information</h3>
            <div>
              <div>
                <strong>Benefit:&nbsp;</strong>
                Post-9/11 GI Bill
              </div>
              <div>
                <strong>Recipients:&nbsp;</strong>
                {formatNumber(it.p911Recipients)}
              </div>
              <div>
                <strong>Total paid (FY 2016):&nbsp;</strong>
                {formatCurrency(it.p911TuitionFees)}
              </div>
            </div>
            <div>
              <div>
                <strong>Benefit:&nbsp;</strong>
                Yellow Ribbon
              </div>
              <div>
                <strong>Recipients:&nbsp;</strong>
                {formatNumber(it.p911YrRecipients)}
              </div>
              <div>
                <strong>Total paid (FY 2016):&nbsp;</strong>
                {formatCurrency(it.p911YellowRibbon)}
              </div>
            </div>
          </div>
          <div className="institution-codes">
            <h3>Institution codes</h3>
            <div>
              <strong>
                <button
                  type="button"
                  className="va-button-link learn-more-button"
                  onClick={this.props.onShowModal.bind(this, 'facilityCode')}
                >
                  VA facility code:
                </button>
                &nbsp;
              </strong>
              {it.facilityCode || 'N/A'}
            </div>
            <div>
              <strong>
                <button
                  type="button"
                  className="va-button-link learn-more-button"
                  onClick={this.props.onShowModal.bind(this, 'ipedsCode')}
                >
                  ED IPEDS code:
                </button>
                &nbsp;
              </strong>
              {it.cross || 'N/A'}
            </div>
            <div>
              <strong>
                <button
                  type="button"
                  className="va-button-link learn-more-button"
                  onClick={this.props.onShowModal.bind(this, 'opeCode')}
                >
                  ED OPE code:
                </button>
                &nbsp;
              </strong>
              {it.ope || 'N/A'}
            </div>
          </div>
        </div>
        <div className="usa-width-one-half medium-6 columns">
          <div className="historical-information table">
            <h3>Historical Information</h3>
            <table>
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
  institution: PropTypes.object,
  onShowModal: PropTypes.func,
};

export default AdditionalInformation;
