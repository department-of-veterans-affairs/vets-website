/**
 * @module containers/IntroductionPage
 * @description Introduction page component for VA Form 21-4192 - Under Development
 */

import React, { useEffect } from 'react';
import { focusElement, scrollToTop } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';

import {
  TITLE,
  SUBTITLE,
} from '@bio-aquia/21-4192-employment-information/constants';

/**
 * Introduction page component for VA Form 21-4192
 * @returns {React.ReactElement} Introduction page component
 */
export const IntroductionPage = () => {
  useEffect(() => {
    scrollToTop();
    focusElement('h1');
  }, []);

  return (
    <article className="schemaform-intro">
      <FormTitle title={TITLE} subTitle={SUBTITLE} />
      <div className="vads-u-margin-y--4">
        <va-alert status="info" visible>
          <h2 slot="headline">Under Development</h2>
          <p>
            This application is currently under development. Please check back
            later for updates.
          </p>
        </va-alert>
      </div>
    </article>
  );
};

export default IntroductionPage;
