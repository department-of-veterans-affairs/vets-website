import React from 'react';

export const introQuestion =
  'Are you filing a claim for a condition related to a toxic exposure?';

export const confirmQuestion =
  'Do you think your condition could be connected to a toxic exposure?';

export const confirmDescription = () => {
  return (
    <>
      <p>
        We want to make sure you get any disability benefits you may be eligible
        for.
      </p>
      <p>
        We automatically assume (or “presume”) that certain toxic exposures
        during military service cause certain health conditions. We call these
        “presumptive conditions.”
      </p>
      <p>
        If you have a presumptive condition, you don’t need to prove that your
        service caused the condition to get VA disability compensation. You only
        need to meet the minimum service requirements for the presumption.
      </p>
      <p>
        The recent PACT Act law has many added presumptive conditions and
        locations for toxic exposures.
      </p>
    </>
  );
};
