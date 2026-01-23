import React from 'react';

import AdditionalInfo from './AdditionalInfo';
import BeforeYouStart from './BeforeYouStart';
import BetaTesting from './BetaTesting';
import Breadcrumbs from './Breadcrumbs';
import Intro from './Intro';
import MoreAboutOurChatbot from './MoreAboutOurChatbot';

export default function LeftColumnContent() {
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
