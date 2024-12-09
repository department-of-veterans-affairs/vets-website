import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { FindVaForms } from '../../components/FindVaForms';

describe('Find VA Forms <FindVaForms>', () => {
  it('should render', () => {
    const tree = shallow(<FindVaForms showPdfWarningBanner />);
    expect(tree.find('SearchForm')).to.exist;
    expect(tree.find('SearchResults')).to.exist;

    tree.unmount();
  });
});
