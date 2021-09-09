import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getDefaultFormState } from '@department-of-veterans-affairs/react-jsonschema-form/lib/utils';

import { setArrayRecordTouched } from 'platform/forms-system/src/js/helpers';
import { errorSchemaIsValid } from 'platform/forms-system/src/js/validation';
import { scrollToFirstError } from 'platform/utilities/ui';
import { setData } from 'platform/forms-system/src/js/actions';

import { scrollAndFocus } from '../utils/ui';
import { getSelectedCount } from '../utils/helpers';
import { SELECTED, MAX_SELECTIONS } from '../constants';
import { GetContent, RenderPage } from './AddIssues';

/* Non-review growable table (array) field */
const AddIssuesField = props => {
  const {
    schema,
    uiSchema,
    errorSchema,
    idSchema,
    formData = [{}],
    registry,
    formContext,
    onBlur,
    fullFormData,
    submission,
    setFormData,
  } = props;

  const id = idSchema.$id;
  const uiOptions = uiSchema['ui:options'] || {};
  const [showErrorModal, setShowErrorModal] = useState(false);

  // if we have form data, use that, otherwise use an array with a single default object
  const items = formData.length
    ? formData
    : [getDefaultFormState(schema.additionalItems, undefined, {})];
  const hasSubmitted = formContext.submitted || submission?.hasAttemptedSubmit;
  const selectedCount = getSelectedCount(fullFormData, items);

  useEffect(
    () => {
      if (!fullFormData['view:hasIssuesToAdd']) {
        setFormData({
          ...fullFormData,
          'view:hasIssuesToAdd': true,
        });
      }
      // Show modal error since it's the best choice for a11y in this situation
      if (hasSubmitted && selectedCount >= MAX_SELECTIONS) {
        setShowErrorModal(true);
      }
    },
    [fullFormData, setFormData, hasSubmitted, selectedCount],
  );

  const initialEditingState = uiOptions.setInitialEditMode?.(fullFormData);
  // Editing state: 1 = new edit, true = update edit & false = view state
  const [editing, setEditing] = useState(
    initialEditingState?.length ? initialEditingState : [1],
  );

  const handlers = {
    closeModal: () => setShowErrorModal(false),
    /**
     * Change to the issue card checkbox
     * @param {Number} indexToChange - index of current card
     * @param {Boolean} checked - checked state
     */
    toggleSelection: (indexToChange, checked) => {
      const newItems = formData.map((item, index) => ({
        ...item,
        [SELECTED]: index === indexToChange ? checked : item[SELECTED],
      }));
      const count = getSelectedCount(fullFormData, newItems);
      if (checked && count > MAX_SELECTIONS) {
        setShowErrorModal(true);
      } else {
        props.onChange(newItems);
      }
    },
    /**
     * Change to the issue name/date
     * @param {Number} indexToChange  - index of current card
     * @param {Object} value - form element values
     */
    onItemChange: (indexToChange, value) => {
      const count = getSelectedCount(fullFormData, formData);
      const selectedValue = count + 1 <= MAX_SELECTIONS;
      // Set newly added issue as selected unless it goes over the max
      // Doing this because it's better for UX && a11y
      const newItems = formData.map(
        (item, index) =>
          index === indexToChange
            ? { ...value, [SELECTED]: selectedValue }
            : item,
      );
      props.onChange(newItems);
    },
    /**
     * Schema for each item, used to assign unique IDs
     * @param {Number} index - index of current card
     * @returns {Object} - item schema with IDs of nested elements
     */
    getItemSchema: index => {
      const itemSchema = schema;
      if (itemSchema.items.length > index) {
        return itemSchema.items[index];
      }
      return itemSchema.additionalItems;
    },
    /**
     * Blur function passed in from json-schemaform field
     */
    blur: onBlur,
    /**
     * Clicking edit on an item that’s not last and so is in view mode
     * @param {Number} index - index of current card
     * @param {Boolean} status - edit mode state
     */
    edit: (index, status = true) => {
      setEditing(editing.map((mode, indx) => (indx === index ? status : mode)));
      scrollAndFocus({
        selector: `dd[data-index="${index}"] legend`,
        timer: 50,
      });
    },
    /**
     * Clicking Update on an item that’s not last and is in edit mode
     * @param {Number} index - index of current card
     */
    update: index => {
      const { issue, decisionDate } = formData[index];
      if (errorSchemaIsValid(errorSchema[index]) && issue && decisionDate) {
        setEditing(
          editing.map((mode, indx) => (indx === index ? false : mode)),
        );
        scrollAndFocus({
          selector: `dd[data-index="${index}"] .edit`,
          timer: 100,
        });
      } else {
        // Set all the fields for this item as touched, so we show errors
        const touched = setArrayRecordTouched(id, index);
        formContext.setTouched(touched, () => {
          scrollToFirstError();
        });
      }
    },
    /**
     * Clicking Add another opens a new issue card
     */
    add: () => {
      const lastIndex = formData.length - 1;
      if (errorSchemaIsValid(errorSchema[lastIndex])) {
        // For new entries we don't use a boolean, so we know it should be labeled
        // as "new" and not "update"
        setEditing(editing.concat([1]));

        const newFormData = formData.concat(
          getDefaultFormState(schema.additionalItems, undefined, {}) || {},
        );
        props.onChange(newFormData);
        scrollAndFocus({
          selector: `dd[data-index="${lastIndex + 1}"] legend`,
          timer: 50,
        });
      } else {
        const touched = setArrayRecordTouched(id, lastIndex);
        formContext.setTouched(touched, () => {
          scrollToFirstError();
        });
      }
    },
    /**
     * Clicking Remove on an item in edit mode
     * @param {Number} indexToRemove - index of card to remove
     */
    remove: indexToRemove => {
      const newItems = formData.filter((_, index) => index !== indexToRemove);
      setEditing(editing.filter((_, index) => index !== indexToRemove));
      props.onChange(newItems);
      scrollAndFocus({
        selector: '.va-growable-add-btn',
        timer: 50,
      });
    },
  };

  const onReviewPage = formContext.onReviewPage;
  // review mode = only show selected cards on the review & submit page
  const isReviewMode = formContext.reviewMode;
  const showCheckbox = !onReviewPage || (onReviewPage && !isReviewMode);

  // first issue does not have a header or grey card background
  const singleIssue = items.length === 1;
  const showContent = formData.length > 0;
  const hasSelected = selectedCount > 0;
  const showNoneSelectedError = hasSubmitted && !hasSelected;
  const maxItemsLength = items.length >= schema.maxItems;

  const content = GetContent({
    handlers,
    registry,
    items,
    schema,
    uiSchema,
    errorSchema,
    singleIssue,
    id,
    formData,
    editing,
    isReviewMode,
    showCheckbox,
  });

  return RenderPage({
    id,
    isReviewMode,
    isEditing: editing.some(edit => edit),
    hasSelected,
    showNoneSelectedError,
    showContent,
    showCheckbox,
    maxItemsLength,
    content,
    handlers,
    showErrorModal,
  });
};

AddIssuesField.propTypes = {
  schema: PropTypes.object.isRequired,
  uiSchema: PropTypes.object,
  errorSchema: PropTypes.object,
  requiredSchema: PropTypes.object,
  idSchema: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  formData: PropTypes.array,
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  registry: PropTypes.shape({
    widgets: PropTypes.objectOf(
      PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    ).isRequired,
    fields: PropTypes.objectOf(PropTypes.func).isRequired,
    formContext: PropTypes.object.isRequired,
  }),
};

const mapDispatchToProps = {
  setFormData: setData,
};

const mapStateToProps = state => ({
  submission: state.form.submission || {},
  fullFormData: state.form.data || {},
});

export { AddIssuesField };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddIssuesField);
