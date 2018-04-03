import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';

import ErrorableCheckboxes from '../../../../src/js/common/components/form-elements/ErrorableCheckboxes';

describe('<ErrorableCheckboxes>', () => {
  const options = [{ value: 'yes', label: 'Yes', additional: <p>additional content</p> }, { value: 'no', label: 'No' }];

  it('should render', () => {
    const state = { yes: false, no: false };
    const tree = mount(
      <ErrorableCheckboxes label="my label" options={options} values={state} onValueChange={(option, checked) => { state[option.value] = checked; }}/>
    );

    expect(tree.find('input').length).to.equal(2);
    expect(tree.find('label').at(0).text()).to.equal('Yes');
    expect(tree.find('label').at(1).text()).to.equal('No');
    expect(tree.find('legend').text()).to.equal('my label');
  });

  it('should reveal additional content', () => {
    const state = { yes: true, no: false };
    const tree = mount(
      <ErrorableCheckboxes label="my label" options={options} values={state} onValueChange={(option, checked) => { state[option.value] = checked; }}/>
    );

    expect(tree.find('p').text()).to.equal('additional content');
  });
});
