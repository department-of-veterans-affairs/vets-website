import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import moment from 'moment';

import { genderLabels } from 'platform/static-data/labels';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

import formConfig from '../../config/form';
import initialData from '../schema/initialData';

const { veteranInformation } = formConfig.chapters.step1.pages;

describe('Confirm Veteran Details', () => {
  it('should render Veteran details (Name, last 4 SSN & VA File, gender)', () => {
    const veteran = initialData;
    const tree = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={veteranInformation.schema}
        uiSchema={veteranInformation.uiSchema}
        data={initialData}
        formData={initialData}
      />,
    );

    const fullName = tree
      .find('strong')
      .first()
      .text();
    const dataName = `${veteran.fullName.first} ${veteran.fullName.last}`;
    expect(fullName).to.equal(dataName);

    const ssn = tree.find('.ssn').text();
    expect(ssn).to.include(veteran.last4SSN);

    const vafn = tree.find('.vafn').text();
    expect(vafn).to.include(veteran.last4VAFile);

    const dob = tree.find('.dob').text();
    expect(dob).to.equal(moment(veteran.dateOfBirth).format('L'));

    const gender = tree.find('.gender').text();
    expect(gender).to.equal(genderLabels[veteran.gender]);

    tree.unmount();
  });
});
