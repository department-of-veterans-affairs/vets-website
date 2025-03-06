import PropTypes from 'prop-types';
import React from 'react';
import { merge, once } from 'lodash';
import classNames from 'classnames';
import Form from '@department-of-veterans-affairs/react-jsonschema-form';
import { deepEquals } from '@department-of-veterans-affairs/react-jsonschema-form/lib/utils';
import set from 'platform/utilities/data/set';
import { connect } from 'react-redux';
import {
  uiSchemaValidate,
  transformErrors,
} from 'platform/forms-system/src/js/validation';
import FieldTemplate from 'platform/forms-system/src/js/components/FieldTemplate';
import * as reviewWidgets from 'platform/forms-system/src/js/review/widgets';
import ReviewFieldTemplate from 'platform/forms-system/src/js/review/ReviewFieldTemplate';
import StringField from 'platform/forms-system/src/js/review/StringField';
import widgets from 'platform/forms-system/src/js/widgets/index';
import ObjectField from 'platform/forms-system/src/js/fields/ObjectField';
import ArrayField from 'platform/forms-system/src/js/fields/ArrayField';
import ReadOnlyArrayField from 'platform/forms-system/src/js/review/ReadOnlyArrayField';
import BasicArrayField from 'platform/forms-system/src/js/fields/BasicArrayField';
import TitleField from 'platform/forms-system/src/js/fields/TitleField';
import ReviewObjectField from 'platform/forms-system/src/js/review/ObjectField';
import { scrollToFirstError } from 'platform/forms-system/src/js/utilities/ui/index';
import getFormDataFromSchemaId from 'platform/forms-system/src/js/utilities/data/getFormDataFromSchemaId';
import YesNoWidget from './YesNoWidget';
import content from '../utils/content.json';

import { updateSaveToProfile } from '../actions/actions';

/*
 * Each page uses this component and passes in config. This is where most of the page level
 * form logic should live.
 */
class SchemaForm extends React.Component {
  constructor(props) {
    super(props);
    this.validate = this.validate.bind(this);
    this.onError = this.onError.bind(this);
    this.getEmptyState = this.getEmptyState.bind(this);
    this.transformErrors = this.transformErrors.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.setTouched = this.setTouched.bind(this);
    this.fields = {
      ObjectField,
      ArrayField,
      BasicArrayField,
      TitleField,
    };
    this.state = {
      ...this.getEmptyState(props),
      saveToProfile: null,
    };

    this.onChangeProfile = this.onChangeProfile.bind(this);

    this.reviewFields = {
      ObjectField: ReviewObjectField,
      ArrayField: ReadOnlyArrayField,
      BasicArrayField,
      address: ReviewObjectField,
      StringField,
    };
  }

  /* eslint-disable-next-line camelcase */
  UNSAFE_componentWillReceiveProps(newProps) {
    if (
      newProps.name !== this.props.name ||
      newProps.pagePerItemIndex !== this.props.pagePerItemIndex
    ) {
      this.setState(this.getEmptyState(newProps)); // No need for prevState here
    } else if (newProps.title !== this.props.title) {
      this.setState(prevState => ({
        formContext: set('pageTitle', newProps.title, prevState.formContext),
      }));
    } else if (!!newProps.reviewMode !== !!this.state.formContext.reviewMode) {
      this.setState(this.getEmptyState(newProps)); // No need for prevState here
    } else if (newProps.formContext !== this.props.formContext) {
      this.setState(this.getEmptyState(newProps)); // No need for prevState here
    }
  }

  /*
   * If we’re in review mode, we can short circuit updating
   * by making sure the schemas are the same and the data
   * displayed on this particular page hasn’t changed
   */
  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.reviewMode &&
      !nextProps.editModeOnReviewPage &&
      nextProps.reviewMode === this.props.reviewMode &&
      deepEquals(this.state, nextState) &&
      nextProps.schema === this.props.schema &&
      typeof nextProps.title !== 'function' &&
      nextProps.uiSchema === this.props.uiSchema
    ) {
      return !Object.keys(nextProps.schema.properties).every(
        objProp => this.props.data[objProp] === nextProps.data[objProp],
      );
    }

    return true;
  }

  onChangeProfile = value => {
    const saveToProfileValue = value;

    this.setState({ saveToProfile: saveToProfileValue }, () => {
      const newFormData = {
        ...this.props.data,
        saveToProfile: saveToProfileValue,
      };
      this.props.dispatch(updateSaveToProfile(saveToProfileValue));
      this.props.onChange(newFormData);
    });
  };

  onError(hasSubmitted = true) {
    this.setState(
      prevState => {
        const formContext = set(
          'submitted',
          !!hasSubmitted,
          prevState.formContext,
        );
        return { formContext };
      },
      () => {
        scrollToFirstError();
      },
    );
  }

  onBlur(id) {
    if (!this.state.formContext.touched[id]) {
      const data = getFormDataFromSchemaId(id, this.props.data);
      const isEmpty = data === undefined || data === null || data === '';
      // Prefer to only set as touched if the field is NOT empty,
      // so that we won't show an error message prematurely.
      // If data is not found for some reason (e.g. schema uses snake case
      // properties which can't be parsed in a 'root_' string) then go
      // ahead and mark as touched which will show a potential error message.
      if (!isEmpty || data === 'FORM_DATA_NOT_FOUND') {
        this.setState(prevState => {
          const formContext = set(['touched', id], true, prevState.formContext);
          return { formContext };
        });
      }
    }
  }

  getEmptyState(props) {
    const {
      onEdit,
      hideTitle,
      title,
      reviewMode,
      reviewTitle,
      pagePerItemIndex,
      uploadFile,
      hideHeaderRow,
      formContext,
      trackingPrefix,
      saveToProfile,
    } = props;
    return {
      formContext: {
        touched: {},
        submitted: false,
        onEdit,
        hideTitle,
        setTouched: this.setTouched,
        reviewTitle,
        pageTitle: title,
        pagePerItemIndex,
        reviewMode,
        hideHeaderRow,
        uploadFile,
        onError: this.onError,
        trackingPrefix,
        saveToProfile,
        ...formContext,
      },
    };
  }

  setTouched(touchedItem, setStateCallback) {
    const touched = merge({}, this.state.formContext.touched, touchedItem);
    // eslint-disable-next-line react/no-access-state-in-setstate
    const formContext = set('touched', touched, this.state.formContext);
    this.setState({ formContext }, setStateCallback);
  }

  /*
   * This gets the list of JSON Schema errors whenever validation
   * is run
   */
  transformErrors(errors) {
    return transformErrors(errors, this.props.uiSchema);
  }

  validate(formData, errors) {
    const { schema, uiSchema, appStateData } = this.props;
    if (uiSchema) {
      uiSchemaValidate(
        errors,
        uiSchema,
        schema,
        formData,
        '',
        null,
        appStateData,
      );
    }
    return errors;
  }

  render() {
    const {
      data,
      schema,
      uiSchema,
      idSchema,
      reviewMode,
      editModeOnReviewPage,
      children,
      onSubmit,
      onChange,
      safeRenderCompletion,
      name,
      addNameAttribute,
    } = this.props;

    const useReviewMode = reviewMode && !editModeOnReviewPage;

    return (
      <Form
        safeRenderCompletion={safeRenderCompletion}
        FieldTemplate={useReviewMode ? ReviewFieldTemplate : FieldTemplate}
        formContext={this.state.formContext}
        liveValidate
        noHtml5Validate
        onError={this.onError}
        onBlur={this.onBlur}
        onChange={({ formData }) => onChange(formData)}
        onSubmit={onSubmit}
        schema={schema}
        uiSchema={uiSchema}
        idSchema={idSchema}
        validate={once(this.validate)}
        showErrorList={false}
        formData={data}
        widgets={useReviewMode ? reviewWidgets : widgets}
        fields={useReviewMode ? this.reviewFields : this.fields}
        transformErrors={this.transformErrors}
        name={addNameAttribute ? name : null}
      >
        <legend
          className={classNames('vads-u-margin-top--3', {
            'schemaform-label': true,
            'usa-input-error-label': this.state.error,
          })}
        >
          Do you also want to update this information in your VA.gov profile?
          <span className="schemaform-required-span">
            {content['validation-required-label']}
          </span>
          <p className="usa-hint vads-u-margin-top--0 vads-u-margin-bottom--0">
            If you select “yes,” this information will be updated across
            multiple VA benefits and services. Read more about{' '}
            <a href="https://www.va.gov/change-address/">
              changing your address in your VA.gov profile (opens in new tab)
            </a>
            .
          </p>
        </legend>

        <div className="schemaform-widget-wrapper vads-u-margin-bottom--3">
          <YesNoWidget
            id="saveToProfile"
            value={this.state.saveToProfile}
            onChange={this.onChangeProfile}
          />
        </div>
        {children}
      </Form>
    );
  }
}
const mapStateToProps = state => ({
  profile: state.user.profile,
});

SchemaForm.propTypes = {
  name: PropTypes.string.isRequired,
  schema: PropTypes.object.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
  uiSchema: PropTypes.object.isRequired,
  addNameAttribute: PropTypes.bool,
  appStateData: PropTypes.object,
  children: PropTypes.array,
  data: PropTypes.any,
  dispatch: PropTypes.func,
  editModeOnReviewPage: PropTypes.bool,
  formContext: PropTypes.object,
  hideTitle: PropTypes.bool,
  idSchema: PropTypes.object,
  pagePerItemIndex: PropTypes.number,
  profile: PropTypes.object,
  reviewMode: PropTypes.bool,
  safeRenderCompletion: PropTypes.bool,
  saveToProfile: PropTypes.bool,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
};

SchemaForm.defaultProps = {
  // This is required when running tests, but we'd prefer not to force
  // everyone to be aware of it when writing tests that use SchemaForm
  safeRenderCompletion: navigator.userAgent === 'node.js',
  // When `true` the rendered `Form` is passed a `name` prop so that the `form`
  // that's rendered to the DOM will have a `name` attribute. A `form` without a
  // `name` attribute will have its implicit `role="form"` disabled. More info
  // re: the implicit role:
  // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form
  addNameAttribute: false,
};

export default connect(mapStateToProps)(SchemaForm);
