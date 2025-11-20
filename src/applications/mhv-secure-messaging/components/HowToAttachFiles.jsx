import React from 'react';
import PropTypes from 'prop-types';
import { VaAdditionalInfo } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const HowToAttachFiles = ({ useLargeAttachments = false }) => {
  const MAX_TOTAL_SIZE_DESCRIPTION = `The maximum total size for all files attached to 1 message is ${
    useLargeAttachments ? '25 MB' : '10 MB'
  }`;
  const MAX_SINGLE_FILE_SIZE_DESCRIPTION = `The maximum size for each file is ${
    useLargeAttachments ? '25 MB' : '6 MB'
  }`;
  return (
    <VaAdditionalInfo
      trigger="What to know about attaching files"
      disable-analytics={false}
      disable-border={false}
      data-dd-action-name="What to know about attaching files Expandable Info"
      data-testid="how-to-attach-files"
    >
      <section className="how-to-attach-files">
        <ul className="vads-u-margin-y--0">
          {useLargeAttachments ? (
            <>
              <li>You can attach up to 10 files to each message</li>
              <li>
                You can attach only these file types: doc, docx, gif, jpg, pdf,
                png, rtf, txt, xls, xlxs, jpeg, jfif, pjpeg, pjp, bmp, tiff,
                ppt, pptx, pps, ppsx, odt, mp4, m4v, mov, wmv, mpg
              </li>
              <li>{MAX_SINGLE_FILE_SIZE_DESCRIPTION}</li>
              <li>{MAX_TOTAL_SIZE_DESCRIPTION}</li>
            </>
          ) : (
            <>
              <li>You may attach up to 4 files to each message</li>
              <li>
                You can attach only these file types: doc, docx, gif, jpg, pdf,
                png, rtf, txt, xls, xlsx, jpeg, jfif, pjpeg, pjp
              </li>
              <li>{MAX_SINGLE_FILE_SIZE_DESCRIPTION}</li>
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
  useLargeAttachments: PropTypes.bool,
};

export default HowToAttachFiles;
