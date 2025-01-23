import React from 'react';

const CombatOperationServiceDescription = props => {
  return (
    <>
      <ul>
        <li>
          <strong>Veteran Gross Income</strong>{' '}
          {/* eslint-disable-next-line react/prop-types */}
          {props?.veteranIncome?.grossIncome}
        </li>
        <li>
          <strong>Iraqi Freedom</strong> between 2003 and 2011
        </li>
        <li>
          <strong>New Dawn</strong> between 2010 and 2011
        </li>
        <li>
          <strong>Inherent Resolve</strong> between 2014 and the present
        </li>
        <li>
          <strong>Freedom’s Sentinel</strong> between 2015 and 2021
        </li>
        <li>
          <strong>Resolute Support Mission</strong> between 2015 and 2021
        </li>
      </ul>
    </>
  );
};

export default CombatOperationServiceDescription;
