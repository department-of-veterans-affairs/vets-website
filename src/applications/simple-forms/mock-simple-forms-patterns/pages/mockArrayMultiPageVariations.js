import React from 'react';
import {
  checkboxGroupSchema,
  checkboxGroupUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const DeselectAll = ({ formData, setFormData }) => {
  const onClick = () => {
    setFormData({
      ...formData,
      chapterSelect: {},
    });
  };

  return <va-button text="Deselect all" onClick={onClick} uswds />;
};

/** @type {PageSchema} */
export default {
  ContentBeforeButtons: DeselectAll,
  uiSchema: {
    ...titleUI('Array builder variations'),
    arrayMultiPageVariationsSelect: checkboxGroupUI({
      title: 'Choose additional array builder variations to test',
      required: false,
      labels: {
        minMaxSame: 'Min/max same',
        minMax: 'Min/max',
        min: 'Min',
        max: 'Max',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      arrayMultiPageVariationsSelect: checkboxGroupSchema([
        'minMaxSame',
        'minMax',
        'min',
        'max',
      ]),
    },
    required: [],
  },
};
