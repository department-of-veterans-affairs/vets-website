// Dependencies.
import React from 'react';

export const normalizeFormsForTable = ({ data: forms }) =>
  forms.map(form => {
    // Derive the form properties.
    const id = form?.id;
    const downloadURL = form?.attributes?.url || '';
    const title = form?.attributes?.title || '';
    const description = form?.attributes?.description || '';
    const availableOnline = form?.attributes?.availableOnline;
    const applyOnlineURL = form?.attributes?.applyOnlineURL;

    // Derive the ID field.
    const idLabel = (
      <a href={downloadURL} rel="noopener noreferrer" target="_blank">
        {id}
      </a>
    );

    // Derive the available online field.
    const availableOnlineLabel = availableOnline ? (
      <a href={applyOnlineURL} rel="noopener noreferrer">
        Apply now
      </a>
    ) : (
      ''
    );

    return {
      id,
      type: form.type,
      ...form.attributes,
      idLabel,
      titleLabel: title,
      descriptionLabel: description,
      availableOnlineLabel,
    };
  });
