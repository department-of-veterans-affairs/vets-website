import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { SearchResult } from '../../components/SearchResult';

describe('SearchResult Component', () => {
  it('evaluates addressExists correctly', () => {
    const representative = {
      data: {
        attributes: {
          addressLine1: '123 Main St',
          city: '',
          stateCode: '',
          zipCode: '',
        },
      },
    };

    const { container } = render(
      <SearchResult
        representative={representative}
        query={{}}
        handleSelectRepresentative={() => {}}
        loadingPOA={false}
      />,
    );

    const addressAnchor = container.querySelector('.address-anchor');
    expect(addressAnchor).to.exist;
    expect(addressAnchor.textContent).to.contain('123 Main St');
  });

  it('evaluates addressExists correctly when only city, stateCode, and zipCode exist', () => {
    const representative = {
      data: {
        attributes: {
          city: 'Anytown',
          stateCode: 'CT',
          zipCode: '43456',
        },
      },
    };

    const { container } = render(
      <SearchResult
        representative={representative}
        query={{}}
        handleSelectRepresentative={() => {}}
        loadingPOA={false}
      />,
    );

    const addressAnchor = container.querySelector('.address-anchor');
    expect(addressAnchor).to.exist;
    expect(addressAnchor.textContent).to.contain('Anytown, CT');
  });

  it('includes the representative name in the select button text', () => {
    const representative = {
      data: {
        id: 1,
        attributes: {
          addressLine1: '123 Main St',
          city: '',
          stateCode: '',
          zipCode: '',
          fullName: 'Robert Smith',
        },
      },
    };

    const { container } = render(
      <SearchResult
        representative={representative}
        query={{}}
        handleSelectRepresentative={() => {}}
        loadingPOA={false}
      />,
    );

    const selectButton = container.querySelector(
      '[data-testid="rep-select-1"]',
    );
    expect(selectButton).to.exist;
    expect(selectButton.getAttribute('text')).to.contain('Robert Smith');
  });
});
