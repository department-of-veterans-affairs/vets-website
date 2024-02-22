import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import FindYellowRibbonPage from '../../components/FindYellowRibbonPage';
import SearchResultsPage from '../../components/SearchResultsPage';
import { YellowRibbonApp } from '.';

describe('Yellow Ribbon container <YellowRibbonApp>', () => {
  it('renders what we expect before having fetched', () => {
    const tree = shallow(<YellowRibbonApp />);

    expect(tree.find('va-breadcrumbs')).to.exist;
    expect(tree.find(FindYellowRibbonPage)).to.have.lengthOf(1);
    expect(tree.find(SearchResultsPage)).to.have.lengthOf(0);

    tree.unmount();
  });

  it('renders what we expect after having fetched', () => {
    const tree = shallow(<YellowRibbonApp hasFetchedOnce />);

    expect(tree.find('va-breadcrumbs')).to.exist;
    expect(tree.find(FindYellowRibbonPage)).to.have.lengthOf(0);
    expect(tree.find(SearchResultsPage)).to.have.lengthOf(1);

    tree.unmount();
  });
});
