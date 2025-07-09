import React from 'react';
import PropTypes from 'prop-types';
import { VaAdditionalInfo } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import useFeatureToggles from '../hooks/useFeatureToggles';

const HowToAttachFiles = ({ isPilot }) => {
  const { largeAttachmentsEnabled } = useFeatureToggles();
  const MAX_TOTAL_SIZE_DESCRIPTION = `The maximum total size for all files attached to 1 message is ${
    isPilot ? '25 MB' : '10 MB'
  }`;
  return (
    <VaAdditionalInfo
      trigger="What to know about attaching files"
      disable-analytics={false}
      disable-border={false}
      data-dd-action-name="What to know about attaching files Expandable Info"
    >
      <section className="how-to-attach-files">
        <ul className="vads-u-margin-y--0">
          {largeAttachmentsEnabled ? (
            <>
              <li>You can attach up to 10 files to each message</li>
              <li>
                You can attach only these file types: doc, docx, gif, jpg, pdf,
                png, rtf, txt, xls, xlxs, jpeg, jfif, pjpeg, pjp, bmp, tiff,
                ppt, pptx, pps, ppsx, odt, mp4, m4v, mov, wmv, mpg
              </li>
              <li>The maximum size for each file is 6 MB</li>
              <li>{MAX_TOTAL_SIZE_DESCRIPTION}</li>
            </>
          ) : (
            <>
              <li>You may attach up to 4 files to each message</li>
              <li>
                You can attach only these file types: doc, docx, gif, jpg, pdf,
                png, rtf, txt, xls, xlsx, jpeg, jfif, pjpeg, pjp
              </li>
              <li>The maximum size for each file is 6 MB</li>
              <li>
                The maximum total size for all files attached to 1 message is 10
                MB
              </li>
            </>
          )}
        </ul>
      </section>
    </VaAdditionalInfo>
  );
};

HowToAttachFiles.propTypes = {
  isPilot: PropTypes.bool,
};

export default HowToAttachFiles;
