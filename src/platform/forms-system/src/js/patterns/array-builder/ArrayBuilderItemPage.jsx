/* eslint-disable no-unused-vars */
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import SchemaForm from '@department-of-veterans-affairs/platform-forms-system/SchemaForm';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import get from 'platform/utilities/data/get';
import { useEditOrAddForm } from './useEditOrAddForm';
import { useDuplicateChecks } from './useDuplicateChecks';
import { useItemPageGuard } from './useItemPageGuard';
import ArrayBuilderCancelButton from './ArrayBuilderCancelButton';
import * as helpers from './helpers';

/**
 * @param {ArrayBuilderItemPageProps} itemPageProps
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

    const searchParams = helpers.getArrayUrlSearchParams();
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

    const shouldRender = useItemPageGuard({
      arrayBuilderProps,
      customPageProps: props,
      schema,
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
          uploadFile={props.uploadFile}
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
    NavButtons: PropTypes.func,
    appStateData: PropTypes.object,
    contentAfterButtons: PropTypes.node,
    contentBeforeButtons: PropTypes.node,
    data: PropTypes.object,
    duplicateChecks: PropTypes.shape({
      // allowDuplicates: PropTypes.bool, // Not enabled in MVP
      comparisons: PropTypes.arrayOf(PropTypes.string),
      duplicateModalDescription: PropTypes.func,
      duplicateModalTitle: PropTypes.func,
      duplicateModalPrimaryButtonText: PropTypes.func,
      duplicateModalSecondaryButtonText: PropTypes.func,
      externalComparisonData: PropTypes.func,
      itemPathModalChecks: PropTypes.object,
    }),
    formContext: PropTypes.object,
    formOptions: PropTypes.object,
    fullData: PropTypes.object,
    getFormData: PropTypes.func,
    goBack: PropTypes.func,
    goToPath: PropTypes.func,
    pageContentBeforeButtons: PropTypes.node,
    pagePerItemIndex: PropTypes.string,
    path: PropTypes.string,
    required: PropTypes.bool,
    setFormData: PropTypes.func,
    title: PropTypes.string,
    trackingPrefix: PropTypes.string,
    uploadFile: PropTypes.func,
    onChange: PropTypes.func,
    onContinue: PropTypes.func,
    onReviewPage: PropTypes.bool,
    onSubmit: PropTypes.func,
  };

  return CustomPage;
}

ArrayBuilderItemPage.propTypes = {
  arrayPath: PropTypes.string.isRequired,
  getText: PropTypes.func.isRequired,
  modalDescription: PropTypes.string.isRequired,
  modalTitle: PropTypes.string.isRequired,
  nounPlural: PropTypes.string.isRequired,
  nounSingular: PropTypes.string.isRequired,
  required: PropTypes.func.isRequired,
  reviewRoute: PropTypes.string.isRequired,
  getIntroPath: PropTypes.func,
  getSummaryPath: PropTypes.func,
};
