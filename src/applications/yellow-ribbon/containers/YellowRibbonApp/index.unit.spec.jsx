// Dependencies.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import FindYellowRibbonPage from '../../components/FindYellowRibbonPage';
import SearchResultsPage from '../../components/SearchResultsPage';
import { YellowRibbonApp } from './index';

describe('Yellow Ribbon container <YellowRibbonApp>', () => {
  it('renders what we expect before having fetched', () => {
    const tree = shallow(<YellowRibbonApp />);

    // Expect there to be:
    expect(tree.find('Breadcrumbs')).to.have.lengthOf(1);
    expect(tree.find(FindYellowRibbonPage)).to.have.lengthOf(1);
    expect(tree.find(SearchResultsPage)).to.have.lengthOf(0);

    tree.unmount();
  });

  it('renders what we expect after having fetched', () => {
    const tree = shallow(<YellowRibbonApp hasFetchedOnce />);

    // Expect there to be:
    expect(tree.find('Breadcrumbs')).to.have.lengthOf(1);
    expect(tree.find(FindYellowRibbonPage)).to.have.lengthOf(0);
    expect(tree.find(SearchResultsPage)).to.have.lengthOf(1);

    tree.unmount();
  });
});
