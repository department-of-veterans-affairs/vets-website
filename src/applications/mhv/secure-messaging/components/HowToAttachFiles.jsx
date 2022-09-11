import React from 'react';
import { VaAdditionalInfo } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const HowToAttachFiles = () => {
  return (
    <VaAdditionalInfo
      trigger="How to attach a file"
      disable-analytics={false}
      disable-border={false}
    >
      <section className="how-to-attach-files">
        <ul>
          <li>Select the 'Attach files' link on the message you are editing</li>
          <li>Select the file you would like to attach</li>
          <li>Select the 'Attach' button</li>
        </ul>

        <h5>Attachment Requirements</h5>
        <ul>
          <li>You may attach up to 4 files.</li>
          <li>
            Files supported: doc, docx, gif, jpg, pdf, png, rtf, txt, xls, xlsx
          </li>
          <li>
            File size for a single attachment cannot exceed 6MB and the total
            size of all attachments cannot exceed 10MB.
          </li>
        </ul>

        <h5>
          Note: If you are unable to attach a document to a Secure Message:
        </h5>
        <ul>
          <li>
            Confirm that your document meets the requirements for size and type
          </li>
          <li>Check your browser settings to be sure JavaScript is enabled</li>
          <li>Use a browser such as Chrome or Firefox</li>
          <li>
            If your problem persists, please contact the My HealtheVet{' '}
            <a href="/help-desk">Help Desk</a>
          </li>
        </ul>
      </section>
    </VaAdditionalInfo>
  );
};

export default HowToAttachFiles;
