import React from 'react';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import { PAGE_TITLE } from '../config/constants';

export const IntroductionPageHeader = () => (
  <>
    <FormTitle title={PAGE_TITLE} />
    <p className="vads-u-font-size--h3 vads-u-margin-bottom--0 vads-u-margin-top--neg3">
      VA Form 21-686c and 21-674
    </p>
  </>
);
