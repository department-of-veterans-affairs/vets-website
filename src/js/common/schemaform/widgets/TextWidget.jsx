import React from 'react';

export default function TextWidget(props) {
  return (
    <input type={props.schema.type === 'number' ? 'number' : props.type}
        id={props.id}
        disabled={props.disabled}
        maxLength={props.schema.maxLength}
        autoComplete={props.options.autocomplete || false}
        className={props.options.widgetClassNames}
        value={props.value || ''}
        onBlur={() => props.onBlur(props.id)}
        onChange={(event) => props.onChange(event.target.value ? event.target.value : undefined)}/>
  );
}

TextWidget.defaultProps = {
  type: 'text'
};
