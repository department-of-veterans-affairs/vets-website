import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import createCommonStore from '@department-of-veterans-affairs/platform-startup/store';
import CompareHeader from '../../components/CompareHeader';

const defaultStore = createCommonStore();

describe('<CompareHeader>', () => {
  it('Renders with correct text', () => {
    const { findByText } = render(
      <Provider store={defaultStore}>
        <MemoryRouter>
          <CompareHeader
            institutions={[
              {
                name: 'Test Institution A',
              },
              {
                name: 'Test Institution B',
              },
            ]}
            smallScreen
          />
        </MemoryRouter>
      </Provider>,
    );
    expect(
      findByText('Test Institution ATest Institution BReturn to search to add'),
    ).to.exist;
  });

  it('should call setShowDifferences and recordEvent when Checkbox is changed', () => {
    const setShowDifferencesSpy = sinon.spy();
    const recordEvent = sinon.spy();

    const { getByLabelText } = render(
      <Provider store={defaultStore}>
        <MemoryRouter>
          <CompareHeader
            setShowDifferences={setShowDifferencesSpy}
            institutions={[
              {
                name: 'Test Institution A',
              },
              {
                name: 'Test Institution B',
              },
            ]}
            smallScreen
          />
        </MemoryRouter>
      </Provider>,
    );

    const checkbox = getByLabelText(/Highlight differences/i);
    fireEvent.click(checkbox);
    expect(setShowDifferencesSpy.calledOnce).to.be.true;
    expect(setShowDifferencesSpy.calledWith(true)).to.be.true;
    expect(recordEvent.calledOnce).to.be.false;
    expect(
      recordEvent.calledWith({
        event: 'gibct-form-change',
        'gibct-form-field': 'Highlight differences',
        'gibct-form-value': true,
      }),
    ).to.be.false;
  });

  it('should call setPromptingFacilityCode when Remove button is clicked', async () => {
    const setPromptingFacilityCode = sinon.spy();
    const institution = {
      facilityCode: '12345',
      name: 'Example Institution',
    };

    const { container } = render(
      <Provider store={defaultStore}>
        <MemoryRouter>
          <CompareHeader
            setPromptingFacilityCode={setPromptingFacilityCode}
            institutions={[
              {
                name: 'Test Institution A',
              },
              {
                name: 'Test Institution B',
              },
            ]}
          />
        </MemoryRouter>
      </Provider>,
    );

    const removeBtn = container.querySelector('va-button[text="Remove"]');
    fireEvent.click(removeBtn);
    expect(setPromptingFacilityCode.calledOnce).to.be.true;
    expect(setPromptingFacilityCode.calledWith(institution.facilityCode)).to.be
      .false;
  });

  it('appends version to the URL when version is provided', async () => {
    const institutions = [{ facilityCode: '123', name: 'ABC' }];
    const version = '456';

    const { findByTestId } = render(
      <Provider store={defaultStore}>
        <MemoryRouter>
          <CompareHeader institutions={institutions} version={version} />
        </MemoryRouter>
      </Provider>,
    );

    const link = await findByTestId('compare-header-link');
    expect(link).to.exist;
    expect(link.href).to.contain(`/institution/123?version=456`);
  });
});
