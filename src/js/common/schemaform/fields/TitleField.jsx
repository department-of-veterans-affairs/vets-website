import React from 'react';

export default function TitleField({ id, title }) {
  const isRoot = id === 'root__title';

  return isRoot
    ? <legend className="schemaform-block-title" id={id}>{title}</legend>
    : <h5 className="schemaform-block-title" id={id}>{title}</h5>;
}
