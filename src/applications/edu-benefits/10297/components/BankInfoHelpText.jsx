import React from 'react';

import { useSelector } from 'react-redux';

const bankInfoHelpText = (
  <va-additional-info trigger="What if I don’t have a bank account?">
    <p className="vads-u-margin-bottom--2">
      The{' '}
      <va-link
        external
        href="https://benefits.va.gov/benefits/banking.asp"
        text="Veterans Benefits Banking Program "
      />{' '}
      provides a list of Veteran-friendly banks and credit unions. They’ll work
      with you to set up an account, or help you qualify for an account, so you
      can use direct deposit. To get started, call one of the participating
      banks or credit unions listed on the website. Be sure to mention the
      Veteran Benefits Banking Program.
    </p>
  </va-additional-info>
);

export const BankInfoHelpText = () => {
  const data = useSelector(state => state);

  return (
    <>
      {data.navigation.route.path === '/direct-deposit' && (
        <>
          <p>
            <strong>Note:</strong> Any bank account information you enter here
            will apply to your other Veteran benefits, including compensation,
            pension, and Benefits for Certain Children with Disabilities
            (Chapter 18) payments.
          </p>
          <p>
            Information entered here won’t change your existing accounts for
            health benefits.
          </p>
          {bankInfoHelpText}
        </>
      )}
    </>
  );
};

export default BankInfoHelpText;
