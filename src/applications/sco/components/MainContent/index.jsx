import React from 'react';
import ResoursesForSchoolTitle from '../ResoursesForSchoolTitle';
import OnThisPage from './OnThisPage';
import LatestAnnouncementFromVA from './LatestAnnouncementFromVA';
import LineFiveStartLine from './LineFiveStartLine';
import TrainningAndGuide from './TrainningAndGuide';
import UpcommingEvents from './UpcommingEvents';
import PoliciesAndProcedures from './PoliciesAndProcedures';
import OtherResourcesToSupportYourStudents from './OtherResourcesToSupportYourStudents';
import LastUpdated from './LastUpdated';

const MainContent = () => {
  return (
    <div className="vads-l-col--12 medium-screen:vads-u-padding-x--2p5 medium-screen:vads-l-col--8">
      <ResoursesForSchoolTitle />
      <div>
        <p className="va-introtext">
          Trainings, resources, guides, and information on GI Bill® programs
          created for school administrators and certifying officials.
        </p>
        <p />
      </div>
      <OnThisPage />
      <LatestAnnouncementFromVA />
      <LineFiveStartLine />
      <TrainningAndGuide />
      <LineFiveStartLine />
      <UpcommingEvents />
      <LineFiveStartLine />
      <PoliciesAndProcedures />
      <LineFiveStartLine />
      <OtherResourcesToSupportYourStudents />
      <LastUpdated />
    </div>
  );
};

export default MainContent;
