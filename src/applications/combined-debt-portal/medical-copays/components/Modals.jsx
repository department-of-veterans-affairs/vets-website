import React, { useState } from 'react';
import {
  VaModal,
  VaButton,
} from '@department-of-veterans-affairs/web-components/react-bindings';
import PropTypes from 'prop-types';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const Modals = ({ children, title }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="vads-u-margin-y--4">
      <VaButton secondary onClick={() => setVisible(true)} text={title} />
      <VaModal
        onCloseEvent={() => setVisible(false)}
        visible={visible}
        modalTitle={title}
        large
      >
        {children}
      </VaModal>
    </div>
  );
};

Modals.Rights = () => (
  <>
    <h3>Collection</h3>
    <p>
      The U.S. Department of Veterans Affairs (VA) is required to collect debts
      owed to the government. Action must be taken within sixty (60) days from
      the initial billing statement to pay your debt in full or establish a
      payment plan or your account may be referred for further collection
      action. You have the right to inspect and copy the records related to the
      debt. You also have the right to establish a payment plan. You have the
      right to submit a compromise offer. Collection action includes referring
      your delinquent balance to the Department of Treasury's Cross-Servicing
      Program and Treasury Offset Program, which will include offset of any
      federal and state payments to which you are entitled. This includes tax
      refunds, social security benefits and salary or retirement benefits. In
      addition, the Department of Treasury may refer your account to private
      collection agencies, which will result in additional fees and interest
      being added to your account. You may also be subject to garnishment of
      non- federal wages under Treasury's Administrative Wage Garnishment
      Program. Other collection actions include offset of any current or future
      VA benefits to which you may become entitled. We may also report your
      delinquent account to credit reporting agencies sixty (60) days from the
      date of the initial billing statement. Additional information can be found
      at:{' '}
      <va-link
        href="https://www.va.gov/healthbenefits/cost/"
        text="www.va.gov/healthbenefits/cost/"
      />
      .
    </p>

    <h3>Pay your bill</h3>
    <p>
      Pay the debt in full by the balance due date on the initial billing
      statement to avoid late charges and collection action:
    </p>
    <ul>
      <li>
        <strong>In Person:</strong> At your local Veteran Affairs Medical
        Centers Agent Cashier's Office
      </li>
      <li>
        <strong> By Phone:</strong> Contact VA at{' '}
        <va-telephone international contact="8888274817" />
      </li>
      <li>
        <strong>By Mail:</strong> Make check or money order payable to "VA" and
        include account number and payment stub. Submit to: <br />
        Department of Veterans Affairs
        <br /> P.O. Box 3978
        <br />
        Portland, OR 97208-3978
      </li>
    </ul>

    <h3>Late charges</h3>
    <p>
      The VA is required to assess late charges on balances which remain unpaid
      thirty (30) days after the statement date. These charges consist of
      interest and administrative fees at rates established each year. Interest
      will be charged from the date charges first appear on the statement. You
      can avoid these charges by making timely payments by the balance due date
      on the initial billing statement. A monthly administrative cost or
      collection fee will be added to your debt if, within thirty (30) days of
      the date of the statement on which charges first appear, full payment of
      the debt is not received or a repayment plan agreement is not approved. If
      an installment repayment plan is established and any installment is not
      received by the due date, the monthly administrative cost or collection
      fee will thereafter be charged until the debt is paid. Other collection
      costs may also be added to the debt if additional collection actions
      become necessary.
    </p>

    <h3>Waiver</h3>
    <p>
      You have the right to request a waiver of part or all of your debt. If the
      waiver is granted you will not be required to pay the amount waived. To do
      so, submit an explanation and a completed Financial Status Report (VA Form
      5655) found at:{' '}
      <va-link
        href="https://www.va.gov/manage-va-debt/request-debt-help-form-5655/introduction"
        text="Financial Status Report (VA Form 5655)"
      />
      . Your explanation should include why you are not responsible for the debt
      and any undue hardship the payment of the debt would cause you. You have
      the right to request a hearing in connection with your request for a
      waiver. To do so, submit a written request for hearing with your waiver
      request. VA will notify you of the date, time and place where the hearing
      will be held. Refer to the "Customer Service" and "Submitting Your
      Request" sections below for more information.
    </p>

    <h3>Compromise offer</h3>
    <p>
      You have the right to request a compromise. A compromise means you may
      propose a lesser amount as full settlement of the debt. To request a
      compromise, submit your request in writing to VA, specifying the dollar
      amount you are proposing VA should accept as payment in full, and a
      completed Financial status Report (VA Form 5655) found at:{' '}
      <va-link
        href="https://www.va.gov/manage-va-debt/request-debt-help-form-5655/introduction"
        text="Financial Status Report (VA Form 5655)"
      />
      . Refer to the “Customer Service” and “Submitting your Request” sections
      below for more information.
    </p>

    <h3>Repayment plan</h3>
    <p>
      You have the right to establish a monthly repayment plan at any time
      during your enrollment in VA health care if you cannot pay your debt in
      full. To do so, submit a completed Agreement to Pay Indebtedness (VA Form
      1100) found at:{' '}
      <va-link
        href="http://www.va.gov/vaforms/va/pdf/VA1100.pdf"
        text="www.va.gov/vaforms/va/pdf/VA1100.pdf"
      />
      . Indicate your proposed monthly payment amount in paragraph 1A. Include
      your first payment with the completed form. Make check or money order
      payable to "VA" and include the account number and payment stub. Refer to
      the "Customer Service" and "Submitting Your Request" sections below for
      more information.
    </p>

    <h3>Dispute the existence or amount of the debt </h3>
    <p>
      You have the right to dispute the existence or amount of the debt. To do
      so, submit a letter explaining why you question the validity or amount of
      the debt. To avoid late charges, you must submit a dispute by the balance
      due date on the initial billing statement. VA will not initiate collection
      if your dispute is received within sixty (60) days from the initial
      billing statement. If VA receives your notice later than sixty (60) days
      and collection has been initiated, it will continue while the dispute is
      being reviewed. If the dispute is resolved in your favor, all late charges
      will be removed from your account, and any amounts withheld from your VA
      benefits, federal payments, or wages will be refunded to you. Refer to the
      "Customer Service" and "Submitting Your Request" sections below for more
      information.
    </p>

    <h3>Hardship determination</h3>
    <p>
      You have the right to request a Hardship Determination which provides an
      exemption from future outpatient and inpatient copayments for the
      remaining calendar year. To do so, send a letter explaining any financial
      hardship these charges will cause you and a completed Request for Hardship
      Determination (VA Form 10-10HS) found at:{' '}
      <va-link
        href="http://www.va.gov/vaforms/medical/pdf/vha-10-10HS.pdf"
        text="www.va.gov/vaforms/medical/pdf/vha-10-10HS.pdf"
      />
      . If your gross household income has decreased, you may be eligible for
      enrollment in a higher Priority Group which may qualify you for copayment
      exemption. Submit a completed Health Benefits Renewal (VA form 10-10EZR)
      found at:{' '}
      <va-link
        href="http://www.1010ez.med.va.gov/"
        text="www.1010ez.med.va.gov"
      />{' '}
      to update your financial information. Refer to the "Customer Service" and
      "Submitting Your Request" sections below for more information.
    </p>

    <h3>Customer service</h3>
    <p>
      For additional assistance or if you are unable to access the forms online:
    </p>
    <ul>
      <li>
        <strong>In Person:</strong> Contact your Patient Advocate or Enrollment
        Coordinator at your local Veteran Affairs Medical Center
      </li>
      <li>
        <strong>By Phone:</strong> Contact VA at{' '}
        <va-telephone international contact={CONTACTS.HEALTH_RESOURCE_CENTER} />
      </li>
      <li>
        <strong>Online:</strong> Visit{' '}
        <va-link
          href="https://www.va.gov/healthbenefits/cost/"
          text="va.gov/healthbenefits/cost"
        />{' '}
        for additional information or{' '}
        <va-link href="http://www.va.gov/vaforms" text="www.va.gov/vaforms" />{' '}
        to retrieve VA forms.
      </li>
    </ul>

    <h3>Submitting your request</h3>
    <p>
      Submit the required VA forms or documents to apply for one of VA's
      Financial Hardship Programs:
    </p>
    <ul>
      <li>
        <strong>In Person:</strong> At your local Veterans Affairs Medical
        Center's Business Office or Health Administration Service Office
      </li>
      <li>
        <strong>By Mail:</strong> Send completed forms and/or other required
        documentation to the VA address at the top left of your statement to the
        attention of the Business Office/Health Administration Service Office
      </li>
    </ul>
    <p>
      For additional information, to request necessary forms or assistance in
      accessing forms online, contact VA at{' '}
      <va-telephone international contact={CONTACTS.HEALTH_RESOURCE_CENTER} />.
    </p>

    <h3>Representation</h3>
    <p>
      An accredited representative of a Veteran Service Organization or other
      service organization recognized by the Secretary of Veterans Affairs may
      represent you without charge. You may employ an attorney or VA accredited
      agent to assist you. The services of an attorney or accredited agent
      representing you in adjudicated proceedings before VA are subject to a fee
      limitation as set forth in 38 U.S.C 5904. If you desire representation and
      have not already designated a representative, contact VA at{' '}
      <va-telephone international contact={CONTACTS.HEALTH_RESOURCE_CENTER} />{' '}
      to request the necessary forms. If an attorney or accredited agent
      represents you before VA, a copy of any agreement between you and the
      attorney or accredited agent about the payment of the attorney's or
      agent's fees must be filed at the following address: Counsel to the
      Chairman (01C3), Board of Veterans Appeals, 810 Vermont Avenue N.W.,
      Washington D.C. 20420.
    </p>

    <h3>Notice to customers making payment by check</h3>
    <p>
      When you provide a check as payment, you authorize VA to either use
      information from your check to make a one-time electronic fund transfer
      from your account or to process the payment as a check transaction. When
      VA uses information from your check to make an electronic transfer, funds
      may be withdrawn from your account as soon as the day we process your
      payment, and you will not receive your check back from the financial
      institution. A Privacy Act Statement required by 5 U.S.C & 552a(e)(3)
      stating our authority for soliciting and collecting the information from
      your check, and explaining the purposes and routine uses which will be
      made of your check information, VA Notice of Privacy Practices, IB 10-163
      is available online at{' '}
      <va-link
        href="http://www.va.gov/vhapublications"
        text="www.va.gov/vhapublications"
      />{' '}
      or call toll free at{' '}
      <va-telephone international contact={CONTACTS.HEALTH_RESOURCE_CENTER} />{' '}
      to obtain a copy by mail. Furnishing the check information is voluntary,
      but a decision not to do so may require you to make payment by some other
      method.
    </p>

    <h3>Questions about payments</h3>
    <p>
      Payments made in the past ten (10) days may not have been applied to your
      account by the time your statement was prepared. If so, this payment will
      be reflected in your account on the next statement. For assistance in
      understanding your billing statement and assessed copayment charges
      contact VA at{' '}
      <va-telephone international contact={CONTACTS.HEALTH_RESOURCE_CENTER} />.
    </p>

    <h3>VA Privacy</h3>
    <p>
      The VA Notice of Privacy Practices, IB 10-163, which outlines your privacy
      rights, is available online at
      <va-link
        href="http://www.va.gov/vhapublications"
        text="www.va.gov/vhapublications"
      />
      , or you may obtain a copy by writing the VHA Privacy Office (10P2C1) at
      810 Vermont Avenue NW, Washington, DC 20420.
    </p>
  </>
);

Modals.propTypes = {
  children: PropTypes.object,
  title: PropTypes.string,
};

export default Modals;
