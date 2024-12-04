import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { render, waitFor, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import ContactAccreditedRepresentative from '../../../components/ContactAccreditedRepresentative';
import selectedRep from '../../fixtures/data/representative.json';

describe('<ContactAccreditedRepresentative>', () => {
  const getProps = () => {
    return {
      props: {
        loggedIn: true,
        formData: { 'view:selectedRepresentative': selectedRep.data },
      },
      mockStore: {
        getState: () => ({
          form: {
            data: { 'view:selectedRepresentative': selectedRep.data },
          },
        }),
        loggedIn: true,
        subscribe: () => {},
      },
    };
  };

  it('should render component', () => {
    const { props, mockStore } = getProps();

    const { container } = render(
      <Provider store={mockStore}>
        <ContactAccreditedRepresentative {...props} />
      </Provider>,
    );
    expect(container).to.exist;
  });

  it('should navigate to the representative selection page when on the review page', async () => {
    const { props, mockStore } = getProps();

    const goToPathSpy = sinon.spy();

    // Simulate being on the review page by mocking window.location.search
    Object.defineProperty(window, 'location', {
      value: { search: '?review=true' },
      writable: true,
    });

    const { getByText } = render(
      <Provider store={mockStore}>
        <ContactAccreditedRepresentative {...props} goToPath={goToPathSpy} />
      </Provider>,
    );

    // Simulate clicking the "Back" button
    fireEvent.click(getByText('Back'));

    await waitFor(() => {
      expect(goToPathSpy.calledWith('/representative-select?review=true')).to.be
        .true;
    });
  });

  it('should call goBack with formData when not on the review page', async () => {
    const { props, mockStore } = getProps();

    const goBackSpy = sinon.spy();

    // Simulate not being on the review page
    Object.defineProperty(window, 'location', {
      value: { search: '' },
      writable: true,
    });

    const { getByText } = render(
      <Provider store={mockStore}>
        <ContactAccreditedRepresentative {...props} goBack={goBackSpy} />
      </Provider>,
    );

    // Simulate clicking the "Back" button
    fireEvent.click(getByText('Back'));

    await waitFor(() => {
      expect(goBackSpy.calledWith(props.formData)).to.be.true;
    });
  });

  it('should navigate to the organization selection page when on the review page and organization selection is required', async () => {
    const { props, mockStore } = getProps();

    const goToPathSpy = sinon.spy();

    // Simulate being on the review page
    Object.defineProperty(window, 'location', {
      value: { search: '?review=true' },
      writable: true,
    });

    // Mock organization selection required
    props.formData[
      'view:selectedRepresentative'
    ].attributes.accreditedOrganizations = {
      data: [
        { attributes: { name: 'Organization 1' } },
        { attributes: { name: 'Organization 2' } },
      ],
    };

    const { getByText } = render(
      <Provider store={mockStore}>
        <ContactAccreditedRepresentative {...props} goToPath={goToPathSpy} />
      </Provider>,
    );

    // Simulate clicking the "Continue" button
    fireEvent.click(getByText('Continue'));

    await waitFor(() => {
      expect(goToPathSpy.calledWith('/representative-organization?review=true'))
        .to.be.true;
    });
  });

  it('should navigate to the review-and-submit page when on the review page and organization selection is not required', async () => {
    const { props, mockStore } = getProps();

    const goToPathSpy = sinon.spy();

    // Simulate being on the review page
    Object.defineProperty(window, 'location', {
      value: { search: '?review=true' },
      writable: true,
    });

    // Mock organization selection not required
    props.formData[
      'view:selectedRepresentative'
    ].attributes.accreditedOrganizations = {
      data: [{ attributes: { name: 'Organization 1' } }], // Only one organization
    };

    const { getByText } = render(
      <Provider store={mockStore}>
        <ContactAccreditedRepresentative {...props} goToPath={goToPathSpy} />
      </Provider>,
    );

    // Simulate clicking the "Continue" button
    fireEvent.click(getByText('Continue'));

    await waitFor(() => {
      expect(goToPathSpy.calledWith('/review-and-submit')).to.be.true;
    });
  });

  it('should call goForward with formData when not on the review page', async () => {
    const { props, mockStore } = getProps();

    const goForwardSpy = sinon.spy();

    // Simulate not being on the review page
    Object.defineProperty(window, 'location', {
      value: { search: '' },
      writable: true,
    });

    const { getByText } = render(
      <Provider store={mockStore}>
        <ContactAccreditedRepresentative {...props} goForward={goForwardSpy} />
      </Provider>,
    );

    // Simulate clicking the "Continue" button
    fireEvent.click(getByText('Continue'));

    await waitFor(() => {
      expect(goForwardSpy.calledWith(props.formData)).to.be.true;
    });
  });
});
