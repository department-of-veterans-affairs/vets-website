import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import CCProviderResult from '../../components/search-results-items/CCProviderResult';
import testData from '../../constants/mock-facility-data-v2.json';

describe('CCProviderResult With Training', () => {
  it('Should render CCProviderResult, serviceType Podiatrist without training', async () => {
    const query = {
      facilityType: 'provider',
      serviceType: '213E00000X', // Podiatrist
    };
    const wrapper = render(
      <CCProviderResult provider={testData.data[0]} query={query} />,
    );
    // should not exist because no trainings
    expect(wrapper.queryAllByTestId('training-a')).to.have.length(0);
    wrapper.unmount();
  });

  it('Should render CCProviderResult, serviceType Podiatrist with 1 training', async () => {
    const query = {
      facilityType: 'provider',
      serviceType: '213E00000X', // Podiatrist
    };
    const wrapper = render(
      <CCProviderResult provider={testData.data[1]} query={query} />,
    );
    expect(wrapper.queryAllByTestId('training-b')).to.have.length(1);
    wrapper.unmount();
  });

  it('Should render CCProviderResult, serviceType Podiatrist with 3 training', async () => {
    const query = {
      facilityType: 'provider',
      serviceType: '213E00000X', // Podiatrist
    };
    const wrapper = render(
      <CCProviderResult provider={testData.data[2]} query={query} />,
    );
    // stll one <p> about core training despite having 3 trainings that fall into that category
    expect(wrapper.queryAllByTestId('training-c')).to.have.length(1);
    wrapper.unmount();
  });
});
