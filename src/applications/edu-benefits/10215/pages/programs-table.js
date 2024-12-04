import React from 'react';
// import _ from 'lodash';
import {
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

const arrayBuilderOptions = {
  arrayPath: 'programs',
  nounSingular: '85/15 calculation',
  nounPlural: '85/15 calculations',
  required: true,
  maxItems: 1000,
  text: {
    getItemName: item => item.programName,
  },
};
const programs = () => {
  // console.log(formData);
  const headings = [
    'Program', 
    'Total enrollment', 
    'Total supported enrollment',
    'Supported students FTE',
    'Non-supported students FTE',
    'Total enrollment FTE',
    'Supported student percentage',
    'Edit',
    'Delete',
  ]
  const editLink = <va-link
    // href={href}
    active
    text="Edit"
  />;
  const deleteBtn = <va-button-icon button-type='delete' />;
  return (
    <div class="usa-table-container--scrollable">
      <table className="usa-table usa-table-borderless usa-table--compact usa-table--stacked">
        <caption>
          Programs
        </caption>
        <thead>
          <tr>
            { headings.map(heading => <td key={heading}>{heading}</td> )}
          </tr>
        </thead>
        <tbody>
          <tr>
          { ['Some long program name', 100, 50, 80, 70, 90, '70%', editLink, deleteBtn].map(heading => <td key={heading}>{heading}</td> )}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export const ProgramsTable = {
  contentBeforeButtons: programs,
  uiSchema: {
    'view:programsSummary': arrayBuilderYesNoUI(arrayBuilderOptions, {
      title: 'Do you have another program to add?',
      labels: {
        Y: 'Yes',
        N: 'No',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:programsSummary': arrayBuilderYesNoSchema,
    },
    required: ['view:programsSummary'],
  },
};
