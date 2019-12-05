// Dependencies.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import FindVaForms from '../../components/FindVaForms';

describe('Find VA Forms <FindVaForms>', () => {
  it('should render', () => {
    const tree = shallow(<FindVaForms />);

    expect(tree.find('SearchForm')).to.exist;
    tree.unmount();
  });
});
