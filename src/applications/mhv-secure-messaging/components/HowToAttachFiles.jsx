import React from 'react';
import { VaAdditionalInfo } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const HowToAttachFiles = () => {
  return (
    <VaAdditionalInfo
      trigger="What to know about attaching files"
      disable-analytics={false}
      disable-border={false}
      data-dd-action-name="What to know about attaching files Expandable Info"
    >
      <section className="how-to-attach-files">
        <ul className="vads-u-margin-y--0">
          <li>You may attach up to 4 files to each message</li>
          <li>
            You can attach only these file types: doc, docx, gif, jpg, pdf, png,
            rtf, txt, xls, xlsx, jpeg, jfif, pjpeg, pjp
          </li>
          <li>The maximum size for each file is 6 MB</li>
          <li>
            The maximum total size for all files attached to 1 message is 10 MB
          </li>
        </ul>
      </section>
    </VaAdditionalInfo>
  );
};

export default HowToAttachFiles;
