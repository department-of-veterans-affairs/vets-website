/* eslint-disable @department-of-veterans-affairs/prefer-button-component */
/* eslint-disable no-unused-vars */
/**
 * For array builder pattern
 * Cards with "Edit" and "Remove"
 */
import React, { useState } from 'react';
import { Link } from 'react-router';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setData } from 'platform/forms-system/src/js/actions';
import get from 'platform/utilities/data/get';
import set from 'platform/utilities/data/set';
import { focusElement } from 'platform/utilities/ui';
import { createArrayBuilderItemEditPath } from './helpers';

const EditLink = ({ to, srText }) => (
  <Link to={to} data-action="edit">
    <span className="vads-u-display--flex vads-u-align-items--center">
      Edit
      <va-icon size={3} icon="chevron_right" aria-hidden="true" />
      <span className="sr-only">{srText}</span>
    </span>
  </Link>
);

const RemoveButton = ({ onClick, srText }) => (
  <button
    type="button"
    className="va-button-link vads-u-color--secondary-dark vads-u-font-weight--bold vads-u-text-decoration--none vads-u-display--flex vads-u-align-items--center"
    data-action="remove"
    onClick={onClick}
  >
    <va-icon
      size={3}
      icon="delete"
      aria-hidden="true"
      className="vads-u-margin-right--1 vads-u-font-size--md"
    />
    Remove
    <span className="sr-only">{srText}</span>
  </button>
);

const MissingInformationAlert = ({ children }) => (
  <div className="vads-u-margin-top--2">
    <va-alert status="error" uswds>
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
 *   editItemPathUrl: string,
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
  editItemPathUrl,
  setFormData,
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
        focusElement(
          `va-card[name="${nounSingular}_${lastIndex}"] [data-action="remove"]`,
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
    setFormData(newData);
    hideRemoveConfirmationModal({
      focusRemoveButton: false,
    });
    onRemove(removedIndex, removedItem);
    if (arrayWithRemovedItem.length === 0) {
      onRemoveAll();
    }
  }

  const Card = ({ index, children }) => (
    <div className="vads-u-margin-top--2">
      <va-card uswds name={`${nounSingular}_${index}`}>
        {children}
      </va-card>
    </div>
  );

  Card.propTypes = {
    index: PropTypes.number.isRequired,
  };

  const CardHeading = `h${Number(titleHeaderLevel) + 1}`;

  return (
    <div>
      <div className="vads-u-display--flex vads-u-justify-content--space-between vads-u-flex-direction--column">
        {arrayData?.length && (
          <ul className="vads-u-margin-top--2 vads-u-padding--0">
            {arrayData.map((itemData, index) => {
              const itemName = getText('getItemName', itemData);
              return (
                <li key={index} style={{ listStyleType: 'none' }}>
                  <Card index={index}>
                    <div>
                      {isIncomplete(itemData) && <IncompleteLabel />}
                      <CardHeading className="vads-u-margin-top--0">
                        {itemName}
                      </CardHeading>
                      {getText('cardDescription', itemData)}
                      {isIncomplete(itemData) && (
                        <MissingInformationAlert>
                          {getText('cardItemMissingInformation', itemData)}
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
                        srText={`${itemName}. ${getText(
                          'cardDescription',
                          itemData,
                        )}`}
                      />
                      <RemoveButton
                        onClick={() => showRemoveConfirmationModal(index)}
                        srText={`${itemName}. ${getText(
                          'cardDescription',
                          itemData,
                        )}`}
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
        modalTitle={getText('removeTitle', currentItem)}
        primaryButtonText={getText('removeYes', currentItem)}
        secondaryButtonText={getText('removeNo', currentItem)}
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
          ? getText('removeNeedAtLeastOneDescription', currentItem)
          : getText('removeDescription', currentItem)}
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
  getText: PropTypes.func.isRequired,
  isIncomplete: PropTypes.func.isRequired,
  isReview: PropTypes.bool.isRequired,
  nounSingular: PropTypes.string.isRequired,
  required: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onRemoveAll: PropTypes.func.isRequired,
  titleHeaderLevel: PropTypes.func,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ArrayBuilderCards);
