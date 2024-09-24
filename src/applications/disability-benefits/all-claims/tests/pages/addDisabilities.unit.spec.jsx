import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import set from 'platform/utilities/data/set';
import React from 'react';
import sinon from 'sinon';

import formConfig from '../../config/form';
import { updateFormData } from '../../pages/addDisabilities';

const {
  schema,
  uiSchema,
} = formConfig.chapters.disabilities.pages.addDisabilities;

const createScreen = (
  claimingNew = true,
  claimingIncrease = false,
  condition = null,
) => {
  const onSubmit = sinon.spy();

  return render(
    <DefinitionTester
      definitions={formConfig.defaultDefinitions}
      schema={schema}
      uiSchema={uiSchema}
      data={{
        'view:claimType': {
          'view:claimingNew': claimingNew,
          'view:claimingIncrease': claimingIncrease,
        },
        newDisabilities: condition,
        ratedDisabilities: [{}, {}],
      }}
      formData={{}}
      onSubmit={onSubmit}
    />,
  );
};

describe('Add Disabilities Page', () => {
  describe('User is claiming a new condition but not claiming an increase', () => {
    it('should render heading and directions', () => {
      const { getByRole, getByText } = createScreen();

      const heading = getByRole('heading', {
        name: 'Tell us the new conditions you want to claim',
      });
      const directions = getByText(
        'Enter the name of your condition. Then, select your condition from the list of possible matches.',
      );

      expect(heading).to.be.visible;
      expect(directions).to.be.visible;
    });

    it('should render "if conditions aren\'t listed" subheading and details', () => {
      const { getByRole, getByText } = createScreen();

      const notListedSubHeading = getByRole('heading', {
        name: 'If your conditions aren’t listed',
      });
      const notListedDetails = getByText(
        'You can claim a condition that isn’t listed. Enter your condition, diagnosis, or short description of your symptoms.',
      );

      expect(notListedSubHeading).to.be.visible;
      expect(notListedDetails).to.be.visible;
    });

    it('should render examples subheading and list', () => {
      const { getByRole, getByText } = createScreen();

      const examplesSubHeading = getByRole('heading', {
        name: 'Examples of conditions',
      });
      const examples = getByRole('list').children;
      const example = getByText('Tinnitus (ringing or hissing in ears)');

      expect(examplesSubHeading).to.be.visible;
      expect(examples.length).to.eq(7);
      expect(example).to.be.visible;
    });

    it('should render "Your new conditions" subheading and array field', () => {
      const { getByRole } = createScreen();

      const newConditionsSubHeading = getByRole('heading', {
        name: 'Your new conditions',
      });

      expect(newConditionsSubHeading).to.be.visible;
    });

    it('should render ComboBox', () => {
      const { getByRole, getByText, getByTestId } = createScreen();

      const label = getByText('Enter your condition');
      const required = label.querySelector('span');
      const input = getByTestId('combobox-input');
      const listbox = getByRole('listbox');

      expect(label).to.be.visible;
      expect(required).to.have.text('(*Required)');
      expect(input).to.be.visible;
      expect(listbox).to.be.visible;
      expect(listbox).to.have.length(0);
    });

    it('should display error if no new conditions are added', () => {
      const { getByText } = createScreen();

      const submitBtn = getByText('Submit');
      fireEvent.click(submitBtn);

      const alertHeading = getByText('Enter a condition to submit your claim');
      const alertText = getByText(
        'You’ll need to enter a condition, diagnosis, or short description of your symptoms to submit your claim.',
      );

      expect(alertHeading).to.exist;
      expect(alertText).to.exist;
    });

    it('should submit when form is completed', () => {
      const { getByText, queryByRole } = createScreen(true, false, [
        {
          cause: 'NEW',
          condition: 'asthma',
          'view:descriptionInfo': {},
        },
      ]);

      const submitBtn = getByText('Submit');
      fireEvent.click(submitBtn);

      const inputError = queryByRole('alert');

      expect(inputError).not.to.exist;
    });
  });

  describe('User is claiming a new condition AND claiming an increase', () => {
    it('should display helpful error if no new conditions are added', () => {
      const { getByText } = createScreen(true, true, null);

      const submitBtn = getByText('Submit');
      fireEvent.click(submitBtn);

      const alertHeading = getByText('We need you to add a condition');
      const alertText = getByText(
        'You’ll need to add a new condition or choose a rated disability to claim. We can’t process your claim without a disability or new condition selected. Please add a new condition or choose a rated disability for increased compensation.',
      );
      const disabilityLink = getByText('Choose a rated disability');

      expect(alertHeading).to.exist;
      expect(alertText).to.exist;
      expect(disabilityLink).to.exist;
    });
  });

  describe('updateFormData', () => {
    // It's a function just to make sure we're not mutating it anywhere along the way
    const oldData = () => ({
      newDisabilities: [{ condition: 'Something with-hyphens and ALLCAPS' }],
      vaTreatmentFacilities: [
        {
          treatedDisabilityNames: {
            somethingwithhyphensandallcaps: true,
          },
        },
      ],
      'view:isPow': {
        powDisabilities: { somethingwithhyphensandallcaps: true },
      },
    });

    describe('should return unmodified newData', () => {
      it("if oldData.newDisabilities doesn't exist", () => {
        const newData = { newDisabilities: ['foo'] };
        expect(updateFormData({}, newData)).to.deep.equal(newData);
      });
      it("if newData.newDisabilities doesn't exist", () => {
        const newData = {};
        expect(updateFormData(oldData(), newData)).to.deep.equal(newData);
      });
      it('if no disabilities changed', () => {
        const old = oldData();
        expect(updateFormData(old, old)).to.deep.equal(old);
      });
    });

    it('should not modify oldData', () => {
      const old = oldData();
      updateFormData(
        old,
        set('newDisabilities[1]', { condition: 'Something else' }, oldData()),
      );
      expect(old).to.deep.equal(oldData());
    });

    it('should change the property name in treatedDisabilityNames and powDisabilities when a disability name is changed', () => {
      const newData = set(
        'newDisabilities[0].condition',
        'Foo-with EXTRAz',
        oldData(),
      );
      const result = updateFormData(oldData(), newData);
      expect(
        result.vaTreatmentFacilities[0].treatedDisabilityNames.foowithextraz,
      ).to.be.true;
      expect(result['view:isPow'].powDisabilities.foowithextraz).to.be.true;
    });

    it('should remove a deleted disability from treatedDisabilityNames and powDisabilities', () => {
      const newData = Object.assign(oldData(), { newDisabilities: [] });
      const result = updateFormData(oldData(), newData);
      expect(result.vaTreatmentFacilities[0].treatedDisabilityNames).to.be
        .empty;
      expect(result['view:isPow'].powDisabilities).to.be.empty;
    });
  });
});
