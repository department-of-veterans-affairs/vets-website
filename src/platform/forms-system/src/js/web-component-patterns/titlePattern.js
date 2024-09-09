/* eslint-disable react/prop-types */
import React from 'react';
import { isReactComponent } from '~/platform/utilities/ui';

export const Title = ({
  title,
  description,
  headerLevel = 3,
  headerStyleLevel,
  classNames,
}) => {
  const CustomHeader = `h${headerLevel}`;
  const style = headerStyleLevel
    ? ` small-screen:vads-u-font-size--h${headerStyleLevel} vads-u-font-size--h${Number(
        headerStyleLevel,
      ) + 1}`
    : '';
  const color =
    headerStyleLevel === 3 || (!headerStyleLevel && headerLevel === 3)
      ? 'gray-dark'
      : 'black';
  const className =
    classNames || `vads-u-color--${color} vads-u-margin-top--0${style}`;

  // If the header is an h1, it's intended to also be the focus,
  // in which case we need an aria-describedby attribute to point to the
  // stepper to read out the step and chapter after reading the title
  const focusHeaderProps =
    headerLevel === 1
      ? {
          'aria-describedby': 'nav-form-header',
          tabIndex: '-1',
        }
      : {};

  return (
    <>
      <CustomHeader className={className} {...focusHeaderProps}>
        {title}
      </CustomHeader>
      {description && (
        <span className="vads-u-font-family--sans vads-u-font-weight--normal vads-u-font-size--base vads-u-line-height--4 vads-u-display--block">
          {description}
        </span>
      )}
    </>
  );
};

function isTitleObject(obj) {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    !Array.isArray(obj) &&
    !(obj instanceof Function) &&
    obj.$$typeof !== Symbol.for('react.element') &&
    !isReactComponent(obj) &&
    obj.title
  );
}

/**
 * @typedef {{
 *   title?: string | JSX.Element | ({ formData, formContext }) => string | JSX.Element,
 *   description?: string | JSX.Element | ({ formData, formContext }) => string | JSX.Element,
 *   headerLevel?: number,
 *   headerStyleLevel?: number,
 *   classNames?: string,
 * }} TitleObject
 */

/**
 * Title for the top of a form page
 *
 * ```js
 * uiSchema: {
 *   ...titleUI('Your contact information')
 *   ...titleUI({
 *     title: 'Your contact information',
 *     description: 'We’ll send any important information to this address.'
 *     headerLevel: 1,
 *     classNames: 'vads-u-margin-top--0',
 *   })
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
 * @param {string | JSX.Element | TitleObject | ({ formData, formContext }) => (string | JSX.Element)} [titleOption] 'ui:title'
 * @param {string | JSX.Element | ({ formData, formContext }) => string | JSX.Element} [descriptionOption] 'ui:description'
 *
 * @returns {UISchemaOptions}
 */
export const titleUI = (titleOption, descriptionOption) => {
  const {
    title,
    description,
    headerLevel,
    headerStyleLevel,
    classNames,
  } = isTitleObject(titleOption)
    ? titleOption
    : {
        title: titleOption,
        description: descriptionOption,
      };
  const isTitleFn = typeof title === 'function';
  const isDescriptionFn = typeof description === 'function';

  return {
    'ui:title':
      isTitleFn || isDescriptionFn ? (
        props => (
          <legend className="schemaform-block-title">
            <Title
              title={isTitleFn ? title(props) : title}
              description={isDescriptionFn ? description(props) : description}
              headerLevel={headerLevel}
              headerStyleLevel={headerStyleLevel}
              classNames={classNames}
            />
          </legend>
        )
      ) : (
        <Title
          title={title}
          description={description}
          headerLevel={headerLevel}
          headerStyleLevel={headerStyleLevel}
          classNames={classNames}
        />
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
