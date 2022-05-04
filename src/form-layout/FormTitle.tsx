import React from 'react';
import { FormTitleProps } from './types';

/**
 * Form Title component is a simple wrapper 
 * around a Form Title and subTitle using VA styles
 *
 * @param {FormTitleProps} props
 * 
 * @example
 * Here's a simple example:
 * ```typescript
 * <FormTitle title="My Title" subTitle="Example sub title text" />;
 * ```
 * 
 * @returns React.Component
 */
const FormTitle = (props: FormTitleProps) => (
  <div className="va-form-title">
    <h1>{props.title}</h1>
    {props.subTitle && <div className="va-form-subtitle">{props.subTitle}</div>}
  </div>
);

export default FormTitle;
