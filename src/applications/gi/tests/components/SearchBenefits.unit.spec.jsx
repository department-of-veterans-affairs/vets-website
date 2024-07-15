import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { waitFor } from '@testing-library/react';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import SearchBenefits from '../../components/SearchBenefits';

const mockStore = configureStore([]);
const getData = ({
  // areFeatureTogglesLoading = true,
  hasFeatureFlag = true,
} = {}) => {
  return {
    featureToggles: {
      // loading: areFeatureTogglesLoading,
      // eslint-disable-next-line camelcase
      militaryBenefitEstimates: hasFeatureFlag,
    },
  };
};
const initialState = getData();
const store = mockStore(initialState);
// beforeEach(() => {
//   window.isProd = true;
// });
describe('SearchBenefits', () => {
  it('it should handle change correctly', async () => {
    window.isProd = true;
    const setGiBillChapter = sinon.spy();
    const setMilitaryStatus = sinon.spy();
    const wrapper = mount(
      <Provider store={store}>
        <SearchBenefits
          giBillChapter=""
          militaryStatus=""
          setGiBillChapter={setGiBillChapter}
          setMilitaryStatus={setMilitaryStatus}
          setSpouseActiveDuty={() => {}}
        />
      </Provider>,
    );
    const event = { target: { name: 'militaryStatus', value: 'active duty' } };
    const event2 = {
      target: { name: 'militaryStatus', value: 'national guard / reserves' },
    };
    await waitFor(() => {
      wrapper
        .find('[name="militaryStatus"]')
        .at(1)
        .simulate('change', event);
      wrapper
        .find('[name="militaryStatus"]')
        .at(1)
        .simulate('change', event2);
      expect(setMilitaryStatus.calledWith('active duty')).to.be.true;
      expect(setMilitaryStatus.calledWith('national guard / reserves')).to.be
        .true;
      const event3 = { target: { name: 'giBillChapter', value: '33b' } };
      const event4 = { target: { name: 'giBillChapter', value: '30' } };
      const event5 = { target: { name: 'giBillChapter', value: '1606' } };
      const event6 = { target: { name: 'giBillChapter', value: '31' } };
      const event7 = { target: { name: 'giBillChapter', value: '35' } };
      const event8 = { target: { name: 'giBillChapter', value: '33a' } };
      wrapper
        .find('[name="giBillChapter"]')
        .at(1)
        .simulate('change', event3);
      wrapper
        .find('[name="giBillChapter"]')
        .at(1)
        .simulate('change', event4);
      wrapper
        .find('[name="giBillChapter"]')
        .at(1)
        .simulate('change', event5);
      wrapper
        .find('[name="giBillChapter"]')
        .at(1)
        .simulate('change', event6);
      wrapper
        .find('[name="giBillChapter"]')
        .at(1)
        .simulate('change', event7);
      wrapper
        .find('[name="giBillChapter"]')
        .at(1)
        .simulate('change', event8);
      expect(setGiBillChapter.calledWith('33b')).to.be.true;
      expect(setGiBillChapter.calledWith('30')).to.be.true;
      expect(setGiBillChapter.calledWith('1606')).to.be.true;
      expect(setGiBillChapter.calledWith('31')).to.be.true;
      expect(setGiBillChapter.calledWith('35')).to.be.true;
      expect(setGiBillChapter.calledWith('33a')).to.be.true;
    });

    wrapper.unmount();
  });

  it('should render warning Post when militaryStatus === active duty', async () => {
    window.isProd = false;
    const props = {
      militaryStatus: 'active duty',
      giBillChapter: '33b',
      chapter33Check: '33b',
    };
    const wrapper = mount(
      <Provider store={store}>
        <SearchBenefits {...props} />
      </Provider>,
    );
    await waitFor(() => {
      const div = wrapper.find('div.military-status-info.warning.form-group');
      expect(div.text()).to.equal(
        'Post 9/11 GI Bill recipients serving on Active Duty (or transferee spouses of a service member on active duty) are not eligible to receive a monthly housing allowance.',
      );
    });

    wrapper.unmount();
  });
  it('should update spouseActiveDuty when Dropdown onChange is triggered', async () => {
    window.isProd = false;
    const setSpouseActiveDuty = sinon.spy();
    const props = {
      militaryStatus: 'spouse',
    };
    const wrapper = mount(
      <Provider store={store}>
        <SearchBenefits setSpouseActiveDuty={setSpouseActiveDuty} {...props} />
      </Provider>,
    );
    await waitFor(() => {
      const dropdown = wrapper.find('Dropdown[name="spouseActiveDuty"]');

      dropdown.simulate('change', { target: { value: 'yes' } });

      expect(setSpouseActiveDuty.calledOnce).to.equal(false);
      expect(setSpouseActiveDuty.calledWith('yes')).to.equal(false);
    });

    wrapper.unmount();
  });
  it('should update cumulativeService when Dropdown onChange is triggered', async () => {
    const props = {
      giBillChapter: '33a',
    };
    const setCumulativeService = sinon.spy();
    const wrapper = mount(
      <Provider store={store}>
        {' '}
        <SearchBenefits
          setCumulativeService={setCumulativeService}
          {...props}
        />
      </Provider>,
    );
    const dropdown = wrapper.find('Dropdown[name="cumulativeService"]');
    await waitFor(() => {
      dropdown.simulate('change', { target: { value: '0.9' } });

      expect(setCumulativeService.calledOnce).to.equal(false);
      expect(setCumulativeService.calledWith('0.9')).to.equal(false);
    });

    wrapper.unmount();
  });
  it('should update giBillChapter when Dropdown onChange is triggered', async () => {
    const setGiBillChapter = sinon.spy();
    const setMilitaryStatus = sinon.spy();
    const wrapper = mount(
      <Provider store={store}>
        <SearchBenefits
          setGiBillChapter={setGiBillChapter}
          setMilitaryStatus={setMilitaryStatus}
        />
      </Provider>,
    );

    const dropdown = wrapper.find('Dropdown[name="giBillChapter"]');
    dropdown.simulate('change', { target: { value: '33b' } });
    await waitFor(() => {
      expect(setGiBillChapter.calledOnce).to.equal(false);
      expect(setGiBillChapter.calledWith('33b')).to.equal(false);
    });

    wrapper.unmount();
  });
  it('should update enlistmentService when Dropdown onChange is triggered', () => {
    const setEnlistmentService = sinon.spy();
    const props = {
      giBillChapter: '30',
    };
    const wrapper = mount(
      <Provider store={store}>
        <SearchBenefits
          setEnlistmentService={setEnlistmentService}
          {...props}
        />
      </Provider>,
    );

    const dropdown = wrapper.find('Dropdown[name="enlistmentService"]');
    dropdown.simulate('change', { target: { value: '3' } });
    expect(dropdown.props().value).to.equal('3');
    wrapper.unmount();
  });
});
