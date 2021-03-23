import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { mockFacilityLocatorApiResponse } from './mockFacilitiesData';
import { FacilityPatientSatisfactionScoresWidget } from '../../facilities/FacilityPatientSatisfactionScoresWidget';

describe('facilities <FacilityPatientSatisfactionScoresWidget>', () => {
  it('should render loading', () => {
    const tree = shallow(<FacilityPatientSatisfactionScoresWidget loading />);

    expect(tree.find('LoadingIndicator').exists()).to.be.true;
    tree.unmount();
  });

  it.skip('should render facility patient satisfaction score data', () => {
    const tree = shallow(
      <FacilityPatientSatisfactionScoresWidget
        loading={false}
        facility={mockFacilityLocatorApiResponse.data[0]}
      />,
    );

    expect(tree.find('LoadingIndicator').exists()).to.be.false;

    const facilityPatientSatisfactionScoresEffectiveDate = tree.find(
      '#facility-patient-satisfaction-scores-effective-date',
    );
    expect(facilityPatientSatisfactionScoresEffectiveDate.text()).to.contain(
      'Current as of May 22, 2018',
    );

    const primaryUrgentScore = tree.find(
      '#facility-patient-satisfaction-scores-primary-urgent-score',
    );
    expect(primaryUrgentScore.isEmpty()).to.be.true;

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
  });
});
