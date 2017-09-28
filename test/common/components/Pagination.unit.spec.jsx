import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import Pagination from '../../../src/js/common/components/Pagination';

const props = {
  onPageSelect: () => {},
};

describe('<Pagination>', () => {
  it('should show all pages if there are fewer pages than the max', () => {
    const tree = SkinDeep.shallowRender(
      <Pagination
        {...props}
        page={1}
        pages={5}/>
    );
    const links = tree.everySubTree('a');
    expect(tree.everySubTree('a')).to.have.length(6);
    links.forEach((link, index) => {
      if (index === 5) {
        expect(link.props.children).to.equal('Next');
      } else {
        const pageNumber = index + 1;
        expect(link.props.children).to.equal(pageNumber);
      }
    });
  });

  it('should show both "Prev" and "Next" if in a middle page', () => {
    const tree = SkinDeep.shallowRender(
      <Pagination
        {...props}
        page={3}
        pages={5}/>
    );
    const links = tree.everySubTree('a');
    expect(tree.everySubTree('a')).to.have.length(7);
    links.forEach((link, index) => {
      if (index === 0) {
        expect(link.props.children.props.children).to.equal('Prev');
      } else if (index === 6) {
        expect(link.props.children).to.equal('Next');
      } else {
        const pageNumber = index;
        expect(link.props.children).to.equal(pageNumber);
      }
    });
  });

  it('should show "Prev" but not "Next" if on the last page', () => {
    const tree = SkinDeep.shallowRender(
      <Pagination
        {...props}
        page={5}
        pages={5}/>
    );
    const links = tree.everySubTree('a');
    expect(tree.everySubTree('a')).to.have.length(6);
    links.forEach((link, index) => {
      if (index === 0) {
        expect(link.props.children.props.children).to.equal('Prev');
      } else if (index === 6) {
        expect(link.props.children).to.equal('Next');
      } else {
        const pageNumber = index;
        expect(link.props.children).to.equal(pageNumber);
      }
    });
  });

  it('should show the correct range of pages if the max is exceeded', () => {
    const tree = SkinDeep.shallowRender(
      <Pagination
        {...props}
        page={5}
        pages={20}/>
    );
    const links = tree.everySubTree('a');
    expect(links).to.have.length(12);
    links.forEach((link, index) => {
      if (index === 0) {
        expect(link.props.children.props.children).to.equal('Prev');
      } else if (index === 11) {
        expect(link.props.children).to.equal('Next');
      } else {
        const pageNumber = index + 4;
        expect(link.props.children).to.equal(pageNumber);
      }
    });
  });

  it('show the last page if enabled and there are more pages than max', () => {
    const tree = SkinDeep.shallowRender(
      <Pagination
        {...props}
        page={3}
        pages={15}
        maxPageListLength={10}
        showLastPage/>
    );
    const links = tree.everySubTree('a');
    expect(links).to.have.length(12);
    links.forEach((link, index) => {
      if (index === 0) {
        expect(link.props.children.props.children).to.equal('Prev');
      } else if (index === 9) {
        expect(link.props.children).to.equal('...');
      } else if (index === 10) {
        expect(link.props.children).to.equal(15);
      } else if (index === 11) {
        expect(link.props.children).to.equal('Next');
      } else {
        const pageNumber = index + 2;
        expect(link.props.children).to.equal(pageNumber);
      }
    });
  });

  it('should show a continuous list when within range of the last page', () => {
    const tree = SkinDeep.shallowRender(
      <Pagination
        {...props}
        page={6}
        pages={15}
        maxPageListLength={10}
        showLastPage/>
    );
    const links = tree.everySubTree('a');
    expect(links).to.have.length(12);
    links.forEach((link, index) => {
      if (index === 0) {
        expect(link.props.children.props.children).to.equal('Prev');
      } else if (index === 10) {
        expect(link.props.children).to.equal(15);
      } else if (index === 11) {
        expect(link.props.children).to.equal('Next');
      } else {
        const pageNumber = index + 5;
        expect(link.props.children).to.equal(pageNumber);
      }
    });
  });
});

