import React, { useState } from 'react';
import Modal from '@department-of-veterans-affairs/component-library/Modal';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

const Modals = ({ children, title }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <p>
        <a onClick={() => setVisible(true)}>{title}</a>
      </p>
      <Modal
        onClose={() => setVisible(false)}
        visible={visible}
        title={title}
        cssClass="va-modal-large"
        contents={children}
      />
    </div>
  );
};

Modals.Rights = () => (
  <>
    <p>
      <strong>Collection:</strong> The U.S. Department of Veterans Affairs (VA)
      is required to collect debts owed to the government. Action must be taken
      within sixty (60) days from the initial billing statement to pay your debt
      in full or establish a payment plan or your account may be referred for
      further collection action. You have the right to inspect and copy the
      records related to the debt. You also have the right to establish a
      payment plan. You have the right to submit a compromise offer. Collection
      action includes referring your delinquent balance to the Department of
      Treasury's Cross-Servicing Program and Treasury Offset Program, which will
      include offset of any federal and state payments to which you are
      entitled. This includes tax refunds, social security benefits and salary
      or retirement benefits. In addition, the Department of Treasury may refer
      your account to private collection agencies, which will result in
      additional fees and interest being added to your account. You may also be
      subject to garnishment of non- federal wages under Treasury's
      Administrative Wage Garnishment Program. Other collection actions include
      offset of any current or future VA benefits to which you may become
      entitled. We may also report your delinquent account to credit reporting
      agencies sixty (60) days from the date of the initial billing statement.
      Additional information can be found at:
      <a
        href="https://www.va.gov/healthbenefits/cost/"
        className="vads-u-margin-left--0p5"
      >
        www.va.gov/healthbenefits/cost/.
      </a>
    </p>
    <p>
      <strong>Pay your bill:</strong> Pay the debt in full by the balance due
      date on the initial billing statement to avoid late charges and collection
      action:
    </p>
    <ul>
      <li>
        In Person: At your local Veteran Affairs Medical Centers Agent Cashier's
        Office
      </li>
      <li>
        By Phone: Contact VA at
        <Telephone
          contact={'1-888-827-4817'}
          className="vads-u-margin-x--0p5"
        />
      </li>
      <li>
        By Mail: Make check or money order payable to "VA" and include account
        number and payment stub Submit to: Department of Veterans Affairs, P.O.
        Box 3978, Portland, OR 97208-3978
      </li>
    </ul>
    <p>
      <strong>Late charges:</strong> The VA is required to assess late charges
      on balances which remain unpaid thirty (30) days after the statement date.
      These charges consist of interest and administrative fees at rates
      established each year. Interest will be charged from the date charges
      first appear on the statement. You can avoid these charges by making
      timely payments by the balance due date on the initial billing statement.
      A monthly administrative cost or collection fee will be added to your debt
      if, within thirty (30) days of the date of the statement on which charges
      first appear, full payment of the debt is not received or a repayment plan
      agreement is not approved. If an installment repayment plan is established
      and any installment is not received by the due date, the monthly
      administrative cost or collection fee will thereafter be charged until the
      debt is paid. Other collection costs may also be added to the debt if
      additional collection actions become necessary.
    </p>
    <p>
      <strong>Waiver:</strong> You have the right to request a waiver of part or
      all of your debt. If the waiver is granted you will not be required to pay
      the amount waived. To do so, submit an explanation and a completed
      Financial Status Report (VA Form 5655) found at:
      <a
        aria-label="Financial Status Report (VA Form 5655) - Opens in new window"
        className="vads-u-margin-left--0p5"
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.va.gov/vaforms/va/pdf/VA5655.pdf"
      >
        Financial Status Report (VA Form 5655)
      </a>
      . Your explanation should include why you are not responsible for the debt
      and any undue hardship the payment of the debt would cause you. You have
      the right to request a hearing in connection with your request for a
      waiver. To do so, submit a written request for hearing with your waiver
      request. VA will notify you of the date, time and place where the hearing
      will be held. Refer to the "Customer Service" and "Submitting Your
      Request" sections below for more information
    </p>
    <p>
      <strong>Compromise offer:</strong> You have the right to request a
      compromise. A compromise means you may propose a lesser amount as full
      settlement of the debt. To request a compromise, submit your request in
      writing to VA, specifying the dollar amount you are proposing VA should
      accept as payment in full, and a completed Financial status Report (VA
      Form 5655) found at:
      <a
        aria-label="Financial Status Report (VA Form 5655) - Opens in new window"
        className="vads-u-margin-left--0p5"
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.va.gov/vaforms/va/pdf/VA5655.pdf"
      >
        Financial Status Report (VA Form 5655)
      </a>
      . Refer to the “Customer Service” and “Submitting your Request” sections
      below for more information.
    </p>
  </>
);

export default Modals;
