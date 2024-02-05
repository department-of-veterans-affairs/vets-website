import React from 'react';
import { addDays, isValid } from 'date-fns';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { formatDate } from '../../../combined/utils/helpers';

const ContactDMC = () => (
  <span className="vads-u-margin-x--0p5">
    <va-telephone contact={CONTACTS.DMC || '8008270648'} uswds /> (or{' '}
    <va-telephone
      contact={CONTACTS.DMC_OVERSEAS || '6127136415'}
      international
      uswds
    />{' '}
    from overseas)
  </span>
);

export const getDebtDetailsCardContent = (debt, dateOfLetter, amountDue) => {
  const endDate = (date, days) => {
    return isValid(new Date(date))
      ? formatDate(addDays(new Date(date), days))
      : '';
  };

  switch (debt.diaryCode) {
    case '71':
      return {
        headerText: 'Contact us to verify your military status',
        status: 'info',
        showIcon: false,
        showLinks: false,
        bodyText: (
          <p>
            Please contact us through IRIS or call us at <ContactDMC /> to
            verify your military status. We’re here Monday through Friday, 7:30
            a.m. to 7:00 p.m. ET.
          </p>
        ),
      };
    case '109':
      return {
        headerText: `Pay your balance now or request help by ${endDate(
          dateOfLetter,
          30,
        )} to avoid more interest charges`,
        status: 'info',
        showIcon: false,
        showLinks: true,
        showMakePayment: true,
        showRequestHelp: true,
        bodyText: (
          <p>
            We’ve added interest to your balance. To avoid more interest charges
            or further collection action, you must pay your full balance or
            request financial help before ${endDate(dateOfLetter, 30)}. If you
            don’t this debt may be referred to the U.S. Department of the
            Treasury.
          </p>
        ),
      };
    case '117':
      return {
        headerText: `Pay your ${amountDue} balance in full or request help by ${endDate(
          dateOfLetter,
          60,
        )}`,
        status: 'info',
        showIcon: false,
        showLinks: true,
        showMakePayment: true,
        showRequestHelp: true,
        bodyText: (
          <p>
            To avoid further collection action on your bill, you must pay your
            full balance or request financial help before{' '}
            {endDate(dateOfLetter, 60)}. If you don’t, this debt may be referred
            to the U.S. Department of the Treasury.
          </p>
        ),
      };
    case '123':
      return {
        headerText: `Pay your ${amountDue} balance now or request help by ${endDate(
          dateOfLetter,
          60,
        )}`,
        status: 'info',
        showIcon: false,
        showLinks: true,
        showMakePayment: true,
        showRequestHelp: true,
        bodyText: (
          <p>
            To avoid your debt being referred to the U.S. Department of the
            Treasury, you must pay your full balance or request financial help
            before {endDate(dateOfLetter, 60)}.
          </p>
        ),
      };
    case '212':
      return {
        headerText: 'Contact us to update your address',
        status: 'info',
        showIcon: false,
        showLinks: false,
        bodyText: (
          <p>
            Please contact us through IRIS or call us at <ContactDMC /> to
            update your address. We’re here Monday through Friday, 7:30 a.m. to
            7:00 p.m. ET.
          </p>
        ),
      };
    case '815':
      return {
        headerText: `Pay your one time payment as part of your compromise agreement by ${endDate(
          dateOfLetter,
          30,
        )}`,
        status: 'info',
        showIcon: false,
        showLinks: true,
        showMakePayment: true,
        showRequestHelp: false,
        bodyText: (
          <p>Your compromise offer must be paid with a single payment.</p>
        ),
      };
    case '061':
    case '065':
    case '070':
    case '440':
    case '442':
    case '448':
    case '453':
      return {
        headerText: "We've paused collection on this debt as you requested",
        status: 'info',
        showIcon: true,
        showLinks: true,
        showMakePayment: true,
        showRequestHelp: true,
        bodyText: (
          <p>
            We’ll let you know when we start collecting on this debt again. You
            don’t have to do anything until that time.
          </p>
        ),
      };
    case '811':
      return {
        headerText:
          'Continue making monthly payments while we review your compromise offer',
        status: 'info',
        showIcon: false,
        showLinks: true,
        showMakePayment: true,
        showRequestHelp: false,
        bodyText: (
          <p>
            We’ll send you a letter with our decision. Please continue to make
            payments monthly while we complete our review. <br />
            <br />
            <strong>
              Your next payment is due by {endDate(dateOfLetter, 30)}.
            </strong>
          </p>
        ),
      };
    case '816':
      return {
        headerText: "We're processing your compromise payment",
        status: 'info',
        showIcon: true,
        showLinks: false,
        showMakePayment: false,
        showRequestHelp: false,
        bodyText: (
          <p>
            Please check your debt balance again soon. If it isn’t adjusted to
            reflect your payment within 30 days, call us at <ContactDMC />,
            Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.
          </p>
        ),
      };
    case '002':
    case '005':
    case '032':
    case '609':
      return {
        headerText: `We're updating your account`,
        status: 'info',
        showIcon: true,
        showLinks: false,
        showMakePayment: false,
        showRequestHelp: false,
        bodyText: (
          <p>
            Please check back in 1 week for updates. If your account shows the
            same information then call us at <ContactDMC />, Monday through
            Friday, 7:30 a.m. to 7:00 p.m. ET.
          </p>
        ),
      };
    case '321':
    case '400':
    case '420':
    case '421':
    case '422':
    case '425':
    case '627':
      return {
        headerText: `We're updating your account`,
        status: 'info',
        showIcon: true,
        showLinks: false,
        showMakePayment: false,
        showRequestHelp: false,
        bodyText: (
          <p>
            Please check back in 30 days for updates. If your account shows the
            same information then call us at <ContactDMC />, Monday through
            Friday, 7:30 a.m. to 7:00 p.m. ET.
          </p>
        ),
      };
    case '080':
    case '850':
    case '852':
    case '860':
    case '855':
      return {
        headerText: `Contact the U.S. Department of the Treasury to pay this ${amountDue} debt`,
        status: 'info',
        showIcon: false,
        showLinks: true,
        showMakePayment: true,
        showRequestHelp: true,
        bodyText: (
          <p>
            Call the U.S. Department of the Treasury’s Debt Management Services
            at{' '}
            <va-telephone
              className="vads-u-color--base "
              contact={CONTACTS.TREASURY_DMS}
              uswds
            />
            , 8:30 a.m. to 6:30 p.m. ET. Don’t send us a payment directly. This
            will delay posting the payment to your account and the Treasury
            Department may continue adding fees and interest.
          </p>
        ),
      };
    case '081':
    case '500':
    case '510':
    case '503':
      return {
        status:
          'We’re referring this debt to the U.S. Department of the Treasury today.',
        nextStep: (
          <span data-testid="diary-code-500-next-step">
            <p>
              <strong>Next step: </strong>
              Please pay the full amount online or by phone now to prevent
              referral. If we don’t receive your payment today we’re required by
              law to refer your debt to the U.S. Department of the Treasury.
            </p>
            <p>
              <a href="https://www.pay.va.gov/">Pay online now</a>
            </p>
            <p>
              Or make a payment over the phone at
              <ContactDMC className="vads-u-margin-left--0p5" />. We’re here
              Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.
            </p>
          </span>
        ),
      };
    case '100':
    case '102':
    case '130':
    case '140':
      return {
        headerText: `Pay your ${amountDue} balance now or request help by ${endDate(
          dateOfLetter,
          30,
        )}`,
        status: 'info',
        showIcon: false,
        showLinks: true,
        showMakePayment: true,
        showRequestHelp: true,
        bodyText: (
          <p>
            To avoid collection actions on your bill, you must pay your full
            balance or request financial help before {endDate(dateOfLetter, 30)}
            . If you don’t, this debt may be referred to the U.S. Department of
            the Treasury.
          </p>
        ),
      };
    case '430':
    case '431':
      return {
        headerText: `We're offsetting your education benefits each month until your debt is paid`,
        status: 'info',
        showIcon: true,
        showLinks: false,
        showMakePayment: false,
        showRequestHelp: false,
        bodyText: (
          <p>
            If you’d like to pay in full now, call us first to ensure you don’t
            overpay. If you stop receiving VA benefits, call us to set up a new
            payment plan. We can be reached at{' '}
            <ContactDMC className="vads-u-margin-left--0p5" />. We’re here
            Monday through Friday, 7:30 a.m. to 7:00 p.m. ET. <br />
            <br />
            If reduced payments are causing you hardship, you can{' '}
            <a href="/manage-va-debt/request-debt-help-form-5655">
              request help with your debt
            </a>
          </p>
        ),
      };
    case '450':
    case '101':
    case '602':
    case '607':
    case '608':
    case '610':
    case '611':
    case '614':
    case '615':
    case '617':
      return {
        headerText: `We're offsetting your benefit payments each month until your debt is paid`,
        status: 'info',
        showIcon: true,
        showLinks: false,
        showMakePayment: false,
        showRequestHelp: false,
        bodyText: (
          <p>
            If you’d like to pay in full now, call us first to ensure you don’t
            overpay. If you stop receiving VA benefits, call us to set up a new
            payment plan. We can be reached at{' '}
            <ContactDMC className="vads-u-margin-left--0p5" />. We’re here
            Monday through Friday, 7:30 a.m. to 7:00 p.m. ET. <br />
            <br />
            If reduced payments are causing you hardship, you can{' '}
            <a href="/manage-va-debt/request-debt-help-form-5655">
              request help with your debt
            </a>
          </p>
        ),
      };
    case '449':
      return {
        headerText: `Pay your balance now or request help by ${endDate(
          dateOfLetter,
          30,
        )}`,
        status: 'info',
        showIcon: false,
        showLinks: true,
        showMakePayment: true,
        showRequestHelp: true,
        bodyText: (
          <p>
            To avoid late fees or further collection action on your bill, you
            must pay your full balance or request financial help before{' '}
            {endDate(dateOfLetter, 30)}.
          </p>
        ),
      };
    case '439':
    case '459':
      return {
        headerText: `Pay your balance now or request help by ${endDate(
          dateOfLetter,
          30,
        )}`,
        status: 'info',
        showIcon: false,
        showLinks: true,
        showMakePayment: true,
        showRequestHelp: true,
        bodyText: (
          <p>
            To avoid late fees or further collection action on your bill, you
            must pay your full balance or request financial help before{' '}
            {endDate(dateOfLetter, 30)}. If you don’t, this debt may be referred
            to the U.S. Department of the Treasury.
          </p>
        ),
      };
    case '600':
    case '601':
      return {
        headerText:
          'Continue making monthly payments until your balance is paid',
        status: 'info',
        showIcon: false,
        showLinks: true,
        showMakePayment: true,
        showRequestHelp: true,
        bodyText: (
          <p>Your next payment is due by {endDate(dateOfLetter, 30)}.</p>
        ),
      };
    case '603':
    case '613':
      return {
        headerText: `Make a payment on your ${amountDue} balance now or request help by ${endDate(
          dateOfLetter,
          30,
        )}`,
        status: 'info',
        showIcon: false,
        showLinks: true,
        showMakePayment: true,
        showRequestHelp: true,
        bodyText: (
          <p>
            To avoid late fees or collection action on your bill, you must make
            a payment on your balance or request financial help before{' '}
            {endDate(dateOfLetter, 30)}.
          </p>
        ),
      };
    case '655':
    case '817':
      return {
        headerText:
          'Submit a Financial Status Report so that we can make a decision on your request',
        status: 'info',
        showIcon: false,
        showLinks: true,
        showMakePayment: true,
        showRequestHelp: true,
        bodyText: (
          <p>
            You can request a waiver, compromise, or extended monthly payment
            plan by filling out the Financial Status Report (VA FORM 5655)
            online or by mail.
          </p>
        ),
      };
    case '680':
      return {
        headerText: `Pay your ${amountDue} balance now or request help`,
        status: 'info',
        showIcon: false,
        showLinks: true,
        showMakePayment: true,
        showRequestHelp: true,
        bodyText: (
          <p>
            To avoid collection actions on your bill, you must pay your full
            balance or request financial help.
          </p>
        ),
      };
    case '681':
    case '682':
      return {
        headerText: `The U.S. Department of the Treasury is offsetting your federal payments until your debt is paid`,
        status: 'info',
        showIcon: false,
        showLinks: true,
        showMakePayment: false,
        showRequestHelp: true,
        bodyText: (
          <p>
            If you’d like to pay in full now, call the U.S. Department of the
            Treasury’s Debt. Management Services at{' '}
            <va-telephone
              className="vads-u-color--base "
              contact={CONTACTS.TREASURY_DMS}
              uswds
            />
            , 8:30 a.m. to 6:30 p.m. ET. Don’t send us a payment directly. This
            will delay posting the payment to your account and the Treasury
            Department may continue adding fees and interest.
          </p>
        ),
      };
    case '801':
    case '802':
    case '803':
    case '804':
    case '809':
    case '820':
      return {
        headerText: `Continue making monthly payments while we review your waiver request`,
        status: 'info',
        showIcon: false,
        showLinks: true,
        showMakePayment: true,
        showRequestHelp: false,
        bodyText: (
          <p>
            We’ll send you a letter with our decision. Please continue to make
            payments monthly while we complete our review. <br />
            <br />
            <strong>
              Your next payment is due by {endDate(dateOfLetter, 30)}.
            </strong>
          </p>
        ),
      };
    case '822':
      return {
        headerText: `Continue making monthly payments while we review your dispute`,
        status: 'info',
        showIcon: false,
        showLinks: true,
        showMakePayment: true,
        showRequestHelp: false,
        bodyText: (
          <p>
            We’ll send you a letter with our decision. Please continue to make
            payments monthly while we complete our review. <br />
            <br />
            <strong>
              Your next payment is due by {endDate(dateOfLetter, 30)}.
            </strong>
          </p>
        ),
      };
    case '825':
      return {
        headerText: `Continue making monthly payments while we review your request for a hearing`,
        status: 'info',
        showIcon: false,
        showLinks: true,
        showMakePayment: true,
        showRequestHelp: false,
        bodyText: (
          <p>
            We’ll send you a letter with our decision. Please continue to make
            payments monthly while we complete our review. <br />
            <br />
            <strong>
              Your next payment is due by {endDate(dateOfLetter, 30)}.
            </strong>
          </p>
        ),
      };
    case '821':
      return {
        headerText: `Continue making monthly payments while we review your Notice of Disagreement`,
        status: 'info',
        showIcon: false,
        showLinks: true,
        showMakePayment: true,
        showRequestHelp: false,
        bodyText: (
          <p>
            We’ll send you a letter with our decision. Please continue to make
            payments monthly while we complete our review. <br />
            <br />
            <strong>
              Your next payment is due by {endDate(dateOfLetter, 30)}.
            </strong>
          </p>
        ),
      };
    case '481':
    case '482':
    case '483':
    case '484':
    default:
      return {
        headerText: `We're reviewing your account`,
        status: 'info',
        showIcon: true,
        showLinks: false,
        showMakePayment: false,
        showRequestHelp: false,
        bodyText: <p>You don’t need to do anything at this time.</p>,
      };
  }
};
