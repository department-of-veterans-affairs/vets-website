import React from 'react';
import BalanceQuestions from '../components/BalanceQuestions';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

const DetailPage = () => {
  return (
    <>
      <h1>Your copay details</h1>
      <BalanceQuestions />
      <p>
        <strong>For questions about your treatment or your charges, </strong>
        contact the James A. Haley Veterans’ Hospital at
        <Telephone contact={'813-972-2000'} className="vads-u-margin-x--0p5" />.
      </p>
    </>
  );
};

export default DetailPage;
