import PropTypes from 'prop-types';
import React from 'react';
import recordEvent from 'platform/monitoring/record-event';

export class AdditionalInformation extends React.Component {
  updateFiscalYear() {
    const constants = this.props.constants;

    return constants.FISCALYEAR;
  }

  renderSection103Info = section103Message => (
    <div className="section-103-message">
      <strong>
        <button
          type="button"
          className="va-button-link learn-more-button"
          onClick={() => {
            recordEvent({
              event: 'gibct-modal-displayed',
              'gibct-modal-displayed': 'protection-against-late-va-payments',
            });
            this.props.onShowModal('section103');
          }}
        >
          Protection against late VA payments:
        </button>
      </strong>
      &nbsp;
      {section103Message}
    </div>
  );

  renderInstitutionSummary() {
    const { institution } = this.props;
    const isOJT = institution.type.toLowerCase() === 'ojt';

    if (isOJT && institution.section103Message) {
      return (
        <div className="institution-summary">
          <h3>Institution summary</h3>
          {this.renderSection103Info(institution.section103Message)}
        </div>
      );
    }

    if (isOJT) return null;

    const typeOfAccreditation = institution.accredited &&
      institution.accreditationType && (
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
          {institution.accreditationType.toUpperCase()}
        </div>
      );

    const vetTuitionPolicy = institution.vetWebsiteLink && (
      <div>
        <strong>Veterans tuition policy:</strong>
        &nbsp;
        <a
          href={institution.vetWebsiteLink}
          target="_blank"
          rel="noopener noreferrer"
        >
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
          {institution.accredited ? (
            <span>
              Yes (
              <a
                href={`http://nces.ed.gov/collegenavigator/?id=${
                  institution.cross
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
        {institution.section103Message &&
          this.renderSection103Info(institution.section103Message)}
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
          {institution.creditForMilTraining ? 'Yes' : 'No'}
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
          {institution.independentStudy ? 'Yes' : 'No'}
        </div>
        <div>
          <strong>
            <button
              type="button"
              className="va-button-link learn-more-button"
              onClick={this.props.onShowModal.bind(this, 'stemIndicator')}
            >
              Rogers STEM Scholarship:
            </button>
          </strong>
          &nbsp;
          {institution.stemIndicator ? 'Yes' : 'No'}
        </div>
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
          {institution.vetPoc ? 'Yes' : 'No'}
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
                <strong>
                  Total paid (FY {this.updateFiscalYear()}
                  ):&nbsp;
                </strong>
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
                <strong>
                  Total paid (FY {this.updateFiscalYear()}
                  ):&nbsp;
                </strong>
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
                  <th>Total paid (FY {this.updateFiscalYear()})</th>
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
  constants: PropTypes.object,
  institution: PropTypes.object,
  onShowModal: PropTypes.func,
};

export default AdditionalInformation;
