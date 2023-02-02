/**
 * This page is for testing the compatibility of running v1 and v3 components on the same page.
 */

import React from 'react';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import V1Container from '../containers/V1Container';
import V3Container from '../containers/V3Container';

export default function V1V3Page() {
  return (
    <>
      <h1>VaTextInput</h1>
      <div className="vads-u-display--flex vads-u-align-items--center">
        <V1Container>
          <VaTextInput />
        </V1Container>
        <V3Container>
          <VaTextInput uswds />
        </V3Container>
      </div>
    </>
  );
}
