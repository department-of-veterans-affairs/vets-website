import React, { useEffect, useState, useRef } from 'react';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import { useEditOrAddForm } from 'platform/forms-system/src/js/patterns/array-builder';
import ArrayBuilderCancelButton from 'platform/forms-system/src/js/patterns/array-builder/ArrayBuilderCancelButton';
import { getArrayUrlSearchParams } from 'platform/forms-system/src/js/patterns/array-builder/helpers';
import { SchemaForm } from 'platform/forms-system/exportsFile';
import {
  VaModal,
  VaButton,
  VaAlert,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  officialReport,
  officialReportMst,
} from '../pages/form0781/officialReport';
import { isMstEvent } from '../pages/form0781/traumaticEventsPages';
import { removePoliceReportModalContent } from '../content/officialReport';
import { POLICE_REPORT_LOCATION_FIELDS } from '../constants';

const OfficialReport = props => {
  const alertRef = useRef(null);
  const searchParams = getArrayUrlSearchParams();
  const isEdit = !!searchParams.get('edit');
  const isAdd = !!searchParams.get('add');
  const index = parseInt(props.pagePerItemIndex, 10);

  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const shouldShowPoliceDataModal = event =>
    event &&
    !event?.otherReports?.police &&
    POLICE_REPORT_LOCATION_FIELDS.some(
      field => typeof event[field] === 'string' && event[field].trim() !== '',
    );

  const onModalOrContinue = ({ formData }) => {
    if (shouldShowPoliceDataModal(formData)) {
      setShowModal(true);
      return;
    }
    props.onSubmit({ formData });
  };

  const onCancelModal = () => {
    setShowModal(false);
    if (!props.data) return;
    props.onChange({
      ...props.data,
      otherReports: { ...props.data.otherReports, police: true },
    });
  };

  const onCancelAlert = () => {
    setShowAlert(false);
  };

  const removePoliceReport = () => {
    setShowModal(false);

    const event = { ...props.data };

    POLICE_REPORT_LOCATION_FIELDS.forEach(field => {
      event[field] = '';
    });
    event.otherReports = { ...event.otherReports, police: false };

    props.onChange(event);
    setShowAlert(true);
  };

  const { data, schema, uiSchema, onChange, onSubmit } = useEditOrAddForm({
    isEdit,
    schema: isMstEvent(props.fullData)
      ? officialReportMst.schema
      : officialReport.schema,
    uiSchema: isMstEvent(props.fullData)
      ? officialReportMst.uiSchema
      : officialReport.uiSchema,
    data: props.data,
    fullData: props.fullData,
    onChange: props.onChange,
    onSubmit: onModalOrContinue,
    index: props.pagePerItemIndex ? index : null,
    arrayPath: props.arrayBuilder.arrayPath,
  });

  useEffect(
    () => {
      if (showAlert && alertRef.current) {
        alertRef.current.focus();
      }
    },
    [showAlert],
  );

  if (!props.onReviewPage && !isEdit && !isAdd) {
    // we should only arrive at this page with
    // ?add=true or ?edit=true, so if we somehow
    // get here without those, redirect to the
    // summary/intro
    const path =
      props.arrayBuilder.required(props.data) &&
      props.arrayBuilder.introRoute &&
      !data?.length
        ? props.arrayBuilder.introRoute
        : props.arrayBuilder.summaryRoute;
    props.goToPath(path);
    return null;
  }

  if (props.onReviewPage || (isEdit && !schema)) {
    // 1. Don't show for review page.
    // 2. If we're editing, the schema will initially be null
    //    so just return null until schema is loaded by useState
    return null;
  }

  const NavButtons = props.NavButtons || FormNavButtons;

  return (
    <div>
      <div className="vads-u-margin-bottom--1">
        <VaAlert
          ref={alertRef}
          closeBtnAriaLabel="Close notification"
          closeable
          onCloseEvent={onCancelAlert}
          fullWidth="false"
          slim
          status="success"
          visible={showAlert}
          uswds
          tabIndex="-1"
        >
          <p className="vads-u-margin-y--0">
            We’ve removed police report information about Event #{index + 1}.
          </p>
          <p>
            <button type="button" className="va-button-link" onClick={onSubmit}>
              Click here
            </button>{' '}
            to continue with your claim.
          </p>
        </VaAlert>
      </div>
      <SchemaForm
        name={props.name}
        title={props.title}
        data={data}
        appStateData={props.appStateData}
        schema={schema}
        uiSchema={uiSchema}
        pagePerItemIndex={props.pagePerItemIndex}
        formContext={props.formContext}
        getFormData={props.getFormData}
        trackingPrefix={props.trackingPrefix}
        onChange={onChange}
        onSubmit={onSubmit}
      >
        <>
          {isAdd && (
            <>
              <ArrayBuilderCancelButton
                goToPath={props.goToPath}
                arrayPath={props.arrayBuilder.arrayPath}
                summaryRoute={props.arrayBuilder.summaryRoute}
                reviewRoute={props.arrayBuilder.reviewRoute}
                getText={props.arrayBuilder.getText}
                required={props.arrayBuilder.required}
              />
              {/* save-in-progress link, etc */}
              {props.pageContentBeforeButtons}
              {props.contentBeforeButtons}
              <NavButtons
                goBack={props.goBack}
                goForward={props.onContinue}
                submitToContinue
              />
            </>
          )}
          {isEdit && (
            <div className="vads-u-display--flex">
              <div className="vads-u-margin-right--2">
                <ArrayBuilderCancelButton
                  goToPath={props.goToPath}
                  arrayPath={props.arrayBuilder.arrayPath}
                  summaryRoute={props.arrayBuilder.summaryRoute}
                  reviewRoute={props.arrayBuilder.reviewRoute}
                  getText={props.arrayBuilder.getText}
                  required={props.arrayBuilder.required}
                  className="vads-u-margin-0"
                />
              </div>
              <div>
                <VaButton continue submit="prevent" text="Save and continue" />
              </div>
            </div>
          )}

          {props.contentAfterButtons}
        </>
      </SchemaForm>
      <VaModal
        visible={showModal}
        status="warning"
        modalTitle="Remove police report?"
        onCloseEvent={onCancelModal}
        onPrimaryButtonClick={removePoliceReport}
        onSecondaryButtonClick={onCancelModal}
        primaryButtonText="Remove police report"
        secondaryButtonText="Cancel and return to claim"
        uswds
      >
        {removePoliceReportModalContent}
      </VaModal>
    </div>
  );
};

export default OfficialReport;
