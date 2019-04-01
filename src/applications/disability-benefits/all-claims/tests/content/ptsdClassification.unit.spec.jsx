import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import {
  getPtsdClassification,
  PtsdNameTitle,
} from '../../content/ptsdClassification';

describe('781 getPtsdClassification', () => {
  it('Combat classification content is correct', () => {
    const formData = {
      'view:selectablePtsdTypes': {
        'view:combatPtsdType': true,
      },
    };

    expect(getPtsdClassification(formData, '781').incidentText).to.equal(
      'combat',
    );
    expect(getPtsdClassification(formData, '781').incidentTitle).to.equal(
      'Combat',
    );
  });

  it('Non-combat classification content is correct', () => {
    const formData = {
      'view:selectablePtsdTypes': {
        'view:nonCombatPtsdType': true,
      },
    };

    expect(getPtsdClassification(formData, '781').incidentText).to.equal(
      'non-combat',
    );
    expect(getPtsdClassification(formData, '781').incidentTitle).to.equal(
      'Non-combat',
    );
  });

  it('Combat and non-combat incident text is correct', () => {
    const formData = {
      'view:selectablePtsdTypes': {
        'view:combatPtsdType': true,
        'view:nonCombatPtsdType': true,
      },
    };

    expect(getPtsdClassification(formData, '781').incidentText).to.equal(
      'combat and non-combat',
    );
    expect(getPtsdClassification(formData, '781').incidentTitle).to.equal(
      'Combat & non-combat',
    );
  });
});

describe('781a getPtsdClassification', () => {
  it('Assault classification content is correct', () => {
    const formData = {
      'view:selectablePtsdTypes': {
        'view:assaultPtsdType': true,
      },
    };

    expect(getPtsdClassification(formData, '781a').incidentText).to.equal(
      'personal assault',
    );
    expect(getPtsdClassification(formData, '781a').incidentTitle).to.equal(
      'Personal assault',
    );
  });

  it('MST classification content is correct', () => {
    const formData = {
      'view:selectablePtsdTypes': {
        'view:mstPtsdType': true,
      },
    };

    expect(getPtsdClassification(formData, '781a').incidentText).to.equal(
      'sexual trauma',
    );
    expect(getPtsdClassification(formData, '781a').incidentTitle).to.equal(
      'Sexual trauma',
    );
  });

  it('Assault and MST classification content is correct', () => {
    const formData = {
      'view:selectablePtsdTypes': {
        'view:assaultPtsdType': true,
        'view:mstPtsdType': true,
      },
    };

    expect(getPtsdClassification(formData, '781a').incidentText).to.equal(
      'personal assault and sexual trauma',
    );
    expect(getPtsdClassification(formData, '781a').incidentTitle).to.equal(
      'Personal assault & sexual trauma',
    );
  });
});

describe('PtsdNameTitle', () => {
  it('renders correctly', () => {
    const formData = {
      'view:selectablePtsdTypes': {
        'view:combatPtsdType': true,
      },
    };

    const wrapper = shallow(
      <PtsdNameTitle formData={formData} formType="781" />,
    );
    expect(wrapper.find('legend').length).to.equal(1);
    wrapper.unmount();
  });
});
