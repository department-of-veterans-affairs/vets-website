import React from 'react';

import {
  VaBreadcrumbs,
  VaButton,
  VaFileInput,
  VaSegmentedProgressBar,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useNavigate, useParams } from 'react-router-dom-v5-compat';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { redirect } from '@department-of-veterans-affairs/platform-user/authentication/utilities';
import { connect } from 'react-redux';
import { submitToSimpleForms } from '../actions';

function UploadPage({ confirmationCode, dispatchSubmitToSimpleForms }) {
  const params = useParams();
  const navigate = useNavigate();
  const breadcrumbList = [
    { href: '/', label: 'VA.gov home' },
    {
      href: `/find-forms/about-form-${params.id}`,
      label: `About VA Form ${params.id}`,
      isRouterLink: true,
    },
    {
      href: `/form-upload/${params.id}`,
      label: `Upload VA Form ${params.id}`,
      isRouterLink: true,
    },
  ];

  function handleRouteChange({ detail }) {
    const { href } = detail;
    navigate(href);
  }

  let formUploadContent = '';
  if (params.id === '21-0779') {
    formUploadContent =
      'Request for Nursing Home Information in Connection with Claim for Aid and Attendance';
  }

  return (
    <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
      <VaBreadcrumbs
        breadcrumbList={breadcrumbList}
        onRouteChange={handleRouteChange}
      />
      <h1>{`Upload VA Form ${params.id}`}</h1>
      <p>{formUploadContent}</p>
      <div>
        <VaSegmentedProgressBar
          current={1}
          total={3}
          labels="Upload your file;Review your information;Submit your form"
        />
      </div>
      <h3>Upload your file</h3>
      <p>
        You’ll need to scan your document onto the device you’re using to submit
        this application, such as your computer, tablet, or mobile phone. You
        can upload your document from there.
      </p>
      <div>
        <p>Guidelines for uploading a file:</p>
        <ul>
          <li>You can upload a .pdf, .jpeg, or .png file</li>
          <li>Your file should be no larger than 25MB</li>
        </ul>
      </div>
      <VaFileInput
        accept=".pdf,.jpeg,.png"
        error=""
        hint={null}
        label={`Upload VA Form ${params.id}`}
        name="form-upload-file-input"
        onVaChange={e =>
          dispatchSubmitToSimpleForms(params.id, e.detail.files[0])
        }
        uswds
      />
      <span>
        <VaButton
          secondary
          text="<< Back"
          onClick={() => redirect(`/find-forms/about-form-${params.id}`)}
        />
        {confirmationCode ? (
          <VaButton
            primary
            text="Continue >>"
            onClick={() =>
              navigate(`/${params.id}/review`, { state: { confirmationCode } })
            }
          />
        ) : (
          <VaButton disabled text="Continue >>" />
        )}
      </span>
      <div className="need-help-footer">
        <h2 className="vads-u-padding-bottom--0p5 vads-u-font-size--h3 vads-u-border-bottom--2px vads-u-border-color--primary">
          Need help?
        </h2>
        <p>
          You can call us at <va-telephone contact="8772228387" /> (
          <va-telephone contact="8008778339" tty />
          ). We’re here Monday through Friday, 8:00 a.m to 9:00 p.m ET.
        </p>
      </div>
    </div>
  );
}

UploadPage.propTypes = {
  dispatchSubmitToSimpleForms: PropTypes.func.isRequired,
  confirmationCode: PropTypes.string,
  params: PropTypes.shape({ id: PropTypes.string.isRequired }),
};

function mapStateToProps(state) {
  return {
    confirmationCode: state?.formUpload?.uploads?.confirmationCode,
  };
}

const mapDispatchToProps = {
  dispatchSubmitToSimpleForms: submitToSimpleForms,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(UploadPage),
);

export { UploadPage };
