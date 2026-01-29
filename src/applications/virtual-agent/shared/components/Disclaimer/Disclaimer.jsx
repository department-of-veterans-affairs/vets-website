import React from 'react';

import Breadcrumbs from './Breadcrumbs';
import Intro from './Intro';
import BetaTesting from './BetaTesting';
import BeforeYouStart from './BeforeYouStart';
import AdditionalInfo from './AdditionalInfo';
import MoreAboutOurChatbot from './MoreAboutOurChatbot';

export default function Disclaimer() {
  return (
    <>
      <Breadcrumbs />
      <Intro />
      <BetaTesting />
      <BeforeYouStart />
      <AdditionalInfo />
      <MoreAboutOurChatbot />
    </>
  );
}
