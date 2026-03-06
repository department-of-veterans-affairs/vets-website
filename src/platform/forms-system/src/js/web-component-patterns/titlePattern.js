/* eslint-disable react/prop-types */
import React, { useRef } from 'react';
import { isReactComponent } from '~/platform/utilities/ui';
import { isMinimalHeaderPath } from '../patterns/minimal-header';

const useHeadingLevels = (userHeaderLevel, userHeaderStyleLevel) => {
  const isMinimalHeader = useRef(null);
  if (isMinimalHeader.current === null) {
    // only call once
    isMinimalHeader.current = isMinimalHeaderPath();
  }
  const headerLevel = userHeaderLevel || (isMinimalHeader.current ? 1 : 3);
  // Arbitrary decision with design:
  // When using titleUI with minimal header and we are now using h1s,
  // the styling is a bit too large for a page title (before it was h3),
  // so we'll bump the style down to h2
  const headerStyleLevel =
    userHeaderStyleLevel || (isMinimalHeader.current ? 2 : undefined);

  return {
    headerLevel,
    headerStyleLevel,
  };
};

export const Title = ({
  title,
  description,
  headerLevel: userHeaderLevel,
  headerStyleLevel: userHeaderStyleLevel,
  classNames,
  ariaDescribedBy,
}) => {
  const { headerLevel, headerStyleLevel } = useHeadingLevels(
    userHeaderLevel,
    userHeaderStyleLevel,
  );

  const CustomHeader = `h${headerLevel}`;
  const style = headerStyleLevel
    ? ` mobile-lg:vads-u-font-size--h${headerStyleLevel} vads-u-font-size--h${Number(
        headerStyleLevel,
      ) + 1}`
    : '';
  const color =
    headerStyleLevel === 3 || (!headerStyleLevel && headerLevel === 3)
      ? 'gray-dark'
      : 'black';
  const className =
    classNames || `vads-u-color--${color} vads-u-margin-top--0${style}`;

  // If the header is an h1, it's intended to also be the focus
  const focusHeaderProps =
    headerLevel === 1
      ? {
          tabIndex: '-1',
        }
      : {};

  const ariaProps = ariaDescribedBy
    ? { 'aria-describedby': ariaDescribedBy }
    : {};

  return (
    <>
      <CustomHeader
        className={className}
        {...focusHeaderProps}
        {...ariaProps}
        aria-describedby="nav-form-header"
      >
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
 * uiSchema title for the form page, which appears at the top of the page, implemented with object spread into the uiSchema like such: ...titleUI('title')
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
    ariaDescribedBy,
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
              ariaDescribedBy={ariaDescribedBy}
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
          ariaDescribedBy={ariaDescribedBy}
        />
      ),
  };
};

/**
 * uiSchema for a description. Prefer to use second argument of titleUI instead.
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
 * uiSchema for an inline title for (in the middle of) a form page. Try not to use this.
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
