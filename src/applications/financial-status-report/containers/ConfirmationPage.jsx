import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useSelector, connect } from 'react-redux';
import Scroll from 'react-scroll';
import environment from 'platform/utilities/environment';
import { focusElement } from 'platform/utilities/ui';
import { getMedicalCenterNameByID } from 'platform/utilities/medical-centers/medical-centers';
import GetFormHelp from '../components/shared/GetFormHelp';
import { deductionCodes } from '../constants/deduction-codes';
import DownloadFormPDF from '../components/shared/DownloadFormPDF';
import { fsrConfirmationEmailToggle, fsrReasonDisplay } from '../utils/helpers';
import { DEBT_TYPES } from '../constants';

const { scroller } = Scroll;
const scrollToTop = () => {
  scroller.scrollTo('topScrollElement', {
    duration: 500,
    delay: 0,
    smooth: true,
  });
};

const RequestDetailsCard = ({ data, response }) => {
  const name = data.personalData?.veteranFullName;
  const enhancedFSR = data['view:enhancedFinancialStatusReport'];
  const windowPrint = useCallback(() => {
    window.print();
  }, []);

  const debtListItem = (debt, index) => {
    const debtFor =
      debt.debtType === DEBT_TYPES.DEBT
        ? deductionCodes[debt.deductionCode]
        : debt.station.facilityName ||
          getMedicalCenterNameByID(debt.station.facilitYNum);
    const resolution = fsrReasonDisplay(debt.resolutionOption);

    return (
      <li key={index}>
        {resolution}
        <span className="vads-u-margin--0p5">for</span>
        {debtFor}
      </li>
    );
  };

  const reliefList = enhancedFSR
    ? data.selectedDebtsAndCopays?.map((debt, index) =>
        debtListItem(debt, index),
      )
    : data.selectedDebts?.map((debt, index) => (
        <li key={index}>
          {debt.resolution?.resolutionType}
          <span className="vads-u-margin--0p5">for</span>
          {deductionCodes[debt.deductionCode]}
        </li>
      ));

  return (
    <div className="inset">
      <h2 className="vads-u-margin-top--0p5 vads-u-font-size-h3">
        Request help for VA debt{' '}
        <span className="vads-u-font-weight--normal">(Form 5655)</span>
      </h2>
      {name && (
        <p>
          for {name.first} {name.middle} {name.last} {name.suffix}
        </p>
      )}
      <>
        <p>
          <strong>Requested repayment or relief options</strong>
        </p>
        <ul>{reliefList}</ul>
        <p className="vads-u-margin-bottom--0">
          <strong>Date submitted</strong>
        </p>
        <p className="vads-u-margin-top--0p5">
          {moment(response.timestamp).format('MMMM D, YYYY')}
        </p>
        <p className="vads-u-margin-bottom--0p5">
          <DownloadFormPDF pdfContent={response.content} />
          <button
            className="usa-button-secondary button vads-u-background-color--white"
            onClick={windowPrint}
            type="button"
          >
            Print this page
          </button>
        </p>
      </>
    </div>
  );
};

RequestDetailsCard.propTypes = {
  data: PropTypes.object,
  download: PropTypes.func,
  response: PropTypes.object,
};

const ConfirmationPage = ({ form, download }) => {
  const showFSREmail = useSelector(state => fsrConfirmationEmailToggle(state));

  const { response } = form.submission;
  const { data } = form;

  useEffect(() => {
    focusElement('.schemaform-title > h1');

    scrollToTop();
  }, []);

  return (
    <div>
      <p className="vads-u-margin-top--0">
        <strong>Please print this page for your records.</strong>
      </p>

      {showFSREmail && (
        <va-alert status="success">
          <h3 className="confirmation-page-title">
            We’ve received your request
          </h3>
          <p>
            We’ll send you an email confirming your request to{' '}
            <strong>{data.personalData.emailAddress}.</strong>
          </p>
        </va-alert>
      )}
      <p>
        We’ll send you a letter with our decision and any next steps.{' '}
        <strong>
          If you experience changes that may affect our decision (like a loss or
          new job), you’ll need to submit a new request.
        </strong>
      </p>

      {response && (
        <RequestDetailsCard
          data={data}
          response={response}
          download={download}
        />
      )}

      <h3>How can I check the status of my request?</h3>
      <div className="process schemaform-process">
        <ol>
          <li className="process-step list-one">
            <h4>Sign in to VA.gov</h4>
            <p>
              You can sign in with your Login.gov, ID.me, DS Logon, or My
              HealtheVet
            </p>
          </li>
          <li className="process-step list-two">
            <h4>
              If you haven’t yet verified your identity, complete this process
              when prompted
            </h4>
            <p>
              This helps keep your information safe, and prevents fraud and
              identity theft. If you’ve already verified your identity with us,
              you don’t need to do this again.
            </p>
          </li>
          <li className="process-step list-three">
            <h4>Go to your debt management portal</h4>
            <p>
              After you sign in, you can go to
              <a href="/manage-va-debt" className="vads-u-margin--0p5">
                Manage my VA debt
              </a>
              to check the status of your current debts.
            </p>
          </li>
        </ol>
        <h3 className="vads-u-margin-bottom--2">
          What if I lose my job or have other changes that may affect my
          finances?
        </h3>
        <p>
          You’ll need to submit a new request to report the changes to us. We’ll
          consider the changes when we make our decision on your request.
        </p>

        <a
          className="vads-c-action-link--green vads-u-margin-top--1p5 vads-u-margin-bottom--2p5"
          href={`${environment.BASE_URL}`}
        >
          Go back to VA.gov
        </a>
      </div>

      <div className="help-container">
        <h2 className="help-heading">Need help?</h2>
        <GetFormHelp />
      </div>
    </div>
  );
};

ConfirmationPage.propTypes = {
  download: PropTypes.func,
  form: PropTypes.object,
};

const mapStateToProps = state => {
  return {
    form: state.form,
  };
};

export default connect(mapStateToProps)(ConfirmationPage);
