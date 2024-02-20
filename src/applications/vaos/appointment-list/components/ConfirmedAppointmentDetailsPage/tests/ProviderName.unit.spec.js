import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import ProviderName from '../ProviderName';

describe('VAOS Component: ProviderName', () => {
  const appointmentData = {
    communityCareProvider: {
      providerName: ['First LastName'],
    },
  };

  it('should render provider name', async () => {
    const appointment = {
      ...appointmentData,
    };

    const screen = render(<ProviderName appointment={appointment} useV2 />);

    expect(screen.baseElement).to.contain.text('First LastName');
  });
  it('should not render provider name when communityCareProvider is missing', async () => {
    const appointment = {};
    const screen = render(<ProviderName appointment={appointment} useV2 />);

    expect(screen.baseElement).to.not.contain.text('First LastName');
  });
  it('should not render provider name when useV2 is false', async () => {
    const appointment = {
      ...appointmentData,
    };

    const screen = render(
      <ProviderName appointment={appointment} useV2={false} />,
    );
    expect(screen.baseElement).to.not.contain.text('First LastName');
  });
});
