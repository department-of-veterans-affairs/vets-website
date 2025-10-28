import React from 'react';
import { expect } from 'chai';

import page from '../../../pages/personalInformation1';
import { veteranFields } from '../../../definitions/constants';

describe('21-4140 page/personalInformation1', () => {
  it('requires full name, SSN, and date of birth', () => {
    const veteranSchema =
      page.schema.properties[veteranFields.parentObject];

    expect(veteranSchema.required).to.deep.equal([
      veteranFields.fullName,
      veteranFields.ssn,
      veteranFields.dateOfBirth,
    ]);
  });

  it('provides the Basic Information heading in the UI schema', () => {
    const veteranUiSchema =
      page.uiSchema[veteranFields.parentObject];
    const title = veteranUiSchema['ui:title'];
    let titleText = '';

    if (typeof title === 'string') {
      titleText = title;
    } else if (React.isValidElement(title)) {
      if (typeof title.props?.title === 'string') {
        titleText = title.props.title;
      } else if (React.isValidElement(title.props?.title)) {
        titleText = React.Children.toArray(title.props.title.props?.children)
          .filter(Boolean)
          .join(' ');
      } else {
        titleText = React.Children.toArray(title.props?.children)
          .filter(Boolean)
          .join(' ');
      }
    }

    expect(titleText).to.contain('Basic Information');
  });
});
