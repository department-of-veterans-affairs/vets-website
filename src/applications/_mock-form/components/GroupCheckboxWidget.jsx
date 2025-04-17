import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { VaCheckboxGroup } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

/**
 * Using a custom checkbox widget because the built-in checkbox will duplicate
 * the label (no checkbox); it is then followed by the error message, then
 * checkbox + label. With this widget, we hide the label (no checkbox), and the
 * error message appears below the proper label per design pattern
 */

const GroupCheckboxWidget = props => {
  const { value, options, formContext, onChange } = props;
  const { onReviewPage, reviewMode } = formContext || {};
  const { labels } = options;

  const isOnReviewPage = onReviewPage || false;
  // inReviewMode = true (review page view, not in edit mode)
  // inReviewMode = false (in edit mode)
  const inReviewMode = (isOnReviewPage && reviewMode) || false;

  const [data, setData] = useState(labels.map(label => value.includes(label)));

  const onGroupChange = event => {
    const checkboxIndex = Number(event.target.dataset.index);
    const isChecked = event.detail.checked;

    const newData = data.map((val, index) =>
      index === checkboxIndex ? isChecked : val,
    );

    const dataArray = labels.reduce((result, label, index) => {
      if (newData[index]) {
        result.push(label);
      }
      return result;
    }, []);

    setData(newData);
    onChange(dataArray.join(','));
  };

  return isOnReviewPage && inReviewMode ? (
    <span>{value.split(',').join(', ')}</span>
  ) : (
    <VaCheckboxGroup
      label="va-checkbox-group label"
      onVaChange={onGroupChange}
      error={null} // form system validation handles this
      required
    >
      {labels.map((label, index) => (
        <va-checkbox
          key={label}
          data-index={index}
          label={label}
          checked={data[index]}
        />
      ))}
    </VaCheckboxGroup>
  );
};

GroupCheckboxWidget.propTypes = {
  formContext: PropTypes.shape({
    submitted: PropTypes.bool,
  }),
  options: PropTypes.shape({
    labels: PropTypes.arrayOf([
      PropTypes.shape({
        label: PropTypes.string,
      }),
    ]),
  }),
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default GroupCheckboxWidget;
