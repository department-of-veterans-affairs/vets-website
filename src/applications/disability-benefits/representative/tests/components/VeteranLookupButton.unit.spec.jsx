import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, fireEvent, waitFor } from '@testing-library/react';

import { VeteranLookupButton } from '../../components/VeteranLookupButton';
import * as mviLookup from '../../utilities/mviLookup';

// MouseEvent with bubbles needed for va-button web component
const mouseClick = new MouseEvent('click', {
  bubbles: true,
  cancelable: true,
});

describe('VeteranLookupButton', () => {
  let claimantSearchStub;

  beforeEach(() => {
    claimantSearchStub = sinon.stub(mviLookup, 'claimantSearch');
  });

  afterEach(() => {
    claimantSearchStub.restore();
  });

  const defaultFormData = {
    fullName: {
      first: 'John',
      last: 'Doe',
    },
    ssn: '123456789',
    dateOfBirth: '1980-01-01',
  };

  const renderComponent = (
    formData = defaultFormData,
    setFormData = () => {},
  ) => {
    return render(
      <VeteranLookupButton formData={formData} setFormData={setFormData} />,
    );
  };

  it('renders the verify button when form data is complete', () => {
    const { baseElement } = renderComponent();
    const button = baseElement.querySelector('va-button');
    expect(button).to.exist;
    expect(button.getAttribute('text')).to.equal('Verify veteran identity');
  });

  it('disables the button when required fields are missing', () => {
    const incompleteData = {
      fullName: { first: 'John' }, // missing last name
      ssn: '123456789',
    };
    const { getByText } = renderComponent(incompleteData);
    const helpText = getByText(/Please complete all required fields/);
    expect(helpText).to.exist;
  });

  it('disables the button when SSN is missing', () => {
    const incompleteData = {
      fullName: { first: 'John', last: 'Doe' },
      dateOfBirth: '1980-01-01',
      // missing SSN
    };
    const { getByText } = renderComponent(incompleteData);
    const helpText = getByText(/Please complete all required fields/);
    expect(helpText).to.exist;
  });

  it('disables the button when date of birth is missing', () => {
    const incompleteData = {
      fullName: { first: 'John', last: 'Doe' },
      ssn: '123456789',
      // missing dateOfBirth
    };
    const { getByText } = renderComponent(incompleteData);
    const helpText = getByText(/Please complete all required fields/);
    expect(helpText).to.exist;
  });

  it('shows success alert when lookup succeeds', async () => {
    const mockResponse = {
      data: {
        attributes: {
          claimantId: 'test-icn-123',
        },
      },
    };
    claimantSearchStub.resolves(mockResponse);

    const setFormData = sinon.spy();
    const { baseElement, getByText } = renderComponent(
      defaultFormData,
      setFormData,
    );

    const button = baseElement.querySelector('va-button');
    fireEvent.click(button, mouseClick);

    await waitFor(() => {
      expect(getByText(/Veteran identity verified successfully/)).to.exist;
    });

    expect(setFormData.called).to.be.true;
    const callArgs = setFormData.firstCall.args[0];
    expect(callArgs.veteranIcn).to.equal('test-icn-123');
    expect(callArgs['view:mviLookupComplete']).to.be.true;
  });

  it('shows error alert when veteran is not found', async () => {
    const mockResponse = {
      data: {
        attributes: {}, // no claimantId
      },
    };
    claimantSearchStub.resolves(mockResponse);

    const { baseElement, getByText } = renderComponent();

    const button = baseElement.querySelector('va-button');
    fireEvent.click(button, mouseClick);

    await waitFor(() => {
      expect(getByText(/Veteran not found in VA records/)).to.exist;
    });
  });

  it('shows error alert when lookup fails', async () => {
    claimantSearchStub.rejects(new Error('Network error'));

    const { baseElement, getByText } = renderComponent();

    const button = baseElement.querySelector('va-button');
    fireEvent.click(button, mouseClick);

    await waitFor(() => {
      expect(getByText(/Network error/)).to.exist;
    });
  });

  it('shows loading state during lookup', async () => {
    // Create a delayed promise
    claimantSearchStub.returns(new Promise(() => {})); // Never resolves

    const { baseElement } = renderComponent();

    const button = baseElement.querySelector('va-button');
    fireEvent.click(button, mouseClick);

    await waitFor(() => {
      const loadingButton = baseElement.querySelector('va-button');
      expect(loadingButton.getAttribute('text')).to.equal('Verifying...');
    });
  });

  it('hides button after successful lookup', async () => {
    const mockResponse = {
      data: {
        attributes: {
          claimantId: 'test-icn-123',
        },
      },
    };
    claimantSearchStub.resolves(mockResponse);

    const setFormData = sinon.spy();
    const { baseElement, getByText } = renderComponent(
      defaultFormData,
      setFormData,
    );

    const button = baseElement.querySelector('va-button');
    fireEvent.click(button, mouseClick);

    await waitFor(() => {
      expect(getByText(/Veteran identity verified successfully/)).to.exist;
      expect(baseElement.querySelector('va-button')).to.be.null;
    });
  });
});
