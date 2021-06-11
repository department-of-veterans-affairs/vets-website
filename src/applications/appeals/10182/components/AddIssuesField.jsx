import { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getDefaultFormState } from '@department-of-veterans-affairs/react-jsonschema-form/lib/utils';

import { setArrayRecordTouched } from 'platform/forms-system/src/js/helpers';
import { errorSchemaIsValid } from 'platform/forms-system/src/js/validation';
import { scrollToFirstError } from 'platform/utilities/ui';
import { setData } from 'platform/forms-system/src/js/actions';

import { scrollAndFocus } from '../utils/ui';
import { someSelected } from '../utils/helpers';
import { SELECTED, MAX_NEW_CONDITIONS } from '../constants';
import { getContent, renderPage } from './AddIssues';

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
  } = props;

  const id = idSchema.$id;
  const uiOptions = uiSchema['ui:options'] || {};

  if (!fullFormData['view:hasIssuesToAdd']) {
    props.setFormData({
      ...fullFormData,
      'view:hasIssuesToAdd': true,
    });
  }

  const initialEditingState = uiOptions.setInitialEditMode?.(formData);
  // Editing state: 1 = new edit, true = update edit & false = view state
  const [editing, setEditing] = useState(
    initialEditingState?.length ? initialEditingState : [1],
  );

  const handlers = {
    toggleSelection: (indexToChange, checked) => {
      const newItems = formData.map((item, index) => ({
        ...item,
        [SELECTED]: index === indexToChange ? checked : item[SELECTED],
      }));
      props.onChange(newItems);
    },
    onItemChange: (indexToChange, value) => {
      const newItems = formData.map(
        (item, index) =>
          index === indexToChange ? { ...value, [SELECTED]: true } : item,
      );
      props.onChange(newItems);
    },
    getItemSchema: index => {
      const itemSchema = schema;
      if (itemSchema.items.length > index) {
        return itemSchema.items[index];
      }
      return itemSchema.additionalItems;
    },
    blur: onBlur,
    /*
     * Clicking edit on an item that’s not last and so is in view mode
     */
    edit: (index, status = true) => {
      setEditing(editing.map((mode, indx) => (indx === index ? status : mode)));
      scrollAndFocus({
        selector: `dd[data-index="${index}"] legend`,
        timer: 50,
      });
    },
    /*
    * Clicking Update on an item that’s not last and is in edit mode
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
    /*
     * Clicking Add another
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
    /*
     * Clicking Remove on an item in edit mode
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

  // if we have form data, use that, otherwise use an array with a single default object
  const items = formData.length
    ? formData
    : [getDefaultFormState(schema.additionalItems, undefined, {})];

  const atMax = items.length > MAX_NEW_CONDITIONS;

  // first issue does not have a header or grey card background
  const singleIssue = items.length === 1;
  const hasSelected =
    someSelected(formData) || someSelected(fullFormData.contestableIssues);
  const hasSubmitted = formContext.submitted || submission?.hasAttemptedSubmit;
  const showError = hasSubmitted && !hasSelected;

  const content = getContent({
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

  return renderPage({
    id,
    isReviewMode,
    isEditing: editing.some(edit => edit),
    hasSelected,
    showError,
    showContent: formData.length > 0,
    showCheckbox,
    atMax,
    content,
    handlers,
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
