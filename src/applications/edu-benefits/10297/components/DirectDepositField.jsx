import React from 'react';
import ReviewCardField from 'platform/forms-system/src/js/components/ReviewCardField';
import get from 'platform/utilities/data/get';
import omit from 'platform/utilities/data/omit';
import { querySelectorWithShadowRoot } from 'platform/utilities/ui/webComponents';

export default class DirectDepositField extends ReviewCardField {
  constructor(props) {
    super(props);

    const emptyData = Object.values(props.formData?.bankAccount ?? {}).every(
      val => !val,
    );
    const startInEditConfigOption = get(
      'ui:options.startInEdit',
      this.props.uiSchema,
      false,
    );

    let shouldStartInEdit = startInEditConfigOption;
    if (typeof startInEditConfigOption === 'function') {
      shouldStartInEdit = startInEditConfigOption(this.props.formData);
    }

    const editing = emptyData || shouldStartInEdit;

    this.state = {
      editing,
      canCancel: !emptyData,
      oldData: props.formData,
    };
  }

  async componentDidUpdate() {
    const saveButton = await querySelectorWithShadowRoot(
      'button',
      '.save-button',
    );
    const cancelButton = await querySelectorWithShadowRoot(
      'button',
      '.cancel-button',
    );
    if (saveButton && cancelButton) {
      const padding = '0.75rem 1.25rem';
      saveButton.style.padding = padding;
      cancelButton.style.padding = padding;
      cancelButton.style.backgroundColor = 'transparent';
      cancelButton.style.textDecoration = 'underline';
      cancelButton.style.boxShadow = 'none';
    }
  }

  getReviewView = () => {
    if (this.props.formContext.onReviewPage) {
      // Check the data type and use the appropriate review field
      const dataType = this.props.schema.type;
      if (dataType === 'object') {
        const { ObjectField } = this.props.registry.fields;
        return <ObjectField {...this.props} />;
      }
      if (dataType === 'array') {
        const { ArrayField } = this.props.registry.fields;
        return <ArrayField {...this.props} />;
      }
    }

    const { viewComponent: ViewComponent, reviewTitle } = this.props.uiSchema[
      'ui:options'
    ];
    const title = reviewTitle || this.getTitle();

    const headerClasses = [
      'review-card--header',
      'vads-u-background-color--gray-lightest',
      'vads-u-padding-y--0',
      'vads-u-padding-x--2',
      'vads-u-display--flex',
      'vads-u-justify-content--space-between',
      'vads-u-align-items--center',
    ].join(' ');
    const titleClasses = [
      'review-card--title',
      'vads-u-display--inline',
      'vads-u-margin--0',
    ].join(' ');
    const bodyClasses = [
      'review-card--body',
      'vads-u-border-color--gray-lightest',
      'vads-u-border--2px',
      /* Remove the top border because it looks like it just extends the header */
      'vads-u-border-top--0',
      'vads-u-padding--1p5',
      'vads-u-margin-bottom--1',
    ].join(' ');

    const Tag = this.props.formContext.onReviewPage ? 'h4' : 'h3';

    return (
      <div className="review-card">
        <div className={headerClasses} style={{ minHeight: '3.125rem' }}>
          <Tag tabIndex={0} className={titleClasses}>
            {title}
          </Tag>
        </div>
        <div className={bodyClasses}>
          <ViewComponent
            formData={this.props.formData}
            formContext={this.props.formContext}
            errorSchema={this.props.errorSchema}
            startEditing={this.startEditing}
            title={this.getTitle()}
          />
        </div>
      </div>
    );
  };

  getEditView = () => {
    const {
      disabled,
      errorSchema,
      formData,
      idSchema,
      onBlur,
      onChange,
      readonly,
      registry,
      required,
      schema,
      formContext,
    } = this.props;
    const { SchemaField } = registry.fields;
    // We've already used the ui:field and ui:title
    const uiSchema = omit(
      ['ui:field', 'ui:title', 'ui:description'],
      this.props.uiSchema,
    );

    const { editTitle, ariaLabel } = this.props.uiSchema['ui:options'];
    const title = editTitle || this.getTitle();
    const subtitle = this.getSubtitle();
    const titleClasses = [
      'review-card--title',
      'vads-u-margin-top--1',
      'vads-u-margin-bottom--2p5',
      'vads-u-margin-x--0',
    ].join(' ');

    const Field = (
      <SchemaField
        name={idSchema.$id}
        required={required}
        schema={schema}
        uiSchema={uiSchema}
        errorSchema={errorSchema}
        idSchema={idSchema}
        formData={formData}
        onChange={onChange}
        onBlur={onBlur}
        registry={registry}
        disabled={disabled}
        readonly={readonly}
      />
    );

    // ObjectField is set to be wrapped in a div instead of a dl, so we move
    // that dl wrap to here; this change fixes an accessibility issue
    const needsDlWrapper =
      // Wrap in DL only if on review page & in review mode
      formContext.onReviewPage &&
      formContext.reviewMode &&
      // volatileData is for arrays, which displays separate blocks
      uiSchema['ui:options']?.volatileData;

    const Tag = formContext.onReviewPage ? 'h4' : 'h3';

    return (
      <div className="review-card">
        <div className="review-card--body input-section va-growable-background">
          <Tag tabIndex={0} className={titleClasses}>
            {title}
          </Tag>
          {subtitle && <div className="review-card--subtitle">{subtitle}</div>}
          {needsDlWrapper ? <dl className="review">{Field}</dl> : Field}
          <div className="vads-u-display--flex vads-u-flex-direction--row vads-u-margin-top--2p5">
            {!formContext.reviewMode && (
              <>
                <va-button
                  class="save-button"
                  onClick={this.update}
                  label={`${ariaLabel || 'Save changes'}`}
                  text="Save"
                />
                {this.state.canCancel && (
                  <va-button
                    secondary
                    class="cancel-button"
                    onClick={this.cancelUpdate}
                    label="Cancel changes"
                    text="Cancel"
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  };
}
