import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import * as reactRedux from 'react-redux';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';
import MoreInfoCard from '../../components/MoreInfoCard';

const mockStore = configureStore([]);
const initialState = {
  personalInfo: {},
};
const store = mockStore(initialState);
describe('when <MoreInfoCard/> renders', () => {
  it('Should render without crashing', () => {
    const wrapper = mount(
      <Provider store={store}>
        <MoreInfoCard />
      </Provider>,
    );
    expect(wrapper.exists()).to.be.ok;
    wrapper.unmount();
  });
  it('renders null if response.error.error is "Forbidden"', () => {
    const useSelectorStub = sinon.stub(reactRedux, 'useSelector');
    useSelectorStub.returns({ error: { error: 'Forbidden' } });

    const wrapper = shallow(
      <MoreInfoCard
        marginTop="3"
        linkText="Example Link"
        relativeURL="/example"
        URL="https://example.com"
        className="example-class"
        linkDescription="Example description"
      />,
    );
    expect(wrapper.type()).to.equal(null);
    useSelectorStub.restore();
    wrapper.unmount();
  });
});
