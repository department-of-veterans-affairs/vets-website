/* eslint-disable no-unused-vars */
/* eslint-disable react/sort-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import SchemaForm from '@department-of-veterans-affairs/platform-forms-system/SchemaForm';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import { useEditOrAddForm } from './useEditOrAddForm';
import ArrayBuilderCancelButton from './ArrayBuilderCancelButton';
import { getArrayUrlSearchParams } from './helpers';

/**
 * @param {{
 *   arrayPath: string,
 *   nounPlural: string,
 *   nounSingular: string,
 *   summaryRoute: string,
 *   introRoute?: string,
 *   required: (formData) => boolean,
 *   reviewRoute: string,
 *   getText: import('./arrayBuilderText').ArrayBuilderGetText,
 * }} props
 */
export default function ArrayBuilderItemPage({
  arrayPath,
  summaryRoute,
  introRoute,
  reviewRoute,
  getText,
  required,
}) {
  /** @type {CustomPageType} */
  function CustomPage(props) {
    const searchParams = getArrayUrlSearchParams();
    const isEdit = !!searchParams.get('edit');
    const isAdd = !!searchParams.get('add');

    const { data, schema, uiSchema, onChange, onSubmit } = useEditOrAddForm({
      isEdit,
      schema: props.schema,
      uiSchema: props.uiSchema,
      data: props.data,
      fullData: props.fullData,
      onChange: props.onChange,
      onSubmit: props.onSubmit,
      index: props.pagePerItemIndex
        ? parseInt(props.pagePerItemIndex, 10)
        : null,
    });

    if (!props.onReviewPage && !isEdit && !isAdd) {
      // we should only arrive at this page with
      // ?add=true or ?edit=true, so if we somehow
      // get here without those, redirect to the
      // summary/intro
      const path =
        required(props.data) && introRoute && !data?.length
          ? introRoute
          : summaryRoute;
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
                arrayPath={arrayPath}
                summaryRoute={summaryRoute}
                introRoute={introRoute}
                reviewRoute={reviewRoute}
                getText={getText}
                required={required}
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
                  arrayPath={arrayPath}
                  summaryRoute={summaryRoute}
                  introRoute={introRoute}
                  reviewRoute={reviewRoute}
                  getText={getText}
                  required={required}
                  className="vads-u-margin-0"
                />
              </div>
              <div>
                <VaButton
                  continue
                  submit="prevent"
                  // "Continue" will display instead of `text`
                  // prop until this is fixed:
                  // https://github.com/department-of-veterans-affairs/vets-design-system-documentation/issues/2733
                  text={getText('editSaveButtonText')}
                />
              </div>
            </div>
          )}

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
    pageContentBeforeButtons: PropTypes.node,
    pagePerItemIndex: PropTypes.string,
    required: PropTypes.bool,
    setFormData: PropTypes.func,
    title: PropTypes.string,
    trackingPrefix: PropTypes.string,
    NavButtons: PropTypes.func,
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
  required: PropTypes.func.isRequired,
  introRoute: PropTypes.string,
  reviewRoute: PropTypes.string.isRequired,
  getText: PropTypes.func.isRequired,
};
