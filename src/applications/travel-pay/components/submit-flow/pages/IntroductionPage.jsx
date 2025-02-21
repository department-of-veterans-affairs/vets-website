import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { HelpTextManage } from '../../HelpText';
import AppointmentErrorAlert from '../../alerts/AppointmentErrorAlert';
import { selectAppointment } from '../../../redux/selectors';
import { isPastAppt } from '../../../util/dates';
import { TRAVEL_PAY_INFO_LINK } from '../../../constants';
import { AppointmentInfoText } from '../../AppointmentDetails';

const IntroductionPage = ({ onStart }) => {
  const { data, error, isLoading } = useSelector(selectAppointment);

  return (
    <div>
      <h1 tabIndex="-1">File a travel reimbursement claim</h1>
      {isLoading && (
        <va-loading-indicator
          label="Loading"
          message="Please wait while we load the application for you."
          data-testid="travel-pay-loading-indicator"
        />
      )}
      {error && <AppointmentErrorAlert />}
      {data && (
        <AppointmentInfoText appointment={data} isPast={isPastAppt(data)} />
      )}
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
            href={`${TRAVEL_PAY_INFO_LINK}#eligibility-for-general-health`}
            text="Travel reimbursement eligibility"
          />
        </va-process-list-item>
        <va-process-list-item header="File your claim">
          <p>
            If you’re only claiming mileage, you can file online right now.
            We’ll just ask you a few questions—you won’t need receipts.
          </p>
          {data &&
            isPastAppt(data) && (
              <va-link-action
                onClick={e => onStart(e)}
                href="javascript0:void"
                text="File a mileage only claim"
              />
            )}
          <p>
            If you’re claiming other expenses, like lodging, meals, or tolls,
            you will need receipts for these expenses. You can file online
            through the Beneficiary Travel Self Service System (BTSSS), by mail,
            or in person.
          </p>
          <va-link
            href={TRAVEL_PAY_INFO_LINK}
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
        className="omb-info--container vads-u-margin-y--3"
        style={{ paddingLeft: '0px' }}
      >
        <va-omb-info
          res-burden={10}
          omb-number="2900-0798"
          exp-date="11/30/2027"
        />
      </div>

      <va-need-help>
        <div slot="content">
          <HelpTextManage />
        </div>
      </va-need-help>
    </div>
  );
};

IntroductionPage.propTypes = {
  onStart: PropTypes.func,
};

export default IntroductionPage;
