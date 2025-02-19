import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router-dom-v5-compat';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { parse } from 'date-fns';
import ResponseInboxPage from '../../containers/ResponseInboxPage';
import { mockInquiryResponse } from '../../utils/mockData';
import { convertDateForInquirySubheader } from '../../config/helpers';

describe('ResponseInboxPage', () => {
  // TODO: This check for mock data use needs to be replaced.
  //       Use a combo of environment.isProduction() and flipper API.
  //       Try not to use app-level mocks in deployable code.
  //       The chance of the mock data accidentally creeping into
  //       production is too high. joehall-tw
  const HOST_FOR_APP_MOCK_DATA = 'http://localhost:3000';
  const HOST_FOR_TST_MOCK_DATA = 'Any other string.';

  const originalWindowLocation = window.location;
  const mockStore = configureMockStore([]);
  let store;
  let props;
  let fetchStub;
  let environmentStub;

  beforeEach(() => {
    fetchStub = sinon.stub(global, 'fetch');
    environmentStub = sinon.stub(environment, 'API_URL');
    environmentStub.returns(HOST_FOR_TST_MOCK_DATA);

    props = {
      data: {},
      setFormData: sinon.spy(),
      goBack: sinon.spy(),
      goForward: sinon.spy(),
      injectMockFlagForAPI: true,
    };

    store = mockStore({
      askVA: {
        currentUserLocation: '123456',
        searchLocationInput: '',
        getLocationInProgress: false,
        getLocationError: false,
        facilityData: null,
        validationError: null,
      },
      navigation: {
        route: {
          path: '987654',
        },
      },
      user: {
        login: {
          currentlyLoggedIn: true,
        },
      },
    });
  });

  afterEach(() => {
    fetchStub.restore();
    environmentStub.restore();
    store.clearActions();
    window.location = originalWindowLocation;
  });

  // TODO: Can the component be driven by the router or component state
  //       instead of window.location? joehall-tw
  const overridePathname = url => {
    Object.defineProperty(window, 'location', {
      value: {
        href: url,
        pathname: url,
      },
      writable: true,
    });
  };

  const updateStore = (customState = {}) => {
    if (Object.keys(customState).length) {
      store = mockStore({
        askVA: {
          ...store.getState().askVA,
          ...customState,
        },
        navigation: {
          route: {
            path: '/test-path',
          },
        },
        user: {
          ...store.getState().user,
        },
      });
    }
  };

  const mountWithStore = (customState = {}) => {
    updateStore(customState);

    return mount(
      <Provider store={store}>
        <MemoryRouter>
          <ResponseInboxPage {...props} />
        </MemoryRouter>
      </Provider>,
    );
  };

  // TODO: This logic was copied from the component. Revisit. joehall-tw
  const getReplySubHeader = messageType => {
    if (!messageType) return 'No messageType';
    if (messageType === 'ResponseFromVA') return 'Response from VA';
    if (messageType === 'ReplyToVA') return 'Reply to VA';
    // Split the string at capital letters and join with spaces
    return messageType.split(/(?=[A-Z])/).join(' ');
  };

  // TODO: This logic was copied from the component. Revisit. joehall-tw
  const getMockInquiryResponseFormatted = () => {
    return mockInquiryResponse.data.attributes.correspondences.data
      .filter(item => item.attributes.messageType !== 'Notification')
      .map(corr => ({
        ...corr,
        attributes: {
          ...corr.attributes,
          createdOn: convertDateForInquirySubheader(corr.attributes.createdOn),
          modifiedOn: convertDateForInquirySubheader(
            corr.attributes.modifiedOn,
          ),
          originalCreatedOn: corr.attributes.createdOn,
        },
      }))
      .sort((a, b) => {
        const dateA = parse(
          a.attributes.originalCreatedOn,
          'MM/dd/yyyy h:mm:ss a',
          new Date(),
        );
        const dateB = parse(
          b.attributes.originalCreatedOn,
          'MM/dd/yyyy h:mm:ss a',
          new Date(),
        );
        return dateA.getTime() - dateB.getTime();
      });
  };

  it('should render loading state', () => {
    const wrapper = mountWithStore({});

    expect(wrapper.find('va-loading-indicator').exists()).to.be.true;
    wrapper.unmount();
  });

  it('should render error state', async () => {
    overridePathname('/contact-us/ask-va/introduction/111');

    const wrapper = mountWithStore();

    fetchStub.resolves({
      ok: false,
      json: () => Promise.reject(new Error('API Error')),
    });

    await new Promise(resolve => setTimeout(resolve, 0));
    wrapper.update();

    expect(wrapper.find('va-alert[status="error"]').exists()).to.be.true;
    wrapper.unmount();
  });

  it('should render with data using API response', async () => {
    overridePathname('/contact-us/ask-va/introduction/222');
    fetchStub.resolves({
      ok: true,
      headers: {
        get: param => (param === 'Content-Type' ? `application/json` : ''),
      },
      json: () => Promise.resolve(mockInquiryResponse),
    });

    const wrapper = mountWithStore();

    await new Promise(resolve => setTimeout(resolve, 0));
    // await new Promise(resolve => setImmediate(resolve));
    wrapper.update();

    expect(wrapper.find('h2').length).to.be.greaterThan(0);
    expect(
      wrapper
        .find('h2')
        .first()
        .text(),
    ).to.equal('Your conversation');

    const accordionItems = wrapper.find('va-accordion va-accordion-item');
    expect(accordionItems).to.exist;

    // Compare formatted correspondence data with rendered accordions
    const replies = getMockInquiryResponseFormatted();
    for (let index = 0; index < accordionItems.length; index++) {
      const msgType =
        index === 0
          ? 'Your question'
          : replies[index - 1].attributes.messageType;
      const header = index === 0 ? 'Your question' : getReplySubHeader(msgType);

      const accordionItemHTML = `${wrapper
        .find('va-accordion va-accordion-item')
        .at(index)
        .html()} <!-- accordionItemHTML ${index} ${msgType} -->`;

      expect(accordionItemHTML).to.contain(`header="${header}"`);
    }

    wrapper.unmount();
  });

  // TODO: Really need to use flipper API vs env.API_URL. Revisit.
  //       Also, mock data shouldn't be stored in app.
  //       This test only exists to test the app's mock data codepath.
  //       joehall-tw
  it('should render with data using mockApiData', async () => {
    overridePathname('/contact-us/ask-va/introduction/333');
    environmentStub.returns(HOST_FOR_APP_MOCK_DATA); // TODO: Revisit. joehall-tw

    fetchStub.resolves({
      ok: true,
      headers: {
        get: param => (param === 'Content-Type' ? `application/json` : ''),
      },
      json: () => Promise.resolve(mockInquiryResponse),
    });

    const wrapper = mountWithStore();

    await new Promise(resolve => setTimeout(resolve, 0));
    // await new Promise(resolve => setImmediate(resolve));
    wrapper.update();

    expect(wrapper.find('h2').length).to.be.greaterThan(0);
    expect(
      wrapper
        .find('h2')
        .first()
        .text(),
    ).to.equal('Your conversation');

    const accordionItems = wrapper.find('va-accordion va-accordion-item');
    expect(accordionItems).to.exist;

    // Compare formatted correspondence data with rendered accordions
    const replies = getMockInquiryResponseFormatted();
    for (let index = 0; index < accordionItems.length; index++) {
      const msgType =
        index === 0
          ? 'Your question'
          : replies[index - 1].attributes.messageType;
      const header = index === 0 ? 'Your question' : getReplySubHeader(msgType);

      const accordionItemHTML = `${wrapper
        .find('va-accordion va-accordion-item')
        .at(index)
        .html()} <!-- accordionItemHTML ${index} ${msgType} -->`;

      expect(accordionItemHTML).to.contain(`header="${header}"`);
    }

    wrapper.unmount();
  });

  // it.skip('should render with inquiries', async () => {
  //   overridePathname('/contact-us/ask-va/introduction/');

  //   console.log('-------------------------');
  //   console.log('--- RENDERS WITH INQs ---');
  //   console.log('-------------------------');

  //   fetchStub.resolves({
  //     ok: true,
  //     // json: () => Promise.resolve({ data: mockInquiryResponse.data }),
  //     json: () => Promise.resolve(mockInquiries),
  //   });

  //   const wrapper = mountWithStore();

  //   await new Promise(resolve => setTimeout(resolve, 0));
  //   // await new Promise(resolve => setImmediate(resolve));
  //   wrapper.update();

  //   console.log(wrapper.debug());
  //   console.log('-------------------');

  //   expect(wrapper.find('h2').text()).to.equal('Your questions');
  //   // expect(wrapper.find('va-accordion-item').length).to.equal(
  //   //   mockInquiryResponse.data.attributes.correspondences.data.length + 1,
  //   // );
  //   wrapper.unmount();
  // });

  // TODO: I'm not 100% confident that this is a great test. Revist?
  //       Seems like postApiData in component still isn't triggered.
  //       joehall-tw
  it('should handle form submission', async () => {
    overridePathname('/contact-us/ask-va/introduction/444');

    fetchStub.resolves({
      ok: true,
      headers: {
        get: param => (param === 'Content-Type' ? `application/json` : ''),
      },
      json: () => Promise.resolve(mockInquiryResponse),
    });

    const wrapper = mountWithStore();

    await new Promise(resolve => setTimeout(resolve, 0));
    // await new Promise(resolve => setImmediate(resolve));
    wrapper.update();

    fetchStub.restore();
    fetchStub.resolves({
      ok: true,
      headers: {
        get: param => (param === 'Content-Type' ? `application/json` : ''),
      },
      json: () => Promise.resolve({}),
    });

    wrapper.find('va-textarea').simulate('change', {
      target: { value: 'Test reply' },
    });

    wrapper.find('va-button[aria-label="Submit reply"]').simulate('click');

    expect(fetchStub.called).to.be.true;
    wrapper.unmount();
  });
});
