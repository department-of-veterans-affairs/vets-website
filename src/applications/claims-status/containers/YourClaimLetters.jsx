import React, { useEffect, useState } from 'react';

import { getClaimLetters } from '../actions';
import ClaimsBreadcrumbs from '../components/ClaimsBreadcrumbs';
import ClaimLetterList from '../components/ClaimLetterList';

const YourClaimLetters = () => {
  const [letters, setLetters] = useState([]);

  useEffect(() => {
    getClaimLetters().then(data => {
      setLetters(data);
    });
  });

  return (
    <article id="claim-letters" className="row">
      <div className="usa-width-two-thirds medium-8 columns">
        <ClaimsBreadcrumbs />
        <h1>Your VA claim letters</h1>
        <div className="vads-u-font-size--lg vads-u-padding-bottom--1">
          We send you letters to update you on the status of your claims,
          appeals, and decision reviews. Download your claim letters on this
          page.
        </div>
        <ClaimLetterList letters={letters} />
      </div>
    </article>
  );
};

export default YourClaimLetters;
