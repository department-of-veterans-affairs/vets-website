import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import moment from 'moment';

import ClosedClaimMessage from '../../components/ClosedClaimMessage';

describe('<ClosedClaimMessage>', () => {
  context('EVSS claims', () => {
    it('should render closed claims within 30 days', () => {
      const claims = [
        {
          id: 1,
          type: 'evss_claims',
          attributes: {
            dateFiled: '2023-01-01',
            open: false,
            phaseChangeDate: moment()
              .add(-29, 'days')
              .format('YYYY-MM-DD'),
          },
        },
      ];
      const tree = SkinDeep.shallowRender(
        <ClosedClaimMessage claims={claims} />,
      );

      expect(tree.everySubTree('.usa-alert')).not.to.be.empty;
    });

    it('should not render closed claims at 30 days', () => {
      const claims = [
        {
          id: 1,
          type: 'evss_claims',
          attributes: {
            dateFiled: '2023-01-01',
            open: false,
            phaseChangeDate: moment()
              .add(-30, 'days')
              .format('YYYY-MM-DD'),
          },
        },
      ];
      const tree = SkinDeep.shallowRender(
        <ClosedClaimMessage claims={claims} />,
      );

      expect(tree.everySubTree('.usa-alert')).to.be.empty;
    });

    it('should render nothing when no closed claims', () => {
      const claims = [
        {
          id: 1,
          type: 'evss_claims',
          attributes: {
            dateFiled: '2023-01-01',
            open: true,
            phaseChangeDate: moment()
              .add(-29, 'days')
              .format('YYYY-MM-DD'),
          },
        },
      ];
      const tree = SkinDeep.shallowRender(
        <ClosedClaimMessage claims={claims} />,
      );

      expect(tree.text()).to.be.empty;
    });
  });

  context('Lighthouse claims', () => {
    it('should render closed claims within 30 days', () => {
      const claims = [
        {
          id: 1,
          type: 'claim',
          attributes: {
            claimDate: '2023-01-01',
            closeDate: moment()
              .add(-29, 'days')
              .format('YYYY-MM-DD'),
          },
        },
      ];

      const screen = render(<ClosedClaimMessage claims={claims} />);
      expect(screen.getByText('Recently closed:')).to.exist;
    });

    it('should not render closed claims at 30 days', () => {
      const claims = [
        {
          id: 1,
          type: 'claims',
          attributes: {
            claimDate: '2023-01-01',
            closeDate: moment()
              .add(-30, 'days')
              .format('YYYY-MM-DD'),
          },
        },
      ];

      const screen = render(<ClosedClaimMessage claims={claims} />);
      expect(screen.queryByText('Recently closed:')).to.not.exist;
    });

    it('should render nothing when no closed claims', () => {
      const claims = [
        {
          id: 1,
          type: 'claims',
          attributes: {
            claimDate: '2023-01-01',
            closeDate: null,
          },
        },
      ];

      const screen = render(<ClosedClaimMessage claims={claims} />);
      expect(screen.queryByText('Recently closed:')).to.not.exist;
    });
  });
});
