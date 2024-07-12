import React from 'react';
import MainContentSubDiv from '../../HubRail/shared/mainContentSubDiv';
import LiSpanAndVaLinkAndPTag from '../../HubRail/shared/liSpanAndVaLinkAndPTag';

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
      <va-accordion id="upload-files-accordion" uswds>
        <va-accordion-item
          uswds
          header="Forms library and other accepted documents"
          subheader="Check out the forms and documents which you can submit to VA via the Education File Upload Portal."
        >
          <p>
            Congress shall make no law respecting an establishment of religion,
            or prohibiting the free exercise thereof; or abridging the freedom
            of speech, or of the press; or the right of the people peaceably to
            assemble, and to petition the Government for a redress of
            grievances.
          </p>
        </va-accordion-item>
      </va-accordion>
    </div>
  );
};

export default UploadFileToVa;
