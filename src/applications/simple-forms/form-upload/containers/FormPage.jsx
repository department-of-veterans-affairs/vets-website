import React, { useState, useEffect } from 'react';

import {
  VaBreadcrumbs,
  VaSegmentedProgressBar,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useHistory, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { focusByOrder } from '~/platform/utilities/ui';
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
  const [index, setIndex] = useState(0);

  // The goal with this is to quickly "remove" the header from the DOM, and
  // immediately re-render the component with the header included. `currentLocation`
  // changes when the form chapter changes, and when this happens we want to
  // force react to remove the <h2> and re-render it. This should ensure that
  // VoiceOver will pick up on the new <h2>
  // https://github.com/department-of-veterans-affairs/VA.gov-team-forms/issues/1400
  useEffect(
    () => {
      const selector = '.nav-header > va-segmented-progress-bar';

      if (currentLocation > index + 1) {
        setIndex(index + 1);
      } else if (currentLocation === index) {
        setIndex(index - 1);
      } else {
        focusByOrder([selector]);
      }

      return () => {
        focusByOrder([selector]);
      };
    },
    [currentLocation, index],
  );

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
        <div className="nav-header">
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
