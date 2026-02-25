import React from 'react';
import ReviewCardField from 'platform/forms-system/src/js/components/ReviewCardField';
import get from 'platform/utilities/data/get';

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
}
