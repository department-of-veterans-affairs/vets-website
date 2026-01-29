// PaginationMeta.unit.spec.jsx
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import * as ReactRouter from 'react-router-dom';
import { ProfileContext } from '../../../context/ProfileContext';
import PaginationMeta from '../../../components/PaginationMeta';

describe('PaginationMeta', () => {
  const defaults = {
    SIZE: 5,
    NUMBER: 1,
    SORT_ORDER: 'desc',
  };
  const contextValue = {
    firstName: 'Test',
    lastName: 'User',
    verified: true,
    signIn: () => {},
    loa: { level: 3 },
  };
  let useSearchParamsStub;
  beforeEach(() => {
    const searchParams = new URLSearchParams(
      '?status=processed&sortOrder=asc&sortBy=resolved_at&pageNumber=1&pageSize=20&as_selected_individual=true',
    );

    useSearchParamsStub = sinon
      .stub(ReactRouter, 'useSearchParams')
      .returns([searchParams, () => {}]);
  });

  afterEach(() => {
    useSearchParamsStub.restore();
  });
  it('renders without crashing with minimal props', () => {
    const meta = {
      page: {
        number: 1,
        size: 20,
        total: 24,
        totalPages: 2,
      },
    };
    const results = Array(5).fill({});
    const wrapper = mount(
      <ProfileContext.Provider value={contextValue}>
        <PaginationMeta
          meta={meta}
          results={results}
          defaults={defaults}
          resultType="requests"
        />
      </ProfileContext.Provider>,
    );
    expect(wrapper.exists()).to.be.true;
    wrapper.unmount();
  });

  it('renders with custom search params', () => {
    const meta = {
      page: {
        number: 2,
        size: 10,
        total: 23,
        totalPages: 2,
      },
    };
    const results = Array(5).fill({});
    const wrapper = mount(
      <ProfileContext.Provider value={contextValue}>
        <PaginationMeta
          meta={meta}
          results={results}
          defaults={defaults}
          resultType="requests"
        />
      </ProfileContext.Provider>,
    );

    const text = wrapper.text();
    expect(text).to.include(
      'Showing 1-20 of 23 processed requests for "You (test user)" sorted by “Processed date (oldest)”',
    );
    wrapper.unmount();
  });

  it('handles last page with fewer results than pageSize', () => {
    const meta = {
      page: {
        number: 1,
        size: 5,
        total: 12,
        totalPages: 3,
      },
    };
    const results = Array(2).fill({});

    const wrapper = mount(
      <ProfileContext.Provider value={contextValue}>
        <PaginationMeta
          meta={meta}
          results={results}
          defaults={defaults}
          resultType="requests"
        />
      </ProfileContext.Provider>,
    );

    const text = wrapper.text();
    expect(text).to.include(
      'Showing 1-12 of 12 processed requests for "You (test user)" sorted by “Processed date (oldest)”',
    );
    wrapper.unmount();
  });

  it('handles empty results on first page gracefully', () => {
    const meta = {
      page: {
        number: 1,
        size: 20,
        total: 0,
        totalPages: 1,
      },
    };

    const results = [];

    const wrapper = mount(
      <ProfileContext.Provider value={contextValue}>
        <PaginationMeta
          meta={meta}
          results={results}
          defaults={defaults}
          resultType="requests"
        />
      </ProfileContext.Provider>,
    );

    const text = wrapper.text();
    expect(text).to.include(
      'Showing 0 processed requests for "You (test user)" sorted by “Processed date (oldest)”',
    );
    wrapper.unmount();
  });

  it('renders without resultType', () => {
    const meta = {
      page: {
        number: 1,
        size: 5,
        total: 10,
        totalPages: 2,
      },
    };

    const results = [{}];

    const wrapper = mount(
      <ProfileContext.Provider value={contextValue}>
        <PaginationMeta
          meta={meta}
          results={results}
          defaults={defaults}
          resultType="requests"
        />
      </ProfileContext.Provider>,
    );

    const text = wrapper.text();
    expect(text).to.include(
      'Showing 1-10 of 10 processed requests for "You (test user)" sorted by “Processed date (oldest)”',
    );
    wrapper.unmount();
  });
});
