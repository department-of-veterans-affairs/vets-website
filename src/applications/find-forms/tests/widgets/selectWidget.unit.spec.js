// Dependencies.
import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';

// Relative imports.
import SelectWidget from '../../widgets/SelectWidget';

describe('Find VA Forms <SearchWidget>', () => {
  const sortOptions = ['Last Updated (Newest)', 'Last Updated (Oldest)'];

  it('widget has props needed', () => {
    const tree = mount(
      <SelectWidget
        options={sortOptions}
        initialState={'Last Updated (Newest)'}
        grabCurrentState={() => {}}
      />,
    );

    expect(tree.props().options).to.eql(sortOptions);
    expect(tree.props().initialState).to.equal('Last Updated (Newest)');
    expect(typeof tree.props().grabCurrentState).to.equal('function');

    tree.unmount();
  });

  it('has all options rendered', () => {
    const tree = shallow(
      <SelectWidget
        options={sortOptions}
        initialState={'Last Updated (Newest)'}
        grabCurrentState={() => {}}
      />,
    );

    const selectNodeClass = '.vas-select-widget select';
    // Select Widget Exists.
    expect(tree.find(selectNodeClass)).to.have.lengthOf(1);
    // Expect two options.
    expect(tree.find(`${selectNodeClass} option`)).to.have.lengthOf(2);

    tree.unmount();
  });

  it('select node state updates correctly', () => {
    const tree = shallow(
      <SelectWidget
        options={sortOptions}
        initialState={'Last Updated (Newest)'}
        grabCurrentState={() => {}}
      />,
    );

    const selectNodeClass = '.vas-select-widget select';
    tree
      .find(selectNodeClass)
      .at(0)
      .simulate('change', {
        target: {
          value: 'Last Updated (Oldest)',
          name: 'Last Updated (Oldest)',
        },
      });

    const currentOptionSelected = tree.find(selectNodeClass);
    // component has an onChange handler
    expect(typeof currentOptionSelected.props().onChange).to.equal('function');
    // change options and expect the state to change
    expect(currentOptionSelected.props().value).to.be.equal(sortOptions[1]);

    tree.unmount();
  });
});
