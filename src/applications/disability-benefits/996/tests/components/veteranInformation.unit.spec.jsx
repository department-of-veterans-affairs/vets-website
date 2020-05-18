import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import moment from 'moment';

import { genderLabels } from 'platform/static-data/labels';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

import formConfig from '../../config/form';
import { veteranInfoView } from '../../pages/veteranInformation';

const profileData = {
  ssn: '4321',
  vaFileNumber: '1234',
  dob: '1980-12-31',
  gender: 'M',
  userFullName: {
    first: 'Mike',
    middle: 'M',
    last: 'Wazowski',
    suffix: 'esq',
  },
};

describe('Confirm Veteran Details', () => {
  it('should render Veteran details (Name, last 4 SSN & VA File, gender)', () => {
    const schema = {
      type: 'object',
      properties: {},
    };
    const uiSchema = {
      'ui:description': () => veteranInfoView(profileData),
    };
    const tree = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={profileData}
        formData={profileData}
      />,
    );
    const name = profileData.userFullName;
    const fullName = tree.find('.name').text();
    const dataName = `${name.first} ${name.middle} ${name.last} ${name.suffix}`;
    expect(fullName).to.equal(dataName);

    const ssn = tree.find('.ssn').text();
    expect(ssn).to.include(profileData.ssn);

    const vafn = tree.find('.vafn').text();
    expect(vafn).to.include(profileData.vaFileNumber);

    const dob = tree.find('.dob').text();
    expect(dob).to.equal(moment(profileData.dob).format('LL'));

    const gender = tree.find('.gender').text();
    expect(gender).to.equal(genderLabels[profileData.gender]);

    tree.unmount();
  });
});
