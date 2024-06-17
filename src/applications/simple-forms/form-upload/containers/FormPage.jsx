import React from 'react';

import {
  VaBreadcrumbs,
  VaSegmentedProgressBar,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useHistory, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  getBreadcrumbList,
  getFormNumber,
  getFormUploadContent,
  handleRouteChange,
} from '../helpers';

const FormPage = ({ children, currentLocation, pageTitle }) => {
  const history = useHistory();

  const location = useLocation();
  const formNumber = getFormNumber(location);
  const formUploadContent = getFormUploadContent(formNumber);
  const breadcrumbList = getBreadcrumbList(formNumber);
  const onRouteChange = ({ detail }) => handleRouteChange({ detail }, history);

  return (
    <div className="row">
      <div className="usa-width-two-thirds medium-8 columns">
        <div className="vads-u-padding-top--2p5 vads-u-padding-bottom--1p5">
          <VaBreadcrumbs
            breadcrumbList={breadcrumbList}
            onRouteChange={onRouteChange}
          />
        </div>
        <h1 className="vads-u-margin-bottom--1">{`Upload VA Form ${formNumber}`}</h1>
        <p className="vads-u-margin-top--0">{formUploadContent}</p>
        <div>
          <VaSegmentedProgressBar
            current={currentLocation}
            total={3}
            headerLevel={2}
            labels="Upload your file;Review your information;Submit your form"
          />
        </div>
        {typeof pageTitle === 'string' ? (
          <h3 className="vads-u-margin-bottom--4">{pageTitle}</h3>
        ) : (
          pageTitle
        )}
        {children}
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
    </div>
  );
};

FormPage.propTypes = {
  children: PropTypes.any.isRequired,
  currentLocation: PropTypes.number.isRequired,
  pageTitle: PropTypes.any.isRequired,
};

export default FormPage;
