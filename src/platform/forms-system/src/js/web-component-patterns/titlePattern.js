import React from 'react';

/**
 * Title for the top of a form page
 *
 * ```js
 * exampleTitle: titleUI('Your contact information')
 * exampleTitle: titleUI('Your contact information', 'We’ll send any important information to this address.')
 * exampleTitle: titleUI('Previous deductible expenses', (<p>
    Tell us more.
        <AdditionalInfo triggerText="What if my expenses are higher than my annual income?">
          We understand in some cases your expenses might be higher than your
          income. If your expenses exceed your income, we’ll adjust them to be
          equal to your income. This won’t affect your application or benefits.
        </AdditionalInfo>
    </p>))
 * ```
 * @param {string | JSX.Element} [title] 'ui:title'
 * @param {string | JSX.Element} [description] 'ui:description'
 *
 * @returns {UISchemaOptions}
 */
export const titleUI = (title, description) => {
  return {
    'ui:title': (
      <h3 className="vads-u-color--gray-dark vads-u-margin-y--0">{title}</h3>
    ),
    'ui:description': description ? (
      <p className="vads-u-margin-bottom--0">{description}</p>
    ) : null,
  };
};

/**
 * Simple text
 *
 * ```js
 * exampleText: textUI('A block of text goes here')
 * exampleText: textUI(<p>A block of text goes here</p>)
 * exampleText: textUI(<p className="vads-u-margin-bottom--0">
    Tell us more.
        <AdditionalInfo triggerText="What if my expenses are higher than my annual income?">
          We understand ...
        </AdditionalInfo>
    </p>)
 * exampleText: textUI('A block of text goes here', {
 *    hideOnReview: true
 * })
 * ```
 * @param {string | JSX.Element} [text] 'ui:description'
 * @param {UIOptions} [uiOptions] 'ui:options'
 *
 * @returns {UISchemaOptions}
 */
export const textUI = (text, uiOptions = {}) => {
  return {
    'ui:title': '',
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
 * exampleTitle: titleUI('Your contact information')
 * exampleTitle: titleUI('Your contact information', 'We’ll send any important information to this address.')
 * exampleTitle: titleUI('Previous deductible expenses', (<p>
    Tell us more.
        <AdditionalInfo triggerText="What if my expenses are higher than my annual income?">
          We understand in some cases your expenses might be higher than your
          income. If your expenses exceed your income, we’ll adjust them to be
          equal to your income. This won’t affect your application or benefits.
        </AdditionalInfo>
    </p>))
 * ```
 * @param {string | JSX.Element} [title] 'ui:title'
 * @param {string | JSX.Element} [description] 'ui:description'
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
export const textSchema = titleSchema;
