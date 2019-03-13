import React from 'react';
import Navigation from '../../../static-pages/wizard/Navigation';

const FileAppealPage = ({ goBack }) => (
  <div>
    File appeal!
    <Navigation goForward={() => {}} forwardAllowed={false} goBack={goBack} />
  </div>
);

export default {
  name: 'file-appeal',
  component: FileAppealPage,
};
