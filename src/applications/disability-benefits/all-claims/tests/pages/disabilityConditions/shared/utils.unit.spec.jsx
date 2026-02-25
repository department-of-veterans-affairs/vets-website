import 'platform/testing/unit/mocha-setup';
import { expect } from 'chai';
import sinon from 'sinon';
import { cleanup } from '@testing-library/react';
import * as abHelpers from 'platform/forms-system/src/js/patterns/array-builder/helpers';
import * as utils from '../../../../pages/disabilityConditions/shared/utils';
import { ARRAY_PATH, NEW_CONDITION_OPTION } from '../../../../constants';

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
    const formData = {
      [ARRAY_PATH]: [
        {
          ratedDisability: NEW_CONDITION_OPTION,
        },
        {
          ratedDisability: 'Knee',
        },
      ],
    };

    expect(utils.isNewCondition(formData, 0)).to.be.true;
    expect(utils.isRatedDisability(formData, 1)).to.be.true;
  });

  it('recognizes isNewCondition / isRatedDisability values with array items', () => {
    const path = utils.arrayOptions.arrayPath;
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

  it('getRemainingRatedDisabilities excludes already-selected items (except current index)', () => {
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

      const out = utils.getRemainingRatedDisabilities(fullData, 1);
      expect(out).to.deep.equal(['Back', 'Neck']);
      expect(utils.hasRatedDisabilities(fullData, 1)).to.be.true;
    } finally {
      idxStub.restore();
    }
  });

  it('hasRatedDisabilities returns false when none available', () => {
    const fullData = { ratedDisabilities: [] };
    expect(utils.hasRatedDisabilities(fullData)).to.be.false;
  });

  it('createNewConditionName handles blanks, capitalization, and side-of-body', () => {
    expect(utils.createNewConditionName({ condition: '   ' })).to.equal(
      'condition',
    );
    expect(
      utils.createNewConditionName({ condition: 'knee pain' }, true),
    ).to.equal('Knee pain');
    expect(utils.createNewConditionName({ condition: 'PTSD' }, true)).to.equal(
      'PTSD',
    );
    expect(
      utils.createNewConditionName(
        { condition: 'Shoulder', sideOfBody: 'Left' },
        true,
      ),
    ).to.equal('Shoulder, left');
  });

  it('validates requirements for newCondition, cause, and cause-specific fields', () => {
    expect(utils.isItemIncomplete({ condition: '', cause: undefined })).to.be
      .true;

    expect(utils.isItemIncomplete({ condition: 'Knee', cause: 'NEW' })).to.be
      .true;
    expect(
      utils.isItemIncomplete({
        condition: 'Knee',
        cause: 'NEW',
        primaryDescription: 'Pain',
        ratedDisability: NEW_CONDITION_OPTION,
      }),
    ).to.be.false;

    expect(
      utils.isItemIncomplete({
        condition: 'Knee',
        cause: 'SECONDARY',
        causedByDisability: {},
        causedByDisabilityDescription: '',
      }),
    ).to.be.true;
    expect(
      utils.isItemIncomplete({
        condition: 'Knee',
        cause: 'SECONDARY',
        causedByDisability: { Back: true },
        causedByDisabilityDescription: 'Because …',
        ratedDisability: NEW_CONDITION_OPTION,
      }),
    ).to.be.false;

    expect(
      utils.isItemIncomplete({
        condition: 'Knee',
        cause: 'WORSENED',
        worsenedDescription: 'x',
      }),
    ).to.be.true;
    expect(
      utils.isItemIncomplete({
        condition: 'Knee',
        cause: 'WORSENED',
        worsenedDescription: 'x',
        worsenedEffects: 'y',
        ratedDisability: NEW_CONDITION_OPTION,
      }),
    ).to.be.false;

    expect(
      utils.isItemIncomplete({
        condition: 'Knee',
        cause: 'VA',
        vaMistreatmentDescription: 'x',
      }),
    ).to.be.true;
    expect(
      utils.isItemIncomplete({
        condition: 'Knee',
        cause: 'VA',
        vaMistreatmentDescription: 'x',
        vaMistreatmentLocation: 'Clinic',
        ratedDisability: NEW_CONDITION_OPTION,
      }),
    ).to.be.false;
  });

  it('arrayOptions.canDeleteItem hides delete on review and for locked items', () => {
    const { canDeleteItem } = utils.arrayOptions;

    expect(canDeleteItem({ itemData: { isLocked: false }, isReview: false })).to
      .be.true;

    expect(canDeleteItem({ itemData: {}, isReview: false })).to.be.true;

    expect(canDeleteItem({ itemData: { isLocked: true }, isReview: false })).to
      .be.false;

    expect(canDeleteItem({ itemData: { isLocked: false }, isReview: true })).to
      .be.false;

    expect(canDeleteItem({ itemData: { isLocked: true }, isReview: true })).to
      .be.false;
  });
});
