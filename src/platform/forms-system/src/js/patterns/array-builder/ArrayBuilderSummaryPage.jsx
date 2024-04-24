/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/sort-prop-types */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SchemaForm from '@department-of-veterans-affairs/platform-forms-system/SchemaForm';
import get from '~/platform/utilities/data/get';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { setData } from '~/platform/forms-system/src/js/actions';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import ArrayBuilderCards from './ArrayBuilderCards';
import {
  createArrayBuilderItemAddPath,
  getArrayUrlSearchParams,
  isDeepEmpty,
} from './helpers';

function getUpdatedItemIndexFromPath() {
  const urlParams = getArrayUrlSearchParams();
  const updatedValue = urlParams.get('updated');
  return updatedValue?.split('-')?.pop();
}

const SuccessAlert = ({ children, nounSingular, index, onDismiss }) => (
  <div className="vads-u-margin-top--2">
    <VaAlert
      onCloseEvent={onDismiss}
      closeable
      name={`${nounSingular}_${index}`}
      status="success"
      uswds
    >
      {children}
    </VaAlert>
  </div>
);

const MaxItemsAlert = ({ children }) => (
  <div className="vads-u-margin-top--4">
    <va-alert status="warning" visible>
      <p className="vads-u-margin-y--0 vads-u-font-weight--normal">
        {children}
      </p>
    </va-alert>
  </div>
);

function filterEmptyItems(arrayData) {
  return arrayData?.length
    ? arrayData.filter(item => !isDeepEmpty(item))
    : arrayData;
}

/**
 * @param {{
 *   arrayPath: string,
 *   firstItemPagePath: string,
 *   getText: import('./arrayBuilderText').ArrayBuilderGetText
 *   hasItemsKey: string,
 *   isItemIncomplete: function,
 *   isReviewPage: boolean,
 *   maxItems: number,
 *   nounPlural: string,
 *   nounSingular: string,
 *   required: (formData) => boolean,
 *   titleHeaderLevel: string,
 * }} props
 * @returns {CustomPageType}
 */
export default function ArrayBuilderSummaryPage({
  arrayPath,
  firstItemPagePath,
  getText,
  hasItemsKey,
  isItemIncomplete,
  isReviewPage,
  maxItems,
  nounPlural,
  nounSingular,
  required,
  titleHeaderLevel = '3',
}) {
  /** @type {CustomPageType} */
  function CustomPage(props) {
    const [showUpdatedAlert, setShowUpdatedAlert] = useState(false);
    const { uiSchema, schema } = props;
    const arrayData = get(arrayPath, props.data);
    const updateItemIndex = getUpdatedItemIndexFromPath();
    const updatedItemData =
      updateItemIndex != null ? arrayData?.[updateItemIndex] : null;
    const Heading = `h${titleHeaderLevel}`;
    const isMaxItemsReached = arrayData?.length >= maxItems;

    useEffect(() => {
      // We may end up with empty items if the user navigates back
      // from outside of the array scope, because of FormPage's
      // prePopulateArrayData function which auto populates an
      // array with empty initial values. This will remove any items
      // with no array data.
      if (arrayData?.length) {
        const newArrayData = filterEmptyItems(arrayData);
        if (newArrayData?.length !== arrayData.length) {
          props.setData({ ...props.data, [arrayPath]: newArrayData });
        }
      }
    }, []);

    useEffect(
      () => {
        setShowUpdatedAlert(updateItemIndex != null);
      },
      [updateItemIndex],
    );

    useEffect(
      () => {
        if (
          (uiSchema &&
            schema?.properties &&
            isMaxItemsReached &&
            props.data[hasItemsKey] !== false) ||
          (isReviewPage && props.data[hasItemsKey] == null)
        ) {
          // 1. If the user has reached the max items, we want to make sure the
          //    yes/no field is set to false because it will be hidden yet required.
          //    So we need to make sure it's false so it doesn't block the continue button.
          // 2. the yes/no field should never be null/undefined on the final review page,
          //    or it could cause a hidden validation error.
          props.setData({ ...props.data, [hasItemsKey]: false });
        }
      },
      [isReviewPage, arrayData?.length],
    );

    function addAnotherItemButtonClick() {
      const index = arrayData ? arrayData.length : 0;
      const path = createArrayBuilderItemAddPath({
        path: firstItemPagePath,
        index,
        isReview: isReviewPage,
        removedAllWarn: !arrayData?.length && required(props.data),
      });

      props.goToPath(path, {
        force: true,
      });
    }

    function onRemoveAllItems() {
      if (required(props.data)) {
        const path = createArrayBuilderItemAddPath({
          path: firstItemPagePath,
          index: 0,
          isReview: isReviewPage,
          removedAllWarn: true,
        });

        props.goToPath(path, {
          force: true,
        });
      }
    }

    function onDismissUpdatedAlert() {
      setShowUpdatedAlert(false);
    }

    const Title = (
      <>
        <Heading className="vads-u-color--gray-dark vads-u-margin-top--0">
          {getText('summaryTitle', updatedItemData)}
        </Heading>
      </>
    );

    const Cards = (
      <>
        {updatedItemData &&
          showUpdatedAlert && (
            <SuccessAlert
              onDismiss={onDismissUpdatedAlert}
              nounSingular={nounSingular}
              index={updateItemIndex}
            >
              {getText('alertItemUpdated', updatedItemData)}
            </SuccessAlert>
          )}
        <ArrayBuilderCards
          cardDescription={getText('cardDescription', updatedItemData)}
          arrayPath={arrayPath}
          nounSingular={nounSingular}
          nounPlural={nounPlural}
          isIncomplete={isItemIncomplete}
          editItemPathUrl={firstItemPagePath}
          getText={getText}
          required={required}
          onRemoveAll={onRemoveAllItems}
        />
      </>
    );

    if (isReviewPage) {
      return (
        <>
          {arrayData?.length ? (
            Title
          ) : (
            <>
              <div className="form-review-panel-page-header-row">
                <h4 className="form-review-panel-page-header vads-u-font-size--h5">
                  {getText('summaryTitle', updatedItemData)}
                </h4>
              </div>
              <dl className="review">
                <div className="review-row">
                  <dt>{getText('yesNoBlankReviewQuestion')}</dt>
                  <dd>
                    <span
                      className="dd-privacy-hidden"
                      data-dd-action-name="data value"
                    >
                      No
                    </span>
                  </dd>
                </div>
              </dl>
            </>
          )}
          {Cards}
          {!isMaxItemsReached && (
            <div className="vads-u-margin-top--2">
              <va-button
                text={getText('reviewAddButtonText', updatedItemData)}
                onClick={addAnotherItemButtonClick}
                primary
                uswds
              />
            </div>
          )}
        </>
      );
    }

    if (arrayData?.length > 0) {
      uiSchema['ui:title'] = (
        <>
          {Title}
          {isMaxItemsReached && (
            <MaxItemsAlert>
              {getText('alertMaxItems', updatedItemData)}
            </MaxItemsAlert>
          )}
        </>
      );
      uiSchema['ui:description'] = Cards;
    } else {
      uiSchema['ui:title'] = undefined;
      uiSchema['ui:description'] = undefined;
    }

    if (schema?.properties && maxItems && arrayData?.length >= maxItems) {
      schema.properties[hasItemsKey]['ui:hidden'] = true;
    }

    return (
      <SchemaForm
        name={props.name}
        title={props.title}
        data={props.data}
        appStateData={props.appStateData}
        schema={schema}
        uiSchema={uiSchema}
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

  CustomPage.propTypes = {
    name: PropTypes.string.isRequired,
    schema: PropTypes.object,
    uiSchema: PropTypes.object,
    appStateData: PropTypes.object,
    contentAfterButtons: PropTypes.node,
    contentBeforeButtons: PropTypes.node,
    data: PropTypes.object,
    formContext: PropTypes.object,
    goBack: PropTypes.func,
    goToPath: PropTypes.func,
    onChange: PropTypes.func,
    onContinue: PropTypes.func,
    onReviewPage: PropTypes.bool,
    onSubmit: PropTypes.func,
    pagePerItemIndex: PropTypes.number,
    setData: PropTypes.func, // available regardless of review page or not
    setFormData: PropTypes.func, // not available on review page
    title: PropTypes.string,
    trackingPrefix: PropTypes.string,
  };

  const mapDispatchToProps = {
    setData,
  };

  return connect(
    null,
    mapDispatchToProps,
  )(CustomPage);
}
