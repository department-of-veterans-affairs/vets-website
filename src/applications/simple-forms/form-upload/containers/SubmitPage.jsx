import React, { useEffect, useState } from 'react';

import {
  VaBreadcrumbs,
  VaButton,
  VaIcon,
  VaSegmentedProgressBar,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { capitalize } from 'lodash';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { apiRequest } from '~/platform/utilities/api';
import {
  getBreadcrumbList,
  getFileSize,
  getFormNumber,
  getFormUploadContent,
  handleRouteChange,
  submitForm,
} from '../helpers';

const inProgressApi = formId => {
  const apiUrl = '/v0/in_progress_forms/';
  return `${environment.API_URL}${apiUrl}${formId}`;
};

const SubmitPage = () => {
  const history = useHistory();
  const location = useLocation();
  const formNumber = getFormNumber(location);
  const formUploadContent = getFormUploadContent(formNumber);
  const breadcrumbList = getBreadcrumbList(formNumber);

  const fullName = useSelector(state => state?.user?.profile?.userFullName);
  const { state } = location;
  const fileName = state?.file?.name;
  const fileSize = state?.file?.size;
  const confirmationCode = state?.file?.confirmationCode;
  const submitHandler = () => submitForm(formNumber, confirmationCode, history);

  const [veteran, setVeteran] = useState();

  useEffect(() => {
    const fetchVeteran = async () => {
      const apiUrl = inProgressApi('FORM-UPLOAD-FLOW');
      const response = await apiRequest(apiUrl, { method: 'GET' });
      return response?.formData.veteran;
    };

    const getVeteran = async () => {
      const fetchedVeteran = await fetchVeteran();
      setVeteran(fetchedVeteran);
    };

    getVeteran();
  }, []);

  return (
    <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
      <VaBreadcrumbs
        breadcrumbList={breadcrumbList}
        onRouteChange={handleRouteChange}
      />
      <h1>{`Upload VA Form ${formNumber}`}</h1>
      <p>{formUploadContent}</p>
      <div>
        <VaSegmentedProgressBar
          current={3}
          total={3}
          labels="Upload your file;Review your information;Submit your form"
        />
      </div>
      <div className="vads-u-display--flex vads-u-border-bottom--2px vads-u-justify-content--space-between vads-u-align-items--center">
        <h3>Uploaded file</h3>
        <a href={`/form-upload/${formNumber}/upload`}>Change file</a>
      </div>
      <div>
        <VaIcon icon="description" size={5} srtext="icon representing a file" />
        <b>{fileName}</b> {getFileSize(fileSize)}
      </div>
      <div className="vads-u-border-left--4px vads-u-border-color--primary vads-u-padding-left--1">
        <p>
          <b>
            {capitalize(fullName.first)} {capitalize(fullName.last)}
          </b>
        </p>
        {veteran && (
          <>
            <p>Social Security number: {veteran.ssn}</p>
            <p>Zip code: {veteran.address?.postalCode}</p>
          </>
        )}
      </div>
      <p>
        <b>Note:</b> If you need to update your personal information, please
        call us at 800-827-1000. We’re here Monday through Friday, 8:00am to
        9:00pm ET.
      </p>
      <span>
        <VaButton secondary text="<< Back" onClick={history.goBack} />
        <VaButton primary text="Submit form" onClick={submitHandler} />
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
};

export default SubmitPage;
