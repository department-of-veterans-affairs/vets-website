import React from 'react';

const formatDate = (value, monthYearOnly) => {
  if (!value) {
    return null;
  }

  const localeOptions = monthYearOnly
    ? { year: 'numeric', month: 'long' }
    : { year: 'numeric', month: 'long', day: 'numeric' };

  try {
    return new Date(`${value}T00:00:00`).toLocaleDateString(
      'en-us',
      localeOptions,
    );
  } catch (error) {
    // Fall back to raw value if the date string is invalid
    return value;
  }
};

const createDateReviewWidget = ({ title, monthYearOnly, dataDogHidden }) => {
  const DateReviewWidget = ({ value }) => {
    const formattedDate = formatDate(value, monthYearOnly);

    if (!formattedDate) {
      return null;
    }

    return (
      <span
        className={dataDogHidden ? 'dd-privacy-hidden' : undefined}
        data-dd-action-name={dataDogHidden ? title : undefined}
      >
        {formattedDate}
      </span>
    );
  };

  DateReviewWidget.displayName = `DateReviewWidget(${title})`;

  return DateReviewWidget;
};

export const wrapDateUiWithDl = uiSchema => {
  if (!uiSchema) {
    return uiSchema;
  }

  const options = uiSchema['ui:options'] || {};
  const title = uiSchema['ui:title'] || 'Date';
  const { monthYearOnly, dataDogHidden } = options;

  const wrappedUiSchema = {
    ...uiSchema,
    'ui:options': {
      ...options,
      useDlWrap: true,
      customTitle: options.customTitle ?? ' ',
    },
    'ui:reviewWidget': createDateReviewWidget({
      title,
      monthYearOnly,
      dataDogHidden,
    }),
  };

  delete wrappedUiSchema['ui:reviewField'];

  return wrappedUiSchema;
};

export const wrapDateRangeUiWithDl = dateRangeUi => {
  if (!dateRangeUi) {
    return dateRangeUi;
  }

  return {
    ...dateRangeUi,
    from: wrapDateUiWithDl(dateRangeUi.from),
    to: wrapDateUiWithDl(dateRangeUi.to),
  };
};
