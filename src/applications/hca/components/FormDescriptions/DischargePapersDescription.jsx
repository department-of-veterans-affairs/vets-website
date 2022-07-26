import React from 'react';
import PropTypes from 'prop-types';

const DischargePapersDescription = ({ formContext }) => {
  return !formContext.reviewMode ? (
    <>
      <p>
        Please upload a copy of your military discharge papers (like your DD214,
        DD256, DD257, NGB22, or other separation documents). If you have more
        than one discharge document, please upload the one with the highest
        character of discharge. If you don’t have your discharge papers, you can
        upload a copy of other official military documents (like proof of
        military awards or your disability rating letter).
      </p>

      <p className="vads-u-margin-y--2">
        You don’t have to upload these documents. But it can help us verify your
        military service and may speed up your application process.
      </p>

      <p>
        <strong>Tips for uploading:</strong>
      </p>

      <ul>
        <li>
          Upload documents as one of these file types: .jpg, .png, .pdf, .doc,
          .rtf
        </li>
        <li>
          Upload one or more files that add up to no more than 10 MB total.
        </li>
        <li>
          If you don’t have a digital copy of a document, you can scan or take a
          photo of it and then upload the image from your computer or phone.
        </li>
      </ul>
    </>
  ) : null;
};

DischargePapersDescription.propTypes = {
  formContext: PropTypes.object,
};

export default DischargePapersDescription;
