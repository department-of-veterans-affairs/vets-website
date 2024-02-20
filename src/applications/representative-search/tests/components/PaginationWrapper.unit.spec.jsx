import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import PaginationWrapper from '../../components/results/PaginationWrapper';

const handlePageSelect = () => {};

describe('PaginationWrapper', () => {
  it('Should render when all required props are provided', () => {
    const currentPage = 1;
    const totalPages = 2;

    const wrapper = shallow(
      <PaginationWrapper
        handlePageSelect={handlePageSelect}
        currentPage={currentPage}
        totalPages={totalPages}
      />,
    );

    expect(wrapper.find('ForwardRef(VaPagination)').length).to.equal(1);
    wrapper.unmount();
  });

  it('Should not render if currentPage is undefined', () => {
    const totalPages = 2;
    const results = [1, 2];
    const shouldRender = true;

    const wrapper = shallow(
      <PaginationWrapper
        handlePageSelect={handlePageSelect}
        totalPages={totalPages}
        results={results}
        shouldRender={shouldRender}
      />,
    );

    expect(wrapper.find('ForwardRef(VaPagination)').length).to.equal(0);
    wrapper.unmount();
  });
});
