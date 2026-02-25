import React from 'react';
import TipsForUploading from './TipsForUploading';

const ToxicExposureDescription = (
  <>
    <p>
      If you’re updating your service period or providing information about
      toxic exposure or hazards, you can upload supporting documents here.
    </p>
    <h2 className="vads-u-font-size--h5">
      You may upload one or more of the following:
    </h2>
    <h3 className="vads-u-font-size--h5">Service and discharge documents</h3>
    <ul>
      <li>
        Military discharge paper (such as DD214, DD256, DD 257, NGB22 or other
        separation documents
      </li>
      <li>Military orders or service records</li>
    </ul>
    <h3 className="vads-u-font-size--h5">
      Toxic exposure or hazard-related documents
    </h3>
    <ul>
      <li>
        What you were exposed to, where you were exposed, and when (month and
        year)
      </li>
      <li>
        Type of activity you were in engaged in during exposure, such as basic
        training
      </li>
      <li>
        Written statements, such as a personal statement or a buddy statement
      </li>
      <li>Unit histories</li>
      <li>News articles</li>
      <li>Additional evidence, like photos, a personal journal, diary</li>
    </ul>
    <p>
      Uploading these documents may help speed up your form processing time.
    </p>
    <TipsForUploading />
    <p>Upload a document (one at a time)</p>
  </>
);

export default ToxicExposureDescription;
