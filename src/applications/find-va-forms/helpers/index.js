// Dependencies.
import React from 'react';
import moment from 'moment';

export const normalizeFormsForTable = ({ data: forms }) =>
  forms.map(form => {
    // Derive the form properties.
    const id = form?.id;
    const downloadURL = form?.attributes?.url || '';
    const title = form?.attributes?.title || '';
    const firstIssuedOn = moment(form?.attributes?.firstIssuedOn, 'YYYY-MM-DD');
    const lastRevisionOn = moment(
      form?.attributes?.lastRevisionOn,
      'YYYY-MM-DD',
    );

    // Derive the ID field.
    const idLabel = (
      <a href={downloadURL} rel="noopener noreferrer" target="_blank">
        {id}
      </a>
    );

    return {
      ...form.attributes,
      // Overridden form values.
      id,
      type: form.type,
      firstIssuedOn: firstIssuedOn.unix(),
      lastRevisionOn: lastRevisionOn.unix(),
      // JSX Labels.
      idLabel,
      titleLabel: title,
      firstIssuedOnLabel: firstIssuedOn.format('MM-DD-YYYY'),
      lastRevisionOnLabel: lastRevisionOn.format('MM-DD-YYYY'),
    };
  });
