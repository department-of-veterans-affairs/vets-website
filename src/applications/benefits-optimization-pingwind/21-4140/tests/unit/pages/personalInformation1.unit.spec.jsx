import React from 'react';
import { expect } from 'chai';

import page from '../../../pages/personalInformation1';
import { veteranFields } from '../../../definitions/constants';

describe('21-4140 page/personalInformation1', () => {
  it('requires full name, SSN, and date of birth', () => {
    const veteranSchema = page.schema.properties[veteranFields.parentObject];

    expect(veteranSchema.required).to.deep.equal([
      veteranFields.fullName,
      veteranFields.ssn,
      veteranFields.dateOfBirth,
    ]);
  });

  it('provides the Basic Information heading in the UI schema', () => {
    const veteranUiSchema = page.uiSchema[veteranFields.parentObject];
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

  it('includes ui:description with introduction text', () => {
    const veteranUiSchema = page.uiSchema[veteranFields.parentObject];
    expect(veteranUiSchema['ui:description']).to.exist;
    expect(typeof veteranUiSchema['ui:description']).to.equal('function');
  });

  it('renders ui:description as a React element', () => {
    const veteranUiSchema = page.uiSchema[veteranFields.parentObject];
    const description = veteranUiSchema['ui:description']();
    expect(React.isValidElement(description)).to.be.true;
  });

  it('defines ui:order for fields', () => {
    const veteranUiSchema = page.uiSchema[veteranFields.parentObject];
    expect(veteranUiSchema['ui:order']).to.deep.equal([
      veteranFields.fullName,
      veteranFields.ssn,
      veteranFields.vaFileNumber,
      veteranFields.dateOfBirth,
      veteranFields.veteranServiceNumber,
    ]);
  });

  it('includes all required schema properties', () => {
    const veteranSchema = page.schema.properties[veteranFields.parentObject];
    expect(veteranSchema.properties).to.have.all.keys([
      veteranFields.fullName,
      veteranFields.vaFileNumber,
      veteranFields.ssn,
      veteranFields.dateOfBirth,
      veteranFields.veteranServiceNumber,
    ]);
  });

  it('includes fullName UI schema', () => {
    const veteranUiSchema = page.uiSchema[veteranFields.parentObject];
    expect(veteranUiSchema[veteranFields.fullName]).to.exist;
  });

  it('includes SSN UI schema', () => {
    const veteranUiSchema = page.uiSchema[veteranFields.parentObject];
    expect(veteranUiSchema[veteranFields.ssn]).to.exist;
  });

  it('includes VA file number UI schema', () => {
    const veteranUiSchema = page.uiSchema[veteranFields.parentObject];
    expect(veteranUiSchema[veteranFields.vaFileNumber]).to.exist;
  });

  it('includes date of birth UI schema', () => {
    const veteranUiSchema = page.uiSchema[veteranFields.parentObject];
    expect(veteranUiSchema[veteranFields.dateOfBirth]).to.exist;
  });

  it('includes veteran service number UI schema', () => {
    const veteranUiSchema = page.uiSchema[veteranFields.parentObject];
    expect(veteranUiSchema[veteranFields.veteranServiceNumber]).to.exist;
  });
});
