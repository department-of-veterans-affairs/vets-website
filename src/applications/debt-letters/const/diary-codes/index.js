import React from 'react';
import moment from 'moment';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/formation-react/Telephone';

export const diaryCodes = Object.freeze({
  '71': 'Pending Veteran deployment verification',
  '109': 'Pending payment',
  '117': 'Pending payment',
  '123': 'Pending payment',
  '212': 'Pending Veteran address',
  '450': 'Pending automatic benefit offset',
  '811': 'Compromise offer is being reviewed',
  '815': 'Compromise offer accepted, pending payment',
  '816': 'Compromise offer payment received',
  '821':
    'Your notice of disagreement/reconsideration request is being reviewed',
  '822': 'Your dispute is being reviewed',
  '825': 'Your waiver/hearing request is being reviewed',
  '430': 'Pending automatic benefit offset',
  '431': 'Pending automatic benefit offset',
  '002': 'Pending review by the VA',
  '005': 'Pending review by the VA',
  '032': 'Pending review by the VA',
  '609': 'Pending review by the VA',
  '061': 'Debt collection suspended',
  '065': 'Debt collection suspended',
  '070': 'Debt collection suspended',
  '440': 'Debt collection suspended',
  '442': 'Debt collection suspended',
  '448': 'Debt collection suspended',
  '453': 'Debt collection suspended',
  '080': 'Referred to the Department of the Treasury',
  '850': 'Referred to the Department of the Treasury',
  '852': 'Referred to the Department of the Treasury',
  '860': 'Referred to the Department of the Treasury',
  '855': 'Referred to the Department of the Treasury',
  '081': 'Debt is pending referral to the Department of the Treasury',
  '500': 'Debt is pending referral to the Department of the Treasury',
  '510': 'Debt is pending referral to the Department of the Treasury',
  '503': 'Debt is pending referral to the Department of the Treasury',
  '100': 'Pending payment',
  '102': 'Pending payment',
  '130': 'Pending payment',
  '140': 'Pending payment',
  '101': 'Pending automatic benefit offset',
  '602': 'Pending automatic benefit offset',
  '607': 'Pending automatic benefit offset',
  '608': 'Pending automatic benefit offset',
  '610': 'Pending automatic benefit offset',
  '611': 'Pending automatic benefit offset',
  '614': 'Pending automatic benefit offset',
  '615': 'Pending automatic benefit offset',
  '617': 'Pending automatic benefit offset',
  '321': 'Pending review by the VA',
  '400': 'Pending review by the VA',
  '420': 'Pending review by the VA',
  '421': 'Pending review by the VA',
  '422': 'Pending review by the VA',
  '425': 'Pending review by the VA',
  '627': 'Pending review by the VA',
  '439': 'Debt suspension expired, awaiting payment',
  '449': 'Debt suspension expired, awaiting payment',
  '459': 'Debt suspension expired, awaiting payment',
  '481': 'Pending review by the VA',
  '482': 'Pending review by the VA',
  '483': 'Pending review by the VA',
  '484': 'Pending review by the VA',
  '600': 'Pending payment',
  '601': 'Pending payment',
  '603': 'Payment overdue',
  '613': 'Payment overdue',
  '655': 'Pending financial status report',
  '817': 'Pending financial status report',
  '680': 'Pending payment',
  '681': 'Pending payment',
  '682': 'Pending payment',
  '801': 'Your waiver request is being reviewed',
  '802': 'Your waiver request is being reviewed',
  '803': 'Your waiver request is being reviewed',
  '804': 'Your waiver request is being reviewed',
  '809': 'Your waiver request is being reviewed',
  '820': 'Your waiver request is being reviewed',
});

const ContactDMC = () => (
  <span>
    {CONTACTS.DMC ? <Telephone contact={CONTACTS.DMC} /> : '800-827-0648'} (or{' '}
    {CONTACTS.DMC_OVERSEAS ? (
      <Telephone
        contact={CONTACTS.DMC_OVERSEAS}
        pattern={PATTERNS.OUTSIDE_US}
      />
    ) : (
      '1-612-713-6415'
    )}{' '}
    from overseas)
  </span>
);

export const renderAdditionalInfo = (diaryCode, dateOfLetter) => {
  const endDate = (date, days) => {
    return moment(date)
      .add(days, 'days')
      .format('MMMM Do, YYYY,');
  };

  switch (diaryCode) {
    case '71':
      return (
        <p>
          <strong>Next step: </strong>
          Please{' '}
          <a href="https://iris.custhelp.va.gov/app/ask">
            contact us through IRIS
          </a>{' '}
          or call us at <ContactDMC /> to verify your military status. We’re
          here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.
        </p>
      );
    case '109':
      return (
        <p>
          <strong>Next step: </strong>
          Please pay or contact us about payment options now to avoid more late
          charges, interest, or collection actions. We're here at 800-827-0648
          (or 1-612-713-6415 from overseas), Monday through Friday, 7:30 a.m. to
          7:00 p.m. ET.{' '}
          <a href="#howDoIPay" className="vads-u-margin-y--2">
            Review payment options
          </a>
        </p>
      );
    case '117':
      return (
        <>
          <p>
            <strong>Next step: </strong>
            Please pay now or contact us about payment options by{' '}
            <strong> {dateOfLetter && endDate(dateOfLetter, 60)} </strong> to
            avoid additional collection action. These include having your debt
            reported to credit reporting agencies or referred to the U.S.
            Department of the Treasury.
          </p>
          <p>
            You can{' '}
            <a href="https://iris.custhelp.va.gov/app/ask">
              contact us through IRIS
            </a>{' '}
            or call us at <ContactDMC />. We’re here Monday through Friday, 7:30
            a.m. to 7:00 p.m. ET.{' '}
            <a href="#howDoIPay" className="vads-u-margin-y--2">
              Review payment options
            </a>
          </p>
        </>
      );
    case '123':
      return (
        <>
          <p>
            <strong>Next step: </strong>
            Please pay now or contact us about payment options by
            <strong> {dateOfLetter && endDate(dateOfLetter, 60)} </strong>
            to avoid collection actions. If you don't pay or make other
            arrangements with us by this date, we're required by law to refer
            your debt to the U.S. Department of the Treasury.
          </p>
          <p>
            You can{' '}
            <a href="https://iris.custhelp.va.gov/app/ask">
              contact us through IRIS
            </a>{' '}
            or call us at <ContactDMC />. We’re here Monday through Friday, 7:30
            a.m. to 7:00 p.m. ET.{' '}
            <a href="#howDoIPay" className="vads-u-margin-y--2">
              Review payment options
            </a>
          </p>
        </>
      );
    case '212':
      return (
        <p>
          <strong>Next step: </strong>
          Please{' '}
          <a href="https://iris.custhelp.va.gov/app/ask">
            contact us through IRIS
          </a>{' '}
          or call us at <ContactDMC /> to update your address. We’re here Monday
          through Friday, 7:30 a.m. to 7:00 p.m. ET.
        </p>
      );
    case '815':
      return (
        <p>
          <strong>Next step: </strong>
          Please pay the amount you offered as a compromise within
          <strong> 30 days </strong>
          of the date in your acceptance letter.{' '}
          <a href="#howDoIPay" className="vads-u-margin-y--2">
            Review payment options
          </a>
        </p>
      );
    case '816':
      return (
        <p>
          <strong>Next step: </strong>
          Please check your debt balance again soon. If it isn't adjusted to
          reflect your payment within
          <strong> 30 days </strong>, call us at 800-827-0648 (or 1-612-713-6415
          from overseas). We’re here Monday through Friday, 7:30 a.m. to 7:00
          p.m. ET.
        </p>
      );
    case '002':
    case '005':
    case '032':
    case '609':
      return (
        <p>
          <strong>Next step: </strong>
          Please check back in 1 week for updates. If your account shows the
          same information then, call us at 800-827-0648 (or 1-612-713-6415 from
          overseas). We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m.
          ET.
        </p>
      );
    case '061':
    case '065':
    case '070':
    case '440':
    case '442':
    case '448':
    case '453':
      return (
        <p>
          <strong>Next step: </strong>
          We'll let you know when we start collecting on this debt again. You
          don't have to do anything until that time. But you can choose to pay
          part or all of the debt now if you'd like.{' '}
          <a href="#howDoIPay" className="vads-u-margin-y--2">
            Review payment options
          </a>
        </p>
      );
    case '080':
    case '850':
    case '852':
    case '860':
    case '855':
      return (
        <p>
          <strong>Next step: </strong>
          Call the U.S. Department of the Treasury's Debt Management Center at
          888-826-3127, 8:30 a.m. to 6:30 p.m. ET. Don't send us payment
          directly. This will delay posting of payment to your account. And the
          Treasury Department may continue adding fees and interest.
        </p>
      );
    case '081':
    case '500':
    case '510':
    case '503':
      return (
        <>
          <p>
            <strong>Next step: </strong>
            Please pay the full amount online or by phone now. If we don't
            receive your payment by <strong>[date/time]</strong>, we're required
            by law to refer your debt to the U.S. Department of the Treasury.
            After we do that, we can't help you manage your debt.
          </p>
          <p>
            <a href="https://www.pay.va.gov/">Pay online now</a> Or{' '}
            <strong>make</strong> a payment <strong>over the</strong> phone at
            <ContactDMC />. We’re here Monday through Friday, 7:30 a.m. to 7:00
            p.m. ET.
          </p>
        </>
      );
    case '100':
    case '102':
    case '130':
    case '140':
      return (
        <>
          <p>
            <strong>Next step: </strong>
            Please pay now or contact us to start making payments again to avoid
            collection actions. You can{' '}
            <a href="https://iris.custhelp.va.gov/app/ask">
              contact us through IRIS
            </a>{' '}
            or call us at <ContactDMC />. We’re here Monday through Friday, 7:30
            a.m. to 7:00 p.m. ET.{' '}
            <a href="#howDoIPay" className="vads-u-margin-y--2">
              Review payment options
            </a>
          </p>
        </>
      );
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
      return (
        <p>
          <strong>Next step: </strong>
          We'll keep offsetting your benefits each month until your debt is paid
          in full. If you'd like to pay in full now, please call us first to
          make sure you don't overpay. If you stop receiving VA benefits, call
          us to set up a new payment plan. We're here at 800-827-0648 (or
          1-612-713-6415 from overseas), Monday through Friday, 7:30 a.m. to
          7:00 p.m. ET.
        </p>
      );
    case '321':
    case '400':
    case '420':
    case '421':
    case '422':
    case '425':
    case '627':
      return (
        <p>
          <strong>Next step: </strong>
          Please check back in <strong> 30 days </strong> for updates. If your
          account shows the same information then, call us at 800-827-0648 (or
          1-612-713-6415 from overseas). We’re here Monday through Friday, 7:30
          a.m. to 7:00 p.m. ET.
        </p>
      );
    case '439':
    case '449':
    case '459':
      return (
        <p>
          <strong>Next step: </strong>
          Please{' '}
          <a href="https://iris.custhelp.va.gov/app/ask">
            contact us through IRIS
          </a>{' '}
          or call us at <ContactDMC /> to start making payments again to avoid
          collection actions. We’re here Monday through Friday, 7:30 a.m. to
          7:00 p.m. ET.
        </p>
      );
    case '481':
    case '482':
    case '483':
    case '484':
      return (
        <p>
          <strong>Next step: </strong>
          You don't need to do anything at this time.
        </p>
      );
    case '600':
    case '601':
      return (
        <p>
          <strong>Next step: </strong>
          Please continue to make payments. If you begin receiving VA benefits,
          call us to set up an automatic payment plan. We'll keep part of your
          benefit amount each month to pay your debt. We're here at 800-827-0648
          (or 1-612-713-6415 from overseas), Monday through Friday, 7:30 a.m. to
          7:00 p.m. ET.
        </p>
      );
    case '603':
    case '613':
      return (
        <p>
          <strong>Next step: </strong>
          Please pay the amount you agreed to in your monthly payment plan. To
          discuss about other payment options,{' '}
          <a href="https://iris.custhelp.va.gov/app/ask">
            contact us through IRIS
          </a>{' '}
          or call us at <ContactDMC />. We're here Monday through Friday, 7:30
          a.m. to 7:00 p.m. ET.{' '}
          <a href="#howDoIPay" className="vads-u-margin-y--2">
            Review payment options
          </a>
        </p>
      );
    case '655':
    case '817':
      return (
        <>
          <p>
            <strong>Next step: </strong>
            Please send us your completed Financial Status Report (VA Form 5655)
            now so we can make a decision on your waiver, compromise, or
            extended monthly payment plan request.{' '}
            <a href="https://www.va.gov/debtman/Financial_Status_Report.asp">
              Download VA Form 5655 (PDF)
            </a>
          </p>
          <p>
            If you need help with the form, read our{' '}
            <a href="https://www.va.gov/DEBTMAN/Most_Frequently_Asked_Questions.asp">
              frequently asked questions
            </a>{' '}
            or call us at <ContactDMC />. We’re here Monday through Friday, 7:30
            a.m. to 7:00 p.m. ET.
          </p>
        </>
      );
    case '680':
    case '681':
    case '682':
      return (
        <p>
          <strong>Next step: </strong>
          Please pay now or contact us about payment options by
          <strong> {dateOfLetter && endDate(dateOfLetter, 30)} </strong>
          to avoid late charges, interest, or collection actions. We're here at
          <ContactDMC />, Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.{' '}
          <a href="#howDoIPay" className="vads-u-margin-y--2">
            Review payment options
          </a>
        </p>
      );
    case '801':
    case '802':
    case '803':
    case '804':
    case '809':
    case '811':
    case '820':
    case '821':
    case '822':
    case '825':
      return (
        <p>
          <strong>Next step: </strong>
          We'll send you a letter with our decision. Please continue to make
          payments while we complete our review.{' '}
          <a href="#howDoIPay" className="vads-u-margin-y--2">
            Review payment options
          </a>
        </p>
      );
    default:
      return null;
  }
};
