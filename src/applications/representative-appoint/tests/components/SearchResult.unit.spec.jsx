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
});
