import React from 'react';
import { expect } from 'chai';
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

  const testProps = {
    officer: 'Test Officer',
    addressLine1: '123 Main St',
    addressLine2: 'Suite 100',
    city: 'Columbus',
    stateCode: 'OH',
    zipCode: '43210',
    phone: '945-456-7890',
    email: 'test@example.com',
    representativeId: '123',
    query: { context: { location: 'UserLocation' } },
    reports: {},
    initializeRepresentativeReport: () => {},
    reportSubmissionStatus: 'INITIAL',
    setReportModalTester: () => {},
  };

  it('should push to datalayer on click of contact link', () => {
    const wrapper = mount(
      <Provider store={mockStore}>
        <SearchResult {...testProps} />
      </Provider>,
    );

    const addressLink = wrapper.find('.address-anchor');

    addressLink.simulate('click');

    const priorEvent = window.dataLayer;
    expect(priorEvent.length).to.equal(1);
    addressLink.simulate('click');
    expect(priorEvent.length).to.equal(2);

    wrapper.unmount();
  });

  it('should push to datalayer on click of report button', () => {
    const wrapper = mount(
      <Provider store={mockStore}>
        <SearchResult {...testProps} />
      </Provider>,
    );

    const priorEvent = window.dataLayer;

    wrapper.find('#open-modal-test-button').simulate('click');

    expect(priorEvent.length).to.equal(1);

    wrapper.unmount();
  });

  it('should render rep email if rep email exists', () => {
    const wrapper = mount(
      <Provider store={mockStore}>
        <SearchResult {...testProps} />
      </Provider>,
    );

    const emailLink = wrapper.find('a[href="mailto:test@example.com"]');

    expect(emailLink.exists(), 'Email link exists').to.be.true;
    expect(emailLink, 'Email link length').to.have.lengthOf(1);

    wrapper.unmount();
  });

  it('should render address link if addressLine1 exists', () => {
    const wrapper = mount(
      <Provider store={mockStore}>
        <SearchResult {...testProps} />
      </Provider>,
    );

    const addressLink = wrapper.find('.address-link');

    expect(addressLink.exists(), 'Address link exists').to.be.true;

    wrapper.unmount();
  });
  it('should render address link if city exists', () => {
    const wrapper = mount(
      <Provider store={mockStore}>
        <SearchResult {...testProps} />
      </Provider>,
    );

    const addressLink = wrapper.find('.address-link');

    expect(addressLink.exists(), 'Address link exists').to.be.true;

    wrapper.unmount();
  });
  it('should render address link if stateCode exists', () => {
    const wrapper = mount(
      <Provider store={mockStore}>
        <SearchResult {...testProps} />
      </Provider>,
    );

    const addressLink = wrapper.find('.address-link');

    expect(addressLink.exists(), 'Address link exists').to.be.true;

    wrapper.unmount();
  });
  it('should render address link if zipCode exists', () => {
    const wrapper = mount(
      <Provider store={mockStore}>
        <SearchResult {...testProps} />
      </Provider>,
    );

    const addressLink = wrapper.find('.address-link');

    expect(addressLink.exists(), 'Address link exists').to.be.true;

    wrapper.unmount();
  });
  it('sets the aria-label on the address link', () => {
    const wrapper = mount(
      <Provider store={mockStore}>
        <SearchResult {...testProps} />
      </Provider>,
    );

    const expectedAriaLabel =
      '123 Main St Suite 100 Columbus, OH 43210 (opens in a new tab)';
    const addressLink = wrapper.find('.address-link a');

    expect(addressLink.exists(), 'Address link exists').to.be.true;
    expect(
      addressLink.prop('aria-label'),
      'Aria label is set correctly',
    ).to.equal(expectedAriaLabel);

    wrapper.unmount();
  });

  it('Does not display the "Thanks for reporting outdated information." message when reports are present', () => {
    const { queryByText } = render(
      <Provider store={mockStore}>
        <SearchResult {...testProps} />
      </Provider>,
    );

    const thankYouMessage = queryByText(
      'Thanks for reporting outdated information.',
    );
    expect(thankYouMessage).to.be.null;
  });
  it('renders addressLine2 if it exists', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <SearchResult {...testProps} />
      </Provider>,
    );

    const addressLink = container.querySelector('.address-link > a');
    expect(addressLink).to.not.be.null;
    expect(addressLink.textContent).to.contain(testProps.addressLine2);
  });
  it('renders without addressLine2 when not provided', () => {
    const testPropsWithoutAddressLine2 = {
      officer: 'Test Officer',
      addressLine1: '123 Main St',
      city: 'Columbus',
      stateCode: 'OH',
      zipCode: '43210',
      phone: '945-456-7890',
      email: 'example@rep.com',
      representativeId: '123',
      query: { context: { location: 'UserLocation' } },
      initializeRepresentativeReport: () => {},
      reportSubmissionStatus: 'INITIAL',
    };

    const { queryByText } = render(
      <Provider store={mockStore}>
        <SearchResult
          {...testPropsWithoutAddressLine2}
          initializeRepresentativeReport={() => {}}
          reportSubmissionStatus="INITIAL"
        />
      </Provider>,
    );

    const addressLine2Text = queryByText('Suite 100');
    expect(addressLine2Text).to.be.null;
  });

  it('renders the trigger button text for associated organizations', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <SearchResult
          {...testProps}
          associatedOrgs={['Org1', 'Org2', 'Org3']}
        />
        ,
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
        <SearchResult {...testProps} distance="5.5" />
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
        <SearchResult {...testProps} />
      </Provider>,
    );

    wrapper.find('#open-modal-test-button').simulate('click');

    wrapper.update();

    expect(wrapper.find('.report-outdated-information-modal')).to.exist;

    wrapper.unmount();
  });
});
