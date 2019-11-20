import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import moment from 'moment';

import { genderLabels } from 'platform/static-data/labels';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

import formConfig from '../../config/form';
import initialData from '../schema/initialData';

const { confirmVeteranDetails } = formConfig.chapters.veteranDetails.pages;

describe('Confirm Veteran Details', () => {
  it('should render Veteran details (Name, last 4 SSN & VA File, gender)', () => {
    const veteran = initialData;
    const tree = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={confirmVeteranDetails.schema}
        uiSchema={confirmVeteranDetails.uiSchema}
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

    const maskedLast4 = tree.find('MaskedNumber');
    expect(maskedLast4.length).to.equal(2);
    expect(maskedLast4.first().props().number).to.equal(veteran.last4SSN);
    expect(maskedLast4.last().props().number).to.equal(veteran.last4VAFile);

    const dob = tree.find('.dob').text();
    expect(dob).to.equal(moment(veteran.dateOfBirth).format('L'));

    const gender = tree.find('.gender').text();
    expect(gender).to.equal(genderLabels[veteran.gender]);

    tree.unmount();
  });
});
