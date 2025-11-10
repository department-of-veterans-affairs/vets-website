import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { SchemaForm } from 'platform/forms-system/exportsFile';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import { useEditOrAddForm } from 'platform/forms-system/src/js/patterns/array-builder';
import ArrayBuilderCancelButton from 'platform/forms-system/src/js/patterns/array-builder/ArrayBuilderCancelButton';
import { getArrayUrlSearchParams } from 'platform/forms-system/src/js/patterns/array-builder/helpers';
import {
  VaModal,
  VaButton,
  VaAlert,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import {
  officialReport,
  officialReportMst,
} from '../pages/form0781/officialReport';
import { removePoliceReportModalContent } from '../content/officialReport';
import { isRelatedToMST } from '../utils/form0781';
import { POLICE_REPORT_LOCATION_FIELDS } from '../constants';

export function shouldShowPoliceDataModal(event) {
  return (
    event &&
    !event?.otherReports?.police &&
    POLICE_REPORT_LOCATION_FIELDS.some(
      field => typeof event[field] === 'string' && event[field].trim() !== '',
    )
  );
}

const OfficialReport = props => {
  const pageTitleRef = useRef(null);
  const formDomRef = useRef(null);
  const modalRef = useRef(null);
  const alertRef = useRef(null);
  const submitButtonRef = useRef(null);

  const searchParams = getArrayUrlSearchParams();
  const isEdit = !!searchParams.get('edit');
  const isAdd = !!searchParams.get('add');
  const index = parseInt(props.pagePerItemIndex, 10);

  const [tempData, setTempData] = useState(props.data || {});
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const summaryRoute = props.arrayBuilder.getSummaryPath();

  const handlers = {
    shouldShowPoliceDataModal,
    onModalOrContinue: ({ formData }) => {
      if (shouldShowPoliceDataModal(formData)) {
        setShowModal(true);
        return;
      }

      if (!formDomRef.current) return;
      setTempData(formData);
      formDomRef.current.submitForm();
    },
    onSubmit: ({ formData }) => {
      if (handlers.shouldShowPoliceDataModal(formData)) {
        setShowModal(true);
        setTempData(formData);
        return;
      }

      props.onChange(formData);
      props.onSubmit({ formData });
    },
    onCancelModal: () => {
      setShowModal(false);
      if (!props.data) return;
      const restoredData = {
        ...tempData,
        otherReports: { ...tempData.otherReports, police: true },
      };

      setTempData(restoredData);
    },
    onCancelAlert: () => {
      setShowAlert(false);
    },
    removePoliceReport: () => {
      setShowModal(false);

      const updatedData = { ...tempData };
      POLICE_REPORT_LOCATION_FIELDS.forEach(field => {
        updatedData[field] = '';
      });
      updatedData.otherReports = { ...updatedData.otherReports, police: false };

      setTempData(updatedData);
      props.onChange(updatedData);
      setShowAlert(true);
    },
    handleChange: newData => {
      setTempData(newData);
    },
  };

  const { schema, uiSchema } = useEditOrAddForm({
    isEdit,
    schema: isRelatedToMST(props.fullData)
      ? officialReportMst.schema
      : officialReport.schema,
    uiSchema: isRelatedToMST(props.fullData)
      ? officialReportMst.uiSchema
      : officialReport.uiSchema,
    data: tempData,
    fullData: props.fullData,
    onChange: handlers.handleChange,
    onSubmit: handlers.onModalOrContinue,
    index: props.pagePerItemIndex ? index : null,
    arrayPath: props.arrayBuilder.arrayPath,
  });

  useEffect(
    () => {
      if (showModal && modalRef.current) {
        setTimeout(() => {
          const modalEl = modalRef.current;
          const modalHeading = modalEl?.shadowRoot?.querySelector('#heading');
          if (modalHeading) {
            modalHeading.focus({ preventScroll: true });
          }
        }, 0);
      }
    },
    [showModal],
  );
  useEffect(
    () => {
      if (showAlert && alertRef.current) {
        alertRef.current.focus();
      }
    },
    [showAlert],
  );

  if (!props.onReviewPage && !isEdit && !isAdd) {
    const path = summaryRoute;
    props.goToPath(path);
    return null;
  }

  if (props.onReviewPage || (isEdit && !schema)) {
    return null;
  }

  const NavButtons = props.NavButtons || FormNavButtons;

  return (
    <div>
      <h3 tabIndex="-1" ref={pageTitleRef} className="sr-only">
        <span>VA FORM 21-0781</span>{' '}
        <span>
          {isAdd && <>{props.title}</>}
          {isEdit && (
            <>
              Edit event #{index + 1} {props.title.toLowerCase()} details
            </>
          )}
        </span>
      </h3>
      <div className="vads-u-margin-bottom--1">
        <VaAlert
          ref={alertRef}
          data-testid="remove-police-alert"
          closeBtnAriaLabel="Close notification"
          closeable
          onCloseEvent={handlers.onCancelAlert}
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
            <va-link
              text="Continue with your claim"
              onClick={() => submitButtonRef.current?.click()}
            />
          </p>
        </VaAlert>
      </div>
      <SchemaForm
        name={props.name}
        title={props.title}
        data={tempData}
        appStateData={props.appStateData}
        schema={schema}
        uiSchema={uiSchema}
        pagePerItemIndex={props.pagePerItemIndex}
        formContext={props.formContext}
        getFormData={props.getFormData}
        trackingPrefix={props.trackingPrefix}
        onChange={handlers.handleChange}
        onSubmit={handlers.onSubmit}
        ref={formRef => {
          if (formRef) {
            formDomRef.current =
              formRef?.formElement || formRef?.formRef?.current;
          }
        }}
      >
        <>
          {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component */}
          <button
            type="submit"
            ref={submitButtonRef}
            style={{ display: 'none' }}
          />
          {isAdd && (
            <>
              <ArrayBuilderCancelButton
                goToPath={props.goToPath}
                arrayPath={props.arrayBuilder.arrayPath}
                summaryRoute={summaryRoute}
                reviewRoute={props.arrayBuilder.reviewRoute}
                getText={props.arrayBuilder.getText}
                required={props.arrayBuilder.required}
              />
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
                  summaryRoute={summaryRoute}
                  reviewRoute={props.arrayBuilder.reviewRoute}
                  getText={props.arrayBuilder.getText}
                  required={props.arrayBuilder.required}
                  className="vads-u-margin-0"
                />
              </div>
              <div>
                <VaButton
                  continue
                  submit="prevent"
                  text="Save and continue"
                  onClick={() =>
                    handlers.onModalOrContinue({ formData: tempData })
                  }
                />
              </div>
            </div>
          )}

          {props.contentAfterButtons}
        </>
      </SchemaForm>
      <VaModal
        ref={modalRef}
        visible={showModal}
        data-testid="remove-police-modal"
        status="warning"
        modalTitle="Remove police report?"
        onCloseEvent={handlers.onCancelModal}
        onPrimaryButtonClick={handlers.removePoliceReport}
        onSecondaryButtonClick={handlers.onCancelModal}
        primaryButtonText="Yes, remove police report"
        secondaryButtonText="No, return to claim"
        uswds
      >
        {removePoliceReportModalContent}
      </VaModal>
    </div>
  );
};

OfficialReport.propTypes = {
  arrayBuilder: PropTypes.shape({
    getSummaryPath: PropTypes.func.isRequired,
    reviewRoute: PropTypes.string.isRequired,
    arrayPath: PropTypes.string.isRequired,
    required: PropTypes.func.isRequired,
    getText: PropTypes.func.isRequired,
  }).isRequired,
  name: PropTypes.string.isRequired,
  schema: PropTypes.object.isRequired,
  uiSchema: PropTypes.object.isRequired,
  appStateData: PropTypes.object,
  contentAfterButtons: PropTypes.element,
  contentBeforeButtons: PropTypes.element,
  data: PropTypes.object,
  formContext: PropTypes.object,
  fullData: PropTypes.object,
  getFormData: PropTypes.func,
  goBack: PropTypes.func,
  goToPath: PropTypes.func,
  onChange: PropTypes.func,
  onContinue: PropTypes.func,
  onReviewPage: PropTypes.bool,
  onSubmit: PropTypes.func,
  pageContentBeforeButtons: PropTypes.element,
  pagePerItemIndex: PropTypes.string,
  title: PropTypes.string,
  trackingPrefix: PropTypes.string,
  NavButtons: PropTypes.func,
};

export default OfficialReport;
