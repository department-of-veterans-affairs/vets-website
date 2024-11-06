import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import LicenseCertificationSearchResults from '../../containers/LicenseCertificationSearchResults';

const mockStore = configureMockStore();
const store = mockStore({
  licenseCertificationSearch: {
    fetchingLc: false,
    hasFetchedOnce: true,
    lcResults: [
      { link: '/sample-link-1', type: 'Certification', name: 'Sample Name 1' },
      { link: '/sample-link-2', type: 'Certification', name: 'Sample Name 2' },
    ],
  },
});

describe('<LicenseCertificationSearchResults />', () => {
  it('should render without crashing', () => {
    const wrapper = shallow(
      <Provider store={store}>
        <LicenseCertificationSearchResults />
      </Provider>,
    );

    expect(wrapper.exists()).to.be.ok;
    wrapper.unmount();
  });
});
