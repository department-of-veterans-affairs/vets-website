import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import environment from 'platform/utilities/environment';
import { focusElement } from 'platform/utilities/ui';
import { scrollToTop } from 'platform/utilities/scroll';
import { getMedicalCenterNameByID } from 'platform/utilities/medical-centers/medical-centers';
import { formatDateLong } from 'platform/utilities/date';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import GetFormHelp from '../components/shared/GetFormHelp';
import { deductionCodes } from '../constants/deduction-codes';
import DownloadFormPDF from '../components/shared/DownloadFormPDF';
import { fsrReasonDisplay } from '../utils/helpers';
import { DEBT_TYPES } from '../constants';
import {
  isStreamlinedLongForm,
  isStreamlinedShortForm,
} from '../utils/streamlinedDepends';
import SurveyInformation from '../components/shared/SurveyInformation';

const RequestDetailsCard = ({ data, response }) => {
  const name = data.personalData?.veteranFullName;
  const windowPrint = useCallback(() => {
    window.print();
  }, []);
  const buttonText = 'Print this page';

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

  const reliefList = data.selectedDebtsAndCopays?.map((debt, index) =>
    debtListItem(debt, index),
  );

  return (
    <va-summary-box>
      <h2 className="vads-u-font-size--h3" slot="headline">
        Request help for VA debt{' '}
        <span className="vads-u-font-weight--normal">(Form 5655)</span>
      </h2>
      {name && (
        <p>
          for {name.first} {name.middle} {name.last} {name.suffix}
        </p>
      )}
      <p>
        <strong>Requested repayment or relief options</strong>
      </p>
      <ul>{reliefList}</ul>
      <p className="vads-u-margin-bottom--0">
        <strong>Date submitted</strong>
      </p>
      <p className="vads-u-margin-top--0p5">{formatDateLong(new Date())}</p>
      <p className="vads-u-margin-bottom--0p5">
        <va-button text={buttonText} onClick={windowPrint} />
        <DownloadFormPDF pdfContent={response.content} />
      </p>
    </va-summary-box>
  );
};

RequestDetailsCard.propTypes = {
  data: PropTypes.object,
  download: PropTypes.func,
  response: PropTypes.object,
};

const ConfirmationPage = ({ form, download }) => {
  const { response } = form.submission;
  const { data } = form;

  const renderLoseJobBlurb = () => {
    if (!isStreamlinedLongForm(data) && !isStreamlinedShortForm(data)) {
      return (
        <>
          <h2 className="vads-u-margin-bottom--2 vads-u-margin-top--0 vads-u-font-size--h3">
            What if I lose my job or have other changes that may affect my
            finances?
          </h2>
          <p>
            You’ll need to{' '}
            <va-link
              href="/manage-va-debt/request-debt-help-form-5655/"
              text="submit a new request"
            />{' '}
            to report the changes to us. We’ll consider the changes when we make
            our decision on your request.
          </p>
        </>
      );
    }
    return null;
  };

  useEffect(() => {
    focusElement('.schemaform-title > h1');

    scrollToTop();
  }, []);

  const renderLongFormAlert = () => {
    return (
      <>
        <va-alert status="success">
          <h2 slot="headline" className="vads-u-font-size--h3">
            We’ve received your request
          </h2>
          <p>
            We’ll send you an email confirming your request to{' '}
            <strong>{data.personalData.emailAddress}.</strong>
          </p>
          <SurveyInformation />
        </va-alert>
        <p>
          We’ll send you a letter with our decision and any next steps.{' '}
          <strong>
            If you experience changes that may affect our decision (like a loss
            or new job), you’ll need to submit a new request.
          </strong>
        </p>
      </>
    );
  };

  const renderSWConfirmationAlert = () => {
    return (
      <>
        <va-alert status="success">
          <h2 slot="headline" className="vads-u-font-size--h3">
            You’re tentatively eligible for debt relief
          </h2>
          <p>
            We’ll complete our final review of your request and mail you a
            letter with more details. We’ll also send a confirmation email to
            <strong> {data.personalData.emailAddress}</strong> for this
            submission.
          </p>
          <SurveyInformation />
        </va-alert>
        <p>You don’t need to do anything else at this time.</p>
        <p>
          If you don’t receive your letter in the next 30 days or have any
          questions, call us at{' '}
          <va-telephone contact={CONTACTS.HEALTH_RESOURCE_CENTER} />(
          <va-telephone contact="711" tty />
          ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
        </p>
      </>
    );
  };

  return (
    <>
      {!(isStreamlinedLongForm(data) || isStreamlinedShortForm(data)) &&
        renderLongFormAlert()}
      {(isStreamlinedLongForm(data) || isStreamlinedShortForm(data)) &&
        renderSWConfirmationAlert()}

      {response && (
        <RequestDetailsCard
          data={data}
          response={response}
          download={download}
        />
      )}

      <h2 className="vads-u-font-size--h3">
        How can I check the status of my request?
      </h2>
      <va-process-list class="vads-u-margin-left--neg2 vads-u-padding-bottom--0">
        <va-process-list-item header="Sign in to VA.gov" level="3">
          <p>You can sign in with your ID.me or Login.gov account.</p>
        </va-process-list-item>
        <va-process-list-item header="Submit your request" level="3">
          <p>
            This helps keep your information safe, and prevents fraud and
            identity theft. If you’ve already verified your identity with us,
            you don’t need to do this again.
          </p>
        </va-process-list-item>
        <va-process-list-item
          header="Go to your debt management portal"
          level="3"
        >
          <p>
            After you sign in, you can go to{' '}
            <va-link href="/manage-va-debt/" text="Manage my VA debt" />
            &nbsp;to check the status of your current debts.
          </p>
        </va-process-list-item>
      </va-process-list>
      {renderLoseJobBlurb()}
      <va-link-action
        href={`${environment.BASE_URL}`}
        text="Go back to VA.gov"
        class="vads-u-margin-top--1p5 vads-u-margin-bottom--3"
      />
      <va-need-help>
        <div slot="content">
          <GetFormHelp />
        </div>
      </va-need-help>
    </>
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
