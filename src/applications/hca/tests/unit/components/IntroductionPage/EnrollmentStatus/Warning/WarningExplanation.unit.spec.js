import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { HCA_ENROLLMENT_STATUSES } from '../../../../../../utils/constants';
import WarningExplanation from '../../../../../../components/IntroductionPage/EnrollmentStatus/Warning/WarningExplanation';

describe('hca <WarningExplanation>', () => {
  const expectedTestIds = {
    [HCA_ENROLLMENT_STATUSES.canceledDeclined]: 'hca-enrollment-text-11',
    [HCA_ENROLLMENT_STATUSES.closed]: 'hca-enrollment-text-11',
    [HCA_ENROLLMENT_STATUSES.deceased]: 'hca-enrollment-text-7',
    [HCA_ENROLLMENT_STATUSES.ineligCHAMPVA]: 'hca-enrollment-text-5',
    [HCA_ENROLLMENT_STATUSES.ineligCharacterOfDischarge]:
      'hca-enrollment-text-2',
    [HCA_ENROLLMENT_STATUSES.ineligCitizens]: 'hca-enrollment-text-6',
    [HCA_ENROLLMENT_STATUSES.ineligFilipinoScouts]: 'hca-enrollment-text-6',
    [HCA_ENROLLMENT_STATUSES.ineligGuardReserve]: 'hca-enrollment-text-4',
    [HCA_ENROLLMENT_STATUSES.ineligNotEnoughTime]: 'hca-enrollment-text-1',
    [HCA_ENROLLMENT_STATUSES.ineligNotVerified]: 'hca-enrollment-text-3',
    [HCA_ENROLLMENT_STATUSES.ineligTrainingOnly]: 'hca-enrollment-text-1',
    [HCA_ENROLLMENT_STATUSES.pendingMt]: 'hca-enrollment-text-8',
    [HCA_ENROLLMENT_STATUSES.pendingOther]: 'hca-enrollment-text-9',
    [HCA_ENROLLMENT_STATUSES.pendingPurpleHeart]: 'hca-enrollment-text-10',
    [HCA_ENROLLMENT_STATUSES.pendingUnverified]: 'hca-enrollment-text-9',
    [HCA_ENROLLMENT_STATUSES.rejectedIncWrongEntry]: 'hca-enrollment-text-11',
    [HCA_ENROLLMENT_STATUSES.rejectedScWrongEntry]: 'hca-enrollment-text-11',
    [HCA_ENROLLMENT_STATUSES.rejectedRightEntry]: 'hca-enrollment-text-11',
  };
  const getData = ({ statusCode = null }) => ({
    mockStore: {
      getState: () => ({
        hcaEnrollmentStatus: { statusCode },
      }),
      subscribe: () => {},
      dispatch: () => {},
    },
  });

  context('when the content is generated based on enrollment status', () => {
    it('should have content for all possible statuses', () => {
      const excludedStatuses = new Set([
        HCA_ENROLLMENT_STATUSES.activeDuty,
        HCA_ENROLLMENT_STATUSES.enrolled,
        HCA_ENROLLMENT_STATUSES.ineligFugitiveFelon,
        HCA_ENROLLMENT_STATUSES.ineligMedicare,
        HCA_ENROLLMENT_STATUSES.ineligOther,
        HCA_ENROLLMENT_STATUSES.ineligOver65,
        HCA_ENROLLMENT_STATUSES.ineligRefusedCopay,
        HCA_ENROLLMENT_STATUSES.nonMilitary,
        HCA_ENROLLMENT_STATUSES.noneOfTheAbove,
      ]);
      const possibleStatuses = Object.values({
        ...HCA_ENROLLMENT_STATUSES,
      }).filter(statusCode => !excludedStatuses.has(statusCode));
      const testedEnrollmentStatuses = Object.keys(expectedTestIds);
      expect(
        possibleStatuses.every(statusCode =>
          testedEnrollmentStatuses.includes(statusCode),
        ),
      ).to.be.true;
    });

    Object.keys(expectedTestIds).forEach(statusCode => {
      it(`should render the correct content for status: ${statusCode}`, () => {
        const { mockStore } = getData({ statusCode });
        const { container } = render(
          <Provider store={mockStore}>
            <WarningExplanation />
          </Provider>,
        );
        const selector = container.querySelector(
          `[data-testid="${expectedTestIds[statusCode]}"]`,
        );
        expect(selector).to.exist;
      });
    });
  });
});
