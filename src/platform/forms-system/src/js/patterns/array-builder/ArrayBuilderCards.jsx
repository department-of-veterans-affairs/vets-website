/* eslint-disable @department-of-veterans-affairs/prefer-button-component */
/* eslint-disable no-unused-vars */
/**
 * For array builder pattern
 * Cards with "Edit" and "DELETE"
 */
import React, { useEffect, useRef, useState } from 'react';
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
    <span className="vads-u-display--flex vads-u-align-items--center vads-u-font-size--md">
      Edit
      <va-icon size={3} icon="chevron_right" aria-hidden="true" />
      <span className="sr-only">{srText}</span>
    </span>
  </Link>
);

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
  forceRerender,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const arrayData = get(arrayPath, formData);
  const currentItem = arrayData?.[currentIndex];
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      // notice this is in the return of the useEffect
      // which is the cleanup function
      isMounted.current = false;
    };
  }, []);

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
    // forceRerender should happen BEFORE onRemoveAll because
    // we should handle any data manipulation before a potential
    // change of URL
    forceRerender(newData);
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
              const itemDescription = getText('cardDescription', itemData);
              return (
                <li key={index} style={{ listStyleType: 'none' }}>
                  <Card index={index}>
                    <div>
                      {isIncomplete(itemData) && <IncompleteLabel />}
                      <CardHeading className="vads-u-margin-top--0">
                        {itemName}
                      </CardHeading>
                      {itemDescription}
                      {isIncomplete(itemData) && (
                        <MissingInformationAlert>
                          {getText('cardItemMissingInformation', itemData)}
                        </MissingInformationAlert>
                      )}
                    </div>
                    <span className="vads-u-margin-bottom--neg1 vads-u-margin-top--1 vads-u-display--flex vads-u-align-items--center vads-u-justify-content--space-between vads-u-font-weight--bold">
                      <EditLink
                        to={createArrayBuilderItemEditPath({
                          path: editItemPathUrl,
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
        modalTitle={getText('deleteTitle', currentItem)}
        primaryButtonText={getText('deleteYes', currentItem)}
        secondaryButtonText={getText('deleteNo', currentItem)}
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
          ? getText('deleteNeedAtLeastOneDescription', currentItem)
          : getText('deleteDescription', currentItem)}
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
  ]),
  editItemPathUrl: PropTypes.string.isRequired,
  forceRerender: PropTypes.func.isRequired,
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
