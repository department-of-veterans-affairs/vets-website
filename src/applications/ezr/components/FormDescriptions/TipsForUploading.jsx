import React from 'react';
import { Toggler } from 'platform/utilities/feature-toggles';
import PropTypes from 'prop-types';

const TipsForUploading = ({ trigger = 'Tips for uploading' }) => (
  <va-additional-info trigger={trigger} class="vads-u-margin-bottom--3" uswds>
    <Toggler feature="ezrServiceHistoryEnabled">
      <Toggler.Enabled>
        <ul>
          <li>Use a .jpg, .png, .pdf, .doc, or .rtf file</li>
          <li>Upload 1 file at a time</li>
          <li>Upload files that add up to no more than 10MB total</li>
          <li>
            If you only have a paper copy, scan or take a photo and upload the
            image
          </li>
        </ul>
      </Toggler.Enabled>
      <Toggler.Disabled>
        <ul>
          <li>Use a .jpg, .png, .pdf, .doc, or .rtf file format</li>
          <li>Upload one file at a time</li>
          <li>Upload files that add up to no more than 10MB or less</li>
          <li>
            If you only have a paper copy, scan or take a photo and upload the
            image
          </li>
        </ul>
      </Toggler.Disabled>
    </Toggler>
  </va-additional-info>
);

TipsForUploading.propTypes = {
  trigger: PropTypes.string,
};

export default TipsForUploading;
