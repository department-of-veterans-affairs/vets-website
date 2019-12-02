// Dependencies.
import React from 'react';
import map from 'lodash/map';

export const normalizeFormsForTable = forms =>
  map(forms, form => {
    // Derive the form properties.
    const id = form?.id;
    const downloadURL = form?.attributes?.url;
    const title = form?.attributes?.title;
    const description = form?.attributes?.description;
    const availableOnline = form?.attributes?.availableOnline;
    const applyOnlineURL = form?.attributes?.applyOnlineURL;

    // Derive the ID field.
    const tableFieldID = (
      <a href={downloadURL} rel="noopener noreferrer" target="_blank">
        {id}
      </a>
    );

    // Derive the available online field.
    const tableFieldAvailableOnline = availableOnline ? (
      <a href={applyOnlineURL} rel="noopener noreferrer">
        Apply now
      </a>
    ) : (
      ''
    );

    return {
      ...form,
      tableFieldID,
      tableFieldFormName: title,
      tableFieldDescription: description,
      tableFieldAvailableOnline,
    };
  });
