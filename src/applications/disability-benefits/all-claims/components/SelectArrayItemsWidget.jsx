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
    const { value: items, id, options, required, formContext } = this.props;
    // Need customTitle to set error message above title.
    const { label: Label, selectedPropName, disabled, customTitle } = options;

    // inReviewMode = true (review page view, not in edit mode)
    // inReviewMode = false (in edit mode)
    const onReviewPage = formContext.onReviewPage;
    const inReviewMode = onReviewPage && formContext.reviewMode;

    const hasSelections = items?.reduce(
      (result, item) =>
        result || !!get(selectedPropName || this.defaultSelectedPropName, item),
      false,
    );

    const itemsList =
      items &&
      items.map((item, index) => {
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

        const itemIsDisabled =
          typeof disabled === 'function' ? disabled(item) : false;

        const labelWithData = (
          <Label
            {...item}
            name={item.name || item.condition}
            className={
              checkboxVisible
                ? 'vads-u-display--inline'
                : 'vads-u-margin-top--0p5'
            }
          />
        );
        // On the review & submit page, there may be more than one of these
        // components in edit mode with the same content, e.g. 526
        // ratedDisabilities & unemployabilityDisabilities causing duplicate
        // input ids/names... an `appendId` value is added to the ui:options
        const appendId = options.appendId ? `_${options.appendId}` : '';
        const elementId = `${id}_${index}${appendId}`;

        const widgetClasses = classNames(
          'form-checkbox',
          options.widgetClassNames,
          { selected: itemIsSelected },
        );

        const labelClass = [
          'schemaform-label',
          checkboxVisible ? '' : 'vads-u-margin-top--0',
        ].join(' ');

        // When a `customTitle` option is included, the ObjectField is set to
        // wrap its contents in a div instead of a dl, so we don't need a
        // include dt and dd elements in the markup; this change fixes an
        // accessibility issue
        return (
          <div key={index} className={widgetClasses}>
            {checkboxVisible && (
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
            )}
            <label className={labelClass} htmlFor={elementId}>
              {labelWithData}
            </label>
          </div>
        );
      });

    const hasCustomTitle = !!customTitle?.trim();
    const Tag = formContext.onReviewPage ? 'h4' : 'h3';

    const content =
      items && (!inReviewMode || (inReviewMode && hasSelections)) ? (
        itemsList
      ) : (
        <p>No items selected</p>
      );

    return hasCustomTitle ? (
      <fieldset>
        <legend>
          <Tag className="vads-u-font-size--h5">{customTitle}</Tag>
        </legend>
        {content}
      </fieldset>
    ) : (
      content
    );
  }
}
