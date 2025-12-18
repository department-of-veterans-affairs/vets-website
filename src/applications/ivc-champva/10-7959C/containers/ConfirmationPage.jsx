import React, { useMemo } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { format } from 'date-fns';
import MissingFileOverview from '../../shared/components/fileUploads/MissingFileOverview';
import { applicantWording } from '../../shared/utilities';
import {
  requiredFiles,
  officeAddress,
  officeFaxNum,
} from '../config/constants';
import { prefixFileNames } from '../components/MissingFileConsentPage';
import ConfirmationFAQ from '../components/ConfirmationPage/ConfirmationFAQ';
import ConfirmationScreenView from '../components/ConfirmationPage/ConfirmationScreenView';
import ConfirmationPrintView from '../components/ConfirmationPage/ConfirmationPrintView';

const heading = (
  <va-alert status="success" class="vads-u-margin-bottom--4">
    <h2>
      You’ve submitted your CHAMPVA Other Health Insurance Certification form
    </h2>
  </va-alert>
);

const requiredWarningHeading = (
  <>
    <va-alert status="warning" class="vads-u-margin-bottom--4">
      <h2>
        You’ve submitted your CHAMPVA Other Health Insurance Certification form
        without required documents
      </h2>
    </va-alert>
    <h2>You still need to mail supporting documents</h2>
    <p>We can’t review your form until we receive copies of these documents:</p>
  </>
);

const optionalWarningHeading = (
  <>
    {heading}
    <p>You can still send us these optional documents for faster processing:</p>
  </>
);

const mailPreamble = (
  <>
    <p>
      <va-link
        href="/family-and-caregiver-benefits/health-and-disability/champva/#supporting-documents-for-your-"
        text="Learn more about the supporting documents you need to submit"
      />
    </p>
    <p>
      Write the Veteran’s first and last name and last four digits of their
      Social Security number on each page of the document.
    </p>
    <p>Mail copies of the supporting documents to this address:</p>
  </>
);

const selectFormData = state => ({
  timestamp: state.form.submission?.timestamp,
  formData: state.form.data,
  formPages: state.form.pages,
});

const ConfirmationPage = () => {
  const { formData, formPages, timestamp } = useSelector(
    selectFormData,
    shallowEqual,
  );
  const alertContent = MissingFileOverview({
    data: formData,
    disableLinks: true,
    heading,
    optionalWarningHeading,
    requiredWarningHeading,
    showMail: true,
    allPages: formPages,
    fileNameMap: prefixFileNames(formData, requiredFiles),
    requiredDescription: '',
    requiredFiles,
    nonListNameKey: 'applicantName',
    mailingAddress: officeAddress,
    mailPreamble,
    faxNum: officeFaxNum,
    showNameHeader: false,
    showRequirementHeaders: false,
  });
  const beneficiary = useMemo(
    () => applicantWording(formData, false, false, false),
    [formData],
  );
  const signee = useMemo(
    () => formData.statementOfTruthSignature ?? formData.signature ?? '',
    [formData],
  );
  const submitDate = useMemo(
    () => timestamp && format(new Date(timestamp), 'MMMM d, yyyy'),
    [timestamp],
  );
  const viewProps = useMemo(
    () => ({ alertContent, beneficiary, signee, submitDate }),
    [alertContent, beneficiary, signee, submitDate],
  );

  return (
    <div className="confirmation-page vads-u-margin-bottom--2p5">
      <section className="screen-only">
        <ConfirmationScreenView {...viewProps} />
      </section>

      <section className="print-only">
        <ConfirmationPrintView {...viewProps} />
      </section>

      <ConfirmationFAQ />

      <p className="screen-only">
        <va-link-action href="/" text="Go back to VA.gov" />
      </p>
    </div>
  );
};

export default ConfirmationPage;
