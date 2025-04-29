import React from 'react';

import { HEALTH_BENEFITS_URL, MST_INFO } from '../constants';

export const wrapInH1 = content => (
  <h1 className="vads-u-font-family--sans vads-u-font-size--base vads-u-font-weight--normal">
    {content}
  </h1>
);

export const OtherBenefits = () => (
  <>
    <h2>Other VA health care benefits and services</h2>
    <p>
      <strong>If you qualify for VA health care</strong>, you’ll receive
      coverage for the services you need to help you get—and stay—healthy.
    </p>
    <p>
      <a href={HEALTH_BENEFITS_URL} target="_blank" rel="noreferrer">
        Learn more about Veterans Health Administration (VHA) health care
        services (opens in a new tab)
      </a>
    </p>
    <p>
      <strong>If you experienced military sexual trauma (MST)</strong>, we
      provide free treatment for any physical or mental health conditions
      related to your experiences. You don’t need to have reported the MST at
      the time or have other proof that the MST occurred to get care.
    </p>
    <p>
      <a href={MST_INFO} target="_blank" rel="noreferrer">
        Learn more about MST-related benefits and services (opens in a new tab)
      </a>
    </p>
  </>
);
