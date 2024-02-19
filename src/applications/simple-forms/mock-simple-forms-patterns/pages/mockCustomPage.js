/* eslint-disable react/sort-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import SchemaForm from '@department-of-veterans-affairs/platform-forms-system/SchemaForm';
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';

// pass this to the formConfig's pageConfig. NOT directly into the SchemaForm
// otherwise updateSchema type code may not work
export const mockCustomPage = {
  uiSchema: {
    ...titleUI(
      'Custom page',
      // or ({ formData, formContext }) => 'Custom page',
      'This page is a base template for using a custom page with a standard SchemaForm',
      // or ({ formData, formContext }) => 'description',
    ),
    nameCustom: {
      'ui:title': 'Your name',
      'ui:webComponentField': VaTextInputField,
    },
  },
  schema: {
    type: 'object',
    required: ['nameCustom'],
    properties: {
      nameCustom: {
        type: 'string',
      },
    },
  },
};

/** @type {CustomPageType} */
export function MockCustomPage(props) {
  /**
   * Customizations:
   *
   * - To treat formData and setFormData at the array item level:
   *   use `customPageUsesPagePerItemData: true` in the pageConfig
   *
   * - Example of managing local state before clicking continue:
   * ```
   * const { data, schema, uiSchema, onChange, onSubmit } = useEditOrAddForm({
   *   isEdit,
   *   schema: props.schema,
   *   uiSchema: props.uiSchema,
   *   data: props.data,
   *   onChange: props.onChange,
   *   onSubmit: props.onSubmit,
   * });
   * // pass new props to SchemaForm
   *
   * if (isEdit && !schema) {
   *  return null;
   * }
   * ```
   */
  return (
    <SchemaForm
      name={props.name}
      title={props.title}
      data={props.data}
      appStateData={props.appStateData}
      schema={props.schema}
      uiSchema={props.uiSchema}
      pagePerItemIndex={props.pagePerItemIndex}
      formContext={props.formContext}
      trackingPrefix={props.trackingPrefix}
      onChange={props.onChange}
      onSubmit={props.onSubmit}
    >
      <>
        {/* contentBeforeButtons = save-in-progress links */}
        {props.contentBeforeButtons}
        <FormNavButtons
          goBack={props.goBack}
          goForward={props.onContinue}
          submitToContinue
        />
        {props.contentAfterButtons}
      </>
    </SchemaForm>
  );
}

MockCustomPage.propTypes = {
  name: PropTypes.string.isRequired,
  schema: PropTypes.object.isRequired,
  uiSchema: PropTypes.object.isRequired,
  appStateData: PropTypes.object,
  contentAfterButtons: PropTypes.node,
  contentBeforeButtons: PropTypes.node,
  data: PropTypes.object,
  formContext: PropTypes.object,
  goBack: PropTypes.func,
  onChange: PropTypes.func,
  onContinue: PropTypes.func,
  onReviewPage: PropTypes.bool,
  onSubmit: PropTypes.func,
  pagePerItemIndex: PropTypes.number,
  title: PropTypes.string,
  trackingPrefix: PropTypes.string,
};
