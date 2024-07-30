import React from 'react';
import MainContentSubDiv from '../../HubRail/shared/mainContentSubDiv';
import LiSpanAndVaLinkAndPTag from '../../HubRail/shared/liSpanAndVaLinkAndPTag';

const TrainingAndWebinar = () => {
  return (
    <MainContentSubDiv
      id="trainings-and-webinars"
      header="Trainings and webinars"
    >
      <LiSpanAndVaLinkAndPTag
        href="https://www.benefits.va.gov/gibill/resources/education_resources/school_certifying_officials/online_sco_training.asp"
        hrefText="Training Requirements"
        pText="Essential training for VA student enrollment certifications and compliance."
      />
      <LiSpanAndVaLinkAndPTag
        href="https://vba-tpss.vbatraining.org/assess/trkSignIn?refid=XSCO"
        hrefText="SCO Training Portal"
        pText="Access to the training portal for school officials."
      />
      <LiSpanAndVaLinkAndPTag
        href="https://www.benefits.va.gov/gibill/resources/education_resources/school_certifying_officials/presentations.asp"
        hrefText="Office Hours and Webinars"
        pText="Join our office hours and webinars for information on the GI Bill, related legislation, and processes."
      />
      <LiSpanAndVaLinkAndPTag
        href="https://public.govdelivery.com/accounts/USVAVBA/subscriber/new"
        hrefText="Sign up for trainings, webinars, and office hour updates"
        pText="Subscribe to the GovDelivery mailing list to receive updates and other routine communications from Education Service about trainings, office hours, and more."
      />
    </MainContentSubDiv>
  );
};

export default TrainingAndWebinar;
