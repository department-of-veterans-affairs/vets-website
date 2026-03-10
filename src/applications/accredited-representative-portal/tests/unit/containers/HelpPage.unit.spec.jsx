import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { MemoryRouter } from 'react-router-dom';
import * as uiModule from 'platform/utilities/ui';
import * as featureToggleModule from '~/platform/utilities/feature-toggles/useFeatureToggle';

import HelpPage from '../../../containers/HelpPage';

describe('HelpPage', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(uiModule, 'focusElement');
  });

  afterEach(() => {
    sandbox.restore();
  });

  const renderPage = ({
    flagEnabled = true,
    flagLoading = false,
    initialEntries = ['/'],
  } = {}) => {
    sandbox.stub(featureToggleModule, 'useFeatureToggle').returns({
      TOGGLE_NAMES: {
        accreditedRepresentativePortalIndividualAccept:
          'accredited_representative_portal_individual_accept',
      },
      useToggleValue: () => flagEnabled,
      useToggleLoadingValue: () => flagLoading,
    });

    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <HelpPage title="Get help with the Accredited Representative Portal" />
      </MemoryRouter>,
    );
  };

  it('renders the page heading', () => {
    const { getByTestId } = renderPage();

    expect(getByTestId('get-help-page-heading').textContent).to.equal(
      'Get help with the Accredited Representative Portal',
    );
  });

  it('renders loading indicator while feature flag is loading', () => {
    const { container, queryByTestId } = renderPage({ flagLoading: true });

    const loadingIndicator = container.querySelector('va-loading-indicator');
    expect(loadingIndicator).to.exist;
    expect(loadingIndicator.getAttribute('message')).to.equal('Loading...');
    expect(queryByTestId('get-help-page-heading')).to.not.exist;
  });

  it('renders new individual accept copy when flag is enabled', () => {
    const { container } = renderPage({ flagEnabled: true });

    const text = container.textContent;

    expect(text).to.include(
      'You can quickly establish representation (power of attorney) using the Representation Requests feature in the portal.',
    );
    expect(text).to.include(
      'Veterans Service Organizations (VSOs) have to activate the Representation Requests feature for their organization if they want to receive requests in the portal.',
    );
    expect(text).to.include('Here’s how to receive requests in the portal:');
    expect(text).to.include(
      'The portal shows a list of requests for your Veterans Service Organization (VSO) that have been received in the portal over the last 60 days.',
    );

    expect(text).to.not.include(
      'You can quickly establish representation with a Veteran by using the portal Representation Requests feature.',
    );
    expect(text).to.not.include(
      'For you to receive a request in the portal, the Veteran needs to submit the online',
    );
  });

  it('renders old representation copy when flag is disabled', () => {
    const { container } = renderPage({ flagEnabled: false });

    const text = container.textContent;

    expect(text).to.include(
      'You can quickly establish representation with a Veteran by using the portal Representation Requests feature.',
    );
    expect(text).to.include(
      'For you to receive a request in the portal, the Veteran needs to submit the online',
    );
    expect(text).to.include(
      'After signing in to the portal, you can review a list of representation requests that appoint one of your VSOs.',
    );
    expect(text).to.include(
      'If you’d like access to this feature, ask the VSO manager or certifying official at one or more of your organizations to email us at',
    );

    expect(text).to.not.include(
      'You can quickly establish representation (power of attorney) using the Representation Requests feature in the portal.',
    );
    expect(text).to.not.include(
      'Here’s how to receive requests in the portal:',
    );
  });
});
