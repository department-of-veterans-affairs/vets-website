import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import EducationHistoryReview from '../../../../src/js/edu-benefits/1990/components/education-history/EducationHistoryReview';
import { createVeteran } from '../../../../src/js/edu-benefits/1990/utils/veteran';
import { makeField } from '../../../../src/js/common/model/fields';

describe('<EducationHistoryReview>', () => {
  it('should properly display the graduation date', () => {
    const veteran = createVeteran();
    veteran.highSchoolOrGedCompletionDate = {
      month: makeField('2'),
      day: makeField('1'),
      year: makeField('1995')
    };

    const tree = SkinDeep.shallowRender(
      <EducationHistoryReview
          data={veteran}/>
    );

    expect(tree.everySubTree('td')[1].text()).to.eql('2/1995');
  });
});
