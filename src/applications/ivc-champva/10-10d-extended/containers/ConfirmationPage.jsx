import { format } from 'date-fns';
import React, { useMemo } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import ConfirmationFAQ from '../components/ConfirmationPage/ConfirmationFAQ';
import ConfirmationPrintView from '../components/ConfirmationPage/ConfirmationPrintView';
import ConfirmationScreenView from '../components/ConfirmationPage/ConfirmationScreenView';

const selectFormData = state => ({
  timestamp: state.form.submission?.timestamp,
  formData: state.form.data,
});

const ConfirmationPage = () => {
  const { formData, timestamp } = useSelector(selectFormData, shallowEqual);
  const signerName = useMemo(
    () => formData.statementOfTruthSignature ?? formData.signature ?? '',
    [formData],
  );
  const submitDate = useMemo(
    () => timestamp && format(new Date(timestamp), 'MMMM d, yyyy'),
    [timestamp],
  );
  const viewProps = useMemo(() => ({ signerName, submitDate }), [
    signerName,
    submitDate,
  ]);

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
        <va-link href="https://ask.va.gov" text="Go to Ask VA" />
      </p>
      <p className="screen-only">
        <va-link-action href="/" text="Go back to VA.gov" />
      </p>
    </div>
  );
};

export default ConfirmationPage;
