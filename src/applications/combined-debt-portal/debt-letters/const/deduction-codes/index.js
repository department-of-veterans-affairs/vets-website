import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

export const deductionCodes = Object.freeze({
  '11': 'Post-9/11 GI Bill debt for books and supplies',
  '12': 'Post-9/11 GI Bill debt for books and supplies',
  '13': 'Post-9/11 GI Bill debt for books and supplies',
  '14': 'Post-9/11 GI Bill debt for books and supplies',
  '15': 'Post-9/11 GI Bill debt for books and supplies',
  '16': 'Post-9/11 GI Bill debt for housing',
  '17': 'Post-9/11 GI Bill debt for housing',
  '18': 'Post-9/11 GI Bill debt for housing',
  '19': 'Post-9/11 GI Bill debt for housing',
  '20': 'Post-9/11 GI Bill debt for housing',
  '27': 'Post-9/11 GI Bill debt for books and supplies',
  '28': 'Post-9/11 GI Bill debt for books and supplies',
  '30': 'Disability compensation and pension debt',
  '41': 'Chapter 34 education debt',
  '44': 'Chapter 35 education debt',
  '48': 'Post-9/11 GI Bill debt for housing',
  '49': 'Post-9/11 GI Bill debt for housing',
  '50': 'Post-9/11 GI Bill debt for housing',
  '51': 'Post-9/11 GI Bill debt for housing',
  '71': 'Post-9/11 GI Bill debt for books and supplies',
  '72': 'Post-9/11 GI Bill debt for housing',
  '73': 'Education Ch 33-Ch1606/Ch30 Kickers',
  '74': 'Post-9/11 GI Bill debt for tuition',
  '75': 'Post-9/11 GI Bill debt for tuition (school liable)',
  '76': 'Education Ch 33-Ch1606/Ch30 Kickers',
  '77': 'Education Ch 33-Ch1606/Ch30 Kickers',
  '78': 'Education Ch 33-Ch1606/Ch30 Kickers',
  '79': 'Education Ch 33-Ch1606/Ch30 Kickers',
});

const ContactInfo = () => (
  <p className="vads-u-margin-bottom--0">
    If you have questions about your VA debt, call us at{' '}
    <va-telephone contact={CONTACTS.DMC} /> (
    <va-telephone contact="711" tty="true" />
    ). If you’re outside the U.S., call{' '}
    <va-telephone contact={CONTACTS.DMC_OVERSEAS} international />. We’re here
    Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.
  </p>
);

export const renderWhyMightIHaveThisDebt = deductionCode => {
  switch (deductionCode) {
    case '30':
      return (
        <>
          <p>
            Here are some common reasons for debt from disability and pension
            overpayments:
          </p>
          <ul className="vads-u-padding-y--2">
            <li>
              You’ve received a payment for disability compensation and military
              pay at the same time.
            </li>
            <li>Your income changed</li>
            <li>You received duplicate payments for the same benefit</li>
          </ul>
          <ContactInfo />
        </>
      );
    case '11':
    case '12':
    case '13':
    case '14':
    case '15':
    case '16':
    case '17':
    case '18':
    case '19':
    case '20':
    case '27':
    case '28':
    case '41':
    case '44':
    case '48':
    case '49':
    case '50':
    case '51':
    case '71':
    case '72':
    case '73':
    case '74':
    case '75':
    case '76':
    case '77':
    case '78':
    case '79':
      return (
        <>
          <p>
            Here are some common reasons for debt from education benefit
            overpayments:
          </p>
          <ul className="vads-u-padding-y--2">
            <li>You were suspended or put on academic probation</li>
            <li>You withdrew from a class or program</li>
            <li>You received duplicate payments for the same benefit</li>
          </ul>
          <ContactInfo />
        </>
      );
    default:
      return null;
  }
};
