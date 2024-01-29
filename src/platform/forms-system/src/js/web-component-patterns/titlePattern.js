/* eslint-disable react/prop-types */
import React from 'react';

const Title = ({ title, description }) => (
  <>
    <h3 className="vads-u-color--gray-dark vads-u-margin-top--0">{title}</h3>
    {description && (
      <span className="vads-u-font-family--sans vads-u-font-weight--normal vads-u-font-size--base vads-u-line-height--4 vads-u-display--block">
        {description}
      </span>
    )}
  </>
);

/**
 * Title for the top of a form page
 *
 * ```js
 * uiSchema: {
 *   ...titleUI('Your contact information')
 *   ...titleUI(({ formData, formContext }) => `Your contact information ${formData.firstName}`)
 *   ...titleUI('Your contact information', 'We’ll send any important information to this address.')
 *   ...titleUI('Previous deductible expenses', (<p>
      Tell us more.
          <AdditionalInfo triggerText="What if my expenses are higher than my annual income?">
            We understand in some cases your expenses might be higher than your
            income. If your expenses exceed your income, we’ll adjust them to be
            equal to your income. This won’t affect your application or benefits.
          </AdditionalInfo>
      </p>))
 * ```
 * @param {string | JSX.Element | ({ formData, formContext }) => string | JSX.Element} [title] 'ui:title'
 * @param {string | JSX.Element | ({ formData, formContext }) => string | JSX.Element} [description] 'ui:description'
 *
 * @returns {UISchemaOptions}
 */
export const titleUI = (title, description) => {
  const isTitleFn = typeof title === 'function';
  const isDescriptionFn = typeof description === 'function';

  return {
    'ui:title':
      isTitleFn || isDescriptionFn ? (
        props => (
          <Title
            title={isTitleFn ? title(props) : title}
            description={isDescriptionFn ? description(props) : description}
          />
        )
      ) : (
        <Title title={title} description={description} />
      ),
  };
};

/**
 * Simple text description
 *
 * ```js
 * exampleText: descriptionUI('A block of text goes here')
 * exampleText: descriptionUI(<p>A block of text goes here</p>)
 * exampleText: descriptionUI(<p className="vads-u-margin-bottom--0">
    Tell us more.
        <va-additional-info trigger="What if my expenses are higher than my annual income?">
          We understand ...
        </va-additional-info>
    </p>)
 * exampleText: descriptionUI('A block of text goes here', {
 *    hideOnReview: true
 * })
 * ```
 * @param {string | JSX.Element} [text] 'ui:description'
 * @param {UIOptions} [uiOptions] 'ui:options'
 *
 * @returns {UISchemaOptions}
 */
export const descriptionUI = (text, uiOptions = {}) => {
  return {
    'ui:description': text,
    'ui:options': {
      ...uiOptions,
    },
  };
};

/**
 * Inline title for (in the middle of) a form page
 *
 * ```js
 * exampleTitle: inlineTitleUI('Your contact information')
 * exampleTitle: inlineTitleUI('Your contact information', 'We’ll send any important information to this address.')
 * exampleTitle: inlineTitleUI('Previous deductible expenses', (<p>
    Tell us more.
        <va-additional-info trigger="What if my expenses are higher than my annual income?">
          We understand in some cases your expenses might be higher than your
          income. If your expenses exceed your income, we’ll adjust them to be
          equal to your income. This won’t affect your application or benefits.
        </va-additional-info>
    </p>))
 * ```
 * @param {string | JSX.Element} [title] 'ui:title'
 * @param {string | JSX.Element} [description] 'ui:description'
 *
 * @returns {UISchemaOptions}
 */
export const inlineTitleUI = (title, description) => {
  return {
    'ui:title': (
      <h3 className="vads-u-color--gray-dark vads-u-margin-top--4 vads-u-margin-bottom--neg3">
        {title}
      </h3>
    ),
    'ui:description': description || null,
  };
};

/**
 * @returns {SchemaOptions}
 */
export const titleSchema = {
  type: 'object',
  properties: {},
};

export const inlineTitleSchema = titleSchema;
export const descriptionSchema = titleSchema;
