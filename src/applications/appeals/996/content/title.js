import React from 'react';

import FormTitle from '@department-of-veterans-affairs/platform-forms-system/FormTitle';

export const formTitle = 'Request a Higher-Level Review';
// for Intro page; so form title differs from
export const longFormTitle =
  'Request a Higher-Level Review with VA Form 20-0996';

export const subTitle = 'VA Form 20-0996';

export const AppTitle = () => formTitle;

/**
 * Render page title
 * @returns {Element}
 */
export const PageTitle = () => {
  const title = <AppTitle />;
  return <FormTitle title={title} subTitle={subTitle} />;
};
