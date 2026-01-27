import React from 'react';

const TravelAgreementContent = () => {
  return (
    <>
      <ul data-testid="travel-agreement-content">
        <li>I have incurred a cost in relation to the travel claim</li>
        <li>
          I have neither obtained transportation at Government expense nor
          through the use of Government request, tickets, or tokens, and have
          not used any Government-owned conveyance or incurred any expenses
          which may be presented as charges against the Department of Veterans
          Affairs for transportation, meals, or lodgings in connection with my
          authorized travel that is not herein claimed
        </li>
        <li>
          I have not received other transportation resources at no cost to me
        </li>
        <li>I am the only person claiming for the travel listed</li>
        <li>
          I have not previously received payment for the transportation claimed
        </li>
      </ul>
    </>
  );
};

export default TravelAgreementContent;
