/* eslint-disable no-unused-vars */
/* eslint-disable react/sort-prop-types */
import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import SchemaForm from '@department-of-veterans-affairs/platform-forms-system/SchemaForm';
import {
  VaButton,
  VaModal,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import get from 'platform/utilities/data/get';
import set from 'platform/utilities/data/set';
import { useEditOrAddForm } from './useEditOrAddForm';
import { useDuplicateChecks } from './useDuplicateChecks';
import { useItemPageGuard } from './useItemPageGuard';
import ArrayBuilderCancelButton, {
  formatPath,
} from './ArrayBuilderCancelButton';
import { getArrayUrlSearchParams, META_DATA_KEY } from './helpers';

/**
 * @param {{
 *   arrayPath: string,
 *   nounPlural: string,
 *   nounSingular: string,
 *   getSummaryPath: (formData) => string,
 *   getIntroPath: (formData) => string,
 *   required: (formData) => boolean,
 *   reviewRoute: string,
 *   getText: import('./arrayBuilderText').ArrayBuilderGetText,
 *   duplicateChecks?: object,
 *   currentPath: string,
 * }} itemPageProps
 */
export default function ArrayBuilderItemPage(itemPageProps) {
  /** @type {CustomPageType} */
  function CustomPage(props) {
    const arrayBuilderProps = itemPageProps;
    // For CustomPages use this line instead:
    // const arrayBuilderProps = props.arrayBuilder;

    const {
      arrayPath,
      getSummaryPath,
      getIntroPath,
      reviewRoute,
      getText,
      required,
      currentPath,
    } = arrayBuilderProps;

    const searchParams = getArrayUrlSearchParams();
    const isEdit = !!searchParams.get('edit');
    const isAdd = !!searchParams.get('add');
    const isReview = searchParams?.has('review');
    const currentItem = get(arrayPath, props.fullData)?.[
      props.pagePerItemIndex
    ];
    const introRoute = getIntroPath(props.fullData);
    const summaryRoute = getSummaryPath(props.fullData);

    const { data, schema, uiSchema, onChange, onSubmit } = useEditOrAddForm({
      isEdit,
      schema: props.schema,
      uiSchema: props.uiSchema,
      data: props.data,
      fullData: props.fullData || {},
      onChange: props.onChange,
      onSubmit: props.onSubmit,
      index: props.pagePerItemIndex
        ? parseInt(props.pagePerItemIndex, 10)
        : null,
      arrayPath,
    });

    const { checkForDuplicates, renderDuplicateModal } = useDuplicateChecks({
      arrayBuilderProps,
      customPageProps: props,
    });

    const handleSubmit = checkForDuplicates(
      useCallback(
        newProps => {
          onSubmit(newProps);
        },
        [onSubmit],
      ),
    );

    // This helps redirect if arriving at this page without proper URL params
    // and guards against rendering when schema is not yet loaded
    const shouldRender = useItemPageGuard({
      arrayBuilderProps,
      customPageProps: props,
      schema,
      fullData: data,
    });

    if (!shouldRender) {
      return null;
    }

    const NavButtons = props.NavButtons || FormNavButtons;

    return (
      <>
        {renderDuplicateModal()}
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
          onSubmit={handleSubmit}
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
                  useWebComponents={
                    props.formOptions?.useWebComponentForNavigation
                  }
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
      </>
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
    formOptions: PropTypes.object,
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
    path: PropTypes.string,
    required: PropTypes.bool,
    setFormData: PropTypes.func,
    title: PropTypes.string,
    trackingPrefix: PropTypes.string,
    NavButtons: PropTypes.func,
    duplicateChecks: PropTypes.shape({
      // allowDuplicates: PropTypes.bool, // Not enabled in MVP
      comparisons: PropTypes.arrayOf(PropTypes.string),
      duplicateModalTitle: PropTypes.func,
      duplicateModalPrimaryButtonText: PropTypes.func,
      duplicateModalSecondaryButtonText: PropTypes.func,
      duplicateModalDescription: PropTypes.func,
      externalComparisonData: PropTypes.func,
      itemPathModalChecks: PropTypes.object,
    }),
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
