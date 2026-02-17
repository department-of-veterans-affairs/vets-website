import React, { useMemo } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { applicantWording } from '../../shared/utilities';
import ConfirmationFAQ from '../components/ConfirmationPage/ConfirmationFAQ';
import ConfirmationScreenView from '../components/ConfirmationPage/ConfirmationScreenView';
import ConfirmationPrintView from '../components/ConfirmationPage/ConfirmationPrintView';

const selectFormData = state => ({
  timestamp: state.form.submission?.timestamp,
  formData: state.form.data,
});

const ConfirmationPage = () => {
  const { formData, timestamp } = useSelector(selectFormData, shallowEqual);
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
    () => ({ beneficiary, signee, submitDate }),
    [beneficiary, signee, submitDate],
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
