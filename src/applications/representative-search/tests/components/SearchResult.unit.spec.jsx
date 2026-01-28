import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import SearchResult from '../../components/results/SearchResult';

describe('SearchResults', () => {
  const mockStore = {
    getState: () => ({
      featureToggles: {
        // eslint-disable-next-line camelcase
        find_a_representative_flagging_feature_enabled: true,
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  };

  const baseProps = {
    officer: 'Test Officer',
    phone: '945-456-7890',
    email: 'test@example.com',
    representativeId: '123',
    query: { context: { location: 'UserLocation' } },
    reports: {},
    initializeRepresentativeReport: () => {},
    reportSubmissionStatus: 'INITIAL',
    setReportModalTester: () => {},
    key: 0,
  };

  const fullAddressProps = {
    ...baseProps,
    addressLine1: '123 Main St',
    addressLine2: 'Suite 100',
    city: 'Columbus',
    stateCode: 'OH',
    zipCode: '43210',
  };

  let dataLayerPushStub;

  beforeEach(() => {
    window.dataLayer = window.dataLayer || [];
    dataLayerPushStub = sinon.stub(window.dataLayer, 'push');
  });

  afterEach(() => {
    if (dataLayerPushStub?.restore) {
      dataLayerPushStub.restore();
    }
    window.dataLayer = [];
  });

  it('should push to dataLayer on click of contact link', () => {
    const wrapper = mount(
      <Provider store={mockStore}>
        <SearchResult {...fullAddressProps} />
      </Provider>,
    );

    const addressLink = wrapper.find('.address-anchor');
    expect(addressLink.exists()).to.be.true;

    addressLink.simulate('click');
    expect(dataLayerPushStub.callCount).to.equal(1);

    addressLink.simulate('click');
    expect(dataLayerPushStub.callCount).to.equal(2);

    const firstPayload = dataLayerPushStub.firstCall.args[0];
    expect(firstPayload).to.have.property('event', 'far-search-results-click');

    wrapper.unmount();
  });

  it('should push to dataLayer on click of report button', () => {
    const wrapper = mount(
      <Provider store={mockStore}>
        <SearchResult {...fullAddressProps} />
      </Provider>,
    );

    wrapper.find('#open-modal-test-button').simulate('click');
    expect(dataLayerPushStub.callCount).to.equal(1);

    const firstPayload = dataLayerPushStub.firstCall.args[0];
    expect(firstPayload).to.have.property(
      'event',
      'far-search-results-outdated',
    );

    wrapper.unmount();
  });

  it('should render rep email if rep email exists', () => {
    const wrapper = mount(
      <Provider store={mockStore}>
        <SearchResult {...fullAddressProps} />
      </Provider>,
    );

    const emailLink = wrapper.find('a[href="mailto:test@example.com"]');
    expect(emailLink.exists(), 'Email link exists').to.be.true;
    expect(emailLink, 'Email link length').to.have.lengthOf(1);

    wrapper.unmount();
  });

  describe('address rendering rules', () => {
    it('renders address link when street address exists (full address)', () => {
      const { container } = render(
        <Provider store={mockStore}>
          <SearchResult {...fullAddressProps} />
        </Provider>,
      );

      const addressLinkContainer = container.querySelector('.address-link');
      expect(addressLinkContainer).to.exist;

      const addressAnchor = container.querySelector('.address-link > a');
      expect(addressAnchor).to.exist;
    });

    it('does NOT render an address link when ONLY city exists (ambiguous city-only)', () => {
      const cityOnlyProps = {
        ...baseProps,
        city: 'Springfield',
        addressLine1: '',
        stateCode: '',
        zipCode: '',
      };

      const { container } = render(
        <Provider store={mockStore}>
          <SearchResult {...cityOnlyProps} />
        </Provider>,
      );

      const addressLinkContainer = container.querySelector('.address-link');
      expect(addressLinkContainer).to.not.exist;
    });

    it('renders an address link when city + state exists (no street)', () => {
      const cityStateProps = {
        ...baseProps,
        city: 'Newark',
        stateCode: 'NJ',
        addressLine1: '',
        zipCode: '',
      };

      const { container, getByText } = render(
        <Provider store={mockStore}>
          <SearchResult {...cityStateProps} distance="5.5" />
        </Provider>,
      );

      const addressLinkContainer = container.querySelector('.address-link');
      expect(addressLinkContainer).to.exist;

      expect(getByText('No street address provided')).to.exist;

      const addressAnchor = container.querySelector('.address-link > a');
      expect(addressAnchor).to.exist;
      expect(addressAnchor.textContent).to.equal('Newark, NJ');
    });

    it('renders an address link when zip exists (no street, no city/state)', () => {
      const zipOnlyProps = {
        ...baseProps,
        addressLine1: '',
        city: '',
        stateCode: '',
        zipCode: '07102',
      };

      const { container, getByText } = render(
        <Provider store={mockStore}>
          <SearchResult {...zipOnlyProps} distance="5.5" />
        </Provider>,
      );

      const addressLinkContainer = container.querySelector('.address-link');
      expect(addressLinkContainer).to.exist;

      expect(getByText('No street address provided')).to.exist;

      const addressAnchor = container.querySelector('.address-link > a');
      expect(addressAnchor).to.exist;
      expect(addressAnchor.textContent).to.equal('07102');
    });

    it('renders city/state/zip in partial location text when city+state and zip exist (no street)', () => {
      const cityStateZipProps = {
        ...baseProps,
        addressLine1: '',
        city: 'Newark',
        stateCode: 'NJ',
        zipCode: '07102',
      };

      const { container } = render(
        <Provider store={mockStore}>
          <SearchResult {...cityStateZipProps} distance="5.5" />
        </Provider>,
      );

      const addressAnchor = container.querySelector('.address-link > a');
      expect(addressAnchor).to.exist;
      expect(addressAnchor.textContent).to.equal('Newark, NJ 07102');
    });

    it('does NOT render an address link when there is no address info at all', () => {
      const noAddressProps = {
        ...baseProps,
        addressLine1: '',
        addressLine2: '',
        addressLine3: '',
        city: '',
        stateCode: '',
        zipCode: '',
      };

      const { container } = render(
        <Provider store={mockStore}>
          <SearchResult {...noAddressProps} />
        </Provider>,
      );

      const addressLinkContainer = container.querySelector('.address-link');
      expect(addressLinkContainer).to.not.exist;
    });
  });

  describe('distance label "(estimated)"', () => {
    it('does NOT show "(estimated)" when street address exists', () => {
      const { container } = render(
        <Provider store={mockStore}>
          <SearchResult {...fullAddressProps} distance="5.5" />
        </Provider>,
      );

      const distanceElement = container.querySelector(
        '.vads-u-font-weight--bold.vads-u-font-family--serif',
      );
      expect(distanceElement).to.exist;
      expect(distanceElement.textContent).to.contain('Mi');
      expect(distanceElement.textContent).to.not.contain('(estimated)');
    });

    it('renders distance when distance is 0 (exact match)', () => {
      const { container } = render(
        <Provider store={mockStore}>
          <SearchResult {...fullAddressProps} distance={0} />
        </Provider>,
      );

      const distanceElement = container.querySelector(
        '.vads-u-font-weight--bold.vads-u-font-family--serif',
      );

      expect(distanceElement).to.exist;
      expect(distanceElement.textContent).to.contain('0 Mi');
    });

    it('shows "(estimated)" when street address is missing but city+state exists', () => {
      const cityStateProps = {
        ...baseProps,
        addressLine1: '',
        city: 'Newark',
        stateCode: 'NJ',
        zipCode: '',
      };

      const { container } = render(
        <Provider store={mockStore}>
          <SearchResult {...cityStateProps} distance="5.5" />
        </Provider>,
      );

      const distanceElement = container.querySelector(
        '.vads-u-font-weight--bold.vads-u-font-family--serif',
      );
      expect(distanceElement).to.exist;
      expect(distanceElement.textContent).to.contain('(estimated)');
    });

    it('shows "(estimated)" when street address is missing but zip exists', () => {
      const zipOnlyProps = {
        ...baseProps,
        addressLine1: '',
        city: '',
        stateCode: '',
        zipCode: '07102',
      };

      const { container } = render(
        <Provider store={mockStore}>
          <SearchResult {...zipOnlyProps} distance="5.5" />
        </Provider>,
      );

      const distanceElement = container.querySelector(
        '.vads-u-font-weight--bold.vads-u-font-family--serif',
      );
      expect(distanceElement).to.exist;
      expect(distanceElement.textContent).to.contain('(estimated)');
    });
  });

  it('sets the aria-label on the address link', () => {
    const wrapper = mount(
      <Provider store={mockStore}>
        <SearchResult {...fullAddressProps} />
      </Provider>,
    );

    const expectedAriaLabel =
      '123 Main St Suite 100 Columbus, OH 43210 (opens in a new tab)';

    const addressAnchor = wrapper.find('.address-link a');
    expect(addressAnchor.exists(), 'Address link exists').to.be.true;
    expect(addressAnchor.prop('aria-label')).to.equal(expectedAriaLabel);

    wrapper.unmount();
  });

  it('Does not display the "Thanks for reporting outdated information." message when reports are present', () => {
    const { queryByText } = render(
      <Provider store={mockStore}>
        <SearchResult {...fullAddressProps} />
      </Provider>,
    );

    const thankYouMessage = queryByText(
      'Thanks for reporting outdated information.',
    );
    expect(thankYouMessage).to.be.null;
  });

  it('renders addressLine2 if it exists (full address)', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <SearchResult {...fullAddressProps} />
      </Provider>,
    );

    const addressAnchor = container.querySelector('.address-link > a');
    expect(addressAnchor).to.not.be.null;
    expect(addressAnchor.textContent).to.contain(fullAddressProps.addressLine2);
  });

  it('renders without addressLine2 when not provided (full address)', () => {
    const noAddressLine2Props = {
      ...baseProps,
      addressLine1: '123 Main St',
      addressLine2: undefined,
      city: 'Columbus',
      stateCode: 'OH',
      zipCode: '43210',
    };

    const { queryByText } = render(
      <Provider store={mockStore}>
        <SearchResult {...noAddressLine2Props} />
      </Provider>,
    );

    const addressLine2Text = queryByText('Suite 100');
    expect(addressLine2Text).to.be.null;
  });

  it('renders the trigger button text for associated organizations', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <SearchResult
          {...fullAddressProps}
          associatedOrgs={['Org1', 'Org2', 'Org3']}
        />
      </Provider>,
    );

    const triggerButton = container
      .querySelector('.associated-organizations-info va-additional-info')
      .getAttribute('trigger');

    expect(triggerButton).to.equal('See associated organizations');
  });

  it('renders distance information when distance is provided', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <SearchResult {...fullAddressProps} distance="5.5" />
      </Provider>,
    );

    const distanceElement = container.querySelector(
      '.vads-u-font-weight--bold.vads-u-font-family--serif',
    );
    expect(distanceElement).to.exist;

    const officerElement = container.querySelector(
      '.vads-u-font-family--serif.vads-u-margin-top--2p5 h3',
    );
    expect(officerElement).to.exist;
  });

  it('renders modal when appropriate', () => {
    const wrapper = mount(
      <Provider store={mockStore}>
        <SearchResult {...fullAddressProps} />
      </Provider>,
    );

    wrapper.find('#open-modal-test-button').simulate('click');
    wrapper.update();

    expect(wrapper.find('.report-outdated-information-modal')).to.exist;

    wrapper.unmount();
  });
});
