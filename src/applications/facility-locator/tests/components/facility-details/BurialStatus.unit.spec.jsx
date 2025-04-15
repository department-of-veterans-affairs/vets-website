import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import BurialStatus from '../../../components/facility-details/BurialStatus';
import { BurialStatusDisplay } from '../../../constants';

describe('facility-locator', () => {
  describe('BurialStatus', () => {
    it('should render the burial status of the provided facility', () => {
      Object.keys(BurialStatusDisplay).forEach(status => {
        const facility = {
          attributes: {
            operatingStatus: {
              supplementalStatus: [{ id: status }],
            },
          },
        };
        const { getByText } = render(<BurialStatus facility={facility} />);

        expect(getByText(BurialStatusDisplay[status].statusTitle)).to.be.ok;

        // The BurialStatusDisplay["default"] does not provide a statusDescription
        if (BurialStatusDisplay[status].statusDescription) {
          expect(getByText(BurialStatusDisplay[status].statusDescription)).to.be
            .ok;
        }
      });
    });

    it('should render default status when facility status is not in BurialStatusDisplay', () => {
      const facility = {
        attributes: {
          operatingStatus: {
            supplementalStatus: [{ id: 'UNKNOWN_STATUS' }],
          },
        },
      };
      const { getByText } = render(<BurialStatus facility={facility} />);

      expect(getByText(BurialStatusDisplay.DEFAULT.statusTitle)).to.be.ok;
    });

    it('should render burial link when status is BURIALS_UNDER_CONSTRUCTION', () => {
      const facility = {
        attributes: {
          operatingStatus: {
            supplementalStatus: [{ id: 'BURIALS_UNDER_CONSTRUCTION' }],
          },
        },
      };
      const { getByText } = render(<BurialStatus facility={facility} />);

      expect(
        getByText(BurialStatusDisplay.BURIALS_UNDER_CONSTRUCTION.statusTitle),
      ).to.be.ok;
    });

    it('should render memorial description for other statuses', () => {
      const facility = {
        attributes: {
          operatingStatus: {
            supplementalStatus: [{ id: 'BURIALS_CREMATION_ONLY' }],
          },
        },
      };
      const { getByText } = render(<BurialStatus facility={facility} />);

      expect(getByText(BurialStatusDisplay.BURIALS_CREMATION_ONLY.statusTitle))
        .to.be.ok;
    });

    it('should render description details as a list if present', () => {
      Object.keys(BurialStatusDisplay).forEach(status => {
        const { descriptionDetails } = BurialStatusDisplay[status];

        if (descriptionDetails && descriptionDetails.length > 0) {
          const facility = {
            attributes: {
              operatingStatus: {
                supplementalStatus: [{ id: status }],
              },
            },
          };
          const { getByText, container } = render(
            <BurialStatus facility={facility} />,
          );

          descriptionDetails.forEach(detail => {
            expect(getByText(detail)).to.be.ok;
          });

          expect(container.querySelector('ul.va-list--disc')).to.exist;
        }
      });
    });
  });
});
