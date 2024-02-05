import React from 'react';
import moment from 'moment';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { VaTelephone } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const ContactDMC = () => (
  <span className="vads-u-margin-x--0p5">
    <VaTelephone contact={CONTACTS.DMC || '800-827-0648'} uswds /> (or{' '}
    <VaTelephone
      contact={CONTACTS.DMC_OVERSEAS || '1-612-713-6415'}
      international
      uswds
    />{' '}
    from overseas)
  </span>
);

export const renderAdditionalInfo = (diaryCode, dateOfLetter, benefitType) => {
  const endDate = (date, days) =>
    moment(date, 'MM-DD-YYYY')
      .add(days, 'days')
      .format('MMMM Do, YYYY,');

  switch (diaryCode) {
    case '71':
      return {
        status:
          'We need to verify your military status to update your account.',
        nextStep: (
          <p>
            <strong>Next step: </strong>
            Please
            <a
              className="vads-u-margin-x--0p5"
              href="https://www.va.gov/contact-us/"
            >
              contact us online through Ask VA
            </a>
            or call us at <ContactDMC /> to verify your military status. We’re
            here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.
          </p>
        ),
      };
    case '109':
      return {
        status:
          'Your payment is past due, and we’re adding interest to the amount.',
        nextStep: (
          <>
            <p>
              <strong>Next step: </strong>
              Please pay now or contact us to start making payments again to
              avoid collection actions.
            </p>
            <p>
              You can
              <a
                className="vads-u-margin-x--0p5"
                href="https://www.va.gov/contact-us/"
              >
                contact us online through Ask VA
              </a>
              or call us at <ContactDMC className="vads-u-margin-left--0p5" />,
              We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.
              <a className="vads-u-margin-left--0p5" href="#howDoIPay">
                Review payment options
              </a>
            </p>
          </>
        ),
      };
    case '117':
      return {
        status: 'Your payment is past due.',
        nextStep: (
          <span data-testid="diary-code-117-next-step">
            <p>
              <strong>Next step: </strong>
              Please pay now or contact us about payment options by
              <strong className="vads-u-margin-x--0p5">
                {dateOfLetter && endDate(dateOfLetter, 60)}
              </strong>
              to avoid additional collection action. These include having your
              debt reported to credit reporting agencies or referred to the U.S.
              Department of the Treasury.
            </p>
            <p>
              You can
              <a
                className="vads-u-margin-x--0p5"
                href="https://www.va.gov/contact-us/"
              >
                contact us online through Ask VA
              </a>
              or call us at <ContactDMC className="vads-u-margin-left--0p5" />.
              We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.
              <a
                href="#howDoIPay"
                className="vads-u-margin-y--2 vads-u-margin-left--0p5"
              >
                Review payment options
              </a>
            </p>
          </span>
        ),
      };
    case '123':
      return {
        status: 'Your payment is past due.',
        nextStep: (
          <span data-testid="diary-code-123-next-step">
            <p>
              <strong>Next step: </strong>
              Please pay now or contact us about payment options by
              <strong className="vads-u-margin-x--0p5">
                {dateOfLetter && endDate(dateOfLetter, 60)}
              </strong>
              to avoid collection actions. If you don’t pay or make other
              arrangements with us by this date, we’re required by law to refer
              your debt to the U.S. Department of the Treasury.
            </p>
            <p>
              You can
              <a
                className="vads-u-margin-x--0p5"
                href="https://www.va.gov/contact-us/"
              >
                contact us online through Ask VA
              </a>
              or call us at <ContactDMC className="vads-u-margin-left--0p5" />.
              We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.
              <a
                href="#howDoIPay"
                className="vads-u-margin-y--2 vads-u-margin-left--0p5"
              >
                Review payment options
              </a>
            </p>
          </span>
        ),
      };
    case '212':
      return {
        status: 'We need your address to update your account.',
        nextStep: (
          <p>
            <strong>Next step: </strong>
            Please
            <a
              className="vads-u-margin-x--0p5"
              href="https://www.va.gov/contact-us/"
            >
              contact us online through Ask VA
            </a>
            or call us at <ContactDMC className="vads-u-margin-x--0p5" /> to
            update your address. We’re here Monday through Friday, 7:30 a.m. to
            7:00 p.m. ET.
          </p>
        ),
      };
    case '815':
      return {
        status: 'We’ve accepted your compromise payment.',
        nextStep: (
          <p>
            <strong>Next step: </strong>
            Please pay the amount you offered as a compromise within
            <strong> 30 days </strong>
            of the date in your acceptance letter.
            <a
              className="vads-u-margin-y--2 vads-u-margin-left--0p5"
              href="#howDoIPay"
            >
              Review payment options
            </a>
          </p>
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
        status: 'We’ve paused collection on this debt as you requested.',
        nextStep: (
          <p>
            We’ll let you know when we start collecting on this debt again. You
            don’t have to do anything until that time.
          </p>
        ),
      };
    case '811':
      return {
        status: 'We’re reviewing your compromise offer.',
        nextStep: (
          <p>
            <strong>Next step: </strong>
            We’ll send you a letter with our decision. Please continue to make
            payments while we complete our review.
            <a
              href="#howDoIPay"
              className="vads-u-margin-y--2 vads-u-margin-left--0p5"
            >
              Review payment options
            </a>
          </p>
        ),
      };
    case '816':
      return {
        status: 'We’ve received your compromise payment.',
        nextStep: (
          <p>
            Please check your debt balance again soon. If it isn’t adjusted to
            reflect your payment within 30 days, call us at
            <ContactDMC className="vads-u-margin-left--0p5" />. We’re here
            Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.
          </p>
        ),
      };
    case '002':
    case '005':
    case '032':
    case '609':
      return {
        status: 'We’re updating your account.',
        nextStep: (
          <p data-testid="diary-code-002-next-step">
            Please check back in 1 week for updates. If your account shows the
            same information then, call us at
            <ContactDMC className="vads-u-margin-left--0p5" />. We’re here
            Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.
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
        status: 'We’re updating your account.',
        nextStep: (
          <p>
            Please check back in 30 days for updates. If your account shows the
            same information then, call us at
            <ContactDMC className="vads-u-margin-left--0p5" />. We’re here
            Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.
          </p>
        ),
      };
    case '481':
    case '482':
    case '483':
    case '484':
      return {
        status: 'We’re reviewing your account.',
        nextStep: (
          <p>
            <strong>Next step: </strong>
            You don’t need to do anything at this time
          </p>
        ),
      };
    case '080':
    case '850':
    case '852':
    case '860':
    case '855':
      return {
        status: 'We referred this debt to the U.S. Department of the Treasury.',
        nextStep: (
          <p data-testid="diary-code-080-next-step">
            <strong>Next step: </strong>
            Call the U.S. Department of the Treasury’s Debt Management Center at{' '}
            <VaTelephone
              contact={CONTACTS.DMC_TREASURY || '888-826-3127'}
              uswds
            />
            , 8:30 a.m. to 6:30 p.m. ET. Don’t send us payment directly. This
            will delay posting of payment to your account. And the Treasury
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
        status: 'Your payment is due now.',
        nextStep: (
          <span data-testid="diary-code-100-next-step">
            <p>
              <strong>Next step: </strong>
              Please pay now or contact us to start making payments again to
              avoid collection actions. You can
              <a
                className="vads-u-margin-x--0p5"
                href="https://www.va.gov/contact-us/"
              >
                contact us online through Ask VA
              </a>
              or call us at <ContactDMC className="vads-u-margin-left--0p5" />.
              We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.
              <a
                className="vads-u-margin-y--2 vads-u-margin-left--0p5"
                href="#howDoIPay"
              >
                Review payment options
              </a>
            </p>
          </span>
        ),
      };
    case '101':
    case '430':
    case '431':
    case '450':
    case '602':
    case '607':
    case '608':
    case '610':
    case '611':
    case '614':
    case '615':
    case '617':
      // we need to have debt type available within this switch
      return {
        status: (
          <>
            We’re keeping part of your
            <span className="vads-u-margin-x--0p5">{benefitType}</span>
            payments each month to pay your debt (called monthly offsets).
          </>
        ),
        nextStep: (
          <p data-testid="diary-code-608-next-step">
            <strong>Next step: </strong>
            We’ll keep offsetting your benefits each month until your debt is
            paid in full. If you’d like to pay in full now, please call us first
            to make sure you don’t overpay. If you stop receiving VA benefits,
            call us to set up a new payment plan. We’re here at
            <ContactDMC className="vads-u-margin-left--0p5" />, Monday through
            Friday, 7:30 a.m. to 7:00 p.m. ET.
          </p>
        ),
      };
    case '439':
    case '449':
    case '459':
      return {
        status: 'We’ve restarted collection on this debt.',
        nextStep: (
          <p>
            <strong>Next step: </strong>
            Please
            <a
              className="vads-u-margin-x--0p5"
              href="https://www.va.gov/contact-us/"
            >
              contact us online through Ask VA
            </a>
            or call us at <ContactDMC className="vads-u-margin-x--0p5" /> to
            start making payments again to avoid collection actions. We’re here
            Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.
          </p>
        ),
      };
    case '600':
    case '601':
      return {
        status: 'Your payment is due.',
        nextStep: (
          <p data-testid="diary-code-600-next-step">
            <strong>Next step: </strong>
            Please continue to make payments. If you begin receiving VA
            benefits, call us to set up an automatic payment plan. We’ll keep
            part of your benefit amount each month to pay your debt. We’re here
            at <ContactDMC className="vads-u-margin-left--0p5" />, Monday
            through Friday, 7:30 a.m. to 7:00 p.m. ET.
          </p>
        ),
      };
    case '603':
    case '613':
      return {
        status: 'Your payment is past due.',
        nextStep: (
          <p>
            <strong>Next step: </strong>
            Please pay the amount you agreed to in your monthly payment plan. To
            discuss about other payment options,
            <a
              className="vads-u-margin-x--0p5"
              href="https://www.va.gov/contact-us/"
            >
              contact us online through Ask VA
            </a>
            or call us at <ContactDMC className="vads-u-margin-left--0p5" />.
            We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.
            <a
              className="vads-u-margin-y--2 vads-u-margin-left--0p5"
              href="#howDoIPay"
            >
              Review payment options
            </a>
          </p>
        ),
      };
    case '655':
    case '817':
      return {
        status:
          'We need your completed Financial Status Report to make a decision on your request.',
        nextStep: (
          <>
            <p>
              <strong>Next step: </strong>
              Please send us your completed Financial Status Report (VA Form
              5655) now so we can make a decision on your waiver, compromise, or
              extended monthly payment plan request.
              <a
                className="vads-u-margin-left--0p5"
                href="https://www.va.gov/debtman/Financial_Status_Report.asp"
              >
                Download VA Form 5655 (PDF)
              </a>
            </p>
            <p>
              If you need help with the form, read our
              <a
                className="vads-u-margin-x--0p5"
                href="https://www.va.gov/DEBTMAN/Most_Frequently_Asked_Questions.asp"
              >
                frequently asked questions
              </a>
              or call us at <ContactDMC className="vads-u-margin-left--0p5" />.
              We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.
            </p>
          </>
        ),
      };
    case '680':
    case '681':
    case '682':
      return {
        status: 'Your payment is due.',
        nextStep: (
          <p>
            <strong>Next step: </strong>
            Please pay now or contact us about payment options by
            <strong className="vads-u-margin-left--0p5">
              {dateOfLetter && endDate(dateOfLetter, 30)}
            </strong>
            to avoid collection actions. You can
            <a
              className="vads-u-margin-x--0p5"
              href="https://www.va.gov/contact-us/"
            >
              contact us online through Ask VA
            </a>
            or call us at <ContactDMC className="vads-u-margin-left--0p5" />,
            We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.
            <a
              href="#howDoIPay"
              className="vads-u-margin-y--2 vads-u-margin-left--0p5"
            >
              Review payment options
            </a>
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
        status: 'We’re reviewing your waiver request.',
        nextStep: (
          <p>
            <strong>Next step: </strong>
            We’ll send you a letter with our decision. Please continue to make
            payments while we complete our review.
            <a
              className="vads-u-margin-y--2 vads-u-margin-left--0p5"
              href="#howDoIPay"
            >
              Review payment options
            </a>
          </p>
        ),
      };
    case '822':
      return {
        status: 'We’re reviewing your debt dispute.',
        nextStep: (
          <p>
            <strong>Next step: </strong>
            We’ll send you a letter with our decision. Please continue to make
            payments while we complete our review.
            <a
              className="vads-u-margin-y--2 vads-u-margin-left--0p5"
              href="#howDoIPay"
            >
              Review payment options
            </a>
          </p>
        ),
      };
    case '825':
      return {
        status: 'We’re reviewing your request for a waiver or hearing.',
        nextStep: (
          <p>
            <strong>Next step: </strong>
            We’ll send you a letter with our decision. Please continue to make
            payments while we complete our review.
            <a
              className="vads-u-margin-y--2 vads-u-margin-left--0p5"
              href="#howDoIPay"
            >
              Review payment options
            </a>
          </p>
        ),
      };
    case '821':
      return {
        status: 'We’re reviewing your notice of disagreement.',
        nextStep: (
          <p>
            <strong>Next step: </strong>
            We’ll send you a letter with our decision. Please continue to make
            payments while we complete our review.
            <a
              className="vads-u-margin-y--2 vads-u-margin-left--0p5"
              href="#howDoIPay"
            >
              Review payment options
            </a>
          </p>
        ),
      };
    default:
      return {
        status: 'We’re updating your account.',
        nextStep: (
          <p data-testid="diary-code-default-next-step">
            <strong>Next step: </strong>
            Please check back in 1 week for updates. If your account shows the
            same information then, call us at
            <ContactDMC className="vads-u-margin-left--0p5" />, Monday through
            Friday, 7:30 a.m. to 7:00 p.m. ET.
          </p>
        ),
      };
  }
};

export const renderLetterHistory = diaryCode => {
  switch (diaryCode) {
    case '100':
    case '101':
    case '102':
    case '109':
      return (
        <>
          <p className="vads-u-margin-bottom--0">
            <strong>First demand letter</strong>
          </p>
          <p className="vads-u-margin-top--0">
            A letter was sent to notify you of your debt and provide information
            on how to resolve it.
          </p>
        </>
      );
    case '117':
      return (
        <>
          <p className="vads-u-margin-bottom--0">
            <strong>Second demand letter</strong>
          </p>
          <p className="vads-u-margin-top--0">
            A letter was sent to inform you that failure to pay or contact the
            DMC within 60 days would result in the debt being reported to Credit
            Reporting Agencies.
          </p>
        </>
      );
    case '123':
      return (
        <>
          <p className="vads-u-margin-bottom--0">
            <strong>Third demand letter</strong>
          </p>
          <p className="vads-u-margin-top--0">
            A letter was sent to inform you that failure to pay or contact the
            DMC within 30 days would result in the debt being referred to the
            Department of Treasury for collection. This referral could result in
            your state or federal payments being withheld.
          </p>
        </>
      );
    case '130':
      return (
        <>
          <p className="vads-u-margin-bottom--0">
            <strong>Debt increase letter</strong>
          </p>
          <p className="vads-u-margin-top--0">
            A letter was sent to inform you that your debt’s balance has
            increased due to additional benefit over payments being made to you.
          </p>
        </>
      );
    default:
      return null;
  }
};
