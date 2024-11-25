import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import { shallow } from 'enzyme';
// import { renderWithStoreAndRouter } from '../helpers';
import createCommonStore from 'platform/startup/store';
import { Provider } from 'react-redux';
import LicenseCertificationSearchResults from '../../containers/LicenseCertificationSearchResults';
import reducer from '../../reducers';

const commonStore = createCommonStore(reducer);

describe('<LicenseCertificationSearchResults />', () => {
  it('should render', () => {
    const wrapper = shallow(
      <Provider store={commonStore}>
        <LicenseCertificationSearchResults
          dispatchFetchLicenseCertificationResults={() => {}}
          lcResults={[]}
          fetchingLc
          hasFetchedOnce={false}
        />
      </Provider>,
    );

    waitFor(() => {
      expect(wrapper).to.not.be.null;
    });

    wrapper.unmount();
  });
});
