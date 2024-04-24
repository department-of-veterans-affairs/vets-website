import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { HCA_ENROLLMENT_STATUSES } from '../../../../../../utils/constants';
import EnrollmentStatusFAQ from '../../../../../../components/IntroductionPage/EnrollmentStatus/FAQ';

describe('hca <EnrollmentStatusFAQ>', () => {
  const expectedTestIds = {
    [HCA_ENROLLMENT_STATUSES.activeDuty]: ['hca-enrollment-faq-8'],
    [HCA_ENROLLMENT_STATUSES.canceledDeclined]: [
      'hca-enrollment-faq-5',
      'hca-enrollment-faq-11',
      'hca-reapply-faq-4',
    ],
    [HCA_ENROLLMENT_STATUSES.closed]: [
      'hca-enrollment-faq-5',
      'hca-enrollment-faq-11',
      'hca-reapply-faq-4',
    ],
    [HCA_ENROLLMENT_STATUSES.enrolled]: [
      'hca-enrollment-faq-1',
      'hca-reapply-faq-1',
    ],
    [HCA_ENROLLMENT_STATUSES.ineligCHAMPVA]: [
      'hca-enrollment-faq-4',
      'hca-reapply-faq-2',
    ],
    [HCA_ENROLLMENT_STATUSES.ineligCharacterOfDischarge]: [
      'hca-enrollment-faq-2',
      'hca-enrollment-faq-9',
      'hca-enrollment-faq-11',
      'hca-reapply-faq-2',
    ],
    [HCA_ENROLLMENT_STATUSES.ineligCitizens]: [
      'hca-enrollment-faq-2',
      'hca-reapply-faq-2',
    ],
    [HCA_ENROLLMENT_STATUSES.ineligFilipinoScouts]: [
      'hca-enrollment-faq-2',
      'hca-reapply-faq-2',
    ],
    [HCA_ENROLLMENT_STATUSES.ineligFugitiveFelon]: [
      'hca-enrollment-faq-5',
      'hca-reapply-faq-2',
    ],
    [HCA_ENROLLMENT_STATUSES.ineligGuardReserve]: [
      'hca-enrollment-faq-2',
      'hca-enrollment-faq-11',
      'hca-reapply-faq-2',
    ],
    [HCA_ENROLLMENT_STATUSES.ineligMedicare]: [
      'hca-enrollment-faq-5',
      'hca-enrollment-faq-11',
      'hca-reapply-faq-2',
    ],
    [HCA_ENROLLMENT_STATUSES.ineligNotEnoughTime]: [
      'hca-enrollment-faq-2',
      'hca-enrollment-faq-11',
      'hca-reapply-faq-2',
    ],
    [HCA_ENROLLMENT_STATUSES.ineligNotVerified]: [
      'hca-enrollment-faq-3',
      'hca-enrollment-faq-11',
      'hca-reapply-faq-2',
    ],
    [HCA_ENROLLMENT_STATUSES.ineligOther]: [
      'hca-enrollment-faq-5',
      'hca-enrollment-faq-11',
      'hca-reapply-faq-2',
    ],
    [HCA_ENROLLMENT_STATUSES.ineligOver65]: [
      'hca-enrollment-faq-5',
      'hca-enrollment-faq-11',
      'hca-reapply-faq-2',
    ],
    [HCA_ENROLLMENT_STATUSES.ineligRefusedCopay]: [
      'hca-enrollment-faq-5',
      'hca-enrollment-faq-11',
      'hca-reapply-faq-2',
    ],
    [HCA_ENROLLMENT_STATUSES.ineligTrainingOnly]: [
      'hca-enrollment-faq-2',
      'hca-enrollment-faq-11',
      'hca-reapply-faq-2',
    ],
    [HCA_ENROLLMENT_STATUSES.nonMilitary]: ['hca-enrollment-faq-10'],
    [HCA_ENROLLMENT_STATUSES.pendingMt]: [
      'hca-enrollment-faq-6',
      'hca-reapply-faq-5',
    ],
    [HCA_ENROLLMENT_STATUSES.pendingOther]: [
      'hca-enrollment-faq-7',
      'hca-reapply-faq-6',
    ],
    [HCA_ENROLLMENT_STATUSES.pendingPurpleHeart]: [
      'hca-enrollment-faq-6',
      'hca-reapply-faq-5',
    ],
    [HCA_ENROLLMENT_STATUSES.pendingUnverified]: [
      'hca-enrollment-faq-7',
      'hca-reapply-faq-6',
    ],
    [HCA_ENROLLMENT_STATUSES.rejectedIncWrongEntry]: [
      'hca-enrollment-faq-5',
      'hca-enrollment-faq-11',
      'hca-reapply-faq-4',
    ],
    [HCA_ENROLLMENT_STATUSES.rejectedScWrongEntry]: [
      'hca-enrollment-faq-5',
      'hca-enrollment-faq-11',
      'hca-reapply-faq-4',
    ],
    [HCA_ENROLLMENT_STATUSES.rejectedRightEntry]: [
      'hca-enrollment-faq-5',
      'hca-enrollment-faq-11',
      'hca-reapply-faq-4',
    ],
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
        HCA_ENROLLMENT_STATUSES.deceased,
        HCA_ENROLLMENT_STATUSES.noneOfTheAbove,
      ]);
      const possibleEnrollmentStatuses = Object.values({
        ...HCA_ENROLLMENT_STATUSES,
      }).filter(statusCode => !excludedStatuses.has(statusCode));
      const testedEnrollmentStatuses = Object.keys(expectedTestIds);
      expect(
        possibleEnrollmentStatuses.every(statusCode =>
          testedEnrollmentStatuses.includes(statusCode),
        ),
      ).to.be.true;
    });

    Object.keys(expectedTestIds).forEach(statusCode => {
      it(`should render the correct content for status: ${statusCode}`, () => {
        const { mockStore } = getData({ statusCode });
        const { container } = render(
          <Provider store={mockStore}>
            <EnrollmentStatusFAQ />
          </Provider>,
        );
        const allFaqs = container.querySelectorAll('.hca-enrollment-faq');
        const testIds = expectedTestIds[statusCode];
        expect(allFaqs).to.have.lengthOf(testIds.length);
        testIds.forEach(id => {
          const selector = container.querySelector(`[data-testid="${id}"]`);
          expect(selector).to.exist;
        });
      });
    });
  });
});
