import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import { merge } from 'lodash';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom-v5-compat';
import { createStore } from 'redux';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import { AppealInfo } from '../../../containers/AppealInfo';
import { mockData } from '../../../utils/helpers';
import {
  USER_FORBIDDEN_ERROR,
  RECORD_NOT_FOUND_ERROR,
  VALIDATION_ERROR,
  BACKEND_SERVICE_ERROR,
  FETCH_APPEALS_ERROR,
} from '../../../actions/types';
import { renderWithRouter } from '../../utils';

const appealIdParam = mockData.data[0].id;

const TestComponent = () => <div data-testid="children" />;

const AVAILABLE = 'AVAILABLE';

const getStore = () => createStore(() => ({}));
const defaultProps = {
  params: { id: appealIdParam },
  appeal: mockData.data[0],
  appealsLoading: false,
  appealsAvailability: AVAILABLE,
  getAppealsV2: () => {},
};

describe('<AppealInfo>', () => {
  it('should render', () => {
    const wrapper = shallow(<AppealInfo {...defaultProps} />);
    expect(wrapper.type()).to.equal('div');
    wrapper.unmount();
  });

  it('should render its children', () => {
    const screen = render(
      <Provider store={getStore()}>
        <MemoryRouter>
          <Routes>
            <Route element={<AppealInfo {...defaultProps} />}>
              <Route index element={<TestComponent />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByTestId('children')).to.exist;
  });

  it('should render va-loading-indicator when appeals loading', () => {
    const props = { params: { id: appealIdParam }, appealsLoading: true };
    const wrapper = shallow(<AppealInfo {...props} />, {
      disableLifecycleMethods: true,
    });
    const loadingIndicator = wrapper.find('va-loading-indicator');
    expect(loadingIndicator.length).to.equal(1);
    wrapper.unmount();
  });

  it('should render the breadcrumbs', () => {
    const { container } = renderWithRouter(
      <Provider store={getStore()}>
        <AppealInfo {...defaultProps} />
      </Provider>,
    );

    const breadcrumbs = $('va-breadcrumbs', container);
    expect(breadcrumbs.breadcrumbList.length).to.equal(3);
  });

  it('should render a header for legacy', () => {
    const wrapper = shallow(<AppealInfo {...defaultProps} />);
    const header = wrapper.find('AppealHeader');
    expect(header.length).to.equal(1);
    wrapper.unmount();
  });

  it('should render a header for supplementalClaim', () => {
    const props = {
      params: { id: mockData.data[3].id },
      appeal: mockData.data[3],
      appealsLoading: false,
      appealsAvailability: AVAILABLE,
      getAppealsV2: () => {},
    };
    const wrapper = shallow(<AppealInfo {...props} />);
    const header = wrapper.find('AppealHeader');
    expect(header.length).to.equal(1);
    wrapper.unmount();
  });

  it('should render a header for higherLevelReview', () => {
    const props = {
      params: { id: mockData.data[4].id },
      appeal: mockData.data[4],
      appealsLoading: false,
      appealsAvailability: AVAILABLE,
      getAppealsV2: () => {},
    };
    const wrapper = shallow(<AppealInfo {...props} />);
    const header = wrapper.find('AppealHeader');
    expect(header.length).to.equal(1);
    wrapper.unmount();
  });

  it('should render a header for appeal', () => {
    const props = {
      params: { id: mockData.data[5].id },
      appeal: mockData.data[5],
      appealsLoading: false,
      appealsAvailability: AVAILABLE,
      getAppealsV2: () => {},
    };
    const wrapper = shallow(<AppealInfo {...props} />);
    const header = wrapper.find('AppealHeader');
    expect(header.length).to.equal(1);
    wrapper.unmount();
  });

  it('should render a tabbed navigator', () => {
    const wrapper = shallow(<AppealInfo {...defaultProps} />);
    const tabNavs = wrapper.find('AppealsV2TabNav');
    expect(tabNavs.length).to.equal(1);
    wrapper.unmount();
  });

  it('should render CopyOfExam block', () => {
    const children = <span className="test">Child Goes Here</span>;
    const props = merge({}, { children }, defaultProps);
    const mockStore = {
      getState: () => ({
        featureToggles: {
          // eslint-disable-next-line camelcase
          omni_channel_link: true,
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };

    const elem = (
      <Provider store={mockStore}>
        <AppealInfo {...props} />
      </Provider>
    );

    const wrapper = mount(
      <MemoryRouter>
        <Routes>
          <Route index element={elem} />
        </Routes>
      </MemoryRouter>,
    );
    expect(wrapper.find('CopyOfExam').length).to.equal(1);
    wrapper.unmount();
  });

  it('should have access to the appeal id in route params', () => {
    const wrapper = shallow(<AppealInfo {...defaultProps} />);
    const appealId = wrapper.instance().props.params.id;
    expect(appealId).to.equal(appealIdParam);
    wrapper.unmount();
  });

  it('should render ServiceUnavailableAlert when user forbidden', () => {
    const props = {
      ...defaultProps,
      appealsAvailability: USER_FORBIDDEN_ERROR,
    };
    const wrapper = shallow(<AppealInfo {...props} />);
    expect(wrapper.find('ServiceUnavailableAlert').length).to.equal(1);
    wrapper.unmount();
  });

  it('should render no records warning when RECORD_NOT_FOUND_ERROR present', () => {
    const props = {
      ...defaultProps,
      appealsAvailability: RECORD_NOT_FOUND_ERROR,
    };
    const wrapper = shallow(<AppealInfo {...props} />);
    expect(wrapper.find('#recordsNotFoundMessage').length).to.equal(1);
    wrapper.unmount();
  });

  it('should render ServiceUnavailableAlert when VALIDATION_ERROR present', () => {
    const props = { ...defaultProps, appealsAvailability: VALIDATION_ERROR };
    const wrapper = shallow(<AppealInfo {...props} />);
    expect(wrapper.find('ServiceUnavailableAlert').length).to.equal(1);
    wrapper.unmount();
  });

  it('should render ServiceUnavailableAlert when BACKEND_SERVICE_ERROR present', () => {
    const props = {
      ...defaultProps,
      appealsAvailability: BACKEND_SERVICE_ERROR,
    };
    const wrapper = shallow(<AppealInfo {...props} />);
    expect(wrapper.find('ServiceUnavailableAlert').length).to.equal(1);
    wrapper.unmount();
  });

  it('should render ServiceUnavailableAlert when FETCH_APPEALS_ERROR present', () => {
    const props = { ...defaultProps, appealsAvailability: FETCH_APPEALS_ERROR };
    const wrapper = shallow(<AppealInfo {...props} />);
    expect(wrapper.find('ServiceUnavailableAlert').length).to.equal(1);
    wrapper.unmount();
  });

  it('should render ServiceUnavailableAlert when other error present', () => {
    const props = { ...defaultProps, appealsAvailability: 'SOME_OTHER_ERROR' };
    const wrapper = shallow(<AppealInfo {...props} />);
    expect(wrapper.find('ServiceUnavailableAlert').length).to.equal(1);
    wrapper.unmount();
  });
});
