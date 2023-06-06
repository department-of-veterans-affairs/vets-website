/**
 * Use this file for reference only - this matches the data sent to LGY, this is
 * not what the frontend submits to vets-api
 */
// * = required
const mockAddress = prefix => ({
  [`${prefix}address1`]: '123 Main St', // *
  [`${prefix}address2`]: 'Apt 456',
  [`${prefix}city`]: 'City', // *
  [`${prefix}state`]: 'State', // *
  [`${prefix}zip`]: '90210', // *
  [`${prefix}zipSuffix`]: '4321', // *
});

export const submitted = () => ({
  id: 0,
  referenceNumber: '5678901234',
  createDate: '2022-06-13T17: 47: 21.1242',
  // enum 3: SUBMITTED, RECEIVED, RETURNED
  status: 'SUBMITTED',
  veteran: {
    firstName: 'Vanilla', // *
    middleName: '', // *
    lastName: 'Ice', // *
    suffixName: 'Jr.', // *
    ...mockAddress('vet'), // *
    ...mockAddress('mailing'), // *
    contactPhone: '8005551212', // *
    contactEmail: '8005551313', // *
    valoanIndicator: true,
    vaHomeOwnIndicator: true,
    activeDutyIndicator: true, // *
    disabilityIndicator: true, // *
    relevantPriorLoans: [
      {
        valoanNumber: '345678901234',
        startDate: '2020-06-13T17:47:21.1247', // *
        paidoffDate: '2020-06-13T17:47:21.1247',
        loanAmount: 0, // *
        loanEntitlementCharged: 0,
        propertyOwned: true,
        homeSellIndicator: null, // LGY directed us to set this to null

        // when the FE sends the value of intent: 'REGULAR',
        // Regular intent will set the 4 following values to false:
        oneTimeRestorationRequested: false,
        irrrlRequested: false,
        cashoutRefinaceRequested: false,
        noRestorationEntitlementIndicator: false,
        ...mockAddress('property'), // *
      },
    ],
    periodsOfService: [
      {
        enteredOnDuty: '2022-06-13T17:47:21.124Z', // *
        releasedActiveDuty: '2022-06-13T17:47:21.1242',
        // enum 2: ACTIVE_DUTY, RESERVE_NATIONAL_GUARD
        serviceType: 'ACTIVE_DUTY',
        // enum 8: HONORABLE, UNDER_HONORABLE_CONDITIONS, GENERAL, UNKNOWN,
        // OTHER_THAN_HONORABLE_CONDIIONS, HONORABLE_FOR_VA_PURPOSES,
        // DISHONORABLE_FOR_VA_PURPOSES, DISHONORABLE
        characterOfService: 'HONORABLE',
        // enum 6: ARMY, NAVY, MARINES, AIR_FORCE, COAST_GUARD, OTHER
        militaryBranch: 'ARMY',
        activeDutyPoints: 'string',
        inactiveDutyPoints: 'string',
        qualifies: true,
        // enum 2: OFFICER, ENLISTED
        rankCode: 'OFFICER',
        disabilityIndicator: true,
      },
    ],
  },
});
