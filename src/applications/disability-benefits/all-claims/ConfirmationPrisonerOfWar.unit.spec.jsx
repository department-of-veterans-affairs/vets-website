import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import ConfirmationPrisonerOfWar from './components/confirmationFields/ConfirmationPrisonerOfWar';

describe('ConfirmationPrisonerOfWar', () => {
  it('should render null when powStatus is undefined', () => {
    const { container } = render(<ConfirmationPrisonerOfWar formData={{}} />);
    expect(container.firstChild).to.be.null;
  });

  it('should render "No" when POW status is false', () => {
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

  it('should render complete POW information with multiple confinement periods and disabilities', () => {
    const formData = {
      newDisabilities: [
        {
          cause: 'NEW',
          primaryDescription: 'sample description',
          'view:serviceConnectedDisability': {},
          condition: 'tinnitus (ringing or hissing in ears)',
        },
        {
          cause: 'NEW',
          primaryDescription: 'another description',
          'view:serviceConnectedDisability': {},
          condition: 'ACL tear (anterior cruciate ligament tear), bilateral',
        },
        {
          cause: 'SECONDARY',
          'view:secondaryFollowUp': {
            causedByDisability: 'Tinnitus (Ringing Or Hissing In Ears)',
            causedByDisabilityDescription: 'secondary description',
          },
          'view:serviceConnectedDisability': {},
          condition: 'PTSD (post-traumatic stress disorder)',
        },
      ],
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
          tinnitusringingorhissinginears: true,
          acltearanteriorcruciateligamenttearbilateral: false,
          ptsdposttraumaticstressdisorder: true,
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
    expect(container.textContent).to.contain(
      'Tinnitus (Ringing Or Hissing In Ears)',
    );
    expect(container.textContent).to.contain(
      'PTSD (Post-Traumatic Stress Disorder)',
    );
    expect(container.textContent).to.not.contain(
      'ACL Tear (Anterior Cruciate Ligament Tear), Bilateral',
    );
  });

  it('should properly display readable (non-sippable) disability names', () => {
    const formData = {
      newDisabilities: [
        {
          cause: 'NEW',
          primaryDescription: 'asdf',
          'view:serviceConnectedDisability': {},
          condition: 'tinnitus (ringing or hissing in ears)',
        },
        {
          cause: 'NEW',
          primaryDescription: 'asdf',
          'view:serviceConnectedDisability': {},
          condition: 'ACL tear (anterior cruciate ligament tear), bilateral',
        },
        {
          cause: 'SECONDARY',
          'view:secondaryFollowUp': {
            causedByDisability: 'Tinnitus (Ringing Or Hissing In Ears)',
            causedByDisabilityDescription: 'asdfasdf',
          },
          'view:serviceConnectedDisability': {},
          condition: 'PTSD (post-traumatic stress disorder)',
        },
      ],
      'view:powStatus': true,
      'view:isPow': {
        powDisabilities: {
          tinnitusringingorhissinginears: true,
          acltearanteriorcruciateligamenttearbilateral: true,
          ptsdposttraumaticstressdisorder: true,
        },
      },
    };

    const { container } = render(
      <ConfirmationPrisonerOfWar formData={formData} />,
    );

    expect(container.textContent).to.contain(
      'Tinnitus (Ringing Or Hissing In Ears)',
    );
    expect(container.textContent).to.contain(
      'ACL Tear (Anterior Cruciate Ligament Tear), Bilateral',
    );
    expect(container.textContent).to.contain(
      'PTSD (Post-Traumatic Stress Disorder)',
    );
  });

  it('should handle POW with no selected POWdisabilities', () => {
    const formData = {
      newDisabilities: [
        {
          cause: 'NEW',
          primaryDescription: 'asdf',
          'view:serviceConnectedDisability': {},
          condition: 'tinnitus (ringing or hissing in ears)',
        },
        {
          cause: 'NEW',
          primaryDescription: 'asdf',
          'view:serviceConnectedDisability': {},
          condition: 'ACL tear (anterior cruciate ligament tear), bilateral',
        },
        {
          cause: 'SECONDARY',
          'view:secondaryFollowUp': {
            causedByDisability: 'Tinnitus (Ringing Or Hissing In Ears)',
            causedByDisabilityDescription: 'asdfasdf',
          },
          'view:serviceConnectedDisability': {},
          condition: 'PTSD (post-traumatic stress disorder)',
        },
      ],
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
    expect(container.textContent).to.not.contain(
      'Which of your conditions is connected to your POW experience?',
    );
  });
});
