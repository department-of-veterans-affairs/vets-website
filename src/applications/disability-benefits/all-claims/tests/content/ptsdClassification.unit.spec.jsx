import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import {
  getPtsdClassification,
  PtsdNameTitle,
} from '../../content/ptsdClassification';

describe('781 getPtsdClassification', () => {
  it('Combat incident text is correct', () => {
    const formData = {
      'view:selectablePtsdTypes': {
        'view:combatPtsdType': true,
      },
    };

    expect(getPtsdClassification(formData, '781').incidentText).to.equal(
      'Combat',
    );
  });

  it('Non-combat incident text is correct', () => {
    const formData = {
      'view:selectablePtsdTypes': {
        'view:noncombatPtsdType': true,
      },
    };

    expect(getPtsdClassification(formData, '781').incidentText).to.equal(
      'Non-Combat PTSD other than Military Sexual Trauma or Personal Assault',
    );
  });

  it('Combat and non-combat incident text is correct', () => {
    const formData = {
      'view:selectablePtsdTypes': {
        'view:combatPtsdType': true,
        'view:noncombatPtsdType': true,
      },
    };

    expect(getPtsdClassification(formData, '781').incidentText).to.equal(
      'Combat and Non-Combat PTSD other than Military Sexual Trauma or Personal Assault',
    );
  });
});

describe('781a getPtsdClassification', () => {
  it('Assault incident text is correct', () => {
    const formData = {
      'view:selectablePtsdTypes': {
        'view:assaultPtsdType': true,
      },
    };

    expect(getPtsdClassification(formData, '781a').incidentText).to.equal(
      'Personal Assault',
    );
  });

  it('MST incident text is correct', () => {
    const formData = {
      'view:selectablePtsdTypes': {
        'view:mstPtsdType': true,
      },
    };

    expect(getPtsdClassification(formData, '781a').incidentText).to.equal(
      'Military Sexual Trauma',
    );
  });

  it('Assault and MST incident text is correct', () => {
    const formData = {
      'view:selectablePtsdTypes': {
        'view:assaultPtsdType': true,
        'view:mstPtsdType': true,
      },
    };

    expect(getPtsdClassification(formData, '781a').incidentText).to.equal(
      'Personal Assault and Military Sexual Trauma',
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
  });
});
