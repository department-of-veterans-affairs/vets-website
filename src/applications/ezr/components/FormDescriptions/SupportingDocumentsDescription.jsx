import React from 'react';
import TipsForUploading from './TipsForUploading';

const ToxicExposureDescription = (
  <>
    <p>
      We recommend uploading any supporting documents that may help us confirm
      details about your military service.
    </p>
    <p>
      It’s your choice whether to upload them. But they may help us process your
      form faster.
    </p>
    <h3 className="vads-u-font-size--h5">Military service documents</h3>
    <p>You can upload copies of any of these documents:</p>
    <ul>
      <li>Your DD214, DD215, or other separation documents</li>
      <li>
        Military service records or documents, like proof of military awards or
        your disability rating letter
      </li>
      <li>Military orders or unit histories</li>
    </ul>
    <p>
      <b>Note:</b>
      If you have more than 1 discharge document, upload the document with the
      highest character of discharge.
    </p>
    <h3 className="vads-u-font-size--h5">
      If you updated information about your exposure to any toxins or other
      hazards
    </h3>
    <p>Here’s the type of information your document can include:</p>
    <ul>
      <li>The toxins or other hazards you may have been exposed to</li>
      <li>When and where you may have been exposed</li>
      <li>
        The type of activity you were engaged in when you were exposed, like
        basic training
      </li>
    </ul>
    <p>
      These are the types of documents you can submit that may have this
      information:
    </p>
    <ul>
      <li>The military service documents listed in the previous section</li>
      <li>
        A written statement, like a personal statement or a buddy statement
      </li>
      <li>Photos, journal entries, or news articles</li>
    </ul>
    <TipsForUploading />
    <p>Select a file to upload</p>
  </>
);

export default ToxicExposureDescription;
