/* eslint-disable @department-of-veterans-affairs/prefer-button-component */
/* eslint-disable no-unused-vars */
/**
 * For array builder pattern
 * Cards with "Edit" and "DELETE"
 */
import React, { useEffect, useRef, useState } from 'react';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import get from 'platform/utilities/data/get';
import set from 'platform/utilities/data/set';
import { focusElement, scrollTo } from 'platform/utilities/ui';
import { waitForRenderThenFocus } from 'platform/utilities/ui/focus';
import { dataDogLogger } from 'platform/monitoring/Datadog/utilities';
import {
  arrayBuilderContextObject,
  createArrayBuilderItemEditPath,
  getItemDuplicateDismissedName,
  META_DATA_KEY,
  slugifyText,
} from './helpers';
import {
  useArrayBuilderEvent,
  ARRAY_BUILDER_EVENTS,
} from './ArrayBuilderEvents';

const EditLink = withRouter(({ to, srText, router }) => {
  function handleRouteChange(event) {
    event.preventDefault();
    router.push(to);
  }

  return (
    <va-link
      active
      href={to}
      text="Edit"
      onClick={handleRouteChange}
      data-action="edit"
      data-dd-privacy="mask"
      data-dd-action-name="Edit Link"
      label={srText}
    />
  );
});

const RemoveButton = ({ onClick, srText }) => (
  <va-button-icon
    data-action="remove"
    button-type="delete"
    onClick={onClick}
    data-dd-privacy="mask"
    data-dd-action-name="Delete Button"
    label={srText}
  />
);
RemoveButton.propTypes = {
  srText: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

const MissingInformationAlert = ({ children }) => (
  <div className="vads-u-margin-top--2">
    <va-alert status="error" uswds class="array-builder-missing-info-alert">
      {children}
    </va-alert>
  </div>
);

MissingInformationAlert.propTypes = {
  children: PropTypes.any.isRequired,
};

const IncompleteLabel = () => (
  <div className="vads-u-margin-bottom--1">
    <span className="usa-label">INCOMPLETE</span>
  </div>
);

const DuplicateInformationAlert = ({ status = 'warning', children }) => {
  dataDogLogger({
    message: 'Duplicate alert',
    // being consistent with log in ArrayBuilderItemPage
    attributes: { state: 'shown', buttonUsed: null },
  });
  return (
    <div className="vads-u-margin-top--2">
      <va-alert status={status} class="array-builder-duplicate-alert">
        {children}
      </va-alert>
    </div>
  );
};

DuplicateInformationAlert.propTypes = {
  children: PropTypes.any.isRequired,
  status: PropTypes.string,
};

const DuplicateLabel = ({ text }) => (
  <div className="vads-u-margin-bottom--1">
    <span className="usa-label">{text || 'DUPLICATE'}</span>
  </div>
);

/**
 * @param {{
 *   arrayPath: ArrayBuilderOptions['arrayPath'],
 *   cardDescription: string | React.ReactNode | ((itemData: any, index: number, fullData: any) => string | React.ReactNode),
 *   duplicateCheckResult: object,
 *   duplicateChecks: ArrayBuilderOptions['duplicateChecks'],
 *   getEditItemPathUrl: (formData: any, index: number, context) => string,
 *   formData: any,
 *   fullData: any,
 *   isIncomplete: ArrayBuilderOptions['isItemIncomplete'],
 *   nounSingular: ArrayBuilderOptions['nounSingular'],
 *   getText: ArrayBuilderGetText,
 *   isReview: boolean,
 *   onRemove: (index: number, item: any, newFormData: any) => void,
 *   onRemoveAll: (newFormData: any) => void,
 *   required: (formData: any) => boolean,
 *   titleHeaderLevel: string,
 *   canEditItem: ArrayBuilderOptions['canEditItem'],
 *   canDeleteItem: ArrayBuilderOptions['canDeleteItem'],
 * }} props
 */
const ArrayBuilderCards = ({
  arrayPath,
  isIncomplete = () => false,
  getEditItemPathUrl,
  formData,
  fullData,
  nounSingular,
  titleHeaderLevel = '3',
  getText,
  onRemoveAll,
  onRemove,
  required,
  isReview,
  canEditItem,
  canDeleteItem,
  duplicateChecks = {},
  duplicateCheckResult = {},
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const arrayData = get(arrayPath, formData);
  const currentItem = arrayData?.[currentIndex];
  const isMounted = useRef(true);
  const incompleteTimeoutRef = useRef(null);
  const nounSingularSlug = slugifyText(nounSingular);

  const getCardSelector = index =>
    `va-card[name="${nounSingularSlug}_${index}"][data-array-path="${arrayPath}"]`;

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useArrayBuilderEvent(
    ARRAY_BUILDER_EVENTS.INCOMPLETE_ITEM_ERROR,
    ({ index, arrayPath: incompleteArrayPath }) => {
      if (incompleteArrayPath === arrayPath) {
        const card = getCardSelector(index);
        scrollTo(card);
        waitForRenderThenFocus(
          card,
          document,
          250,
          '.array-builder-missing-info-alert',
        );
      }
    },
  );

  useArrayBuilderEvent(
    ARRAY_BUILDER_EVENTS.DUPLICATE_ITEM_ERROR,
    ({ index, arrayPath: duplicateArrayPath }) => {
      if (duplicateArrayPath === arrayPath) {
        const card = getCardSelector(index);
        requestAnimationFrame(() => {
          if (!isMounted.current) {
            return;
          }
          scrollTo(card);
          waitForRenderThenFocus(
            card,
            document,
            250,
            '.array-builder-duplicate-alert',
          );
        });
      }
    },
  );

  if (!arrayData?.length) {
    return null;
  }

  function showRemoveConfirmationModal(index) {
    setCurrentIndex(index);
    setIsModalVisible(true);
  }

  function hideRemoveConfirmationModal({ focusRemoveButton }) {
    const lastIndex = currentIndex;
    setCurrentIndex(null);
    setIsModalVisible(false);
    if (focusRemoveButton) {
      requestAnimationFrame(() => {
        if (!isMounted.current) {
          return;
        }
        focusElement(
          'button',
          null,
          `${getCardSelector(lastIndex)} [data-action="remove"]`,
        );
      });
    }
  }

  function removeAction() {
    const removedIndex = currentIndex;
    const removedItem = currentItem;

    const arrayWithRemovedItem = arrayData.filter(
      (_, index) => index !== currentIndex,
    );
    const newData = set(arrayPath, arrayWithRemovedItem, formData);
    if (!required(newData) && !arrayWithRemovedItem?.length) {
      delete newData[arrayPath];
    }
    hideRemoveConfirmationModal({
      focusRemoveButton: false,
    });
    onRemove(removedIndex, removedItem, newData);
    if (arrayWithRemovedItem.length === 0) {
      onRemoveAll(newData);
    }
  }

  const Card = ({ index, children }) => (
    <div className="vads-u-margin-top--2">
      <va-card
        uswds
        name={`${nounSingularSlug}_${index}`}
        data-array-path={arrayPath}
      >
        {children}
      </va-card>
    </div>
  );

  Card.propTypes = {
    children: PropTypes.any.isRequired,
    index: PropTypes.number.isRequired,
  };

  const cardHeaderLevel = Number(titleHeaderLevel) + 1;
  const CardTitle = `h${cardHeaderLevel}`;
  // Use h3 as the largest size for styling, otherwise use header level.
  // This can change based on minimal header or not.
  const cardHeadingStyling = cardHeaderLevel < 3 ? ' vads-u-font-size--h3' : '';

  return (
    <div>
      <div className="vads-u-display--flex vads-u-justify-content--space-between vads-u-flex-direction--column">
        {arrayData?.length && (
          <ul className="vads-u-margin-top--2 vads-u-padding--0">
            {arrayData.map((itemData, index) => {
              const itemName = getText(
                'getItemName',
                itemData,
                formData,
                index,
              );
              const itemDescription = getText(
                'cardDescription',
                itemData,
                formData,
                index,
              );

              // Incomplete label & alert > duplicate label & alert
              let label = null;
              let alert = null;
              if (isIncomplete(itemData, fullData)) {
                label = <IncompleteLabel />;
                alert = (
                  <MissingInformationAlert>
                    {getText(
                      'cardItemMissingInformation',
                      itemData,
                      formData,
                      index,
                    )}
                  </MissingInformationAlert>
                );
              } else if (
                duplicateCheckResult.duplicates?.includes(
                  duplicateCheckResult.arrayData?.[index],
                )
              ) {
                const getDuplicateText = name =>
                  duplicateChecks[name]?.({ itemData, fullData, index }) ||
                  getText(name, itemData, formData, index);
                const duplicateMetadataFlag = getItemDuplicateDismissedName({
                  arrayPath,
                  duplicateChecks,
                  itemIndex: index,
                  itemString: duplicateCheckResult.arrayData?.[index],
                });
                const dismissedInMetadata =
                  fullData[META_DATA_KEY]?.[duplicateMetadataFlag];
                // If they continue after seeing the duplicate modal between
                // item pages, then we remove the duplicate label and change
                // this from a warning to an info alert
                label = dismissedInMetadata ? null : (
                  <DuplicateLabel
                    text={getDuplicateText('duplicateSummaryCardLabel')}
                  />
                );
                const duplicateInfoAlertStatus = 'warning';
                // allowDuplicates not enabled in MVP
                // duplicateChecks.allowDuplicates ? 'warning' : 'error';

                alert = dismissedInMetadata ? (
                  <DuplicateInformationAlert status="info">
                    {getDuplicateText('duplicateSummaryCardInfoAlert')}
                  </DuplicateInformationAlert>
                ) : (
                  <DuplicateInformationAlert status={duplicateInfoAlertStatus}>
                    {getDuplicateText(
                      'duplicateSummaryCardWarningOrErrorAlert',
                    )}
                  </DuplicateInformationAlert>
                );
              }

              const canEditItemCheck =
                typeof canEditItem !== 'function' ||
                canEditItem({ itemData, index, fullData, isReview });
              const canDeleteItemCheck =
                typeof canDeleteItem !== 'function' ||
                canDeleteItem({ itemData, index, fullData, isReview });

              return (
                <li key={index} style={{ listStyleType: 'none' }}>
                  <Card index={index}>
                    <div>
                      {label}
                      <CardTitle
                        className={`vads-u-margin-top--0${cardHeadingStyling} dd-privacy-mask`}
                        data-dd-action-name="Item Name"
                      >
                        {itemName}
                      </CardTitle>
                      <div
                        className="dd-privacy-mask"
                        data-dd-action-name="Item Description"
                      >
                        {itemDescription}
                      </div>
                      {alert}
                    </div>
                    <span className="vads-u-margin-bottom--neg1 vads-u-margin-top--1 vads-u-display--flex vads-u-align-items--center vads-u-justify-content--space-between vads-u-font-weight--bold">
                      {canEditItemCheck && (
                        <EditLink
                          to={createArrayBuilderItemEditPath({
                            path: getEditItemPathUrl(
                              formData,
                              index,
                              arrayBuilderContextObject({
                                edit: true,
                                review: isReview,
                              }),
                            ),
                            index,
                            isReview,
                          })}
                          srText={`Edit ${itemName}`}
                        />
                      )}
                      {canDeleteItemCheck && (
                        <RemoveButton
                          onClick={() => showRemoveConfirmationModal(index)}
                          srText={`Delete ${itemName}`}
                        />
                      )}
                    </span>
                  </Card>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <VaModal
        clickToClose
        status="warning"
        data-dd-privacy="mask"
        data-dd-action-name="Delete Modal"
        modalTitle={getText('deleteTitle', currentItem, formData, currentIndex)}
        primaryButtonText={getText(
          'deleteYes',
          currentItem,
          formData,
          currentIndex,
        )}
        secondaryButtonText={getText(
          'deleteNo',
          currentItem,
          formData,
          currentIndex,
        )}
        onCloseEvent={() =>
          hideRemoveConfirmationModal({
            focusRemoveButton: true,
          })
        }
        onPrimaryButtonClick={removeAction}
        onSecondaryButtonClick={() =>
          hideRemoveConfirmationModal({
            focusRemoveButton: true,
          })
        }
        visible={isModalVisible}
        uswds
      >
        <div
          className="dd-privacy-mask"
          data-dd-action-name="Delete Confirmation"
        >
          {required(formData) && arrayData?.length === 1
            ? getText(
                'deleteNeedAtLeastOneDescription',
                currentItem,
                formData,
                currentIndex,
              )
            : getText('deleteDescription', currentItem, formData, currentIndex)}
        </div>
      </VaModal>
    </div>
  );
};

const mapStateToProps = state => ({
  formData: state.form.data,
  pageList: state.form.pages,
});

ArrayBuilderCards.propTypes = {
  arrayPath: PropTypes.string.isRequired,
  formData: PropTypes.object.isRequired,
  fullData: PropTypes.object.isRequired,
  getEditItemPathUrl: PropTypes.func.isRequired,
  getText: PropTypes.func.isRequired,
  isIncomplete: PropTypes.func.isRequired,
  isReview: PropTypes.bool.isRequired,
  nounSingular: PropTypes.string.isRequired,
  required: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onRemoveAll: PropTypes.func.isRequired,
  cardDescription: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.node,
    PropTypes.string,
  ]),
  duplicateCheckResult: PropTypes.shape({
    duplicates: PropTypes.arrayOf(PropTypes.string).isRequired,
    arrayData: PropTypes.arrayOf(PropTypes.string).isRequired,
  }),
  duplicateChecks: PropTypes.shape({
    // allowDuplicates: PropTypes.bool, // Not enabled in MVP
    comparisonType: PropTypes.oneOf(['internal', 'external', 'all']),
    duplicateSummaryCardInfoAlert: PropTypes.func,
    duplicateSummaryCardWarningOrErrorAlert: PropTypes.func,
    duplicateSummaryCardLabel: PropTypes.func,
  }),
  canEditItem: PropTypes.func,
  canDeleteItem: PropTypes.func,
  titleHeaderLevel: PropTypes.string,
};

export default connect(mapStateToProps)(ArrayBuilderCards);
