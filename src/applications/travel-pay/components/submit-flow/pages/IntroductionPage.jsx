import React, { useEffect } from 'react';

import { focusElement, scrollToTop } from 'platform/utilities/ui';
// import { isLoggedIn } from 'platform/user/selectors';
import { HelpTextContent } from '../../HelpText';
import { formatDateTime, getDaysLeft } from '../../../util/dates';

// import { useSelector } from 'react-redux';

const IntroductionPage = ({ appointment, onNext }) => {
  // const userLoggedIn = useSelector(state => isLoggedIn(state));

  const [formattedDate] = formatDateTime(appointment.vaos.apiData.start);

  const daysLeft = getDaysLeft(appointment.vaos.apiData.start);

  useEffect(() => {
    focusElement('h2');
    scrollToTop('topScrollElement');
  }, []);

  return (
    <article className="schemaform-intro">
      {/* <FormTitle
        title="File a travel reimbursement claim"
        subtitle="Equal to VA Form 10-3542 (Beneficiary Travel)"
      /> */}
      <h1 className="vads-u-font-size--h2 vad-u-margin-top--0">
        File a travel reimbursement claim
      </h1>

      <p>
        You have {`${daysLeft} ${daysLeft === 1 ? 'day' : 'days'}`} left to file
        for your appointment on {formattedDate} at{' '}
        {appointment.vaos.apiData.location.attributes.name}.
      </p>

      <h2 className="vads-u-font-size--h3 vad-u-margin-top--0">
        Follow the steps below to apply for beneficiary travel claim.
      </h2>
      <va-process-list>
        <va-process-list-item header="Check your travel reimbursement eligibility">
          <p>
            If you’re eligible for health care travel reimbursement and you have
            your direct deposit set up, you can file a reimbursement claim now.
          </p>
          <va-link
            href="https://www.va.gov/health-care/get-reimbursed-for-travel-pay/#eligibility-for-general-health"
            text="Travel reimbursement eligibility"
          />
        </va-process-list-item>
        <va-process-list-item header="File your claim">
          <p>
            If you’re only claiming mileage, you can file online right now.
            We’ll just ask you a few questions—you won’t need receipts.
          </p>
          <va-link-action
            onClick={e => onNext(e)}
            href="javascript0:void"
            text="File a mileage only claim"
          />

          <p>
            If you’re claiming other expenses, like lodging, meals, or tolls,
            you will need receipts for these expenses. You can file online
            through the Beneficiary Travel Self Service System (BTSSS), by mail,
            or in person.
          </p>
          <va-link
            href="https://www.va.gov/health-care/get-reimbursed-for-travel-pay/"
            text="Learn how to file claims for other expenses"
          />
        </va-process-list-item>
      </va-process-list>
      <va-alert status="info" visible>
        <h3 id="set-up-direct-deposit" slot="headline">
          Set up direct deposit
        </h3>
        <p className="vads-u-margin-y--0">
          You have to set up direct deposit to receive travel reimbursement. If
          you’ve already done this, no additional steps are needed.
        </p>
        <va-link
          external
          href="https://www.cep.fsc.va.gov/"
          text="Set up direct deposit"
        />
      </va-alert>
      <div
        className="omb-info--container vads-u-margin-bottom--3"
        style={{ paddingLeft: '0px' }}
      >
        <va-omb-info
          res-burden={10}
          omb-number="2900-0798"
          exp-date="11/30/2027"
        />
      </div>

      <h3>Need help?</h3>
      <hr />
      <HelpTextContent />
    </article>
  );
};

export default IntroductionPage;
