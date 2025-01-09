import React from 'react';
import { expect } from 'chai';

import Breadcrumbs from '../../../../components/common/Breadcrumbs';
import { renderTestApp } from '../../helpers';

describe('Breadcrumbs', () => {
  it('renders Breadcrumbs for the Home page (aka Landing Page)', () => {
    const { getByTestId } = renderTestApp(<Breadcrumbs />, {
      initialEntries: ['/'],
    });

    expect(getByTestId('breadcrumbs')).to.not.be.null;
  });

  it('renders Breadcrumbs for the Dashboard Page', () => {
    const { getByTestId } = renderTestApp(<Breadcrumbs />, {
      initialEntries: ['/dashboard'],
    });

    expect(getByTestId('breadcrumbs')).to.not.be.null;
  });

  it('renders Breadcrumbs for the POA Requests Page', () => {
    const { getByTestId } = renderTestApp(<Breadcrumbs />, {
      initialEntries: ['/poa-requests'],
    });

    expect(getByTestId('breadcrumbs')).to.not.be.null;
  });

  it('renders Breadcrumbs for the Permissions Page', () => {
    const { getByTestId } = renderTestApp(<Breadcrumbs />, {
      initialEntries: ['/permissions'],
    });

    expect(getByTestId('breadcrumbs')).to.not.be.null;
  });

  it('correctly renders breadcrumbs for a deeply nested path', () => {
    const { getByTestId } = renderTestApp(<Breadcrumbs />, {
      initialEntries: ['/poa-requests/a-deeply-nested-page'],
    });

    expect(getByTestId('breadcrumbs')).to.not.be.null;
  });
});
