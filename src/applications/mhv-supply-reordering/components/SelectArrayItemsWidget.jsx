import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import get from 'platform/utilities/data/get';
import set from 'platform/utilities/data/set';
import { setData } from 'platform/forms-system/src/js/actions';
import { autoSaveForm } from 'platform/forms/save-in-progress/actions';

class SelectArrayItemsWidget extends React.Component {
  defaultSelectedPropName = 'view:selected';

  keyValue = 'supplies';

  onChange = (index, checked) => {
    const items = set(
      `[${index}].${this.props.formData.supplies['view:selected'] ||
        this.defaultSelectedPropName}`,
      checked,
      this.props.value,
    );
    this.props.onChange(items);
  };

  render() {
    const { value: supplies, options, formContext, formData } = this.props;

    // Need customTitle to set error message above title.
    const { label: selectedPropName, customTitle } = options;

    // inReviewMode = true (review page view, not in edit mode)
    // inReviewMode = false (in edit mode)
    const { onReviewPage } = formContext;
    const inReviewMode = onReviewPage && formContext.reviewMode;

    const hasSelections = formData.supplies?.reduce(
      (result, item) =>
        result || !!get(selectedPropName || this.defaultSelectedPropName, item),
      false,
    );

    const itemsList =
      formData.supplies?.length > 0 &&
      formData.supplies.map((item, index) => {
        let itemDescription = item?.deviceName ? `Device: ${item.deviceName}\n` : '';
        itemDescription += `Quantity: ${item.quantity}\n`;
        itemDescription += `Last ordered on ${item.lastOrderDate}\n`;

        const itemIsSelected = !!get(
          selectedPropName || this.defaultSelectedPropName,
          item,
        );

        // Don't show un-selected ratings in review mode
        if (inReviewMode && !itemIsSelected) {
          return null;
        }

        const checkboxVisible =
          !onReviewPage || (onReviewPage && !inReviewMode);

        const widgetClasses = classNames(
          'form-checkbox',
          options.widgetClassNames,
          { selected: itemIsSelected },
        );

        // When a `customTitle` option is included, the ObjectField is set to
        // wrap its contents in a div instead of a dl, so we don't need a
        // include dt and dd elements in the markup; this change fixes an
        // accessibility issue
        return (
          <div key={index} className={widgetClasses}>
            {checkboxVisible && (
              <VaCheckbox
                tile
                label={item.productName}
                checkbox-description={itemDescription}
                checked={
                  typeof itemIsSelected === 'undefined' ? false : itemIsSelected
                }
                onVaChange={event => this.onChange(index, event.target.checked)}
                style={{ whiteSpace: 'pre-line' }}
              />
            )}
          </div>
        );
      });

    const hasCustomTitle = !!customTitle?.trim();
    const Tag = formContext.onReviewPage ? 'h4' : 'h3';

    const content =
      itemsList && (!inReviewMode || (inReviewMode && hasSelections)) ? (
        itemsList
      ) : (
        <p>
          <strong>
            {`No supplies ${supplies?.length > 0 ? 'selected' : 'found'}`}
          </strong>
        </p>
      );

    return hasCustomTitle ? (
      <fieldset>
        <legend>
          <Tag className="vads-u-font-size--h5">{customTitle}</Tag>
        </legend>
        {content}
      </fieldset>
    ) : (
      <>{content}</>
    );
  }
}

SelectArrayItemsWidget.propTypes = {
  formContext: PropTypes.object.isRequired,
  formId: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  options: PropTypes.shape({
    title: PropTypes.string,
    customTitle: PropTypes.string,
    field: PropTypes.string,
    label: PropTypes.func,
    showFieldLabel: PropTypes.bool,
    validations: PropTypes.array,
  }).isRequired,
  value: PropTypes.arrayOf(
    PropTypes.shape({
      productName: PropTypes.string.isRequired,
      productId: PropTypes.number.isRequired,
    }),
  ).isRequired,
  autoSaveForm: PropTypes.func,
  formData: PropTypes.shape({}),
  metadata: PropTypes.shape({
    version: PropTypes.number,
    returnUrl: PropTypes.string,
    submission: PropTypes.shape({}),
  }),
  required: PropTypes.bool,
  setData: PropTypes.func,
};

SelectArrayItemsWidget.defaultProps = {
  value: [],
  formData: {},
  loadedData: {
    metadata: {},
  },
  setData: () => {},
  autoSaveForm: () => {},
};

const mapDispatchToProps = {
  setData,
  autoSaveForm,
};

const mapStateToProps = state => {
  const { form } = state;
  return {
    formId: form.formId,
    formData: form.data,
    metadata: form.loadedData?.metadata || {},
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelectArrayItemsWidget);

export { SelectArrayItemsWidget };
