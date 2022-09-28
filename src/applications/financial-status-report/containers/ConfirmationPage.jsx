import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useSelector, connect } from 'react-redux';
import Scroll from 'react-scroll';
import environment from 'platform/utilities/environment';
import { focusElement } from 'platform/utilities/ui';
import ServiceProvidersText, {
  ServiceProvidersTextCreateAcct,
} from 'platform/user/authentication/components/ServiceProvidersText';
import { getMedicalCenterNameByID } from 'platform/utilities/medical-centers/medical-centers';
import recordEvent from '~/platform/monitoring/record-event';
import GetFormHelp from '../components/GetFormHelp';
import { deductionCodes } from '../constants/deduction-codes';
import DownloadFormPDF from '../components/DownloadFormPDF';
import {
  fsrConfirmationEmailToggle,
  DEBT_TYPES,
  fsrReasonDisplay,
} from '../utils/helpers';

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
  const combinedFSR = data['view:combinedFinancialStatusReport'];
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

  const reliefList = combinedFSR
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
      <h4 className="vads-u-margin-top--0">
        Request help for VA debt <span>(Form 5655)</span>
      </h4>
      {name && (
        <span>
          for {name.first} {name.middle} {name.last} {name.suffix}
        </span>
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
          <strong>Your request was sent to</strong>
        </p>
        <p className="vads-u-margin-y--0">Debt Management Center</p>
        <p className="vads-u-margin-y--0">P.O. Box 11930</p>
        <p className="vads-u-margin-y--0">St. Paul, MN 55111-0930</p>
        <p>
          <DownloadFormPDF />
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
  const successVBAResponse =
    'Document has been successfully uploaded to filenet';

  const { response } = form.submission;
  const { data } = form;

  useEffect(
    () => {
      focusElement('.schemaform-title > h1');
      if (response.vbaStatus.status === successVBAResponse) {
        recordEvent({ event: 'cfsr-5655-vba-submitted' });
      }

      if (response.vhaStatus.status.includes(200)) {
        recordEvent({ event: 'cfsr-5655-vha-submitted' });
      }
      scrollToTop();
    },
    [response],
  );

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
        We’ll send you a letter with our decision and any next steps. If you
        experience changes that may affect our decision (like a job loss or a
        new job), you’ll need to submit a new request.
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
              You can sign in with your existing <ServiceProvidersText />
              account. <ServiceProvidersTextCreateAcct />
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
              Once you’re signed in, you can go to
              <a href="/manage-va-debt" className="vads-u-margin--0p5">
                Manage my VA debt
              </a>
              to check the status of your current debts.
            </p>
            <p>
              If you have a question about the status of your request call us at
              800-827-0648 (or 1-612-713-6415 from overseas). We’re here Monday
              through Friday, 7:30 a.m. to 7:00 p.m. ET.
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
