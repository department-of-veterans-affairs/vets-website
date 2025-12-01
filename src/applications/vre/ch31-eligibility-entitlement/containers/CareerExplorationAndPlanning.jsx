import React from 'react';
import AssessYourInterestsSection from '../components/AssessYourInterestsSection';
import FindAPathSection from '../components/FindAPathSection';
import FindAJobSection from '../components/FindAJobSection';

export default function CareerExplorationAndPlanning() {
  return (
    <div className="row">
      <article className="usa-width-two-thirds vads-u-margin-bottom--4 vads-u-margin-top--0p5 vads-u-margin-x--1 medium-screen:vads-u-margin-x--0 ">
        <h1>Career Exploration and Planning</h1>
        <p className="vads-u-font-size--lg">
          Career options, resources, and tools to help Veterans set and achieve
          your career goals.
        </p>

        <va-card background class="vads-u-padding-top--0">
          <AssessYourInterestsSection />
          <FindAPathSection />
          <FindAJobSection />
        </va-card>

        <va-need-help class="vads-u-margin-top--4">
          <div slot="content">
            <p>
              Do you have more questions or need more information? Reach out to
              your VR&E RO Counselor or Officer:
            </p>
            <p className="va-address-block vads-u-margin-left--0">
              U.S. Department of Veterans Affairs
              <br />
              Medical Office
              <br />
              PO Box 11930
              <br />
              St. Paul, MN 55111
              <br />
              United States of America
              <br />
            </p>
            <p>
              Phone number title:&nbsp;
              <va-telephone contact="8773459876" />
            </p>
            <p>
              Monday through Friday, 8:00 a.m to 9:00 p.m ET. If you have
              hearing loss, call <va-telephone contact="711" tty />.
            </p>
          </div>
        </va-need-help>

        <va-back-to-top />
      </article>
    </div>
  );
}
