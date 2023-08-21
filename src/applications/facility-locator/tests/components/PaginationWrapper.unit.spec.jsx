import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { PaginationWrapper } from '../../components/PaginationWrapper';

const handlePageSelect = () => {};

describe('PaginationWrapper', () => {
  it('Should render when all required props are provided', () => {
    const currentPage = 1;
    const totalPages = 2;
    const results = [1, 2];
    const shouldRender = true;

    const wrapper = shallow(
      <PaginationWrapper
        handlePageSelect={handlePageSelect}
        currentPage={currentPage}
        totalPages={totalPages}
        results={results}
        shouldRender={shouldRender}
      />,
    );

    expect(wrapper.find('ForwardRef(VaPagination)').length).to.equal(1);
    wrapper.unmount();
  });

  it('Should not render if shouldRender is false', () => {
    const currentPage = 1;
    const totalPages = 2;
    const results = [1, 2];
    const shouldRender = false;

    const wrapper = shallow(
      <PaginationWrapper
        handlePageSelect={handlePageSelect}
        currentPage={currentPage}
        totalPages={totalPages}
        results={results}
        shouldRender={shouldRender}
      />,
    );

    expect(wrapper.find('ForwardRef(VaPagination)').length).to.equal(0);
    wrapper.unmount();
  });

  it('Should not render if results is empty', () => {
    const currentPage = 1;
    const totalPages = 2;
    const results = [];
    const shouldRender = true;

    const wrapper = shallow(
      <PaginationWrapper
        handlePageSelect={handlePageSelect}
        currentPage={currentPage}
        totalPages={totalPages}
        results={results}
        shouldRender={shouldRender}
      />,
    );

    expect(wrapper.find('ForwardRef(VaPagination)').length).to.equal(0);
    wrapper.unmount();
  });

  it('Should not render if results is undefined', () => {
    const currentPage = 1;
    const totalPages = 2;
    const shouldRender = true;

    const wrapper = shallow(
      <PaginationWrapper
        handlePageSelect={handlePageSelect}
        currentPage={currentPage}
        totalPages={totalPages}
        shouldRender={shouldRender}
      />,
    );

    expect(wrapper.find('ForwardRef(VaPagination)').length).to.equal(0);
    wrapper.unmount();
  });

  it('Should not render if totalPages < 2', () => {
    const currentPage = 1;
    const totalPages = 1;
    const results = [1, 2];
    const shouldRender = true;

    const wrapper = shallow(
      <PaginationWrapper
        handlePageSelect={handlePageSelect}
        currentPage={currentPage}
        totalPages={totalPages}
        results={results}
        shouldRender={shouldRender}
      />,
    );

    expect(wrapper.find('ForwardRef(VaPagination)').length).to.equal(0);
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
