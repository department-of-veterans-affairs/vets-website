/* eslint-disable no-unused-vars */
/* eslint-disable react/sort-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import SchemaForm from '@department-of-veterans-affairs/platform-forms-system/SchemaForm';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import { useEditOrAddForm } from './useEditOrAddForm';
import ArrayBuilderCancelAddingButton from './ArrayBuilderCancelAddingButton';

const DEFAULT_TEXT = {
  cancelTitle: props =>
    `Are you sure you want to cancel adding this ${props.nounSingular}?`,
  cancelDescription: props =>
    `If you cancel adding this ${
      props.nounSingular
    }, we won't save the information. You'll return to a screen where you can add or remove ${
      props.nounPlural
    }.`,
  cancelYes: props => `Yes, cancel adding`,
  cancelNo: props => `No, continue adding`,
  buttonText: props => `Cancel adding this ${props.nounSingular}`,
};

/**
 * Item page for ArrayBuilder pattern. Uses local state when in
 * 'edit=true' urlQueryParam mode.
 *
 * requires `customPageUsesPagePerItemData: true` in the pageConfig
 *
 * Example:
 * ```
 * customPageUsesPagePerItemData: true
 * CustomPage: ArrayBuilderItemPage({
    arrayPath: 'employers',
    nounSingular: 'employer',
    nounPlural: 'employers',
    summaryRoute: '/array-multiple-page-builder-summary',
  })
 * ```
 *
 * @param {{
 *   arrayPath: string,
 *   buttonText: string,
 *   nounPlural: string,
 *   nounSingular: string,
 *   summaryRoute: string,
 *   textOverrides?: {
 *     cancelTitle: (props) => string,
 *     cancelDescription: (props) => string,
 *     cancelYes: (props) => string,
 *     cancelNo: (props) => string,
 *     buttonText: (props) => string,
 *   }
 * }} props
 */
export default function ArrayBuilderItemPage({
  arrayPath,
  nounSingular,
  nounPlural,
  textOverrides,
  summaryRoute,
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

    const textProps = {
      nounPlural,
      nounSingular,
    };

    function getText(key) {
      return textOverrides?.[key]
        ? textOverrides?.[key](textProps)
        : DEFAULT_TEXT[key](textProps);
    }

    const text = {
      cancelTitle: getText('cancelTitle'),
      cancelDescription: getText('cancelDescription'),
      cancelYes: getText('cancelYes'),
      cancelNo: getText('cancelNo'),
      buttonText: getText('buttonText'),
    };

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
            modalDescription={text.cancelDescription}
            modalTitle={text.cancelTitle}
            modalButtonPrimary={text.cancelYes}
            modalButtonSecondary={text.cancelNo}
            buttonText={text.buttonText}
            summaryRoute={summaryRoute}
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
  buttonText: PropTypes.object.isRequired,
  modalDescription: PropTypes.string.isRequired,
  modalTitle: PropTypes.string.isRequired,
  nounPlural: PropTypes.string.isRequired,
  nounSingular: PropTypes.string.isRequired,
  summaryRoute: PropTypes.string.isRequired,
  textOverrides: PropTypes.shape({
    cancelTitle: PropTypes.func,
    cancelDescription: PropTypes.func,
    cancelYes: PropTypes.func,
    cancelNo: PropTypes.func,
    buttonText: PropTypes.func,
  }),
};
