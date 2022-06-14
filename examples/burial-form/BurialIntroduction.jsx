import React from 'react';
import { Page, IntroductionPage } from '@department-of-veterans-affairs/va-forms-system-core';

export default function BurialIntroduction(props) {
  return (
    <>
      <Page {...props}>
        <IntroductionPage />
      </Page>
    </>
  )
}