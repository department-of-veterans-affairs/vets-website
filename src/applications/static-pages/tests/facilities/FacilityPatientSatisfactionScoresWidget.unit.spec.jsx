import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { mockApiRequest, resetFetch } from 'platform/testing/unit/helpers';
import { mockFacilityLocatorApiResponse } from './mockFacilitiesData';
import FacilityPatientSatisfactionScoresWidget from '../../facilities/FacilityPatientSatisfactionScoresWidget';

describe('facilities <FacilityPatientSatisfactionScoresWidget>', () => {
  it('should render loading', () => {
    const tree = shallow(
      <FacilityPatientSatisfactionScoresWidget
        facilityId={mockFacilityLocatorApiResponse.data[0].id}
      />,
      {
        disableLifecycleMethods: true,
      },
    );

    expect(tree.find('LoadingIndicator').exists()).to.be.true;
    tree.unmount();
  });

  it('should render facility patient satisfaction score data', done => {
    mockApiRequest({ data: mockFacilityLocatorApiResponse.data[0] });

    const tree = shallow(
      <FacilityPatientSatisfactionScoresWidget
        facilityId={mockFacilityLocatorApiResponse.data[0].id}
      />,
    );
    tree.instance().request.then(() => {
      tree.update();
      expect(tree.find('LoadingIndicator').exists()).to.be.false;

      const satisfactionScoresHeader = tree.find('h2');
      expect(satisfactionScoresHeader.text()).to.contain(
        'Our patient satisfaction scores',
      );

      const facilityPatientSatisfactionScoresEffectiveDate = tree.find(
        '#facility-patient-satisfaction-scores-effective-date',
      );
      expect(facilityPatientSatisfactionScoresEffectiveDate.text()).to.contain(
        'Last updated: May 22, 2018',
      );

      const primaryUrgentScore = tree.find(
        '#facility-patient-satisfaction-scores-primary-urgent-score',
      );
      expect(primaryUrgentScore.text()).to.contain('N/A');

      const primaryRoutineScore = tree.find(
        '#facility-patient-satisfaction-scores-primary-routine-score',
      );
      expect(primaryRoutineScore.text()).to.contain('88%');

      const specialtyUrgentScore = tree.find(
        '#facility-patient-satisfaction-scores-specialty-urgent-score',
      );
      expect(specialtyUrgentScore.text()).to.contain('76%');

      const specialtyRoutineScore = tree.find(
        '#facility-patient-satisfaction-scores-specialty-routine-score',
      );
      expect(specialtyRoutineScore.text()).to.contain('91%');

      tree.unmount();
      resetFetch();
      done();
    });
  });
});
