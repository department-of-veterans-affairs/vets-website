/* eslint-disable no-unused-vars */
/* eslint-disable react/sort-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import SchemaForm from '@department-of-veterans-affairs/platform-forms-system/SchemaForm';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import { useEditOrAddForm } from './useEditOrAddForm';
import ArrayBuilderCancelAddingButton from './ArrayBuilderCancelAddingButton';

/**
 * @param {{
 *   arrayPath: string,
 *   nounPlural: string,
 *   nounSingular: string,
 *   summaryRoute: string,
 *   getText: import('./arrayBuilderText').ArrayBuilderGetText,
 * }} props
 */
export default function ArrayBuilderItemPage({
  arrayPath,
  summaryRoute,
  getText,
}) {
  /** @type {CustomPageType} */
  function CustomPage(props) {
    const searchParams = new URLSearchParams(window.location.search);
    const isEdit = !!searchParams.get('edit');
    const { data, schema, uiSchema, onChange, onSubmit } = useEditOrAddForm({
      isEdit,
      schema: props.schema,
      uiSchema: props.uiSchema,
      data: props.data,
      onChange: props.onChange,
      onSubmit: props.onSubmit,
    });

    if (props.onReviewPage || (isEdit && !schema)) {
      return null;
    }

    return (
      <SchemaForm
        name={props.name}
        title={props.title}
        data={data}
        appStateData={props.appStateData}
        schema={schema}
        uiSchema={uiSchema}
        pagePerItemIndex={props.pagePerItemIndex}
        formContext={props.formContext}
        trackingPrefix={props.trackingPrefix}
        onChange={onChange}
        onSubmit={onSubmit}
      >
        <>
          <ArrayBuilderCancelAddingButton
            goToPath={props.goToPath}
            arrayPath={arrayPath}
            summaryRoute={summaryRoute}
            getText={getText}
          />
          {/* auto displayed save-in-progress link, etc */}
          {!isEdit && props.contentBeforeButtons}
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

  CustomPage.propTypes = {
    name: PropTypes.string.isRequired,
    schema: PropTypes.object.isRequired,
    uiSchema: PropTypes.object.isRequired,
    appStateData: PropTypes.object,
    contentAfterButtons: PropTypes.node,
    contentBeforeButtons: PropTypes.node,
    PageContentBeforeButtons: PropTypes.node,
    data: PropTypes.object,
    formContext: PropTypes.object,
    goBack: PropTypes.func,
    goToPath: PropTypes.func,
    onChange: PropTypes.func,
    onContinue: PropTypes.func,
    onReviewPage: PropTypes.bool,
    onSubmit: PropTypes.func,
    pagePerItemIndex: PropTypes.string,
    setFormData: PropTypes.func,
    title: PropTypes.string,
    trackingPrefix: PropTypes.string,
  };

  return CustomPage;
}

ArrayBuilderItemPage.propTypes = {
  arrayPath: PropTypes.string.isRequired,
  modalDescription: PropTypes.string.isRequired,
  modalTitle: PropTypes.string.isRequired,
  nounPlural: PropTypes.string.isRequired,
  nounSingular: PropTypes.string.isRequired,
  summaryRoute: PropTypes.string.isRequired,
  getText: PropTypes.func.isRequired,
};
