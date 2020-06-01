import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import moment from 'moment';

import { genderLabels } from 'platform/static-data/labels';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

import { veteranInfoView } from '../../content/veteranInformation';

const data = {
  veteran: {
    ssnLastFour: '4321',
    vaFileNumber: '1234',
  },
  profile: {
    dob: '1980-12-31',
    gender: 'M',
    userFullName: {
      first: 'MIKE',
      middle: 'M',
      last: 'Wazowski',
      suffix: 'III',
    },
  },
};

describe('Confirm Veteran Details', () => {
  it('should render Veteran details (Name, last 4 SSN & VA File, gender)', () => {
    const schema = {
      type: 'object',
      properties: {},
    };
    const uiSchema = {
      'ui:description': () => veteranInfoView(data),
    };
    const tree = mount(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={data}
        formData={data}
      />,
    );
    const fullName = tree.find('.name').text();
    expect(fullName).to.equal('Mike M Wazowski, III');

    const ssn = tree.find('.ssn').text();
    expect(ssn).to.include(data.veteran.ssnLastFour);

    const vafn = tree.find('.vafn').text();
    expect(vafn).to.include(data.veteran.vaFileNumber);

    const dob = tree.find('.dob').text();
    expect(dob).to.equal(moment(data.profile.dob).format('LL'));

    const gender = tree.find('.gender').text();
    expect(gender).to.equal(genderLabels[data.profile.gender]);

    tree.unmount();
  });
});
