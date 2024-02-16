import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';
import { benefitsLabels } from '../labels';

class ConfirmationPage extends React.Component {
  componentDidMount() {
    focusElement('.confirmation-page-title');
    scrollToTop('topScrollElement');
  }

  render() {
    const { form } = this.props;
    const response = form?.submission?.response ?? {};
    const {
      'view:claimedBenefits': benefits,
      claimantFullName: claimantName,
      veteranFullName: veteranName,
    } = form?.data;
    const hasDocuments =
      form?.data?.deathCertificate || form?.data?.transportationReceipts;
    const { deathCertificate, transportationReceipts } = form.data;

    const submittedAt = moment(form.submission.submittedAt);
    const offset = submittedAt.isDST() ? '-0500' : '-0600';

    return (
      <div>
        <div className="print-only">
          <img
            src="https://www.va.gov/img/design/logo/logo-black-and-white.png"
            alt="VA logo"
            width="300"
          />
        </div>
        <h2 className="confirmation-page-title vads-u-font-size--h3">
          Claim submitted
        </h2>
        <p>
          We process claims in the order we receive them. Please print this page
          for your records.
        </p>
        <p>We may contact you for more information or documents.</p>
        <div className="inset">
          <h3 className="vads-u-margin-top--0">
            Burial Benefit Claim{' '}
            <span className="additional">(Form 21P-530)</span>
          </h3>
          <span>
            for {claimantName.first} {claimantName.middle} {claimantName.last}{' '}
            {claimantName.suffix}
          </span>

          <ul className="claim-list">
            <li>
              <h4>Confirmation number</h4>
              <span>{response.confirmationNumber}</span>
            </li>
            <li>
              <h4>Date submitted</h4>
              <span>
                {submittedAt
                  .utcOffset(offset)
                  .format('MMM D, YYYY h:mm a [CT]')}
              </span>
            </li>
            <li>
              <h4>Deceased Veteran</h4>
              <span>
                {veteranName.first} {veteranName.middle} {veteranName.last}{' '}
                {veteranName.suffix}
              </span>
            </li>
            <li>
              <h4>Benefits claimed</h4>
              <ul className="benefits-claimed">
                {Object.entries(benefits).map(([benefitName, isRequested]) => {
                  const label = benefitsLabels[benefitName];
                  return isRequested && label ? (
                    <li key={benefitName}>{label}</li>
                  ) : null;
                })}
              </ul>
            </li>
            {hasDocuments && (
              <li>
                <h4>Documents uploaded</h4>
                {deathCertificate && <p>Death certificate: 1 file</p>}
                {transportationReceipts && (
                  <p>
                    Transportation documentation:{' '}
                    {transportationReceipts.length}{' '}
                    {transportationReceipts.length > 1 ? 'files' : 'file'}
                  </p>
                )}
              </li>
            )}
            <li>
              <h4>Your claim was sent to</h4>
              <address className="schemaform-address-view">
                {response?.regionalOffice?.map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </address>
            </li>
          </ul>
          <va-button
            className="usa-button screen-only"
            onClick={() => window.print()}
            text="Print for your records"
            uswds="false"
          />
        </div>
        <div className="confirmation-guidance-container">
          <h3 className="confirmation-guidance-heading">Need help?</h3>
          <p className="confirmation-guidance-message">
            If you have questions, call <va-telephone contact="8008271000" />,
            Monday through Friday, 8:00 a.m. to 9:00 p.m. ET. Please have your
            Social Security number or VA file number ready. For
            Telecommunication Relay Services, dial{' '}
            <va-telephone contact="711" />.
          </p>
        </div>
        <div className="row form-progress-buttons schemaform-back-buttons">
          <div className="small-6 usa-width-one-half medium-6 columns">
            <a href="/">Go back to VA.gov</a>
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
