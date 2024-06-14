import React, { useEffect } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getAppUrl } from 'platform/utilities/registry-helpers';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';

import { MoreQuestions } from '../../status/components/MoreQuestions';

const printPage = () => window.print();

const statusUrl = getAppUrl('coe-status');

const ConfirmationPage = ({ form }) => {
  useEffect(() => {
    focusElement('.schemaform-title > h1');
    scrollToTop('topScrollElement');
  });

  const { data, submission } = form;
  const name = data?.fullName || {};
  const fullName = [name.first || '', name.middle || '', name.last || '']
    .join(' ')
    .trim();

  const submitDate = moment(submission?.timestamp || Date.now());
  const { referenceNumber = '' } = submission?.response?.attributes || {};

  return (
    <div className="vads-u-margin-bottom--9">
      <va-alert status="success" uswds="false">
        <h2 slot="headline" className="vads-u-font-size--h3">
          You’ve successfully submitted your request for a COE.
        </h2>
        <p className="vads-u-font-size--base">
          We’ll review your request. If you qualify for a Certificate of
          Eligibility, we’ll notify you by email to let you know how to get your
          COE.
        </p>
      </va-alert>
      <div className="inset">
        <h2 className="vads-u-font-size--h3 vads-u-margin-top--1">
          Request for a Certificate of Eligibility{' '}
          <span className="additional">(VA Form 26-1880)</span>
        </h2>

        {fullName && (
          <span>
            For: {fullName}
            {name.suffix && `, ${name.suffix}`}
          </span>
        )}

        {submitDate.isValid() && (
          <div>
            <h3>Date submitted</h3>
            {submitDate.format('LL')}
          </div>
        )}

        {referenceNumber && (
          <div>
            <h3>Reference number</h3>
            {referenceNumber}
          </div>
        )}

        <button
          className="vads-u-margin-top--3 usa-button screen-only"
          onClick={printPage}
          type="button"
        >
          Print this page
        </button>
      </div>

      <h2>When will I hear back about my request for a COE?</h2>
      <div className="inset secondary">
        <h3 className="vads-u-font-size--h2 vads-u-margin--0 vads-u-padding-bottom--1 vads-u-border-bottom--1px vads-u-border-color--gray-light vads-u-display--inline-block">
          Within 5 business days
        </h3>
        <p>
          If more than 5 business days have passed since you submitted your
          request and you haven’t heard back, don’t request a COE again. Call
          our toll-free number at <va-telephone contact="8778273702" />.
        </p>
        <a href={statusUrl}>
          Check the status of your VA home loan Certificate of Eligibility
        </a>
      </div>
      <MoreQuestions />
    </div>
  );
};

function mapStateToProps(state) {
  return {
    form: state.form,
  };
}

ConfirmationPage.propTypes = {
  form: PropTypes.object,
};

export default connect(mapStateToProps)(ConfirmationPage);
