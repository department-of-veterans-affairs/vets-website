import React from 'react';
import classNames from 'classnames';

import get from 'platform/utilities/data/get';
import set from 'platform/utilities/data/set';

// TODO: Safety checks for `selected` callback and `label` element

export default class SelectArrayItemsWidget extends React.Component {
  onChange = (index, checked) => {
    const items = set(
      `[${index}].${this.props.options.selectedPropName ||
        this.defaultSelectedPropName}`,
      checked,
      this.props.value,
    );
    this.props.onChange(items);
  };

  defaultSelectedPropName = 'view:selected';

  render() {
    const { value: items, id, options, required, registry } = this.props;
    // Need customTitle to set error message above title.
    const { label: Label, selectedPropName, disabled, customTitle } = options;
    const { formContext } = registry;

    // inReviewMode = true (review page view, not in edit mode)
    // inReviewMode = false (in edit mode)
    const inReviewMode = formContext.onReviewPage && formContext.reviewMode;
    const hasSelections = items?.reduce(
      (result, item) =>
        result || !!get(selectedPropName || this.defaultSelectedPropName, item),
      false,
    );

    return (
      <>
        {customTitle && items && <h5 className="title">{customTitle}</h5>}
        {!inReviewMode || (inReviewMode && hasSelections) ? (
          items.map((item, index) => {
            const itemIsSelected = !!get(
              selectedPropName || this.defaultSelectedPropName,
              item,
            );

            // Don't show unselected items
            if (inReviewMode && !itemIsSelected) {
              return null;
            }

            const itemIsDisabled =
              typeof disabled === 'function' ? disabled(item) : false;
            const elementId = `${id}_${index}`;
            const labelWithData = (
              <Label
                {...item}
                name={item.name || item.condition}
                for={elementId}
              />
            );

            const widgetClasses = inReviewMode
              ? ''
              : classNames('form-checkbox', options.widgetClassNames, {
                  selected: itemIsSelected,
                });

            const input = inReviewMode ? null : (
              <input
                type="checkbox"
                id={elementId}
                name={elementId}
                checked={
                  typeof itemIsSelected === 'undefined' ? false : itemIsSelected
                }
                required={required}
                disabled={itemIsDisabled}
                onChange={event => this.onChange(index, event.target.checked)}
              />
            );

            // Fix axe issue on page, but not mess up review & submit page
            // a <dl class="review"> wraps this content on review & submit page
            const Tag = inReviewMode ? 'div' : 'dl';

            return (
              <Tag key={elementId} className="review-row">
                <dt className={widgetClasses}>
                  {input}
                  <label
                    className="schemaform-label vads-u-margin-top--0"
                    htmlFor={elementId}
                  >
                    {labelWithData}
                  </label>
                </dt>
                <dd />
              </Tag>
            );
          })
        ) : (
          <div className="review-row" role="presentation">
            <dt>No selections have been made</dt>
            <dd />
          </div>
        )}
      </>
    );
  }
}
