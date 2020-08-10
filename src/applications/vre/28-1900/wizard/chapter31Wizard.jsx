import React from 'react';
import Wizard from '../../../static-pages/wizard/index';
import pages from './pages/index';

const Chapter31Wizard = () => {
  return <Wizard pages={pages} expander buttonText="Let's get started" />;
};

export default Chapter31Wizard;
