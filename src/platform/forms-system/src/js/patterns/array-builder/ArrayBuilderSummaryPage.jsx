/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/sort-prop-types */
import classNames from 'classnames';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { focusElement } from 'platform/utilities/ui/focus';
import { scrollAndFocus } from 'platform/utilities/scroll';
import PropTypes from 'prop-types';
import SchemaForm from '@department-of-veterans-affairs/platform-forms-system/SchemaForm';
import get from '~/platform/utilities/data/get';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { setData } from '~/platform/forms-system/src/js/actions';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import ArrayBuilderCards from './ArrayBuilderCards';
import ArrayBuilderSummaryReviewPage from './ArrayBuilderSummaryReviewPage';
import ArrayBuilderSummaryNoSchemaFormPage from './ArrayBuilderSummaryNoSchemaFormPage';
import {
  arrayBuilderContextObject,
  checkIfArrayHasDuplicateData,
  createArrayBuilderItemAddPath,
  getUpdatedItemFromPath,
  isDeepEmpty,
  // META_DATA_KEY,
  maxItemsFn,
  slugifyText,
  useHeadingLevels,
  validateIncompleteItems,
} from './helpers';

const SuccessAlert = ({ nounSingular, index, onDismiss, text }) => (
  <div className="vads-u-margin-top--2">
    <VaAlert
      onCloseEvent={onDismiss}
      slim
      closeable
      name={`${slugifyText(nounSingular)}_${index}`}
      status="success"
      closeBtnAriaLabel="Close notification"
      uswds
    >
      <div className="dd-privacy-mask" data-dd-action-name="Success Alert">
        {text}
      </div>
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

/**
 * @param {{
 *   arrayPath: ArrayBuilderOptions['arrayPath'],
 *   getFirstItemPagePath: (formData, index, context) => string,
 *   getText: ArrayBuilderGetText,
 *   hasItemsKey: string,
 *   hideMaxItemsAlert: boolean,
 *   getIntroPath: (formData) => string,
 *   isItemIncomplete: ArrayBuilderOptions['isItemIncomplete'],
 *   isReviewPage: boolean,
 *   maxItems: ArrayBuilderOptions['maxItems'],
 *   missingInformationKey: string,
 *   nounPlural: ArrayBuilderOptions['nounPlural'],
 *   nounSingular: ArrayBuilderOptions['nounSingular'],
 *   required: (formData) => boolean,
 *   titleHeaderLevel: string,
 *   useLinkInsteadOfYesNo: ArrayBuilderOptions['useLinkInsteadOfYesNo'],
 *   useButtonInsteadOfYesNo: ArrayBuilderOptions['useButtonInsteadOfYesNo'],
 *   canAddItem: ArrayBuilderOptions['canAddItem'],
 *   canEditItem: ArrayBuilderOptions['canEditItem'],
 *   canDeleteItem: ArrayBuilderOptions['canDeleteItem'],
 *   duplicateChecks: ArrayBuilderOptions['duplicateChecks'],
 * }} arrayBuilderOptions
 * @returns {CustomPageType}
 */
export default function ArrayBuilderSummaryPage(arrayBuilderOptions) {
  const {
    arrayPath,
    getFirstItemPagePath,
    getText,
    hasItemsKey,
    hideMaxItemsAlert,
    getIntroPath,
    isItemIncomplete,
    isReviewPage,
    missingInformationKey,
    nounPlural,
    nounSingular,
    required,
    titleHeaderLevel,
    useLinkInsteadOfYesNo,
    useButtonInsteadOfYesNo,
    canEditItem,
    canDeleteItem,
    canAddItem,
    duplicateChecks = {},
  } = arrayBuilderOptions;

  // use closure variable rather than useRef to
  // maintain state over page navigations and review page.
  let maxItemsAlertSeen = false;

  /** @type {CustomPageType} */
  function CustomPage(props) {
    const {
      index: updateItemIndex,
      arrayPathSlug: updatedArrayPathSlug,
    } = getUpdatedItemFromPath();
    const arrayData = get(arrayPath, props.data);
    const arrayPathSlug = slugifyText(arrayPath);
    const updatedItemData =
      updatedArrayPathSlug === arrayPathSlug && updateItemIndex != null
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
    const dataRef = useRef(props.data);
    const { uiSchema, schema } = props;
    const { headingLevel, headingStyle } = useHeadingLevels(
      titleHeaderLevel,
      isReviewPage,
    );
    const Heading = `h${headingLevel}`;
    const maxItems = maxItemsFn(arrayBuilderOptions.maxItems, props.data);
    const isMaxItemsReached = arrayData?.length >= maxItems;
    const hasReviewError =
      isReviewPage && checkHasYesNoReviewError(props.reviewErrors, hasItemsKey);

    const duplicateCheckResult = checkIfArrayHasDuplicateData({
      arrayPath,
      duplicateChecks,
      fullData: props.fullData,
    });

    const getTitleSelector = () =>
      `[data-title-for-noun-singular="${nounSingular}"][data-array-path="${arrayPath}"]`;

    const setDataFromRef = data => {
      const dataToSet = { ...(dataRef.current || {}), ...data };
      dataRef.current = dataToSet;
      props.setData(dataToSet);
    };

    useEffect(
      () => {
        dataRef.current = props.data;
      },
      [props.data],
    );

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
            setDataFromRef({ [arrayPath]: newArrayData });
          }
        }
      };

      const redirectToIntroIfEmpty = () => {
        if (!isReviewPage && !arrayData?.length && required(props.data)) {
          // We shouldn't be on this page if there are no items and its required
          // because the required flow goes intro -> item page with no items
          props.goToPath(getIntroPath(props.fullData));
        }
      };

      const resetYesNo = () => {
        // We shouldn't persist the 'yes' answer after an item is entered/cancelled
        // We should ask the yes/no question again after an item is entered/cancelled
        // Since it is required, it shouldn't be left null/undefined
        if (!isReviewPage && dataRef.current?.[hasItemsKey]) {
          setDataFromRef({ [hasItemsKey]: undefined });
        }
      };

      cleanupEmptyItems();
      redirectToIntroIfEmpty();
      resetYesNo();
    }, []);

    useEffect(
      () => {
        if (updatedArrayPathSlug === arrayPathSlug) {
          setShowUpdatedAlert(() => updateItemIndex != null);
        }
      },
      [updatedArrayPathSlug, updateItemIndex, arrayPathSlug],
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
        // Ensure yes/no field is never left in a bad state:
        // - On summary page: force false when max items reached (field hidden but still required)
        // - On review page: force false to avoid hidden validation error
        const length = Array.isArray(arrayData) ? arrayData.length : 0;
        const reachedMax =
          Number.isFinite(maxItems) && maxItems > 0 && length >= maxItems;

        const id = requestAnimationFrame(() => {
          const curr = dataRef.current || {};
          const val = curr?.[hasItemsKey];

          const setFalseForReview = isReviewPage && typeof val === 'undefined';
          const setFalseForMax = !isReviewPage && reachedMax && val !== false;

          if (setFalseForMax || setFalseForReview) {
            setDataFromRef({ [hasItemsKey]: false });
          }
        });

        return () => cancelAnimationFrame(id);
      },
      [
        isReviewPage,
        hasItemsKey,
        maxItems,
        props.data?.[hasItemsKey],
        Array.isArray(arrayData) ? arrayData.length : 0,
      ],
    );

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
        path: getFirstItemPagePath(
          props.data,
          index,
          arrayBuilderContextObject({
            add: true,
            review: isReviewPage,
          }),
        ),
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
        focusElement(document.querySelector(getTitleSelector()));
      });
    }

    function onDismissRemovedAlert() {
      setShowRemovedAlert(false);
      setRemovedItemText('');
      setRemovedItemIndex(null);
      requestAnimationFrame(() => {
        focusElement(document.querySelector(getTitleSelector()));
      });
    }

    function onRemoveItem(index, item, newFormData) {
      const onUpdate = isReviewPage ? props.setData : props.onChange;
      onUpdate(newFormData);
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

    function onRemoveAllItems(newFormData) {
      if (required(props.data)) {
        const path = createArrayBuilderItemAddPath({
          path: getFirstItemPagePath(newFormData, 0, {
            add: true,
            review: isReviewPage,
          }),
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
      const baseClasses = ['vads-u-color--gray-dark', 'vads-u-margin-top--0'];
      return text ? (
        <Heading
          className={classNames(baseClasses, headingStyle)}
          data-title-for-noun-singular={nounSingular}
          data-array-path={arrayPath}
        >
          {text}
        </Heading>
      ) : null;
    };

    Title.propTypes = {
      textType: PropTypes.string.isRequired,
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

    UpdatedAlert.propTypes = {
      show: PropTypes.bool.isRequired,
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

    RemovedAlert.propTypes = {
      show: PropTypes.bool.isRequired,
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

    ReviewErrorAlert.propTypes = {
      show: PropTypes.bool.isRequired,
    };

    const Alerts = () => {
      const showMaxItemsAlert = isMaxItemsReached && !hideMaxItemsAlert;
      const alertsShown =
        showMaxItemsAlert ||
        showUpdatedAlert ||
        showRemovedAlert ||
        showReviewErrorAlert;
      const isButtonOrLink = useLinkInsteadOfYesNo || useButtonInsteadOfYesNo;

      return (
        <div
          className={
            alertsShown && isButtonOrLink && !arrayData?.length
              ? 'vads-u-margin-bottom--4'
              : ''
          }
        >
          <MaxItemsAlert show={showMaxItemsAlert} ref={maxItemsAlertRef}>
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
        </div>
      );
    };

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
        titleHeaderLevel={headingLevel}
        fullData={props.fullData}
        canEditItem={canEditItem}
        canDeleteItem={canDeleteItem}
        duplicateChecks={duplicateChecks}
        duplicateCheckResult={duplicateCheckResult}
      />
    );

    // Calculate hideAdd based on maxItems and canAddItem
    const canAddItemCheck =
      typeof canAddItem !== 'function' ||
      canAddItem({ arrayData, fullData: props.data, isReview: isReviewPage });
    const hideAdd = isMaxItemsReached || !canAddItemCheck;

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
          hideAdd={hideAdd}
        />
      );
    }

    // About missing information validation/focus event:
    // 1. Why invisible field? Because we don't want to display an
    //    extra field or error.
    // 2. Why not redux? Validation errors aren't stored in redux, they
    //    are calculated on the fly on page submission, so the easiest
    //    way to get the error and block going to the next page is to
    //    hook into ui:validations
    // 3. Where does the error show up? if ui:validation fails, it fires
    //    an ArrayBuilderEvent that the ArrayBuilderCards listen to,
    //    which then scrolls/focuses to the respective error card.
    const missingInformation = {
      uiSchema: {
        'ui:title': ' ',
        'ui:options': {
          showFieldLabel: 'no-wrap',
        },
        'ui:validations': [
          (errors, _, formData) => {
            validateIncompleteItems({
              arrayData: get(arrayPath, formData),
              isItemIncomplete,
              nounSingular,
              errors,
              arrayPath,
              fullData: formData,
            });
          },
        ],
      },
      schema: {
        type: 'object',
        properties: {},
        'ui:hidden': true,
      },
    };

    const newUiSchema = {
      [missingInformationKey]: missingInformation.uiSchema,
      ...uiSchema,
    };
    let newSchema = schema;
    const NavButtons = props.NavButtons || FormNavButtons;
    const hasArrayItems = !!arrayData?.length;

    const typeSuffix = hasArrayItems ? '' : 'WithoutItems';
    const titleTextType = `summaryTitle${typeSuffix}`;
    const descriptionTextType = `summaryDescription${typeSuffix}`;

    const renderKey = [
      showUpdatedAlert ? 'u1' : 'u0',
      showRemovedAlert ? 'r1' : 'r0',
      showReviewErrorAlert ? 'e1' : 'e0',
      isMaxItemsReached ? 'm1' : 'm0',
    ].join('-');
    const UIDescription = (
      <div key={renderKey}>
        <Alerts />
        {hasArrayItems && <Cards />}
      </div>
    );

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

    if (schema?.properties?.[hasItemsKey]) {
      if (
        Boolean(newSchema.properties[hasItemsKey]['ui:hidden']) !==
        Boolean(hideAdd)
      ) {
        newSchema = {
          ...schema,
          properties: {
            [missingInformationKey]: missingInformation.schema,
            ...schema.properties,
            [hasItemsKey]: {
              ...schema.properties[hasItemsKey],
              'ui:hidden': hideAdd,
            },
          },
        };
      } else {
        newSchema = {
          ...schema,
          properties: {
            [missingInformationKey]: missingInformation.schema,
            ...schema.properties,
          },
        };
      }
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
          isItemIncomplete={isItemIncomplete}
          NavButtons={NavButtons}
        />
      );
    }

    const onSubmit = (...args) => {
      const isValid = validateIncompleteItems({
        arrayData: get(arrayPath, props.data),
        isItemIncomplete,
        nounSingular,
        errors: { addError: () => {} },
        arrayPath,
        fullData: props.fullData,
      });

      if (isValid) {
        // NOTE: Blocking submission using duplicateChecks.allowDuplicates is
        // not enabled in MVP because we need to consider UX of the modal first
        // if (
        //   duplicateChecks?.allowDuplicates === false &&
        //   duplicateCheckResult.hasDuplicate
        // ) {
        //   scrollAndFocus('va-card:has(.array-builder-duplicate-alert)');
        // } else {
        props.onSubmit(...args);
        // }
      }
    };

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
        onSubmit={onSubmit}
        formOptions={props.formOptions}
      >
        <>
          {/* contentBeforeButtons = save-in-progress links */}
          {props.pageContentBeforeButtons}
          {props.contentBeforeButtons}
          <NavButtons
            goBack={props.goBack}
            goForward={props.onContinue}
            submitToContinue
            useWebComponents={props.formOptions?.useWebComponentForNavigation}
          />
          {props.contentAfterButtons}
        </>
      </SchemaForm>
    );
  }

  CustomPage.propTypes = {
    name: PropTypes.string.isRequired,
    schema: PropTypes.object,
    uiSchema: PropTypes.object.isRequired,
    appStateData: PropTypes.object,
    contentAfterButtons: PropTypes.node,
    contentBeforeButtons: PropTypes.node,
    data: PropTypes.object,
    formContext: PropTypes.object,
    formOptions: PropTypes.object,
    fullData: PropTypes.object,
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
