// Dependencies.
import React from 'react';
import moment from 'moment';

export const normalizeFormsForTable = forms =>
  forms.map(form => {
    // Derive the form properties.
    const id = form?.id;
    const downloadURL = form?.attributes?.url || '';
    const title = form?.attributes?.title || '';
    const lastRevisionOn = moment(
      form?.attributes?.lastRevisionOn,
      'YYYY-MM-DD',
    );

    // Derive the ID field.
    const idLabel = (
      <a href={downloadURL} rel="noopener noreferrer" target="_blank">
        {id} {downloadURL.toLowerCase().includes('.pdf') && '(PDF)'}
      </a>
    );

    return {
      ...form.attributes,
      // Overridden form values.
      id,
      type: form.type,
      lastRevisionOn: lastRevisionOn.unix(),
      // JSX Labels.
      idLabel,
      titleLabel: title,
      lastRevisionOnLabel: lastRevisionOn.format('MM-DD-YYYY'),
    };
  });
