import React from 'react';

export const deductionCodes = Object.freeze({
  '30': 'Disability compensation and pension debt',
  '41': 'Chapter 34 education debt',
  '44': 'Chapter 35 education debt',
  '71': 'Post-9/11 GI Bill debt for books and supplies',
  '72': 'Post-9/11 GI Bill debt for housing',
  '74': 'Post-9/11 GI Bill debt for tuition',
  '75': 'Post-9/11 GI Bill debt for tuition (school liable)',
});

export const renderWhyMightIHaveThisDebt = deductionCode => {
  switch (deductionCode) {
    case '30':
      return (
        <section>
          <p className="vads-u-margin-top--0">
            Here are some common reasons for debt from disability and pension
            overpayments:
          </p>

          <ul>
            <li>
              You’ve received a payment for disability compensation and military
              pay at the same time.
            </li>
            <li>Your income changed</li>
            <li>You received duplicate payments for the same benefit</li>
          </ul>
          <p>
            If you have questions about your VA debt, call us at{' '}
            <va-telephone contact="8008270648" /> (
            <va-telephone contact="711" tty="true" />
            ). If you’re outside the U.S., call{' '}
            <va-telephone contact="6127136415" international />. We’re here
            Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.
          </p>
        </section>
      );
    case '41':
    case '44':
    case '71':
    case '72':
    case '74':
    case '75':
      return (
        <section>
          <p className="vads-u-margin-top--0">
            Here are some common reasons for debt from education benefit
            overpayments:
          </p>
          <ul>
            <li>You were suspended or put on academic probation</li>
            <li>You withdrew from a class or program</li>
            <li>You received duplicate payments for the same benefit</li>
          </ul>
          <p className="vads-u-margin-bottom--0">
            If you have questions about your VA debt, call us at{' '}
            <va-telephone contact="8008270648" /> (
            <va-telephone contact="711" tty="true" />
            ). If you’re outside the U.S., call{' '}
            <va-telephone contact="6127136415" international />. We’re here
            Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.
          </p>
        </section>
      );
    default:
      return null;
  }
};
