import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import * as actions from '../../actions';
import AppContent from '../../components/AppContent';

const mockResponse = { combinedDisabilityRating: 30, individualRatings: [] };
const mockError = {
  errors: [
    {
      status: '500',
      error: 'Internal Server Error',
      path: '/veteran_verification/v2/disability_rating',
      code: '500',
      title: 'Common::Exceptions::ExternalServerInternalServerError',
      detail: 'Internal Server Error',
    },
  ],
};

const headlines = {
  combinedRating: `Your combined disability rating is ${
    mockResponse.combinedDisabilityRating
  }%`,
  noCombinedRating:
    'We don’t have a combined disability rating on file for you',
  noRatings: 'We don’t have any rated disabilities on file for you',
  serverError: 'We’re sorry. Something went wrong on our end.',
};

const mockApiCall = sinon.stub(actions, 'getRatedDisabilities');

describe('<AppContent>', () => {
  beforeEach(() => {
    mockApiCall.reset();
  });

  context('error/loading states', () => {
    it('should display a loading indicator when the request is not done', async () => {
      mockApiCall.resolves(mockResponse);

      const { container } = render(<AppContent />);

      expect($('va-loading-indicator', container)).to.exist;
    });

    it('should not display a loading indicator when the request is done', async () => {
      mockApiCall.resolves(mockResponse);

      const { container } = render(<AppContent />);

      await Promise.resolve();

      expect($('va-loading-indicator', container)).not.to.exist;
    });

    it('should display an error message when the request fails', async () => {
      mockApiCall.rejects(mockError);

      const screen = render(<AppContent />);

      await Promise.resolve();

      expect(screen.getByText(headlines.serverError)).to.exist;
    });

    it('should display a message when there is no combined rating', async () => {
      mockApiCall.resolves({ ...mockResponse, combinedDisabilityRating: null });

      const screen = render(<AppContent />);

      await Promise.resolve();

      expect(screen.getByText(headlines.noCombinedRating)).to.exist;
    });

    it('should display a message when there are no ratings', async () => {
      mockApiCall.resolves(mockResponse);

      const screen = render(<AppContent />);

      await Promise.resolve();

      expect(screen.getByText(headlines.noRatings)).to.exist;
    });
  });

  it('should display a combined rating message', async () => {
    mockApiCall.resolves(mockResponse);

    const screen = render(<AppContent />);

    await Promise.resolve();

    expect(screen.getByText(headlines.combinedRating)).to.exist;
  });

  it('should display a list of ratings', async () => {
    mockApiCall.resolves({
      ...mockResponse,
      individualRatings: [
        {
          decision: 'Service Connected',
          diagnosticText: 'Hearing Loss',
          diagnosticTypeName: '6100-Hearing loss',
          effectiveDate: '2005-01-01',
          ratingPercentage: 20,
        },
      ],
    });

    const screen = render(<AppContent />);

    await Promise.resolve();

    expect(screen.getByText('20% rating for Hearing Loss')).to.exist;
  });
});
