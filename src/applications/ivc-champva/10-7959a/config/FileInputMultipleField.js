import React from 'react';
import commonFieldMapping from 'platform/forms-system/src/js/web-component-fields/commonFieldMapping';
import formsPatternFieldMapping from 'platform/forms-system/src/js/web-component-fields/formsPatternFieldMapping';
import { VaFileInputMultiple } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { uploadFile } from 'platform/forms-system/src/js/actions';
import environment from 'platform/utilities/environment';
import { createPayload } from '../../shared/components/fileUploads/upload';

function vaFileInputMultipleMapping(props) {
  const {
    description,
    textDescription,
    DescriptionField,
    uiOptions,
    index,
    childrenProps,
  } = props;

  // Stubs
  const setProgress = async _v => {};
  const setUploadRequest = async _v => {};

  const updateProgress = async percent => {
    setProgress(percent);
  };
  const onAddFile = async event => {
    if (event.target?.files?.length) {
      // const addUiOptions = props.uiSchema['ui:options'];

      // v3 multi-file always includes a `null` at the end of files array, so drop:
      const tmpFiles = event.target.files.filter(el => el);

      const tmpCurrentFile = tmpFiles.slice(-1); // for v3 we need last item, not first
      const currentFile = tmpCurrentFile[0]; // v3 multi-upload returns a single-item list, so pull file from that
      const allFiles = props.formData || [];

      const idx = allFiles.length === 0 ? 0 : allFiles.length;

      uploadFile(
        currentFile,
        {
          fileUploadUrl: `${
            environment.API_URL
          }/ivc_champva/v1/forms/submit_supporting_documents`,
          createPayload,
          parseResponse: (response, file) => {
            setTimeout(() => {
              //   findAndFocusLastSelect();
            });
            return {
              name: file.name,
              confirmationCode: response.data.attributes.confirmationCode,
              attachmentId: '',
            };
          },
        },
        updateProgress,
        file => {
          // formData is undefined initially
          const newData = props.formData || [];
          newData[idx] = { ...file, isEncrypted: false };
          props.onChange(newData);
          setUploadRequest(null);
        },
        () => {
          setUploadRequest(null);
        },
        '123', // tracking prefix
        undefined, // Password
        false, // enable short workflow
      );
    }
  };

  const commonFieldProps = commonFieldMapping(props);
  const { formsPatternProps, formDescriptionSlot } = formsPatternFieldMapping(
    props,
  );

  return {
    ...commonFieldProps,
    ...formsPatternProps,
    value:
      typeof childrenProps.formData === 'undefined'
        ? ''
        : childrenProps.formData,
    messageAriaDescribedby:
      commonFieldProps.messageAriaDescribedby || undefined,
    onVaMultipleChange: event => {
      return onAddFile({ target: event.detail });
    },
    onBlur: () => childrenProps.onBlur(childrenProps.idSchema.$id),
    children: (
      <>
        {formDescriptionSlot}
        {textDescription && <p>{textDescription}</p>}
        {DescriptionField && (
          <DescriptionField options={uiOptions} index={index} />
        )}
        {!textDescription && !DescriptionField && description}
      </>
    ),
  };
}

function VaFileInputMultipleField(props) {
  const mappedProps = vaFileInputMultipleMapping(props);
  return <VaFileInputMultiple {...mappedProps} />;
}

export { VaFileInputMultipleField };
