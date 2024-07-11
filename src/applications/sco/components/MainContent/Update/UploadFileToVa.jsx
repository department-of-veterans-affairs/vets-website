import React from 'react';
import MainContentSubDiv from '../../HubRail/shared/mainContentSubDiv';
import LiSpanAndVaLinkAndPTag from '../../HubRail/shared/liSpanAndVaLinkAndPTag';

const UploadFileToVa = () => {
  return (
    <MainContentSubDiv id="upload-files-to-va" header="Upload files to VA">
      <LiSpanAndVaLinkAndPTag
        href="https://www.my.va.gov/EducationFileUploads/s/"
        hrefText="Education File Upload Portal"
        pText="Upload forms and other accepted documents supporting compliance actions, designating or removing certifying officials, and more."
      />
    </MainContentSubDiv>
  );
};

export default UploadFileToVa;
