import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { $ } from 'platform/forms-system/src/js/utilities/ui';
import MyVAHealth from '../components/MyVAHealth';

const oldLocation = global.window.location;

describe('MyVAHealth', () => {
  const ssoeTarget = `https://staging-patientportal.myhealth.va.gov`;
  let server;
  let pushState;
  let go;

  before(() => {
    server = setupServer();
    server.listen();
  });

  beforeEach(() => {
    pushState = sinon.spy(global.window.history, 'pushState');
    go = sinon.spy(global.window.history, 'go');
  });

  afterEach(() => {
    server.resetHandlers();
    global.window.location = oldLocation;
  });

  after(() => server.close());

  it('should render', () => {
    const { container } = render(<MyVAHealth />);

    const loadingIndicator = $('va-loading-indicator', container);
    expect(loadingIndicator).to.not.be.null;
  });

  it('should redirect to failure page with code=110 when api returns an error', async () => {
    global.window.location = `https://dev.va.gov/terms-of-use/myvahealth/?ssoeTarget=${ssoeTarget}`;

    server.use(
      rest.put(
        `https://dev-api.va.gov/v0/terms_of_use_agreements/update_provisioning`,
        (_, res, ctx) => res(ctx.status(400), ctx.json({ errors: [] })),
      ),
    );

    render(<MyVAHealth />);
    await waitFor(
      () => {
        expect(pushState.called).to.be.true;
        expect(go.calledWith('/auth/login/callback/?auth=fail&code=110'));
      },
      { timeout: 3500 },
    );
  });

  it('should redirect formatted redirect url when api returns 200', async () => {
    global.window.location = `https://dev.va.gov/terms-of-use/myvahealth/?ssoeTarget=${ssoeTarget}`;

    server.use(
      rest.put(
        `https://dev-api.va.gov/v0/terms_of_use_agreements/update_provisioning`,
        (_, res, ctx) => res(ctx.status(200), ctx.json({ provisioned: true })),
      ),
    );

    render(<MyVAHealth />);

    await waitFor(() => {
      expect(global.window.location).to.eql(ssoeTarget);
    });
  });
});
