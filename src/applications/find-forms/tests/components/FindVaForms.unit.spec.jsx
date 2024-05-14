import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { FindVaForms } from '../../components/FindVaForms';

describe('Find VA Forms <FindVaForms>', () => {
  it('should render', () => {
    const tree = shallow(<FindVaForms showPdfWarningBanner />);
    expect(tree.find('PdfAlert')).to.be.empty;
    expect(tree.find('SearchForm')).to.exist;
    expect(tree.find('SearchResults')).to.exist;

    tree.unmount();
  });

  it('should render correctly when showPdfWarningBanner is true', () => {
    const tree = shallow(<FindVaForms showPdfWarningBanner />);
    expect(tree.find('PdfAlert')).to.exist;
    expect(tree.find('SearchForm')).to.exist;
    expect(tree.find('SearchResults')).to.exist;

    tree.unmount();
  });
});
