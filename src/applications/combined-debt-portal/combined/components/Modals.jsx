import React, { useState } from 'react';
import {
  VaModal,
  VaButton,
} from '@department-of-veterans-affairs/web-components/react-bindings';
import PropTypes from 'prop-types';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import {
  dmcPhoneContent,
  healthResourceCenterPhoneContent,
} from '../utils/helpers';

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
    <h3>Collection by offset</h3>
    <p>
      We must collect debts owed to the U.S. government under VA programs. When
      we need to, we collect debts by withholding current and future VA benefits
      and life insurance dividends. We may also refer the debt to the Department
      of the Treasury for offset of most other federal payments.
    </p>
    <p>We conduct periodic computer matching efforts for these reasons:</p>
    <ul>
      <li>
        To identify people who owe money to VA and who are federal employees,
        military members, or retirees
      </li>
      <li>
        To get the addresses of people who owe money to VA from their federal
        tax returns
      </li>
      <li>To alert government-backed mortgage lenders of outstanding debt</li>
    </ul>
    <p>
      If you owe money to the government, your federal pay and retirement
      benefits are subject to offset. We may also cancel any benefit checks not
      cashed within 1 year and apply the money to offset outstanding debts. We
      won’t reissue those checks.
    </p>

    <h3>Late charges</h3>
    <p>
      We’re required by law to assess late charges for health care copay debts
      that remain unpaid 30 days after the statement date. These charges can
      consist of interest and administrative fees. You can avoid these charges
      by making timely payments by the balance due date on the initial billing
      statement. If you have a repayment plan with us for a debt and we don’t
      receive an installment by the due date, we may charge you a monthly
      administrative cost or collection fee until you’ve paid the debt in full.
    </p>

    <h3>Right to dispute the existence or amount of a debt</h3>
    <p>
      If you believe you don’t owe a debt or that the amount is incorrect, you
      have the right to dispute it.
    </p>
    <p>
      To dispute a debt, you must explain in writing why you question the
      validity or amount of the debt. If your benefits are scheduled to offset,
      you must write us within 30 days of your first debt letter or copay bill
      to avoid that action.
    </p>
    <p>
      If we receive your dispute within 30 days, we’ll suspend the offset action
      until we confirm that the debt is valid and the amount is correct. If the
      delay required to resolve your dispute prevents us from collecting the
      full amount of the debt from your benefits, we don’t suspend collection
      action. If we determine that the debt and the amount are correct, you
      still have the right to appeal our decision to the Board of Veterans
      Appeals.
    </p>
    <p>You can get help with disputing a debt in either of these ways:</p>
    <ul>
      <li>
        Contact us online through Ask VA at{' '}
        <va-link
          href="https://www.va.gov/contact-us/ask-va/"
          text="va.gov/contact-us/ask-va/"
        />
      </li>
      <li>Calling the Debt Management Center at {dmcPhoneContent()}</li>
    </ul>

    <h3>Right to request waiver of a debt</h3>
    <p>
      Under certain circumstances, we can grant a request to waive part or all
      of the debt. This means that you won’t have to pay the amount waived.
    </p>
    <p>
      You must submit your request to waive a debt online or in writing. Explain
      any responsibility you had in causing the debt or why you believe you
      aren’t responsible for the debt. If you feel that collection of the debt
      would be unfair or discriminatory to you or cause you undue hardship,
      explain this in your request.
    </p>
    <p>
      To prove your financial hardship, you must also complete the Financial
      Status Report form (VA Form 5655) and submit it with your waiver request
    </p>
    <p>
      You have 1 year from the date of your first debt letter or copay bill to
      submit a waiver request. A VA service representative at your nearest VA
      regional office can help you prepare your waiver request and supporting
      documentation.
    </p>
    <p>
      <strong>Note: </strong>
      Waiver of an education benefit overpayment won’t restore the program
      entitlement you used by receiving the benefits that caused the debt. Only
      payment of the debt in full can restore entitlement.
    </p>
    <p>
      Learn more about waivers for VA benefit debt online at{' '}
      <va-link
        href="https://www.va.gov/resources/waivers-for-va-benefit-debt/"
        text="va.gov/resources/waivers-for-va-benefit-debt/"
      />
    </p>

    <h3>Effect of waiver request on withholding of benefits</h3>
    <p>
      If we notified you that we plan to withhold your VA benefits to offset a
      debt, we must receive your request for waiver within 30 days of the date
      of notice to prevent the withholding.
    </p>
    <p>
      If we don’t receive your request within 30 days, the scheduled offset will
      occur and will continue while we consider your waiver request. If we grant
      the waiver, we’ll pay you back any amount we withheld and applied to the
      waived debt.
    </p>

    <h3>Oral hearing on waiver request</h3>
    <p>
      You can request an oral hearing to present evidence or argue any point in
      connection with your waiver request. If you want a hearing, request it
      when you submit your request for waiver. This will allow us to schedule
      the hearing before we make a decision on your waiver request.
    </p>
    <p>
      If you request a hearing, we’ll notify you of the date, time, and place
      where we’ll hold the hearing. You can bring witnesses. We’ll enter all
      testimony into the record. We’ll also provide a dedicated hearing room and
      hearing officials, and we’ll prepare a written transcript of the
      proceeding. We can’t cover the cost of any other expense for the hearing.
    </p>

    <h3>Hardship determination: Health care copay debts</h3>
    <p>
      You have the right to request a hardship determination to get an exemption
      from future outpatient and inpatient copays for the remaining calendar
      year.
    </p>
    <p>
      To request a hardship determination, submit a Request for Hardship
      Determination (VA Form 10-10HS). Also include a letter explaining any
      financial hardship these charges will cause you.
    </p>
    <p>
      If your gross household income has decreased, you may also be eligible for
      enrollment in a higher priority group, which may qualify you for copay
      exemption. To update your financial information, submit a completed Health
      Benefits Update (VA Form 10-10 EZR).
    </p>
    <p>
      Find out how to request VA financial hardship assistance for copay bills
      online at{' '}
      <va-link
        href="https://www.va.gov/health-care/pay-copay-bill/financial-hardship/"
        text="va.gov/health-care/pay-copay-bill/financial-hardship/"
      />
    </p>
    <p>You can get help with these forms in either of these ways:</p>
    <ul>
      <li>
        Contact us online through Ask VA at{' '}
        <va-link
          href="https://www.va.gov/contact-us/ask-va/"
          text="va.gov/contact-us/ask-va/"
        />
      </li>
      <li>
        Calling us at <va-telephone contact={CONTACTS.HELP_DESK} /> (
        <va-telephone contact={CONTACTS[711]} tty />
        ). If you’re outside the U.S., call{' '}
        <va-telephone contact={CONTACTS.DMC_OVERSEAS} international />. We’re
        here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
      </li>
    </ul>

    <h3>Hardship determination: Benefit overpayments</h3>
    <p>
      You can request a hardship determination to help you get a repayment plan
      based on your financial status.
    </p>
    <p>
      To request a hardship determination, submit a completed Financial Status
      Report (VA Form VA5655). If you need help, call us at {dmcPhoneContent()}
    </p>
    <p>
      You can fill out VA Form VA5655 online at{' '}
      <va-link
        href="https://www.va.gov/manage-va-debt/request-debt-help-form-5655/introduction"
        text="va.gov/manage-va-debt/request-debt-help-form-5655/introduction"
      />
    </p>

    <h3>Representation</h3>
    <p>
      You can appoint an accredited representative of a Veterans' organization
      or other service organization recognized by the Secretary of Veterans
      Affairs to represent you, without charge.
    </p>
    <p>
      You may also hire an attorney to help you, such as an attorney in a
      private practice or a legal aid attorney. The services of an attorney
      representing you in adjudicative proceedings before VA are subject to a
      fee limitation as set forth in 38 U.S.C 5904.
    </p>
    <p>
      If you want representation and haven’t already designated a
      representative, contact us for the necessary forms or use our online tool.
    </p>
    <p>
      You can get help from a VA accredited representative or VSO online at{' '}
      <va-link
        href="https://www.va.gov/get-help-from-accredited-representative/"
        text="va.gov/get-help-from-accredited-representative/"
      />
    </p>
    <p>
      If an attorney or accredited agent represents you before VA, you must file
      a copy of any agreement between you and the attorney or agent about the
      payment of the attorney's or agent's fees. Send the copy of the agreement
      to us at this address:
    </p>
    <p>810 Vermont Avenue, NW (005R1A) Washington, DC 20420</p>

    <h3>Questions about payments</h3>
    <p>
      If you’ve made a payment in the past 10 days, we may not have applied the
      payment to your account before we prepared your current statement. In this
      case, we’ll include the payment on your next statement.
    </p>
    <p>
      For help with understanding your health care copay charges, contact our VA
      Health Resource Center at {healthResourceCenterPhoneContent()}
    </p>
    <p>
      For help with understanding your VA benefit overpayments, contact our VA
      Debt Management Center at {dmcPhoneContent()}
    </p>

    <h3>VA Privacy</h3>
    <p>
      The VA Notice of Privacy Practices, IB 10-163, which outlines your privacy
      rights, is available online.
    </p>
    <p>
      Review VA privacy policies at{' '}
      <va-link
        href="https://department.va.gov/privacy/va-privacy-policies/"
        text="department.va.gov/privacy/va-privacy-policies/"
      />
    </p>
    <p>
      To request a printed copy, send a written request to the VHA privacy
      office at this address:
    </p>
    <p>810 Vermont Avenue, NW (005R1A) Washington, DC 20420</p>

    <h3>How to manage financial stress</h3>
    <p>
      Taking care of your well-being, including your mental health, is
      essential. Everyone handles stress differently. We’re here to help.
    </p>
    <p>
      You can learn more about VA mental health services at{' '}
      <va-link
        href="https://www.va.gov/health-care/health-needs-conditions/mental-health/"
        text="va.gov/health-care/health-needs-conditions/mental-health/"
      />
    </p>
    <p>
      As a recipient of VA benefits, we also want you to be aware of available
      resources intended to help you in making wise financial decisions. We
      encourage you to visit these resources for helpful financial information:
    </p>
    <ul>
      <li>
        <va-link
          href="https://VeteransBenefitsBanking.org/"
          text="VeteransBenefitsBanking.org"
        />
      </li>
      <li>
        <va-link text="MyMoney.gov" href="https://www.mymoney.gov/" />
      </li>
      <li>
        <va-link text="Consumer.gov" href="https://consumer.gov/" />
      </li>
    </ul>
    <p>
      If you or someone you know is having thoughts of suicide, contact the
      Veterans Crisis Line to receive free, confidential support and crisis
      intervention. We’re here 24 hours a day, 7 days a week, 365 days a year.
      You can contact us in any of these ways:
    </p>
    <ul>
      <li>
        Call <va-link text="988" href="tel:988" /> and select 1
      </li>
      <li>Text 838255</li>
      <li>
        Chat online at{' '}
        <va-link
          text="veteranscrisisline.net"
          href="https://www.veteranscrisisline.net/"
        />
      </li>
    </ul>
  </>
);

Modals.propTypes = {
  children: PropTypes.object,
  title: PropTypes.string,
};

export default Modals;
