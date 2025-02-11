/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/sort-prop-types */
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { focusElement, scrollAndFocus } from 'platform/utilities/ui';
import PropTypes from 'prop-types';
import SchemaForm from '@department-of-veterans-affairs/platform-forms-system/SchemaForm';
import get from '~/platform/utilities/data/get';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { setData } from '~/platform/forms-system/src/js/actions';
import { isMinimalHeaderPath } from '~/platform/forms-system/src/js/patterns/minimal-header';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import ArrayBuilderCards from './ArrayBuilderCards';
import ArrayBuilderSummaryReviewPage from './ArrayBuilderSummaryReviewPage';
import ArrayBuilderSummaryNoSchemaFormPage from './ArrayBuilderSummaryNoSchemaFormPage';
import {
  createArrayBuilderItemAddPath,
  getUpdatedItemFromPath,
  isDeepEmpty,
} from './helpers';

const SuccessAlert = ({ nounSingular, index, onDismiss, text }) => (
  <div className="vads-u-margin-top--2">
    <VaAlert
      onCloseEvent={onDismiss}
      slim
      closeable
      name={`${nounSingular}_${index}`}
      status="success"
      closeBtnAriaLabel="Close notification"
      uswds
    >
      {text}
    </VaAlert>
  </div>
);

const MaxItemsAlert = forwardRef(
  ({ children, show }, ref) =>
    show ? (
      <div className="vads-u-margin-top--4">
        <va-alert slim status="warning" tabIndex={-1} visible ref={ref}>
          <p className="vads-u-margin-y--0 vads-u-font-weight--normal">
            {children}
          </p>
        </va-alert>
      </div>
    ) : null,
);

function filterEmptyItems(arrayData) {
  return arrayData?.length
    ? arrayData.filter(item => !isDeepEmpty(item))
    : arrayData;
}

function checkHasYesNoReviewError(reviewErrors, hasItemsKey) {
  return (
    hasItemsKey && reviewErrors?.errors?.some(obj => obj.name === hasItemsKey)
  );
}

function getYesNoReviewErrorMessage(reviewErrors, hasItemsKey) {
  // use the same error message as the yes/no field
  const error =
    hasItemsKey && reviewErrors?.errors?.find(obj => obj.name === hasItemsKey);
  return error?.message;
}

const useHeadingLevels = (userHeaderLevel, isReviewPage) => {
  const isMinimalHeader = useRef(null);
  if (isMinimalHeader.current === null) {
    // only check once
    isMinimalHeader.current = isMinimalHeaderPath();
  }
  const headingLevel =
    userHeaderLevel || (isMinimalHeader.current && !isReviewPage ? '1' : '3');
  const headingStyle =
    isMinimalHeader.current && !isReviewPage ? ' vads-u-font-size--h2' : '';

  return { headingLevel, headingStyle };
};

/**
 * @param {{
 *   arrayPath: string,
 *   getFirstItemPagePath: (formData, index) => string,
 *   getText: import('./arrayBuilderText').ArrayBuilderGetText
 *   hasItemsKey: string,
 *   introPath: string,
 *   isItemIncomplete: function,
 *   isReviewPage: boolean,
 *   maxItems: number,
 *   nounPlural: string,
 *   nounSingular: string,
 *   required: (formData) => boolean,
 *   titleHeaderLevel: string,
 *   useLinkInsteadOfYesNo: boolean,
 *   useButtonInsteadOfYesNo: boolean,
 * }} arrayBuilderOptions
 * @returns {CustomPageType}
 */
export default function ArrayBuilderSummaryPage(arrayBuilderOptions) {
  const {
    arrayPath,
    getFirstItemPagePath,
    getText,
    hasItemsKey,
    introPath,
    isItemIncomplete,
    isReviewPage,
    maxItems,
    nounPlural,
    nounSingular,
    required,
    titleHeaderLevel,
    useLinkInsteadOfYesNo,
    useButtonInsteadOfYesNo,
  } = arrayBuilderOptions;

  // use closure variable rather than useRef to
  // maintain state over page navigations and review page.
  let maxItemsAlertSeen = false;

  /** @type {CustomPageType} */
  function CustomPage(props) {
    const {
      index: updateItemIndex,
      nounSingular: updatedNounSingular,
    } = getUpdatedItemFromPath();
    const arrayData = get(arrayPath, props.data);
    const updatedItemData =
      updatedNounSingular === nounSingular.toLowerCase() &&
      updateItemIndex != null
        ? arrayData?.[updateItemIndex]
        : null;

    const [showUpdatedAlert, setShowUpdatedAlert] = useState(!!updatedItemData);
    const [showRemovedAlert, setShowRemovedAlert] = useState(false);
    const [showReviewErrorAlert, setShowReviewErrorAlert] = useState(false);
    const [removedItemText, setRemovedItemText] = useState('');
    const [removedItemIndex, setRemovedItemIndex] = useState(null);
    const updatedAlertRef = useRef(null);
    const removedAlertRef = useRef(null);
    const reviewErrorAlertRef = useRef(null);
    const maxItemsAlertRef = useRef(null);
    const { uiSchema, schema } = props;
    const { headingLevel, headingStyle } = useHeadingLevels(
      titleHeaderLevel,
      isReviewPage,
    );
    const Heading = `h${headingLevel}`;
    const isMaxItemsReached = arrayData?.length >= maxItems;
    const hasReviewError =
      isReviewPage && checkHasYesNoReviewError(props.reviewErrors, hasItemsKey);

    useEffect(() => {
      const cleanupEmptyItems = () => {
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
      };

      const redirectToIntroIfEmpty = () => {
        if (!isReviewPage && !arrayData?.length && required(props.data)) {
          // We shouldn't be on this page if there are no items and its required
          // because the required flow goes intro -> item page with no items
          props.goToPath(introPath);
        }
      };

      const resetYesNo = () => {
        // We shouldn't persist the 'yes' answer after an item is entered/cancelled
        // We should ask the yes/no question again after an item is entered/cancelled
        // Since it is required, it shouldn't be left null/undefined
        if (!isReviewPage && props.data?.[hasItemsKey]) {
          props.setData({ ...props.data, [hasItemsKey]: undefined });
        }
      };

      cleanupEmptyItems();
      redirectToIntroIfEmpty();
      resetYesNo();
    }, []);

    useEffect(
      () => {
        if (updatedNounSingular === nounSingular.toLowerCase()) {
          setShowUpdatedAlert(() => updateItemIndex != null);
        }
      },
      [updatedNounSingular, updateItemIndex, nounSingular],
    );

    useEffect(
      () => {
        let timeout;
        let focusRef;

        if (
          showUpdatedAlert &&
          updateItemIndex != null &&
          updatedAlertRef.current
        ) {
          focusRef = updatedAlertRef;
        } else if (
          isMaxItemsReached &&
          !maxItemsAlertSeen &&
          maxItemsAlertRef
        ) {
          focusRef = maxItemsAlertRef;
        }

        maxItemsAlertSeen = isMaxItemsReached;

        if (focusRef) {
          timeout = setTimeout(() => {
            if (focusRef.current) {
              scrollAndFocus(focusRef.current);
            }
          }, 300); // need to wait to override pageScrollAndFocus
        }

        return () => timeout && clearTimeout(timeout);
      },
      [showUpdatedAlert, updateItemIndex, updatedAlertRef, isMaxItemsReached],
    );

    useEffect(
      () => {
        if (
          (uiSchema &&
            schema?.properties &&
            isMaxItemsReached &&
            props.data?.[hasItemsKey] !== false) ||
          (isReviewPage && props.data?.[hasItemsKey] == null)
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

    function forceRerender(data = props.data) {
      // This is a hacky workaround to rerender the page
      // due to the way SchemaForm interacts with CustomPage
      // here in order to hide/show alerts correctly.
      props.setData({
        ...data,
        _metadata: {
          ...data._metadata,
          [`${nounPlural}ForceRenderTimestamp`]: Date.now(),
        },
      });
    }

    useEffect(
      () => {
        setShowReviewErrorAlert(hasReviewError);
        if (
          props.recalculateErrors &&
          props.name &&
          (showUpdatedAlert || showRemovedAlert)
        ) {
          // Affects the red highlighting at the chapter level and
          // error messages. This prop only exists on the review page.
          props.recalculateErrors(props.name);
        }
      },
      [hasReviewError, showUpdatedAlert, showRemovedAlert],
    );

    function addAnotherItemButtonClick() {
      const index = arrayData ? arrayData.length : 0;
      const path = createArrayBuilderItemAddPath({
        path: getFirstItemPagePath(props.data, index),
        index,
        isReview: isReviewPage,
        removedAllWarn: !arrayData?.length && required(props.data),
      });

      props.goToPath(path, {
        force: true,
      });
    }

    function onDismissUpdatedAlert() {
      setShowUpdatedAlert(false);
      requestAnimationFrame(() => {
        focusElement(
          document.querySelector(
            `[data-title-for-noun-singular="${nounSingular}"]`,
          ),
        );
      });
      forceRerender();
    }

    function onDismissRemovedAlert() {
      setShowRemovedAlert(false);
      setRemovedItemText('');
      setRemovedItemIndex(null);
      requestAnimationFrame(() => {
        focusElement(
          document.querySelector(
            `[data-title-for-noun-singular="${nounSingular}"]`,
          ),
        );
      });
      forceRerender();
    }

    function onRemoveItem(index, item) {
      // updated alert may be from initial state (URL path)
      // so we can go ahead and remove it if there is a new
      // alert
      setShowUpdatedAlert(false);
      setRemovedItemText(getText('alertItemDeleted', item, props.data, index));
      setRemovedItemIndex(index);
      setShowRemovedAlert(true);
      requestAnimationFrame(() => {
        focusElement(removedAlertRef.current);
      });
    }

    function onRemoveAllItems() {
      if (required(props.data)) {
        const path = createArrayBuilderItemAddPath({
          path: getFirstItemPagePath(props.data, 0),
          index: 0,
          isReview: isReviewPage,
          removedAllWarn: true,
        });

        props.goToPath(path, {
          force: true,
        });
      }
    }

    const Title = ({ textType }) => {
      const text = getText(textType, updatedItemData, props.data);

      return text ? (
        <Heading
          className={`vads-u-color--gray-dark vads-u-margin-top--0${headingStyle}`}
          data-title-for-noun-singular={nounSingular}
        >
          {text}
        </Heading>
      ) : null;
    };

    const UpdatedAlert = ({ show }) => {
      return (
        <div ref={updatedAlertRef}>
          {show ? (
            <SuccessAlert
              onDismiss={onDismissUpdatedAlert}
              nounSingular={nounSingular}
              index={updateItemIndex}
              text={getText(
                'alertItemUpdated',
                updatedItemData,
                props.data,
                updateItemIndex,
              )}
            />
          ) : null}
        </div>
      );
    };

    const RemovedAlert = ({ show }) => {
      return (
        <div ref={removedAlertRef}>
          {show ? (
            <SuccessAlert
              onDismiss={onDismissRemovedAlert}
              nounSingular={nounSingular}
              index={removedItemIndex}
              text={removedItemText}
            />
          ) : null}
        </div>
      );
    };

    const ReviewErrorAlert = ({ show }) => {
      return (
        <div ref={reviewErrorAlertRef}>
          {show ? (
            <div className="vads-u-margin-top--2">
              <VaAlert
                status="error"
                slim
                tabIndex={0}
                visible
                name={`${nounPlural}ReviewError`}
              >
                {getYesNoReviewErrorMessage(props.reviewErrors, hasItemsKey)}
              </VaAlert>
            </div>
          ) : null}
        </div>
      );
    };

    const Alerts = () => (
      <>
        <MaxItemsAlert show={isMaxItemsReached} ref={maxItemsAlertRef}>
          {getText(
            'alertMaxItems',
            updatedItemData,
            props.data,
            updateItemIndex,
          )}
        </MaxItemsAlert>
        <RemovedAlert show={showRemovedAlert} />
        <UpdatedAlert show={showUpdatedAlert} />
        <ReviewErrorAlert show={showReviewErrorAlert} />
      </>
    );

    const Cards = () => (
      <ArrayBuilderCards
        cardDescription={getText(
          'cardDescription',
          updatedItemData,
          props.data,
          updateItemIndex,
        )}
        arrayPath={arrayPath}
        nounSingular={nounSingular}
        nounPlural={nounPlural}
        isIncomplete={isItemIncomplete}
        getEditItemPathUrl={getFirstItemPagePath}
        getText={getText}
        required={required}
        onRemoveAll={onRemoveAllItems}
        onRemove={onRemoveItem}
        isReview={isReviewPage}
        forceRerender={forceRerender}
        titleHeaderLevel={headingLevel}
      />
    );

    if (isReviewPage) {
      return (
        <ArrayBuilderSummaryReviewPage
          customPageProps={props}
          arrayBuilderOptions={arrayBuilderOptions}
          arrayData={arrayData}
          addAnotherItemButtonClick={addAnotherItemButtonClick}
          updatedItemData={updatedItemData}
          Alerts={Alerts}
          Cards={Cards}
          Title={Title}
          hideAdd={isMaxItemsReached}
        />
      );
    }

    const newUiSchema = { ...uiSchema };
    let newSchema = schema;
    let titleTextType;
    let descriptionTextType;
    let UIDescription;
    const NavButtons = props.NavButtons || FormNavButtons;

    if (arrayData?.length > 0) {
      titleTextType = 'summaryTitle';
      descriptionTextType = 'summaryDescription';
      UIDescription = (
        <>
          <Alerts />
          <Cards />
        </>
      );
    } else {
      titleTextType = 'summaryTitleWithoutItems';
      descriptionTextType = 'summaryDescriptionWithoutItems';
      UIDescription = <Alerts />;
    }

    const descriptionText = getText(descriptionTextType, null, props.data);
    const UITitle = (
      <>
        <Title textType={titleTextType} />
        {descriptionText && (
          <span className="vads-u-font-family--sans vads-u-font-weight--normal vads-u-display--block">
            {descriptionText}
          </span>
        )}
      </>
    );

    newUiSchema['ui:title'] = UITitle;
    newUiSchema['ui:description'] = UIDescription;

    const hideAdd = maxItems && arrayData?.length >= maxItems;

    if (
      schema?.properties?.[hasItemsKey] &&
      Boolean(newSchema.properties[hasItemsKey]['ui:hidden']) !==
        Boolean(hideAdd)
    ) {
      newSchema = {
        ...schema,
        properties: {
          ...schema.properties,
          [hasItemsKey]: {
            ...schema.properties[hasItemsKey],
            'ui:hidden': hideAdd,
          },
        },
      };
    }

    if (useLinkInsteadOfYesNo || useButtonInsteadOfYesNo) {
      return (
        <ArrayBuilderSummaryNoSchemaFormPage
          title={UITitle}
          description={UIDescription}
          arrayData={arrayData}
          hideAdd={hideAdd}
          customPageProps={props}
          arrayBuilderOptions={arrayBuilderOptions}
          addAnotherItemButtonClick={addAnotherItemButtonClick}
          NavButtons={NavButtons}
        />
      );
    }

    return (
      <SchemaForm
        name={props.name}
        title={props.title}
        data={props.data}
        appStateData={props.appStateData}
        schema={newSchema}
        uiSchema={newUiSchema}
        pagePerItemIndex={props.pagePerItemIndex}
        formContext={props.formContext}
        trackingPrefix={props.trackingPrefix}
        onChange={props.onChange}
        onSubmit={props.onSubmit}
      >
        <>
          {/* contentBeforeButtons = save-in-progress links */}
          {props.pageContentBeforeButtons}
          {props.contentBeforeButtons}
          <NavButtons
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
    pageContentBeforeButtons: PropTypes.node,
    pagePerItemIndex: PropTypes.number,
    recalculateErrors: PropTypes.func,
    reviewErrors: PropTypes.object,
    setData: PropTypes.func, // available regardless of review page or not
    setFormData: PropTypes.func, // not available on review page
    title: PropTypes.string,
    trackingPrefix: PropTypes.string,
    NavButtons: PropTypes.func,
  };

  const mapStateToProps = state => ({
    reviewErrors: state?.form?.formErrors,
  });

  const mapDispatchToProps = {
    setData,
  };

  return connect(
    mapStateToProps,
    mapDispatchToProps,
  )(CustomPage);
}

SuccessAlert.propTypes = {
  nounSingular: PropTypes.string,
  index: PropTypes.number,
  onDismiss: PropTypes.func,
  text: PropTypes.string,
};

MaxItemsAlert.propTypes = {
  children: PropTypes.node,
  alertRef: PropTypes.object,
  show: PropTypes.bool,
};
