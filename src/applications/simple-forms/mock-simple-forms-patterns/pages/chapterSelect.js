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
    ...titleUI('Chapter select'),
    chapterSelect: checkboxGroupUI({
      title: 'Chapters to include in this form',
      required: true,
      labels: {
        arrayMultiPageAggregate: 'Array Multi-Page Aggregate',
        arrayMultiPageBuilder: 'Array Multi-Page Builder',
        arraySinglePage: 'Array single page',
        checkbox: 'Checkbox',
        confirmationPageNew: 'New Confirmation Page',
        date: 'Date',
        formsPattern: 'Forms pattern',
        miscellaneous: 'Miscellaneous',
        numberInput: 'Number input',
        radio: 'Radio',
        select: 'Select',
        textInput: 'Text input',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      chapterSelect: checkboxGroupSchema([
        'arrayMultiPageAggregate',
        'arrayMultiPageBuilder',
        'arraySinglePage',
        'checkbox',
        'confirmationPageNew',
        'date',
        'formsPattern',
        'miscellaneous',
        'numberInput',
        'radio',
        'select',
        'textInput',
      ]),
    },
    required: ['chapterSelect'],
  },
};
