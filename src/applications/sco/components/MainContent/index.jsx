import React from 'react';
import ResourcesForSchoolTitle from '../ResourcesForSchoolTitle';
import ScoHandbooks from './Update/ScoHandbooks';
import ProgramApprovalInformation from './Update/ProgramApprovalInformation';
import UploadFileToVa from './Update/UploadFileToVa';
import OtherResources from './Update/OtherResources';
import TrainingAndWebinar from './Update/TrainingAndWebinar';

import LastUpdated from './LastUpdated';

const MainContent = () => {
  return (
    <div className="vads-l-col--12 medium-screen:vads-u-padding-x--2p5 medium-screen:vads-l-col--8">
      <ResourcesForSchoolTitle />
      <div>
        <p className="va-introtext">
          Trainings, resources, guides, and information on GI Bill® programs
          created for school administrators and certifying officials.
        </p>
        <p />
      </div>
      <article>
        <va-on-this-page uswds />
        <ScoHandbooks />
        <TrainingAndWebinar />
        <ProgramApprovalInformation />
        <UploadFileToVa />
        <OtherResources />
      </article>
      <LastUpdated />
    </div>
  );
};

export default MainContent;
