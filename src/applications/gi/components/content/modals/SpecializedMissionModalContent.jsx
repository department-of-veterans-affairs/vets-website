import React from 'react';
import { isProductionOrTestProdEnv } from '../../../utils/helpers';

const h3Text = (automatedTest = false) => {
  return isProductionOrTestProdEnv(automatedTest)
    ? 'Community focus'
    : 'Specialized mission';
};

export default function SpecializedMissionModalContent() {
  return (
    <>
      <h3>{h3Text()}</h3>
      <p>
        Is the school single-gender, a Historically Black college or university,
        or does it have a religious affiliation?
      </p>
    </>
  );
}
