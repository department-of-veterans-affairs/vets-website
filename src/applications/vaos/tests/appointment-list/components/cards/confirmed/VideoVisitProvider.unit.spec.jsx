import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import VideoVisitProvider from '../../../../../appointment-list/components/cards/confirmed/VideoVisitProvider';

const participantMock = [
  { actor: { reference: 'Location/test' } },
  { actor: { reference: 'Practitioner/Tester', display: 'Tester' } },
];

describe('VAOS integration: VA Video Visit Provider', () => {
  it('should show practitioner', async () => {
    const screen = render(
      <VideoVisitProvider participants={participantMock} />,
    );

    expect(screen.baseElement).to.contain.text("You'll be meeting with");
    expect(screen.baseElement).to.contain.text('Tester');
  });

  it('should not show practitioner', async () => {
    const screen = render(<VideoVisitProvider participants="" />);

    expect(screen.baseElement).to.not.contain.text("You'll be meeting with");
  });
});
