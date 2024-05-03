import React from 'react';

import {
  VaBreadcrumbs,
  VaButton,
  VaSegmentedProgressBar,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  useNavigate,
  useParams,
  useLocation,
} from 'react-router-dom-v5-compat';
import PropTypes from 'prop-types';
import { redirect } from '@department-of-veterans-affairs/platform-user/authentication/utilities';

function ReviewPage() {
  const params = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
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
          current={2}
          total={3}
          labels="Upload your file;Review your information;Submit your form"
        />
      </div>
      <h3>Review your information</h3>
      <p>
        When you submit your form, we’ll include the following personal
        information so that you can track your submission’s status.
      </p>
      <p>
        <b>Ziggy Ignots</b>
      </p>
      <p>Social Security number: ***-**-2139</p>
      <p>VA file number: ***-**-8355</p>
      <p>Zip code: 12590</p>
      <p>
        <b>Note:</b> If you need to update your personal information, please
        call us at 800-827-1000. We’re here Monday through Friday, 8:00am to
        9:00pm ET.
      </p>
      <span>
        <VaButton
          secondary
          text="<< Back"
          onClick={() => redirect(`/${params.id}/upload`)}
        />
        <VaButton
          primary
          text="Continue >>"
          onClick={() =>
            navigate(`/${params.id}/submit`, {
              state: { confirmationCode: state.confirmationCode },
            })
          }
        />
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

ReviewPage.propTypes = {
  params: PropTypes.shape({ id: PropTypes.string.isRequired }),
};

export default ReviewPage;
