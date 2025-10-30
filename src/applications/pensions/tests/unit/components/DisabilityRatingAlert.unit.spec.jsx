import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import * as api from 'platform/utilities/api';

import DisabilityRatingAlert from '../../../components/DisabilityRatingAlert';

describe('DisabilityRatingAlert component', () => {
  let apiStub;

  afterEach(() => {
    if (apiStub) {
      apiStub.restore();
      apiStub = null;
    }
  });

  it('renders loading indicator initially', () => {
    const pending = new Promise(() => {}); // unresolved promise
    apiStub = sinon.stub(api, 'apiRequest').returns(pending);

    const { container } = render(<DisabilityRatingAlert />);

    const loader = container.querySelector('va-loading-indicator');
    expect(loader).to.exist;
    const msg = loader.getAttribute('message');
    expect(msg).to.include('Checking your disability rating');
  });

  it('renders info alert when rating is 100%', async () => {
    apiStub = sinon.stub(api, 'apiRequest').resolves({
      data: {
        type: 'disability_ratings',
        attributes: { combinedDisabilityRating: 100 },
      },
    });

    const { container, getByText } = render(<DisabilityRatingAlert />);

    await waitFor(() => {
      expect(getByText(/This benefit is unlikely to increase your payments/i))
        .to.exist;

      const link = container.querySelector('va-link');
      expect(link).to.exist;
      expect(link.getAttribute('href')).to.include(
        'disability/view-disability-rating/rating',
      );
    });
  });

  it('renders nothing when rating is less than 100%', async () => {
    apiStub = sinon.stub(api, 'apiRequest').resolves({
      data: {
        type: 'disability_ratings',
        attributes: { combinedDisabilityRating: 70 },
      },
    });

    const { container } = render(<DisabilityRatingAlert />);

    await waitFor(() => {
      expect(container.querySelector('va-alert')).to.not.exist;
    });
  });

  it('renders fallback alert when request fails', async () => {
    apiStub = sinon.stub(api, 'apiRequest').rejects(new Error('Network error'));

    const { getByText } = render(<DisabilityRatingAlert />);

    await waitFor(() => {
      expect(getByText(/Consider your disability rating before you apply/i)).to
        .exist;
    });
  });
});
