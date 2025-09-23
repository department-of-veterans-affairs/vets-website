import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import PropTypes from 'prop-types';
import AllergiesListItem from '../../../../components/RecordList/AllergyListItems/AllergiesListItem';

// Mock StandardAllergyListItem
const StandardAllergyListItem = ({ record }) => (
  <div data-testid="standard-allergy">Standard: {record?.id}</div>
);
StandardAllergyListItem.propTypes = {
  record: PropTypes.object,
};

describe('AllergiesListItem (mocha)', () => {
  let standardStub;

  before(() => {
    standardStub = sinon
      .stub(
        require('../../../../components/RecordList/AllergyListItems/StandardAllergyListItem'),
        'default',
      )
      .callsFake(StandardAllergyListItem);
  });

  after(() => {
    standardStub.restore();
  });

  it('renders StandardAllergyListItem for all data (v1 and v2 use same format)', () => {
    const record = {
      id: '123',
      name: 'Test Allergy',
      reaction: ['Hives'],
      type: 'Medication',
    };

    const screen = render(<AllergiesListItem record={record} />);

    expect(screen.getByTestId('standard-allergy')).to.exist;
  });

  it('handles both v1 and v2 data with same component', () => {
    const record = {
      id: '456',
      name: 'Test Unified Allergy',
      reaction: ['Swelling'],
      type: 'Food',
    };

    const screen = render(<AllergiesListItem record={record} />);

    expect(screen.getByTestId('standard-allergy')).to.exist;
  });

  it('works with minimal record data', () => {
    const record = {
      id: '789',
      name: 'Test Default Allergy',
    };

    const screen = render(<AllergiesListItem record={record} />);

    expect(screen.getByTestId('standard-allergy')).to.exist;
  });
});
