import 'platform/testing/unit/mocha-setup';
import { expect } from 'chai';
import sinon from 'sinon';
import { cleanup } from '@testing-library/react';
import * as abHelpers from 'platform/forms-system/src/js/patterns/array-builder/helpers';
import * as utils from '../../../pages/shared/utils';
import { ARRAY_PATH, NEW_CONDITION_OPTION } from '../../../constants';

describe('526 utils shared page', () => {
  afterEach(() => {
    cleanup();
  });

  it('isEditFromContext reads the value from context', () => {
    expect(utils.isEditFromContext({ edit: true })).to.be.true;
    expect(utils.isEditFromContext({ edit: false })).to.be.false;
    expect(utils.isEditFromContext(undefined)).to.be.undefined;
  });

  it('createAddAndEditTitles picks edit title when ?edit present', () => {
    const stub = sinon.stub(abHelpers, 'getArrayUrlSearchParams');
    try {
      stub.returns(new URLSearchParams('edit=true'));
      expect(utils.createAddAndEditTitles('Add cond', 'Edit cond')).to.equal(
        'Edit cond',
      );

      stub.returns(new URLSearchParams('')); // no edit
      expect(utils.createAddAndEditTitles('Add cond', 'Edit cond')).to.equal(
        'Add cond',
      );
    } finally {
      stub.restore();
    }
  });

  it('createRatedDisabilityDescriptions formats rating and max note', () => {
    const fullData = {
      ratedDisabilities: [
        { name: 'Knee', ratingPercentage: 20, maximumRatingPercentage: 50 },
        { name: 'Back', ratingPercentage: 50, maximumRatingPercentage: 50 },
      ],
    };

    const out = utils.createRatedDisabilityDescriptions(fullData);
    expect(out).to.deep.equal({
      Knee: 'Current rating: 20%',
      Back:
        "Current rating: 50% (You're already at the maximum for this rated disability.)",
    });
  });

  it('recognizes isNewCondition / isRatedDisability values of the form', () => {
    expect(utils.isNewCondition({ ratedDisability: NEW_CONDITION_OPTION })).to
      .be.true;
    expect(utils.isRatedDisability({ ratedDisability: 'Knee' })).to.be.true;
  });

  it('recognizes isNewCondition / isRatedDisability values with array items', () => {
    const path = utils.arrayBuilderOptions.arrayPath;
    const formData = {
      [ARRAY_PATH]: [
        { ratedDisability: NEW_CONDITION_OPTION },
        { ratedDisability: 'Back' },
      ],
    };

    expect(formData[path][0].ratedDisability).to.equal(NEW_CONDITION_OPTION);
    expect(formData[path][1].ratedDisability).to.equal('Back');

    expect(utils.isNewCondition(formData, 0)).to.be.true;
    expect(utils.isRatedDisability(formData, 1)).to.be.true;
  });

  it('createNonSelectedRatedDisabilities excludes already-selected items (except current index)', () => {
    const idxStub = sinon
      .stub(abHelpers, 'getArrayIndexFromPathName')
      .returns(1);
    try {
      const fullData = {
        [ARRAY_PATH]: [
          { ratedDisability: 'Knee' },
          { ratedDisability: NEW_CONDITION_OPTION },
        ],
        ratedDisabilities: [
          { name: 'Knee' },
          { name: 'Back' },
          { name: 'Neck' },
        ],
      };

      const out = utils.createNonSelectedRatedDisabilities(fullData);
      expect(out).to.deep.equal({ Back: 'Back', Neck: 'Neck' });
      expect(utils.hasRatedDisabilities(fullData)).to.be.true;
    } finally {
      idxStub.restore();
    }
  });

  it('hasRatedDisabilities returns false when none available', () => {
    const fullData = { ratedDisabilities: [] };
    expect(utils.hasRatedDisabilities(fullData)).to.be.false;
  });

  it('createNewConditionName handles blanks, capitalization, and side-of-body', () => {
    expect(utils.createNewConditionName({ newCondition: '   ' })).to.equal(
      'condition',
    );
    expect(
      utils.createNewConditionName({ newCondition: 'knee pain' }, true),
    ).to.equal('Knee pain');
    expect(
      utils.createNewConditionName({ newCondition: 'PTSD' }, true),
    ).to.equal('PTSD');
    expect(
      utils.createNewConditionName(
        { newCondition: 'Shoulder', sideOfBody: 'Left' },
        true,
      ),
    ).to.equal('Shoulder, left');
  });

  it('validates requirements for newCondition, cause, and cause-specific fields', () => {
    expect(utils.isItemIncomplete({ newCondition: '', cause: undefined })).to.be
      .true;

    expect(utils.isItemIncomplete({ newCondition: 'Knee', cause: 'NEW' })).to.be
      .true;
    expect(
      utils.isItemIncomplete({
        newCondition: 'Knee',
        cause: 'NEW',
        primaryDescription: 'Pain',
      }),
    ).to.be.false;

    expect(
      utils.isItemIncomplete({
        newCondition: 'Knee',
        cause: 'SECONDARY',
        causedByCondition: {},
        causedByConditionDescription: '',
      }),
    ).to.be.true;
    expect(
      utils.isItemIncomplete({
        newCondition: 'Knee',
        cause: 'SECONDARY',
        causedByCondition: { Back: true },
        causedByConditionDescription: 'Because …',
      }),
    ).to.be.false;

    expect(
      utils.isItemIncomplete({
        newCondition: 'Knee',
        cause: 'WORSENED',
        worsenedDescription: 'x',
      }),
    ).to.be.true;
    expect(
      utils.isItemIncomplete({
        newCondition: 'Knee',
        cause: 'WORSENED',
        worsenedDescription: 'x',
        worsenedEffects: 'y',
      }),
    ).to.be.false;

    expect(
      utils.isItemIncomplete({
        newCondition: 'Knee',
        cause: 'VA',
        vaMistreatmentDescription: 'x',
      }),
    ).to.be.true;
    expect(
      utils.isItemIncomplete({
        newCondition: 'Knee',
        cause: 'VA',
        vaMistreatmentDescription: 'x',
        vaMistreatmentLocation: 'Clinic',
      }),
    ).to.be.false;
  });
});
