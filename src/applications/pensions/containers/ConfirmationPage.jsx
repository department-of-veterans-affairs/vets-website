import React from 'react';
import { utcToZonedTime, format } from 'date-fns-tz';
import { connect } from 'react-redux';

import { focusElement } from 'platform/utilities/ui';
import CallVBACenter from 'platform/static-data/CallVBACenter';
import { scrollToTop, formatFullName } from '../helpers';

const centralTz = 'America/Chicago';

class ConfirmationPage extends React.Component {
  componentDidMount() {
    focusElement('.confirmation-page-title');
    scrollToTop();
  }

  render() {
    const {
      form: { submission, data },
    } = this.props;
    const response = submission?.response ?? {};
    const fullName = formatFullName(data?.veteranFullName ?? {});
    const regionalOffice = response?.regionalOffice || [];

    const pmcName = regionalOffice?.length
      ? regionalOffice[0].replace('Attention:', '').trim()
      : null;

    const zonedDate = utcToZonedTime(submission?.timestamp, centralTz);
    const submittedAt = format(zonedDate, 'LLL d, yyyy h:mm a zzz', {
      timeZone: centralTz,
    });

    return (
      <div>
        <h3 className="confirmation-page-title">Claim submitted</h3>
        <p>
          We process claims in the order we receive them. Please print this page
          for your records.
        </p>
        <p>We may contact you for more information or documents.</p>
        <div className="inset">
          <h4>
            Veterans Pension Benefit Claim{' '}
            <span className="additional">(Form 21P-527EZ)</span>
          </h4>
          <span>for {fullName}</span>

          <ul className="claim-list">
            <li>
              <strong>Date submitted</strong>
              <br />
              <span>{submittedAt}</span>
            </li>
            {response?.confirmationNumber && (
              <li>
                <strong>Confirmation number</strong>
                <br />
                <span>{response?.confirmationNumber}</span>
              </li>
            )}
            <li>
              <strong>Pension Management Center</strong>
              <br />
              {pmcName && <span>{pmcName}</span>}
              <br />
              <span>
                Phone: <va-telephone international contact="8008271000" />,
                Monday &#8211; &#8211; Friday, 8:00 a.m. &#8211; 9:00 p.m. ET
              </span>
              <br />
              <span>Fax: 844-655-1604</span>
            </li>
            <li>
              <span>
                If you have several documents to send in, you can mail them to:
              </span>
              <address className="schemaform-address-view">
                {regionalOffice?.map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </address>
            </li>
            <li>
              <strong>Note:</strong> If you choose to mail in your supporting
              documents, you don't have to send in a paper copy of VA Form
              21P-527EZ with the documents.
            </li>
          </ul>
        </div>
        <div className="confirmation-guidance-container">
          <h4 className="confirmation-guidance-heading">Need help?</h4>
          <p className="confirmation-guidance-message">
            If you have questions, <CallVBACenter />
            <br />
            Monday &#8211; Friday, 8:00 a.m. &#8211; 9:00 p.m. ET. <br />
            Please have your Social Security number or VA file number ready.
          </p>
        </div>
        <div className="row form-progress-buttons schemaform-back-buttons">
          <div className="small-6 usa-width-one-half medium-6 columns">
            <a href="/">
              <button className="usa-button-primary">Go Back to VA.gov</button>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    form: state.form,
  };
}

export default connect(mapStateToProps)(ConfirmationPage);
export { ConfirmationPage };
