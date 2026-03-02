import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import * as api from 'platform/utilities/api';
import * as ddUtils from 'platform/monitoring/Datadog/utilities';

import DisabilityRatingAlert from '../../../components/DisabilityRatingAlert';

describe('DisabilityRatingAlert component', () => {
  let apiStub;
  let ddLoggerStub;
  afterEach(() => {
    if (apiStub) {
      apiStub.restore();
      apiStub = null;
    }
    if (ddLoggerStub) {
      ddLoggerStub.restore();
      ddLoggerStub = null;
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
    ddLoggerStub = sinon.stub(ddUtils, 'dataDogLogger');
    apiStub = sinon.stub(api, 'apiRequest').resolves({
      data: {
        type: 'disability_ratings',
        attributes: { combinedDisabilityRating: 100 },
      },
    });

    const { container, getByText } = render(<DisabilityRatingAlert />);

    await waitFor(() => {
      expect(getByText(/Applying likely won’t increase your monthly payments/i))
        .to.exist;
      expect(ddLoggerStub.called).to.be.true;
      expect(ddLoggerStub.args[0][0]).to.deep.equal({
        message: 'Pension disability rating alert visible for 100 rating',
        attributes: {
          error: null,
          state: 'visible',
          alertType: 'warning',
        },
      });

      const link = container.querySelector('va-link');
      expect(link).to.exist;
      expect(link.getAttribute('href')).to.include(
        'pension/veterans-pension-rates',
      );
    });
  });

  it('renders nothing when rating is less than 100%', async () => {
    ddLoggerStub = sinon.stub(ddUtils, 'dataDogLogger');
    apiStub = sinon.stub(api, 'apiRequest').resolves({
      data: {
        type: 'disability_ratings',
        attributes: { combinedDisabilityRating: 70 },
      },
    });

    const { container } = render(<DisabilityRatingAlert />);

    await waitFor(() => {
      expect(container.querySelector('va-alert')).to.not.exist;
      expect(ddLoggerStub.args[0][0]).to.deep.equal({
        message:
          'Pension disability rating alert hidden for ratings less than 100',
        attributes: {
          error: null,
          state: 'hidden',
          alertType: null,
        },
      });
    });
  });

  it('renders fallback alert when request fails', async () => {
    ddLoggerStub = sinon.stub(ddUtils, 'dataDogLogger');
    apiStub = sinon.stub(api, 'apiRequest').rejects(new Error('Network error'));

    const { container, getByText } = render(<DisabilityRatingAlert />);

    await waitFor(() => {
      expect(getByText(/Consider your disability rating before you apply/i)).to
        .exist;
      expect(ddLoggerStub.args[0][0]).to.deep.equal({
        message: 'Pension disability rating fetch error',
        attributes: {
          error: 'Network error',
          state: 'visible',
          alertType: 'info',
        },
      });
    });

    const link = container.querySelector('va-link');
    expect(link).to.exist;
    expect(link.getAttribute('href')).to.include(
      'pension/veterans-pension-rates',
    );
  });
});
