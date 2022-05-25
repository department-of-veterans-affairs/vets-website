import React from 'react';
import { Page, IntroductionPage } from '@department-of-veterans-affairs/va-forms-system-core';

export default function BurialIntroduction() {
  return (
    <>
      <Page title="Introduction Page" nextPage="/claimant-information">
        <IntroductionPage />
      </Page>
    </>
  )
}