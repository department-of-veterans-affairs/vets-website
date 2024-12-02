import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { HCA_ENROLLMENT_STATUSES } from '../../../../../../utils/constants';
import WarningHeadline from '../../../../../../components/IntroductionPage/EnrollmentStatus/Warning/WarningHeadline';
import content from '../../../../../../locales/en/content.json';

describe('hca <WarningHeadline>', () => {
  const expectedOutputs = {
    [HCA_ENROLLMENT_STATUSES.activeDuty]:
      content['enrollment-alert-title--active-duty'],
    [HCA_ENROLLMENT_STATUSES.canceledDeclined]:
      content['enrollment-alert-title--reapply'],
    [HCA_ENROLLMENT_STATUSES.closed]:
      content['enrollment-alert-title--reapply'],
    [HCA_ENROLLMENT_STATUSES.deceased]:
      content['enrollment-alert-title--deceased'],
    [HCA_ENROLLMENT_STATUSES.enrolled]:
      content['enrollment-alert-title--enrolled'],
    [HCA_ENROLLMENT_STATUSES.ineligCHAMPVA]:
      content['enrollment-alert-title--inelig'],
    [HCA_ENROLLMENT_STATUSES.ineligCharacterOfDischarge]:
      content['enrollment-alert-title--inelig'],
    [HCA_ENROLLMENT_STATUSES.ineligCitizens]:
      content['enrollment-alert-title--inelig'],
    [HCA_ENROLLMENT_STATUSES.ineligFilipinoScouts]:
      content['enrollment-alert-title--inelig'],
    [HCA_ENROLLMENT_STATUSES.ineligFugitiveFelon]:
      content['enrollment-alert-title--inelig'],
    [HCA_ENROLLMENT_STATUSES.ineligGuardReserve]:
      content['enrollment-alert-title--inelig'],
    [HCA_ENROLLMENT_STATUSES.ineligMedicare]:
      content['enrollment-alert-title--inelig'],
    [HCA_ENROLLMENT_STATUSES.ineligNotEnoughTime]:
      content['enrollment-alert-title--inelig'],
    [HCA_ENROLLMENT_STATUSES.ineligNotVerified]:
      content['enrollment-alert-title--inelig'],
    [HCA_ENROLLMENT_STATUSES.ineligOther]:
      content['enrollment-alert-title--inelig'],
    [HCA_ENROLLMENT_STATUSES.ineligOver65]:
      content['enrollment-alert-title--inelig'],
    [HCA_ENROLLMENT_STATUSES.ineligRefusedCopay]:
      content['enrollment-alert-title--inelig'],
    [HCA_ENROLLMENT_STATUSES.ineligTrainingOnly]:
      content['enrollment-alert-title--inelig'],
    [HCA_ENROLLMENT_STATUSES.nonMilitary]:
      content['enrollment-alert-title--non-military'],
    [HCA_ENROLLMENT_STATUSES.pendingMt]:
      content['enrollment-alert-title--more-info'],
    [HCA_ENROLLMENT_STATUSES.pendingOther]:
      content['enrollment-alert-title--review'],
    [HCA_ENROLLMENT_STATUSES.pendingPurpleHeart]:
      content['enrollment-alert-title--more-info'],
    [HCA_ENROLLMENT_STATUSES.pendingUnverified]:
      content['enrollment-alert-title--review'],
    [HCA_ENROLLMENT_STATUSES.rejectedIncWrongEntry]:
      content['enrollment-alert-title--reapply'],
    [HCA_ENROLLMENT_STATUSES.rejectedScWrongEntry]:
      content['enrollment-alert-title--reapply'],
    [HCA_ENROLLMENT_STATUSES.rejectedRightEntry]:
      content['enrollment-alert-title--reapply'],
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
        HCA_ENROLLMENT_STATUSES.noneOfTheAbove,
      ]);
      const possibleEnrollmentStatuses = Object.values({
        ...HCA_ENROLLMENT_STATUSES,
      }).filter(statusCode => !excludedStatuses.has(statusCode));
      const testedEnrollmentStatuses = Object.keys(expectedOutputs);
      expect(
        possibleEnrollmentStatuses.every(statusCode =>
          testedEnrollmentStatuses.includes(statusCode),
        ),
      ).to.be.true;
    });

    Object.keys(expectedOutputs).forEach(statusCode => {
      it(`should render the correct content for status: ${statusCode}`, () => {
        const { mockStore } = getData({ statusCode });
        const { container } = render(
          <Provider store={mockStore}>
            <WarningHeadline />
          </Provider>,
        );
        const selector = container.querySelector(
          '[data-testid="hca-enrollment-alert-heading"]',
        );
        expect(selector).to.contain.text(expectedOutputs[statusCode]);
      });
    });
  });
});
