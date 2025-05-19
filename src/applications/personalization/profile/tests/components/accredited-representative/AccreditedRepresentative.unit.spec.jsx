import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';

import AccreditedRepresentative from '../../../components/accredited-representative/AccreditedRepresentative';

describe('<AccreditedRepresentative />', () => {
  it('should render the AccreditedRepresentative component', () => {
    const { queryByText, container } = renderInReduxProvider(
      <AccreditedRepresentative />,
      {
        initialState: {
          vaProfile: {
            powerOfAttorney: { id: 'representative-id' },
          },
        },
      },
    );

    expect(queryByText(/Accredited Representative or VSO/)).to.not.be.null;

    expect(
      container.querySelector('[data-widget-type="representative-status"]')
        ?.length,
    ).to.equal(1);
  });
});
