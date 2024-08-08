import React from 'react';

import { Toggler } from 'platform/utilities/feature-toggles';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';

export const formTitle = 'Request a Higher-Level Review';
// for Intro page; so form title differs from
export const longFormTitle =
  'Request a Higher-Level Review with VA Form 20-0996';

export const subTitle = 'VA Form 20-0996';

export const AppTitle = () => (
  <Toggler toggleName={Toggler.TOGGLE_NAMES.hlrUpdatedContent}>
    <Toggler.Enabled>{formTitle}</Toggler.Enabled>
    <Toggler.Disabled>{longFormTitle}</Toggler.Disabled>
  </Toggler>
);

/**
 * Render page title
 * @returns {Element}
 */
export const PageTitle = () => {
  const title = <AppTitle />;
  return <FormTitle title={title} subTitle={subTitle} />;
};
