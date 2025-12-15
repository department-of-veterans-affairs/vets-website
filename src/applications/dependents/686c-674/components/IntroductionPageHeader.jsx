import React from 'react';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import { PAGE_TITLE } from '../config/constants';

/**
 * Introduction page header component
 * @returns {React.ReactElement} Intro page header
 */
export const IntroductionPageHeader = () => (
  <>
    <FormTitle title={PAGE_TITLE} subTitle="VA Form 21-686c and 21-674" />
  </>
);
