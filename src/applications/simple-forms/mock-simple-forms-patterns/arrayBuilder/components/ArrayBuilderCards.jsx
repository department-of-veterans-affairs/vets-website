/* eslint-disable @department-of-veterans-affairs/prefer-button-component */
/* eslint-disable no-unused-vars */
/**
 * For array builder pattern
 * Cards with "Edit" and "Remove"
 */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setData } from 'platform/forms-system/src/js/actions';
import get from 'platform/utilities/data/get';
import set from 'platform/utilities/data/set';
import { createArrayBuilderItemEditPath } from '../helpers';

const DEFAULT_TEXT = {
  title: props => `Review your ${props.nounPlural}`,
  removeTitle: props =>
    `Are you sure you want to remove this ${props.nounSingular}?`,
  removeDescription: props =>
    `This will remove ${props.getItemName(
      props.itemData,
    )} and all the information from your list of ${props.nounPlural}.`,
  removeYes: props => `Yes, remove this ${props.nounSingular}`,
  removeNo: props => `No, continue`,
  itemUpdated: props =>
    `${props.getItemName(props.itemData)}’s information has been updated`,
  itemMissingInformation: props =>
    `This ${
      props.nounSingular
    } is missing information. Edit and complete this ${
      props.nounSingular
    }’s information before continuing.`,
  getItemName: itemData => itemData?.name,
};

const EditLink = ({ to, itemName }) => (
  <Link to={to} data-action="edit">
    Edit
    <i
      aria-hidden="true"
      className="fa fa-chevron-right vads-u-margin-left--1"
    />
    <span className="sr-only">{itemName}</span>
  </Link>
);

const RemoveButton = ({ onClick, itemName }) => (
  <button
    type="button"
    className="va-button-link vads-u-color--secondary-dark vads-u-font-weight--bold vads-u-text-decoration--none vads-u-display--flex vads-u-align-items--center"
    data-action="remove"
    onClick={onClick}
  >
    <i
      aria-hidden="true"
      className="fa fa-trash vads-u-margin-right--1 vads-u-font-size--md"
    />
    Remove
    <span className="sr-only">{itemName}</span>
  </button>
);

const MissingInformationAlert = ({ children }) => (
  <div className="vads-u-margin-top--2">
    <va-alert status="error" uswds>
      {children}
    </va-alert>
  </div>
);

const SuccessAlert = ({ children }) => (
  <div className="vads-u-margin-top--2">
    <va-alert status="success" uswds>
      {children}
    </va-alert>
  </div>
);

const IncompleteLabel = () => (
  <div className="vads-u-margin-bottom--1">
    <span className="usa-label">INCOMPLETE</span>
  </div>
);

function getUpdatedItemIndexFromPath() {
  const urlParams = new URLSearchParams(window.location?.search);
  const updatedValue = urlParams.get('updated');
  return updatedValue?.split('-')?.pop();
}

/**
 * Usage:
 * ```
 * <ArrayBuilderCards
 *   cardDescription={itemData =>
 *     `${itemData?.dateStart} - ${itemData?.dateEnd}`
 *   }
 *   arrayPath="employers"
 *   nounSingular="employer"
 *   nounPlural="employers"
 *   isIncomplete={item => !item?.name}
 *   editItemPathUrl="/array-multiple-page-builder-item-page-1/:index"
 * />
 * ```x
 *
 * @param {Object} props
 */
const ArrayBuilderCards = ({
  arrayPath,
  isIncomplete = () => false,
  editItemPathUrl,
  setFormData,
  formData,
  nounSingular,
  nounPlural,
  cardDescription,
  titleHeaderLevel = '3',
  textOverrides,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const arrayData = get(arrayPath, formData);
  const currentItem = arrayData?.[currentIndex];
  const isReview = window.location?.pathname?.includes('review-and-submit');
  const updateItemIndex = getUpdatedItemIndexFromPath();
  const updatedItemData =
    updateItemIndex != null ? arrayData?.[updateItemIndex] : null;

  const textProps = {
    getItemName: textOverrides?.getItemName || (itemData => itemData?.name),
    itemData: currentItem,
    nounPlural,
    nounSingular,
  };

  function getText(key, props) {
    return textOverrides?.[key]
      ? textOverrides?.[key](props || textProps)
      : DEFAULT_TEXT[key](props || textProps);
  }

  const text = {
    title: getText('title'),
    removeTitle: getText('removeTitle'),
    removeDescription: getText('removeDescription'),
    removeYes: getText('removeYes'),
    removeNo: getText('removeNo'),
    itemUpdated: getText('itemUpdated', {
      ...textProps,
      itemData: updatedItemData,
    }),
    itemMissingInformation: getText('itemMissingInformation'),
  };

  if (!arrayData?.length) {
    return null;
  }

  function showRemoveConfirmationModal(index) {
    setCurrentIndex(index);
    setIsModalVisible(true);
  }

  function hideRemoveConfirmationModal() {
    setCurrentIndex(null);
    setIsModalVisible(false);
  }

  function removeAction() {
    const item = arrayData[currentIndex];
    const arrayWithRemovedItem = arrayData.filter(
      data => data.name !== item.name,
    );
    const newData = set(arrayPath, arrayWithRemovedItem, formData);

    setFormData(newData);
    hideRemoveConfirmationModal();
  }

  const Card = ({ index, children }) => (
    <div className="vads-u-margin-bottom--2">
      <va-card uswds name={`${nounSingular}_${index}`}>
        {children}
      </va-card>
    </div>
  );

  Card.propTypes = {
    index: PropTypes.number.isRequired,
  };

  const Heading = `h${titleHeaderLevel}`;
  const CardHeading = `h${Number(titleHeaderLevel) + 1}`;

  return (
    <div>
      <Heading>{text.title}</Heading>
      <div className="vads-u-display--flex vads-u-justify-content--space-between vads-u-flex-direction--column">
        {updatedItemData && <SuccessAlert>{text.itemUpdated}</SuccessAlert>}
        {arrayData?.length && (
          <ul className="vads-u-margin-top--4 vads-u-padding--0">
            {arrayData.map((itemData, index) => {
              const itemName = textProps.getItemName(itemData);
              return (
                <li key={index} style={{ listStyleType: 'none' }}>
                  <Card index={index}>
                    <div>
                      {isIncomplete(itemData) && <IncompleteLabel />}
                      <CardHeading className="vads-u-margin-top--0">
                        {itemName}
                      </CardHeading>
                      {cardDescription(itemData)}
                      {isIncomplete(itemData) && (
                        <MissingInformationAlert>
                          {text.itemMissingInformation}
                        </MissingInformationAlert>
                      )}
                    </div>
                    <span className="vads-u-margin-top--2 vads-u-display--flex vads-u-justify-content--space-between vads-u-font-weight--bold">
                      <EditLink
                        to={createArrayBuilderItemEditPath({
                          path: editItemPathUrl,
                          index,
                          isReview,
                        })}
                        itemName={itemName}
                      />
                      <RemoveButton
                        onClick={() => showRemoveConfirmationModal(index)}
                        itemName={itemName}
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
        modalTitle={text.removeTitle}
        primaryButtonText={text.removeYes}
        secondaryButtonText={text.removeNo}
        onCloseEvent={hideRemoveConfirmationModal}
        onPrimaryButtonClick={removeAction}
        onSecondaryButtonClick={hideRemoveConfirmationModal}
        visible={isModalVisible}
        uswds
      >
        {text.removeDescription}
      </VaModal>
    </div>
  );
};

const mapStateToProps = state => ({
  formData: state.form.data,
  pageList: state.form.pages,
});

const mapDispatchToProps = {
  setFormData: setData,
};

ArrayBuilderCards.propTypes = {
  arrayPath: PropTypes.string.isRequired,
  cardDescription: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.node,
    PropTypes.string,
  ]).isRequired,
  editItemPathUrl: PropTypes.string.isRequired,
  formData: PropTypes.object.isRequired,
  isIncomplete: PropTypes.func.isRequired,
  nounPlural: PropTypes.string.isRequired,
  nounSingular: PropTypes.string.isRequired,
  setFormData: PropTypes.func.isRequired,
  textOverrides: PropTypes.shape({
    title: PropTypes.func,
    removeTitle: PropTypes.func,
    removeDescription: PropTypes.func,
    removeYes: PropTypes.func,
    removeNo: PropTypes.func,
    itemUpdated: PropTypes.func,
    itemMissingInformation: PropTypes.func,
    getItemName: PropTypes.func,
  }),
  titleHeaderLevel: PropTypes.func,
};

/**
 * Usage:
 * ```
 * <ArrayBuilderCards
 *   cardDescription={itemData =>
 *     `${itemData?.dateStart} - ${itemData?.dateEnd}`
 *   }
 *   arrayPath="employers"
 *   nounSingular="employer"
 *   nounPlural="employers"
 *   isIncomplete={item => !item?.name}
 *   editItemPathUrl="/array-multiple-page-builder-item-page-1"
 * />
 * ```
 *
 * @param {Object} props
 */
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ArrayBuilderCards);
