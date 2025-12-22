import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router-dom-v5-compat';
import * as apiModule from '@department-of-veterans-affairs/platform-utilities/api';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { parse } from 'date-fns';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResponseInboxPage from '../../containers/ResponseInboxPage';
import { mockInquiryResponse } from '../../utils/mockData';
import { convertDateForInquirySubheader } from '../../config/helpers';
import * as FileUploadModule from '../../components/FileUpload';
import * as constants from '../../constants';
import { createMockStore, mockRouterProps } from '../common';
import { askVAAttachmentStorage } from '../../utils/StorageAdapter';

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
  let apiRequestStub;
  let FileUploadStub;
  let askVAAttachmentStorageGetStub;
  let askVAAttachmentStorageClearStub;

  beforeEach(() => {
    global.window.URL = {
      createObjectURL: () => {},
      revokeObjectURL: () => {},
    };
    fetchStub = sinon.stub(global, 'fetch');
    apiRequestStub = sinon.stub(apiModule, 'apiRequest');
    environmentStub = sinon.stub(environment, 'API_URL');
    environmentStub.returns(HOST_FOR_TST_MOCK_DATA);
    FileUploadStub = sinon
      .stub(FileUploadModule, 'default')
      .callsFake(() => <div>FileUpload</div>);
    askVAAttachmentStorageGetStub = sinon
      .stub(askVAAttachmentStorage, 'get')
      .resolves([]);
    askVAAttachmentStorageClearStub = sinon
      .stub(askVAAttachmentStorage, 'clear')
      .resolves();

    props = {
      data: {},
      setFormData: sinon.spy(),
      goBack: sinon.spy(),
      goForward: sinon.spy(),
      injectMockFlagForAPI: true,
    };

    store = mockStore({
      askVA: {
        currentUserLocation: [],
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
    apiRequestStub.restore();
    fetchStub.restore();
    environmentStub.restore();
    store.clearActions();
    FileUploadStub.restore();
    window.location = originalWindowLocation;
    localStorage.removeItem('askVAFiles');
    askVAAttachmentStorageGetStub.restore();
    askVAAttachmentStorageClearStub.restore();
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

  const renderWithStore = (customState = {}) => {
    updateStore(customState);

    return render(
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
    apiRequestStub.rejects();

    const wrapper = mountWithStore();

    await new Promise(resolve => setTimeout(resolve, 0));
    wrapper.update();

    expect(wrapper.find('va-alert[status="error"]').exists()).to.be.true;
    wrapper.unmount();
  });

  it('should render with data using API response', async () => {
    overridePathname('/contact-us/ask-va/introduction/222');
    apiRequestStub.resolves(mockInquiryResponse);

    const wrapper = mountWithStore();

    await new Promise(resolve => setTimeout(resolve, 0));
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
    apiRequestStub.resolves(mockInquiryResponse);

    const wrapper = mountWithStore();

    await new Promise(resolve => setTimeout(resolve, 0));
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

  it('should render with inquiries', async () => {
    overridePathname('/user/dashboard/A-20241219-308852');
    apiRequestStub.resolves(mockInquiryResponse);

    const { container, getByRole } = renderWithStore();

    await waitFor(() => {
      getByRole('heading', { name: 'Question details', level: 1 });
      getByRole('heading', { name: 'Your conversation', level: 2 });
      getByRole('heading', { name: 'Send a reply', level: 2 });
      expect(
        container.querySelector('va-accordion-item[header="Your question"]'),
      ).to.exist;
    });
  });

  it('should render with inquiries using mockTestingFlagForAPI', async () => {
    const mockTestingFlagStub = sinon
      .stub(constants, 'getMockTestingFlagforAPI')
      .returns(true);
    overridePathname('/user/dashboard/A-20241219-308852');
    apiRequestStub.resolves(mockInquiryResponse);

    const { container, getByRole } = renderWithStore();

    await waitFor(() => {
      getByRole('heading', { name: 'Question details', level: 1 });
      getByRole('heading', { name: 'Your conversation', level: 2 });
      getByRole('heading', { name: 'Send a reply', level: 2 });
      expect(
        container.querySelector('va-accordion-item[header="Your question"]'),
      ).to.exist;
      mockTestingFlagStub.restore();
    });
  });

  it('should be able to download an attachment', async () => {
    overridePathname('/user/dashboard/A-20241219-308852');
    apiRequestStub.callsFake(url => {
      if (url.includes('download')) {
        return Promise.resolve({
          ok: true,
          headers: {
            get: param => (param === 'Content-Type' ? `application/json` : ''),
          },
          json: () =>
            Promise.resolve({
              data: {
                attributes: {
                  fileName: 'test-upload-pdf.pdf',
                  fileContent: 'test-file-content',
                },
              },
            }),
        });
      }
      return Promise.resolve(mockInquiryResponse);
    });
    const createElementSpy = sinon.spy(document, 'createElement');

    const { container, findByText } = renderWithStore();

    await findByText('Your conversation');

    userEvent.click(
      container.querySelector(
        'va-accordion-item[subheader="Jan. 5, 2025 at 9:56 p.m. E.T"]',
      ),
    );

    await waitFor(() => {
      expect(container.querySelector('va-link[text="test-upload-pdf.pdf"]')).to
        .exist;
    });

    // userEvent.click(
    //   container.querySelector('va-link[text="test-upload-pdf.pdf"]'),
    // );

    // await waitFor(() => {
    //   // Download link manually created and removed from DOM
    //   expect(createElementSpy.called).to.be.true;
    // });

    createElementSpy.restore();
  });

  it('should be able to download an attachment using mockTestingFlagForAPI', async () => {
    overridePathname('/user/dashboard/A-20241219-308852');
    const mockTestingFlagStub = sinon
      .stub(constants, 'getMockTestingFlagforAPI')
      .returns(true);
    const createElementSpy = sinon.spy(document, 'createElement');

    const { container, findByText } = renderWithStore();

    await findByText('Your conversation');

    userEvent.click(
      container.querySelector(
        'va-accordion-item[subheader="Jan. 5, 2025 at 9:56 p.m. E.T"]',
      ),
    );

    await waitFor(() => {
      expect(container.querySelector('va-link[text="test-upload-pdf.pdf"]')).to
        .exist;
    });

    // TODO: This component needs to be reworked so that uploaded files can be testable
    // userEvent.click(
    //   container.querySelector('va-link[text="test-upload-pdf.pdf"]'),
    // );

    // await waitFor(() => {
    //   // Download link manually created and removed from DOM
    //   expect(createElementSpy.called).to.be.true;
    // });

    createElementSpy.restore();
    mockTestingFlagStub.restore();
  });

  it('should be able to type a reply and click send', async () => {
    overridePathname('/user/dashboard/A-20241219-308852');
    apiRequestStub.resolves(mockInquiryResponse);
    const createElementSpy = sinon.spy(document, 'createElement');

    const testStore = createMockStore();
    const pushSpy = sinon.spy();

    const { container, findByText } = render(
      <Provider store={testStore}>
        <ResponseInboxPage
          {...props}
          router={{
            ...mockRouterProps,
            push: pushSpy,
          }}
        />
      </Provider>,
    );

    await findByText('Send a reply');
    const input = container.querySelector('va-textarea');
    input.value = 'Test reply';
    const event = new window.Event('input', {
      bubbles: true,
      cancelable: true,
    });

    input.dispatchEvent(event);

    await waitFor(() => {
      expect(container.querySelector('va-textarea').value).to.equal(
        'Test reply',
      );
    });

    userEvent.click(
      container.querySelector('va-button[aria-label="Submit reply"]'),
    );

    await waitFor(() => {
      expect(pushSpy.firstCall.args[0]).to.equal('/response-sent');
    });

    createElementSpy.restore();
  });

  it('should be able to type a reply and click send using getMockTestingFlagforAPI', async () => {
    overridePathname('/user/dashboard/A-20241219-308852');
    const mockTestingFlagStub = sinon
      .stub(constants, 'getMockTestingFlagforAPI')
      .returns(true);
    const createElementSpy = sinon.spy(document, 'createElement');

    const testStore = createMockStore();
    const pushSpy = sinon.spy();

    const { container, findByText } = render(
      <Provider store={testStore}>
        <ResponseInboxPage
          {...props}
          router={{
            ...mockRouterProps,
            push: pushSpy,
          }}
        />
      </Provider>,
    );

    await findByText('Send a reply');
    const input = container.querySelector('va-textarea');
    input.value = 'Test reply';
    const event = new window.Event('input', {
      bubbles: true,
      cancelable: true,
    });

    input.dispatchEvent(event);

    await waitFor(() => {
      expect(container.querySelector('va-textarea').value).to.equal(
        'Test reply',
      );
    });

    userEvent.click(
      container.querySelector('va-button[aria-label="Submit reply"]'),
    );

    await waitFor(() => {
      expect(pushSpy.firstCall.args[0]).to.equal('/response-sent');
    });

    createElementSpy.restore();
    mockTestingFlagStub.restore();
  });
});
