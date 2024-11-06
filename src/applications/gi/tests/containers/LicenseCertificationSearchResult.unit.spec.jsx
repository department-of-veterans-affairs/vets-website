import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import LicenseCertificationSearchResult from '../../containers/LicenseCertificationSearchResult';

const mockStore = configureMockStore();
const store = mockStore({
  licenseCertificationSearch: {
    hasFetchedResult: true,
    lcResultInfo: {
      institution: {
        name: 'Sample Institution',
        phone: '123-456-7890',
        physicalStreet: '123 Main St',
        physicalCity: 'Sample City',
        physicalState: 'CA',
        physicalZip: '90210',
        physicalCountry: 'USA',
      },
      tests: [
        { name: 'Sample Test 1', fee: 200 },
        { name: 'Sample Test 2', fee: 300 },
      ],
    },
  },
});

describe('<LicenseCertificationSearchResult />', () => {
  it('should render without crashing', () => {
    const result = {
      link: '/sample-link',
      type: 'Sample Type',
      name: 'Sample Name',
    };

    const wrapper = shallow(
      <Provider store={store}>
        <LicenseCertificationSearchResult result={result} />
      </Provider>,
    );

    expect(wrapper.exists()).to.be.ok;
    wrapper.unmount();
  });
});
