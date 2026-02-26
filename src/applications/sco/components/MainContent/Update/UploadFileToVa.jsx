import React from 'react';
import MainContentSubDiv from '../../HubRail/shared/mainContentSubDiv';
import LiSpanAndVaLinkAndPTag from '../../HubRail/shared/liSpanAndVaLinkAndPTag';
import LiSpanAndVaLink from '../../HubRail/shared/liSpanAndVaLink';
import LiText from '../../HubRail/shared/liText';

const UploadFileToVa = () => {
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
          <>
            <h4>Accepted forms for digital submission</h4>
            <ul className="vads-u-margin-left--neg2p5">
              <LiSpanAndVaLink
                hrefText="VA Form 22-10215: Statement of Assurance of Compliance with 85% Enrollment Ratios"
                href="/school-administrators/85-15-rule-enrollment-ratio"
                testId="digital-10215-form"
              />
              <LiSpanAndVaLink
                hrefText="VA Form 22-10216: 35% Exemption Request from 85/15 Reporting Requirement"
                href="/school-administrators/35-percent-exemption"
                testId="digital-10216-form"
              />
              <LiSpanAndVaLink
                hrefText="VA Form 22-8794: Designation of Certifying Official(s)"
                href="/school-administrators/update-certifying-officials"
                testId="digital-8794-form"
              />

              <LiSpanAndVaLink
                hrefText="VA Form 22-1919: Conflicting Interests Certification for Proprietary Schools"
                href="/school-administrators/report-conflicting-interests"
                testId="digital-1919-form"
              />

              <LiSpanAndVaLink
                hrefText="VA Form 22-0839: Yellow Ribbon Program Agreement"
                href="/school-administrators/submit-yellow-ribbon-program-agreement-form-22-0839"
                testId="digital-0839-form"
              />
            </ul>
          </>
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
