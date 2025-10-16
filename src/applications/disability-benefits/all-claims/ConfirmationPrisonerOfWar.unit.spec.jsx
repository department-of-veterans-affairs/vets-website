import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import ConfirmationPrisonerOfWar from './components/ConfirmationPrisonerOfWar';

describe('ConfirmationPrisonerOfWar', () => {
  it('should render null when powStatus is undefined', () => {
    const { container } = render(<ConfirmationPrisonerOfWar formData={{}} />);
    expect(container.firstChild).to.be.null;
  });

  it('should render "No" for non-POW status', () => {
    const formData = {
      'view:powStatus': false,
    };

    const { container } = render(
      <ConfirmationPrisonerOfWar formData={formData} />,
    );

    expect(container.textContent).to.contain('Prisoner of War (POW)');
    expect(container.textContent).to.contain('Have you ever been a POW?');
    expect(container.textContent).to.contain('No');
  });

  it('should render complete POW information with multiple confinements and disabilities', () => {
    const formData = {
      'view:powStatus': true,
      'view:isPow': {
        confinements: [
          {
            from: '2020-01-01',
            to: '2020-06-30',
          },
          {
            from: '2021-03-15',
            to: '2021-12-31',
          },
        ],
        powDisabilities: {
          'anxiety disorder': true,
          ptsd: true,
          arthritis: false,
        },
      },
    };

    const { container } = render(
      <ConfirmationPrisonerOfWar formData={formData} />,
    );

    // Check POW status
    expect(container.textContent).to.contain('Have you ever been a POW?');
    expect(container.textContent).to.contain('Yes');

    // Check confinement periods
    expect(container.textContent).to.contain('Periods of confinement');
    expect(container.textContent).to.contain(
      'From January 1, 2020 to June 30, 2020',
    );
    expect(container.textContent).to.contain(
      'From March 15, 2021 to December 31, 2021',
    );

    // Check disabilities (should only show those marked true)
    expect(container.textContent).to.contain(
      'Which of your conditions is connected to your POW experience?',
    );
    expect(container.textContent).to.contain('Anxiety Disorder');
    expect(container.textContent).to.contain('Ptsd');
    expect(container.textContent).not.to.contain('Arthritis');
  });

  it('should handle partial confinement dates', () => {
    const formData = {
      'view:powStatus': true,
      'view:isPow': {
        confinements: [
          {
            from: '2020-01-01',
            // missing 'to' date
          },
          {
            // missing 'from' date
            to: '2021-12-31',
          },
        ],
      },
    };

    const { container } = render(
      <ConfirmationPrisonerOfWar formData={formData} />,
    );

    expect(container.textContent).to.contain('From January 1, 2020 to N/A');
    expect(container.textContent).to.contain('From N/A to December 31, 2021');
  });

  it('should handle POW with no confinements', () => {
    const formData = {
      'view:powStatus': true,
      'view:isPow': {
        confinements: [],
        powDisabilities: {
          ptsd: true,
        },
      },
    };

    const { container } = render(
      <ConfirmationPrisonerOfWar formData={formData} />,
    );

    expect(container.textContent).to.contain('Yes');
    expect(container.textContent).not.to.contain('From');
    expect(container.textContent).to.contain('Ptsd');
  });

  it('should handle POW with no disabilities', () => {
    const formData = {
      'view:powStatus': true,
      'view:isPow': {
        confinements: [
          {
            from: '2020-01-01',
            to: '2020-06-30',
          },
        ],
        powDisabilities: {},
      },
    };

    const { container } = render(
      <ConfirmationPrisonerOfWar formData={formData} />,
    );

    expect(container.textContent).to.contain(
      'From January 1, 2020 to June 30, 2020',
    );
    expect(container.textContent).to.contain('None selected');
  });

  it('should handle missing isPow object', () => {
    const formData = {
      'view:powStatus': true,
      // missing view:isPow
    };

    const { container } = render(
      <ConfirmationPrisonerOfWar formData={formData} />,
    );

    expect(container.textContent).to.contain('Yes');
    expect(container.textContent).to.contain('None selected');
  });

  it('should properly capitalize disability names', () => {
    const formData = {
      'view:powStatus': true,
      'view:isPow': {
        powDisabilities: {
          'post traumatic stress disorder': true,
          'chronic pain syndrome': true,
        },
      },
    };

    const { container } = render(
      <ConfirmationPrisonerOfWar formData={formData} />,
    );

    expect(container.textContent).to.contain('Post Traumatic Stress Disorder');
    expect(container.textContent).to.contain('Chronic Pain Syndrome');
  });
});
