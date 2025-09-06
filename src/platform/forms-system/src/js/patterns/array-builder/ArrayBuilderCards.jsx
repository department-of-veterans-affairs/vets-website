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
import get from 'platform/utilities/data/get';
import set from 'platform/utilities/data/set';
import { focusElement, scrollTo } from 'platform/utilities/ui';
import { withRouter } from 'react-router';
import {
  arrayBuilderContextObject,
  createArrayBuilderItemEditPath,
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
      label={srText}
    />
  );
});

const RemoveButton = ({ onClick, srText }) => (
  <va-button-icon
    data-action="remove"
    button-type="delete"
    onClick={onClick}
    label={srText}
  />
);

const MissingInformationAlert = ({ children }) => (
  <div className="vads-u-margin-top--2">
    <va-alert status="error" uswds class="array-builder-missing-info-alert">
      {children}
    </va-alert>
  </div>
);

const IncompleteLabel = () => (
  <div className="vads-u-margin-bottom--1">
    <span className="usa-label">INCOMPLETE</span>
  </div>
);

/**
 * @param {{
 *   arrayPath: string,
 *   getEditItemPathUrl: (formData: any, index: number, context) => string,
 *   formData: any,
 *   isIncomplete: (itemData: any) => boolean,
 *   nounSingular: string,
 *   setFormData: (formData: any) => void,
 *   titleHeaderLevel: string,
 *   getText: import('./arrayBuilderText').ArrayBuilderGetText
 *   onRemoveAll: () => void,
 *   required: (formData: any) => boolean,
 * }} props
 */
const ArrayBuilderCards = ({
  arrayPath,
  isIncomplete = () => false,
  getEditItemPathUrl,
  formData,
  nounSingular,
  titleHeaderLevel = '3',
  getText,
  onRemoveAll,
  onRemove,
  required,
  isReview,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const arrayData = get(arrayPath, formData);
  const currentItem = arrayData?.[currentIndex];
  const isMounted = useRef(true);
  const nounSingularSlug = slugifyText(nounSingular);

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
        const card = `va-card[name="${nounSingularSlug}_${index}"]`;
        scrollTo(card);
        focusElement(`${card} .array-builder-missing-info-alert`);
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
          `va-card[name="${slugifyText(
            nounSingular,
          )}_${lastIndex}"] [data-action="remove"]`,
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
      <va-card uswds name={`${nounSingularSlug}_${index}`}>
        {children}
      </va-card>
    </div>
  );

  Card.propTypes = {
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
              return (
                <li key={index} style={{ listStyleType: 'none' }}>
                  <Card index={index}>
                    <div>
                      {isIncomplete(itemData) && <IncompleteLabel />}
                      <CardTitle
                        className={`vads-u-margin-top--0${cardHeadingStyling} dd-privacy-mask`}
                        data-dd-action-name="Card title"
                      >
                        {itemName}
                      </CardTitle>
                      {itemDescription}
                      {isIncomplete(itemData) && (
                        <MissingInformationAlert>
                          {getText(
                            'cardItemMissingInformation',
                            itemData,
                            formData,
                            index,
                          )}
                        </MissingInformationAlert>
                      )}
                    </div>
                    <span className="vads-u-margin-bottom--neg1 vads-u-margin-top--1 vads-u-display--flex vads-u-align-items--center vads-u-justify-content--space-between vads-u-font-weight--bold">
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
                      <RemoveButton
                        onClick={() => showRemoveConfirmationModal(index)}
                        srText={`Delete ${itemName}`}
                      />
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
        {required(formData) && arrayData?.length === 1
          ? getText(
              'deleteNeedAtLeastOneDescription',
              currentItem,
              formData,
              currentIndex,
            )
          : getText('deleteDescription', currentItem, formData, currentIndex)}
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
  titleHeaderLevel: PropTypes.string,
};

export default connect(mapStateToProps)(ArrayBuilderCards);
