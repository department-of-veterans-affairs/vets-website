import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import { VeteranInfoView } from '../../content/veteranInformation';
import { SAVED_CLAIM_TYPE } from '../../constants';

describe('veteranInformation', () => {
  const form = {
    data: {},
  };
  const setFormData = data => {
    form.data = data;
  };

  it('should add benefitType in sessionStorage to formData', () => {
    const data = {
      formData: {},
      profile: {
        dob: '2000-01-01',
        gender: 'M',
        userFullName: {
          first: 'Foo',
          last: 'Bar',
        },
      },
      veteran: {
        ssnLastFour: '9876',
        vaFileLastFour: '5432',
      },
    };
    window.sessionStorage.setItem(SAVED_CLAIM_TYPE, 'compensation');
    const tree = mount(<VeteranInfoView {...data} setFormData={setFormData} />);
    expect(tree.find('.name').text()).to.equal('Foo  Bar');
    expect(tree.find('.ssn').text()).to.contain('9876');
    expect(tree.find('.vafn').text()).to.contain('5432');
    expect(tree.find('.dob').text()).to.contain('January 1, 2000');
    expect(tree.find('.gender').text()).to.contain('Male');

    expect(form.data.benefitType).to.equal('compensation');
    tree.unmount();
  });
});
