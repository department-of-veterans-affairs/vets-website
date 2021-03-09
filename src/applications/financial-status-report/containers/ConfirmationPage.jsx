import React, { useEffect } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';
import { deductionCodes } from '../../debt-letters/const/deduction-codes/';
import { downloadPDF } from '../actions';
import { focusElement } from 'platform/utilities/ui';
import { bindActionCreators } from 'redux';
import GetFormHelp from '../components/GetFormHelp';

const scroller = Scroll.scroller;
const scrollToTop = () => {
  scroller.scrollTo('topScrollElement', {
    duration: 500,
    delay: 0,
    smooth: true,
  });
};

const RequestDetailsCard = ({ data, response, download }) => {
  const name = data.personalData?.veteranFullName;

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
        <ul>
          {data.fsrDebts?.map((debt, index) => (
            <li key={index}>
              {debt.resolution.resolutionType} for{' '}
              {deductionCodes[debt.deductionCode]}{' '}
            </li>
          ))}
        </ul>
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
        <p className="vads-u-margin-y--0">St. Paul, MN 5111-0930</p>
        <p>
          <button className="usa-button button" onClick={() => download()}>
            Download completed form
          </button>
          <button
            className="usa-button-secondary button vads-u-background-color--white"
            onClick={() => window.print()}
          >
            Print this page
          </button>
        </p>
      </>
    </div>
  );
};

const ConfirmationPage = ({ form, download }) => {
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
      <h3 className="confirmation-page-title">We've received your request</h3>
      <p>
        We’ll send you a letter with our decision and any next steps within 45
        days. If you experience changes that may affect our decision (like a job
        loss or a new job), you’ll need to submit a new request.
      </p>
      {response && (
        <RequestDetailsCard
          data={data}
          response={response}
          download={download}
        />
      )}
      <h3>When will VA make a decision on my request?</h3>
      <p>
        You can expect our decision within 45 days. We'll send you a letter by
        mail with our decision and any next steps to resolve your debt.
      </p>
      <div className="process schemaform-process">
        <ol>
          <li className="process-step list-one">
            <h4>Sign in to VA.gov</h4>
            <p>
              You can sign in with your DS Logon, My HealtheVet, or ID.me
              account.
            </p>
          </li>
          <li className="process-step list-two">
            <h4>
              If you haven't yet verified your identity, complete this process
              when prompted
            </h4>
            <p>
              This helps keep your information safe, and prevents fraud and
              identity theft. If you've already verified your identity with us,
              you don't need to do this again.
            </p>
          </li>
          <li className="process-step list-three">
            <h4>Go to your debt management portal</h4>
            <p>
              Once you're signed in, you can go to{' '}
              <a href="/manage-va-debt">Manage my VA debt</a> to check the
              status of your current debts.
            </p>
          </li>
        </ol>
        <h3 className="vads-u-margin-bottom--2">
          What if I lose my job or have other changes that may affect my
          finances?
        </h3>
        <p>
          You'll need to submit a new request to report the changes to us. We'll
          consider the changes when we make our decision on your request.
        </p>
      </div>
      <div className="help-container">
        <h2 className="help-heading">Need help?</h2>
        <GetFormHelp />
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    form: state.form,
  };
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({ download: downloadPDF }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConfirmationPage);
