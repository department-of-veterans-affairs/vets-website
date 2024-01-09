import React from 'react';
import { isProductionOfTestProdEnv } from '../../../../edu-benefits/1995/helpers';

export default function SpecializedMissionModalContent() {
  return (
    <>
      <h3>
        {isProductionOfTestProdEnv()
          ? 'Specialized mission'
          : 'Community focus'}
      </h3>
      <p>
        Is the school single-gender, a Historically Black college or university,
        or does it have a religious affiliation?
      </p>
    </>
  );
}
