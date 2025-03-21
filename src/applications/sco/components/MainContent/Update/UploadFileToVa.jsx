import React from 'react';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import MainContentSubDiv from '../../HubRail/shared/mainContentSubDiv';
import LiSpanAndVaLinkAndPTag from '../../HubRail/shared/liSpanAndVaLinkAndPTag';
import LiSpanAndVaLink from '../../HubRail/shared/liSpanAndVaLink';
import LiText from '../../HubRail/shared/liText';

const UploadFileToVa = () => {
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const forms1516Toggle = useToggleValue(TOGGLE_NAMES.forms1516Links);

  return (
    <div>
      <MainContentSubDiv id="upload-files-to-va" header="Upload files to VA">
        <LiSpanAndVaLinkAndPTag
          href="https://www.my.va.gov/EducationFileUploads/s/"
          hrefText="Education File Upload Portal"
          pText="Upload forms and other accepted documents supporting compliance actions, designating or removing certifying officials, and more."
        />
      </MainContentSubDiv>
      <va-accordion uswds>
        <va-accordion-item
          uswds
          level="3"
          header="Forms library and other accepted documents"
          subheader="Check out the forms and documents which you can submit to VA via the Education File upload portal."
        >
          {forms1516Toggle ? (
            <>
              <h4>Accepted forms for digital submission</h4>
              <ul className="vads-u-margin-left--neg2p5">
                <LiSpanAndVaLink
                  hrefText="VA Form 22-10215: Statement of Assurance of Compliance with 85% Enrollment Ratios"
                  href="/school-administrators/85-15-rule-enrollment-ratio"
                />
                <LiSpanAndVaLink
                  hrefText="VA Form 22-10216: 35% Exemption Request from 85/15 Reporting Requirement"
                  href="/school-administrators/35-percent-exemption"
                />
              </ul>
              <h4>Accepted PDF forms for download</h4>
              <ul className="vads-u-margin-left--neg2p5">
                <LiSpanAndVaLink
                  hrefText="Download VA form 22-8794: Designation of Certifying Official(s)"
                  href="https://www.vba.va.gov/pubs/forms/VBA-22-8794-ARE.pdf"
                />
                <LiSpanAndVaLink
                  hrefText="Download VA form 22-1919: Conflicting interests Certification for Proprietary Schools"
                  href="https://www.vba.va.gov/pubs/forms/VBA-22-1919-ARE.pdf"
                />
              </ul>
            </>
          ) : (
            <>
              <h4>Accepted forms</h4>
              <ul className="vads-u-margin-left--neg2p5">
                <LiSpanAndVaLink
                  hrefText="Download Designation of Certifying Official(s) - VA Form 22-8794 (PDF, 3 pages)"
                  href="https://www.vba.va.gov/pubs/forms/VBA-22-8794-ARE.pdf"
                />
                <LiSpanAndVaLink
                  hrefText="Download Statement of Assurance of Compliance with 85 Percent Enrollment Ratios - VA Form 22-10215 (PDF, 4 pages)"
                  href="https://www.vba.va.gov/pubs/forms/vba-22-10215-are.pdf"
                />
                <LiSpanAndVaLink
                  hrefText="Download Statement of Assurance of Compliance with 85 Percent Enrollment Ratios Continuation Sheet - VA Form 22-10215a (PDF, 2 pages)"
                  href="https://www.vba.va.gov/pubs/forms/vba-22-10215a-are.pdf"
                />
                <LiSpanAndVaLink
                  hrefText="Download 35% Exemption Request from 85/15 Reporting Requirement - VA Form 22-10216 (PDF, 2 pages)"
                  href="https://www.vba.va.gov/pubs/forms/vba-22-10216-are.pdf"
                />
                <LiSpanAndVaLink
                  hrefText="Download Conflicting Interests Certification for Proprietary Schools - VA Form 22-1919 (PDF, 1 page)"
                  href="https://www.vba.va.gov/pubs/forms/VBA-22-1919-ARE.pdf"
                />
              </ul>
            </>
          )}
          <h4>Other accepted documents</h4>
          <ul className="vads-u-margin-left--neg2p5">
            <LiText text="Compliance documents requested to support a scheduled compliance activity at your institution" />
            <LiText text="Electronic Fund Transfer and Tax ID Updates" />
            <LiText text="Requests for centralized certification" />
          </ul>
        </va-accordion-item>
      </va-accordion>
    </div>
  );
};

export default UploadFileToVa;
