import React from 'react';
import ResoursesForSchoolTitle from '../ResoursesForSchoolTitle';
import OnThisPage from './OnThisPage';
import KeyResourcesForScos from './KeyResourcesForScos';
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
          Resources for schools is a one-stop shop for School Certifying
          Officials (SCOs) and school administrators assisting students who are
          using their VA benefits to pursue education and training programs.
          Find trainings, resources, guides, and information on GI Bill programs
          to support military-connected students.
        </p>
        <p />
      </div>
      <OnThisPage />
      <KeyResourcesForScos />
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
