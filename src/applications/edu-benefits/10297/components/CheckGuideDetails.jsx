import React from 'react';
import { useSelector } from 'react-redux';

export const CheckGuideDetails = () => {
  const data = useSelector(state => state);
  return (
    <>
      {data.navigation.route.path === '/direct-deposit' && (
        <>
          <img
            src="/img/direct-deposit-check-guide.svg"
            alt="On a personal check, the bank’s 9-digit routing number is at bottom left; your account number follows it."
          />
          <p>
            Your bank’s routing number is listed along the bottom-left edge of a
            personal check. Your account number is listed to the right of that.
            Routing numbers must be nine digits and account numbers can be up to
            17 digits.
          </p>
        </>
      )}
    </>
  );
};
