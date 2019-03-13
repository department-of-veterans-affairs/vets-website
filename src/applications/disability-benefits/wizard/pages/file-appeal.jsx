import React from 'react';
import Navigation from '../../../static-pages/wizard/Navigation';
import { pageNames } from './pageList';

const FileAppealPage = ({ goBack }) => (
  <div>
    File appeal!
    <Navigation goForward={() => {}} forwardAllowed={false} goBack={goBack} />
  </div>
);

export default {
  name: pageNames.fileAppeal,
  component: FileAppealPage,
};
