import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';

import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { Toggler } from '~/platform/utilities/feature-toggles';
import ListItemView from '../../../components/ListItemView';
import { FakeProvider } from '../chapters/pageTests.spec';

// TODO: Update tests after pension_multiresponse_styles flipper is removed.

describe('ListItemView Component', () => {
  it('renders without crashing', async () => {
    const { container } = render(
      <FakeProvider>
        <ListItemView title="Test title" />
      </FakeProvider>,
    );
    await waitFor(() => {
      expect($('h3', container)).to.exist;
    });
  });

  it('displays the correct title', () => {
    const title = 'Software Engineer';
    const { container } = render(
      <FakeProvider>
        <ListItemView title={title} />
      </FakeProvider>,
    );
    expect($('h3', container).textContent).to.eql(title);
  });

  it('handles missing title gracefully', () => {
    const { container } = render(
      <FakeProvider>
        <ListItemView />
      </FakeProvider>,
    );
    expect($('h3', container).textContent).to.eql('');
  });
});

describe('ListItemView Component Multiresponse Flipper', () => {
  it('renders without crashing', async () => {
    const { container } = render(
      <FakeProvider
        state={{
          featureToggles: {
            loading: false,
            [Toggler.TOGGLE_NAMES.pensionMultiresponseStyles]: true,
          },
        }}
      >
        <ListItemView title="Test title" />
      </FakeProvider>,
    );
    await waitFor(() => {
      expect($('h3', container)).to.exist;
    });
  });

  it('displays the correct title', () => {
    const title = 'Software Engineer';
    const { container } = render(
      <FakeProvider
        state={{
          featureToggles: {
            loading: false,
            [Toggler.TOGGLE_NAMES.pensionMultiresponseStyles]: true,
          },
        }}
      >
        <ListItemView title={title} />
      </FakeProvider>,
    );
    expect($('h3', container).textContent).to.eql(title);
  });

  it('handles missing title gracefully', () => {
    const { container } = render(
      <FakeProvider
        state={{
          featureToggles: {
            loading: false,
            [Toggler.TOGGLE_NAMES.pensionMultiresponseStyles]: true,
          },
        }}
      >
        <ListItemView />
      </FakeProvider>,
    );
    expect($('h3', container).textContent).to.eql('');
  });
});
