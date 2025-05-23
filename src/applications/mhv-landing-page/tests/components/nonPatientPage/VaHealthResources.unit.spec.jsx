import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import * as recordEventModule from 'platform/monitoring/record-event';
import VaHealthResources from '../../../components/nonPatientPage/VaHealthResources';

describe('VaHealthResources component', () => {
  const healthResourcesLinks = [
    {
      text: 'VA Mental Health Services',
      href: 'https://www.va.gov/mental-health/',
    },
    {
      text: 'VA Women Veterans Health Care',
      href: 'https://www.va.gov/women-veterans/',
    },
  ];

  it('renders the correct heading', () => {
    const { getByRole } = render(
      <VaHealthResources healthResourcesLinks={healthResourcesLinks} />,
    );
    expect(getByRole('heading', { level: 3, name: /VA health resources/ })).to
      .exist;
  });

  it('renders a list of health resource links', () => {
    const { getAllByRole } = render(
      <VaHealthResources healthResourcesLinks={healthResourcesLinks} />,
    );
    const links = getAllByRole('link');
    expect(links).to.have.lengthOf(2);
    expect(links[0]).to.have.text('VA Mental Health Services');
    expect(links[0].href).to.equal('https://www.va.gov/mental-health/');
    expect(links[1]).to.have.text('VA Women Veterans Health Care');
    expect(links[1].href).to.equal('https://www.va.gov/women-veterans/');
  });

  it('calls recordEvent when a link is clicked', async () => {
    const recordEventSpy = sinon.stub(recordEventModule, 'default');

    const { getByText } = render(
      <VaHealthResources healthResourcesLinks={healthResourcesLinks} />,
    );
    const link = getByText('VA Mental Health Services');
    link.click();
    await waitFor(() => {
      expect(recordEventSpy.calledOnce).to.be.true;
    });

    expect(
      recordEventSpy.calledWithMatch({
        event: 'nav-linkslist',
        'links-list-header': 'VA Mental Health Services',
        'links-list-section-header': 'VA health resources',
      }),
    ).to.be.true;

    recordEventSpy.restore();
  });
});
