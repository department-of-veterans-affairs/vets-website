import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import VACheckboxGroupGi from '../../components/VaCheckboxGroupGi';

describe('<VaCheckboxGroupGi>', () => {
  it('should render', () => {
    const tree = shallow(<VACheckboxGroupGi />);
    expect(tree.type()).to.not.equal(null);
    tree.unmount();
  });
  it('should render inputs', () => {
    const tree = shallow(
      <VACheckboxGroupGi
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
        row
      />,
    );
    expect(tree.type()).to.not.equal(null);
    expect(tree.find('label').length).to.eq(2);
    tree.unmount();
  });
  it('should render inputs with props and error', () => {
    const tree = shallow(
      <VACheckboxGroupGi
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
        row
        colNum={2}
        padding
        errorMessage="Error message"
      />,
    );
    expect(tree.type()).to.not.equal(null);
    expect(tree.find('.usa-input-error').length).to.eq(1);

    tree.unmount();
  });
});
