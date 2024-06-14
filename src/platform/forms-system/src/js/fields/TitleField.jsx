import React from 'react';
import classNames from 'classnames';

export default function TitleField({ id, title, useHeaderStyling }) {
  const isRoot = id === 'root__title';
  const classes = classNames('schemaform-block-title', {
    'schemaform-block-subtitle': !isRoot,
  });

  const isEmptyTitle = typeof title === 'string' && title.trim() === '';
  if (!isEmptyTitle && useHeaderStyling)
    return (
      <h3 className="vads-u-font-size--h5" id={id}>
        {title}
      </h3>
    );

  return isEmptyTitle ? null : (
    <legend className={classes} id={id}>
      {title}
    </legend>
  );
}
