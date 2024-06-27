import React from 'react';

import { Toggler } from 'platform/utilities/feature-toggles';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';

export const formTitle = 'Request a Higher-Level Review';
// for Intro page; so form title differs from
export const longFormTitle =
  'Request a Higher-Level Review with VA Form 20-0996';

export const newFormSubTitle =
  'Decision Review Request: Higher-Level Review (VA Form 20-0996)';
export const oldFormSubTitle = 'VA Form 20-0996 (Higher-Level Review)';

export const appTitle = ({ longTitle }) =>
  longTitle ? longFormTitle : formTitle;

export const FormSubTitle = () => (
  <Toggler toggleName={Toggler.TOGGLE_NAMES.hlrUpdatedContent}>
    <Toggler.Enabled>{newFormSubTitle}</Toggler.Enabled>
    <Toggler.Disabled>{oldFormSubTitle}</Toggler.Disabled>
  </Toggler>
);

/**
 * Render page title
 * @param {boolean} longTitle - flag to enable showing longer H1 on intro page
 * @returns {Element}
 */
export const PageTitle = props => {
  const title = appTitle(props);
  const subTitle = <FormSubTitle />;
  return <FormTitle title={title} subTitle={subTitle} />;
};
