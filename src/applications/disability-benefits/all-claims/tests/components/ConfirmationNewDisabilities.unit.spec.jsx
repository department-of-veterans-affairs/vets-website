import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import ConfirmationNewDisabilities from '../../components/confirmationFields/ConfirmationNewDisabilities';

describe('ConfirmationNewDisabilities', () => {
  describe('NEW conditions', () => {
    it('should render NEW condition with required fields', () => {
      const formData = {
        newDisabilities: [
          {
            condition: 'hearing loss',
            cause: 'NEW',
            primaryDescription: 'Caused by loud machinery during service',
          },
        ],
      };

      const { getByText } = render(
        <ConfirmationNewDisabilities formData={formData} />,
      );

      expect(getByText('Hearing Loss')).to.exist;
      expect(getByText('Type of condition')).to.exist;
      expect(getByText('New condition')).to.exist;
      expect(getByText('Cause')).to.exist;
      expect(
        getByText(
          'My condition was caused by an injury or exposure during my military service.',
        ),
      ).to.exist;
      expect(getByText('Description')).to.exist;
      expect(getByText('Caused by loud machinery during service')).to.exist;
    });

    it('should render NEW condition with optional conditionDate', () => {
      const formData = {
        newDisabilities: [
          {
            condition: 'test condition',
            cause: 'NEW',
            primaryDescription: 'Description with date',
            conditionDate: '2020-01-15',
          },
        ],
      };

      const { getByText } = render(
        <ConfirmationNewDisabilities formData={formData} />,
      );

      expect(getByText('Test Condition')).to.exist;
      expect(getByText('Date')).to.exist;
      expect(getByText('January 15, 2020')).to.exist;
    });
  });

  describe('SECONDARY conditions', () => {
    it('should render SECONDARY condition with required fields', () => {
      const formData = {
        newDisabilities: [
          {
            condition: 'lower back pain',
            cause: 'SECONDARY',
            'view:secondaryFollowUp': {
              causedByDisability: 'Knee injury',
              causedByDisabilityDescription:
                'The knee injury caused me to walk with a limp, which led to back pain',
            },
          },
        ],
      };

      const { getByText } = render(
        <ConfirmationNewDisabilities formData={formData} />,
      );

      expect(getByText('Lower Back Pain')).to.exist;
      expect(getByText('Secondary condition')).to.exist;
      expect(
        getByText(
          'My condition was caused by another service-connected disability I already have. (For example, I have a limp that caused lower-back problems.)',
        ),
      ).to.exist;
      expect(getByText('Caused by')).to.exist;
      expect(getByText('Knee injury')).to.exist;
      expect(
        getByText(
          'The knee injury caused me to walk with a limp, which led to back pain',
        ),
      ).to.exist;
    });

    it('should render SECONDARY condition with optional conditionDate', () => {
      const formData = {
        newDisabilities: [
          {
            condition: 'secondary with date',
            cause: 'SECONDARY',
            conditionDate: '2021-03-20',
            'view:secondaryFollowUp': {
              causedByDisability: 'Primary condition',
              causedByDisabilityDescription: 'How it was caused',
            },
          },
        ],
      };

      const { getByText } = render(
        <ConfirmationNewDisabilities formData={formData} />,
      );

      expect(getByText('Secondary With Date')).to.exist;
      expect(getByText('Date')).to.exist;
      expect(getByText('March 20, 2021')).to.exist;
    });
  });

  describe('WORSENED conditions', () => {
    it('should render WORSENED condition with required fields', () => {
      const formData = {
        newDisabilities: [
          {
            condition: 'knee injury',
            cause: 'WORSENED',
            'view:worsenedFollowUp': {
              worsenedDescription: 'Had minor knee pain before service',
              worsenedEffects:
                'Before service, could walk normally. Now cannot walk without assistance.',
            },
          },
        ],
      };

      const { getByText } = render(
        <ConfirmationNewDisabilities formData={formData} />,
      );

      expect(getByText('Knee Injury')).to.exist;
      expect(getByText('Worsened condition')).to.exist;
      expect(
        getByText(
          'My condition existed before I served in the military, but it got worse because of my military service.',
        ),
      ).to.exist;
      expect(getByText('Worsened description')).to.exist;
      expect(getByText('Had minor knee pain before service')).to.exist;
      expect(getByText('Worsened effects')).to.exist;
      expect(
        getByText(
          'Before service, could walk normally. Now cannot walk without assistance.',
        ),
      ).to.exist;
    });

    it('should render WORSENED condition with optional conditionDate', () => {
      const formData = {
        newDisabilities: [
          {
            condition: 'worsened with date',
            cause: 'WORSENED',
            conditionDate: '2019-06-10',
            'view:worsenedFollowUp': {
              worsenedDescription: 'Description in worsened field',
              worsenedEffects: 'Effects description',
            },
          },
        ],
      };

      const { getByText } = render(
        <ConfirmationNewDisabilities formData={formData} />,
      );

      expect(getByText('Worsened With Date')).to.exist;
      expect(getByText('Date')).to.exist;
      expect(getByText('June 10, 2019')).to.exist;
    });
  });

  describe('VA mistreatment conditions', () => {
    it('should render VA condition with required fields', () => {
      const formData = {
        newDisabilities: [
          {
            condition: 'infection',
            cause: 'VA',
            'view:vaFollowUp': {
              vaMistreatmentDescription:
                'Got infection during VA surgery on my shoulder',
              vaMistreatmentLocation: 'VA Hospital Boston',
              vaMistreatmentDate: 'March 2019',
            },
          },
        ],
      };

      const { getByText } = render(
        <ConfirmationNewDisabilities formData={formData} />,
      );

      expect(getByText('Infection')).to.exist;
      expect(getByText('VA condition')).to.exist;
      expect(
        getByText(
          'My condition was caused by an injury or event that happened when I was receiving VA care.',
        ),
      ).to.exist;
      expect(getByText('VA mistreatment description')).to.exist;
      expect(getByText('Got infection during VA surgery on my shoulder')).to
        .exist;
      expect(getByText('VA mistreatment location')).to.exist;
      expect(getByText('VA Hospital Boston')).to.exist;
      expect(getByText('VA mistreatment date')).to.exist;
      expect(getByText('March 2019')).to.exist;
    });

    it('should render VA condition with optional conditionDate', () => {
      const formData = {
        newDisabilities: [
          {
            condition: 'va with date',
            cause: 'VA',
            conditionDate: '2019-03-15',
            'view:vaFollowUp': {
              vaMistreatmentDescription: 'Description of incident',
              vaMistreatmentLocation: 'VA Medical Center',
              vaMistreatmentDate: 'A while ago',
            },
          },
        ],
      };

      const { getByText, queryByText } = render(
        <ConfirmationNewDisabilities formData={formData} />,
      );

      expect(getByText('Va With Date')).to.exist;
      expect(queryByText('Date')).to.be.null;
      expect(queryByText('March 15, 2019')).to.be.null;
      expect(getByText('VA mistreatment date')).to.exist;
      expect(getByText('A while ago')).to.exist;
    });

    it('should render VA conditionDate when vaMistreatmentDate is not present', () => {
      const formData = {
        newDisabilities: [
          {
            condition: 'va condition only',
            cause: 'VA',
            conditionDate: '2019-03-15',
            'view:vaFollowUp': {
              vaMistreatmentDescription: 'Description of incident',
              vaMistreatmentLocation: 'VA Medical Center',
            },
          },
        ],
      };

      const { getByText, queryByText } = render(
        <ConfirmationNewDisabilities formData={formData} />,
      );

      expect(getByText('Va Condition Only')).to.exist;
      expect(getByText('Date')).to.exist;
      expect(getByText('March 15, 2019')).to.exist;
      expect(queryByText('VA mistreatment date')).to.be.null;
    });

    it('should render VA condition with only vaMistreatmentDescription', () => {
      const formData = {
        newDisabilities: [
          {
            condition: 'partial va',
            cause: 'VA',
            'view:vaFollowUp': {
              vaMistreatmentDescription: 'Only description present',
            },
          },
        ],
      };

      const { container, getByText } = render(
        <ConfirmationNewDisabilities formData={formData} />,
      );

      expect(getByText('Partial Va')).to.exist;
      expect(getByText('VA mistreatment description')).to.exist;
      expect(getByText('Only description present')).to.exist;

      const locationDivs = Array.from(container.querySelectorAll('div')).filter(
        div => div.textContent === 'VA mistreatment location',
      );
      expect(locationDivs).to.have.length(0);

      const dateDivs = Array.from(container.querySelectorAll('div')).filter(
        div => div.textContent === 'VA mistreatment date',
      );
      expect(dateDivs).to.have.length(0);
    });

    it('should render VA condition with only vaMistreatmentLocation', () => {
      const formData = {
        newDisabilities: [
          {
            condition: 'va location only',
            cause: 'VA',
            'view:vaFollowUp': {
              vaMistreatmentLocation: 'VA Medical Center',
            },
          },
        ],
      };

      const { container, getByText } = render(
        <ConfirmationNewDisabilities formData={formData} />,
      );

      expect(getByText('Va Location Only')).to.exist;
      expect(getByText('VA mistreatment location')).to.exist;
      expect(getByText('VA Medical Center')).to.exist;

      const descDivs = Array.from(container.querySelectorAll('div')).filter(
        div => div.textContent === 'VA mistreatment description',
      );
      expect(descDivs).to.have.length(0);

      const dateDivs = Array.from(container.querySelectorAll('div')).filter(
        div => div.textContent === 'VA mistreatment date',
      );
      expect(dateDivs).to.have.length(0);
    });
  });

  describe('Edge cases', () => {
    it('should render nothing when no new disabilities are provided', () => {
      const formData = {
        newDisabilities: [],
      };
      const { container } = render(
        <ConfirmationNewDisabilities formData={formData} />,
      );
      expect(container.querySelectorAll('h4')).to.have.length(0);
    });

    it('should render nothing when formData is empty', () => {
      const { container } = render(
        <ConfirmationNewDisabilities formData={{}} />,
      );
      expect(container.querySelectorAll('h4')).to.have.length(0);
    });

    it('should handle legacy conditions without cause', () => {
      const formData = {
        newDisabilities: [
          {
            condition: 'legacy condition',
            primaryDescription: 'No cause specified',
          },
        ],
      };
      const { getByText } = render(
        <ConfirmationNewDisabilities formData={formData} />,
      );
      expect(getByText('Legacy Condition')).to.exist;
      expect(getByText('Claimed condition')).to.exist;
      expect(getByText('No cause specified')).to.exist;
    });

    it('should render multiple conditions of different types', () => {
      const formData = {
        newDisabilities: [
          {
            condition: 'Condition 1',
            cause: 'NEW',
            primaryDescription: 'Primary description 1',
          },
          {
            condition: 'Condition 2',
            cause: 'SECONDARY',
            primaryDescription: 'Primary description 2',
            'view:secondaryFollowUp': {
              causedByDisability: 'Condition A',
              causedByDisabilityDescription: 'Caused by description A',
            },
          },
        ],
      };
      const { container, getByText } = render(
        <ConfirmationNewDisabilities formData={formData} />,
      );
      expect(container.querySelectorAll('h4')).to.have.length(2);
      expect(getByText('Condition 1')).to.exist;
      expect(getByText('Primary description 1')).to.exist;
      expect(getByText('Condition 2')).to.exist;
      expect(getByText('Primary description 2')).to.exist;
      expect(getByText('Condition A')).to.exist;
      expect(getByText('Caused by description A')).to.exist;
    });

    it('should not render when condition is Rated Disability', () => {
      const formData = {
        newDisabilities: [{ condition: 'Rated Disability', cause: 'NEW' }],
      };

      const { container } = render(
        <ConfirmationNewDisabilities formData={formData} />,
      );

      expect(container.querySelectorAll('li')).to.have.length(0);
    });

    it('does not render when condition is Rated Disability', () => {
      const formData = {
        newDisabilities: [{ condition: 'Rated Disability' }],
      };

      const { container } = render(
        <ConfirmationNewDisabilities formData={formData} />,
      );

      expect(container.querySelectorAll('li')).to.have.length(0);
    });
  });
});
