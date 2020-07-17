import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';

import createCommonStore from 'platform/startup/store';
import { LandingPage } from '../../containers/LandingPage';
import reducer from '../../reducers';

const defaultStore = createCommonStore(reducer);
const defaultProps = {
  ...defaultStore.getState(),
  showModal: sinon.spy(),
  setPageTitle: sinon.spy(),
  eligibilityChange: sinon.spy(),
};

describe('<LandingPage>', () => {
  it('should render', () => {
    const tree = shallow(<LandingPage {...defaultProps} />);
    expect(tree).to.not.be.undefined;
    tree.unmount();
  });

  it('should handleSubmit correctly', () => {
    const props = {
      ...defaultProps,
      router: { push: sinon.spy() },
      location: { query: {} },
      autocomplete: { searchTerm: 'foo' },
      handleSubmit: sinon.spy(),
    };

    const tree = mount(
      <Provider store={defaultStore}>
        <LandingPage {...props} />
      </Provider>,
    );
    tree.find('form').simulate('submit');
    expect(props.router.push.called).to.be.true;
    tree.unmount();
  });

  it('should display VET TEC type of institution filter', () => {
    const props = {
      ...defaultProps,
      router: { push: sinon.spy() },
      location: { query: {} },
      autocomplete: { searchTerm: null },
      renderVetTecLogo: sinon.spy(),
    };

    const store = {
      ...defaultStore,
      state: {
        ...defaultProps,
        eligibility: {
          ...defaultProps.eligibility,
          militaryStatus: 'veteran',
          giBillChapter: '33',
        },
      },
    };
    const tree = mount(
      <Provider store={store}>
        <LandingPage {...props} />
      </Provider>,
    );

    const vetTecOption = tree
      .find('LandingPageTypeOfInstitutionFilter')
      .find('RadioButtons')
      .find('span')
      .find('button');
    expect(vetTecOption.text()).to.equal('(Learn more)');
    tree.unmount();
  });
});
