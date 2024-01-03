/**
 * For array builder pattern
 * Shows a title and cards with edit and remove links
 */
import React, { useState } from 'react';
import { Link } from 'react-router';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setData } from 'platform/forms-system/src/js/actions';
import get from 'platform/utilities/data/get';
import set from 'platform/utilities/data/set';

const ArrayBuilderSummaryCardList = ({
  editBasePath,
  formDataPath,
  setFormData,
  formData,
  CardContent,
  title,
  titleHeaderLevel = '3',
  removeTitle = 'Are you sure you want to remove this item?',
  removeDescription = () =>
    'This will remove this item from your list of items.',
  removeYesLabel = 'Yes, remove',
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const arrayData = get(formDataPath, formData);
  const currentItem = arrayData?.[currentIndex];

  if (!arrayData?.length) {
    return null;
  }

  function showRemoveConfirmationModel(index) {
    setCurrentIndex(index);
    setIsModalVisible(true);
  }

  function hideRemoveConfirmationModel() {
    setCurrentIndex(null);
    setIsModalVisible(false);
  }

  function removeAction() {
    const item = arrayData[currentIndex];
    const arrayWithRemovedItem = arrayData.filter(
      data => data.name !== item.name,
    );
    const newData = set(formDataPath, arrayWithRemovedItem, formData);

    setFormData(newData);
    hideRemoveConfirmationModel();
  }

  const Card = ({ item, index }) => (
    <div className="vads-u-margin-bottom--2">
      <va-card>
        <CardContent item={item} />
        <span className="vads-u-margin-top--2 vads-u-display--flex vads-u-justify-content--space-between">
          <Link to={`${editBasePath}/${index}?=edit`}>
            Edit
            <i
              aria-hidden="true"
              className="fa fa-chevron-right vads-u-margin-left--1"
            />
          </Link>
          {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component */}
          <button
            type="button"
            className="va-button-link vads-u-color--secondary-dark"
            onClick={() => showRemoveConfirmationModel(index)}
          >
            <i
              aria-hidden="true"
              className="fa fa-times vads-u-margin-right--1"
            />
            Remove
          </button>
        </span>
      </va-card>
    </div>
  );

  Card.propTypes = {
    index: PropTypes.number.isRequired,
    item: PropTypes.object.isRequired,
  };

  const Heading = `h${titleHeaderLevel}`;

  return (
    <div>
      <Heading>{title}</Heading>
      <div className="vads-u-display--flex vads-u-justify-content--space-between vads-u-flex-direction--column">
        {arrayData?.length &&
          arrayData.map((item, index) => (
            <Card key={index} item={item} index={index} />
          ))}
      </div>
      <VaModal
        clickToClose
        status="warning"
        modalTitle={removeTitle}
        primaryButtonText={removeYesLabel}
        secondaryButtonText="No, cancel"
        onCloseEvent={hideRemoveConfirmationModel}
        onPrimaryButtonClick={removeAction}
        onSecondaryButtonClick={hideRemoveConfirmationModel}
        visible={isModalVisible}
        uswds
      >
        {removeDescription(currentItem?.name)}
      </VaModal>
    </div>
  );
};

const mapStateToProps = state => ({
  formData: state.form.data,
});

const mapDispatchToProps = {
  setFormData: setData,
};

ArrayBuilderSummaryCardList.propTypes = {
  CardContent: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  editBasePath: PropTypes.string.isRequired,
  formData: PropTypes.object.isRequired,
  formDataPath: PropTypes.string.isRequired,
  setFormData: PropTypes.func.isRequired,
  title: PropTypes.object.isRequired,
  removeDescription: PropTypes.string,
  removeTitle: PropTypes.func,
  removeYesLabel: PropTypes.func,
  titleHeaderLevel: PropTypes.func,
};

/**
 * Usage:
 * ```
 * const CardContent = ({ item }) => (
 *  <>
 *   <div className="vads-u-font-weight--bold">{item?.name}</div>
 *   <div>
 *    {item?.dateStart} - {item?.dateEnd}
 *   </div>
 *  </>
 * );
 *
 * uiSchema: {
 *   'ui:description': (<ArrayBuilderSummaryCardList
 *      title="Review your employers"
 *      CardContent={CardContent}
 *      editBasePath="/array-multiple-page-builder-item-page-1"
 *      formDataPath="employers"
 *      removeTitle="Are you sure you want to remove this employer?"
 *      removeDescription={itemName =>
 *        `This will remove ${itemName} and all their information from your list of employers.`
 *      }
 *      removeYesLabel="Yes, remove this employer"
 *    />)
 *   ...
 * ```
 */
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ArrayBuilderSummaryCardList);
