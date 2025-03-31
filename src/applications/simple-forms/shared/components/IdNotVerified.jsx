import React from 'react';
import PropTypes from 'prop-types';
import VerifyAlert from 'platform/user/authorization/components/VerifyAlert';

const getDefaultDownloadLink = formNumber =>
  `https://www.vba.va.gov/pubs/forms/VBA-${formNumber}-ARE.pdf`;

const getContent = formType => {
  return `If you don’t want to verify your identity right now, you can still download and complete the PDF version of this ${formType}.`;
};

const IdNotVerifiedAlert = ({
  headingLevel,
  formType,
  formNumber,
  downloadLink,
  content,
}) => (
  <div
    className="id-not-verified-content vads-u-margin-top--4"
    data-testid="verifyIdAlert"
  >
    <VerifyAlert headingLevel={headingLevel} />
    <p className="vads-u-margin-top--3">{content || getContent(formType)}</p>
    <p className="vads-u-margin-y--3">
      <va-link
        download
        href={downloadLink || getDefaultDownloadLink(formNumber)}
        text={`Get VA Form ${formNumber} to download`}
      />
    </p>
  </div>
);

IdNotVerifiedAlert.propTypes = {
  formNumber: PropTypes.string.isRequired,
  content: PropTypes.node,
  downloadLink: PropTypes.string,
  formType: PropTypes.string,
  headingLevel: PropTypes.number,
};

IdNotVerifiedAlert.defaultProps = {
  headingLevel: 3,
  formType: 'request',
};

export default React.memo(IdNotVerifiedAlert);
