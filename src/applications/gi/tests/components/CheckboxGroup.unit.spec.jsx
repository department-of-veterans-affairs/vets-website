import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import CheckboxGroup from '../../components/CheckboxGroup';

describe('<CheckboxGroup>', () => {
  it('should render', () => {
    const tree = shallow(<CheckboxGroup />);
    expect(tree.type()).to.not.equal(null);
    expect(tree.find('input').length).to.eq(0);
    tree.unmount();
  });
  it('should render inputs', () => {
    const tree = shallow(
      <CheckboxGroup
        options={[
          {
            name: 'checkbox-1',
            optionLabel: 'label 1',
          },
          {
            name: 'checkbox-2',
            optionLabel: 'label 2',
          },
        ]}
      />,
    );
    expect(tree.type()).to.not.equal(null);
    expect(tree.find('input').length).to.eq(2);
    tree.unmount();
  });
  it('should should calls className of usa-input-error', () => {
    const tree = shallow(
      <CheckboxGroup
        errorMessage="some error"
        options={[
          {
            name: 'checkbox-1',
            optionLabel: 'label 1',
          },
          {
            name: 'checkbox-2',
            optionLabel: 'label 2',
          },
        ]}
      />,
    );
    expect(tree.find('.usa-input-error').hasClass('usa-input-error')).to.be
      .true;
    tree.unmount();
  });
  it('should calls className of vads-l-grid-container', () => {
    const tree = shallow(
      <CheckboxGroup
        row
        options={[
          {
            name: 'checkbox-1',
            optionLabel: 'label 1',
          },
          {
            name: 'checkbox-2',
            optionLabel: 'label 2',
          },
        ]}
      />,
    );
    expect(
      tree.find('.vads-l-grid-container').hasClass('vads-l-grid-container'),
    ).to.be.true;
    tree.unmount();
  });
  it('should calls className of vads-l-col--2', () => {
    const tree = shallow(
      <CheckboxGroup
        colNum={2}
        row
        options={[
          {
            name: 'checkbox-1',
            optionLabel: 'label 1',
          },
          {
            name: 'checkbox-2',
            optionLabel: 'label 2',
          },
        ]}
      />,
    );
    expect(
      tree
        .find('.vads-l-col--2')
        .at(1)
        .hasClass('vads-l-col--2'),
    ).to.be.true;
    tree.unmount();
  });
});
