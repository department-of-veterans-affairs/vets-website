import React from 'react';
import { isProductionOrTestProdEnv } from '../../../utils/helpers';

export default function SpecializedMissionModalContent() {
  return (
    <>
      <h3>
        {isProductionOrTestProdEnv()
          ? 'Community focus'
          : 'Specialized mission'}
      </h3>
      <p>
        Is the school single-gender, a Historically Black college or university,
        or does it have a religious affiliation?
      </p>
    </>
  );
}
