import { fireEvent, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import { fullStringSimilaritySearch } from 'platform/forms-system/src/js/utilities/addDisabilitiesStringSearch';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import set from 'platform/utilities/data/set';
import React from 'react';
import sinon from 'sinon';

import formConfig from '../../config/form';
import disabilityLabelsRevised from '../../content/disabilityLabelsRevised';
import { updateFormData } from '../../pages/addDisabilities';

const items = Object.values(disabilityLabelsRevised);

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

const getVaButtonByText = (text, container) => {
  return $(`va-button[text="${text}"]`, container);
};

const getAllVaButtonsByText = (text, container) => {
  return $$(`va-button[text="${text}"]`, container);
};

const simulateInputChange = (selector, value) => {
  const vaTextInput = selector;
  vaTextInput.value = value;

  const event = new Event('input', {
    bubbles: true,
  });

  vaTextInput.dispatchEvent(event);
};

const addAConditionWithMouse = async (
  getAllByRole,
  getByTestId,
  searchTerm,
  searchResult,
) => {
  const input = getByTestId('autocomplete-input');
  simulateInputChange(input, searchTerm);

  await waitFor(() => {
    const listResults = getAllByRole('option');

    for (const result of listResults) {
      if (result.textContent === searchResult) {
        fireEvent.click(result);
        const saveButton = getVaButtonByText('Save');
        fireEvent.click(saveButton);
      }
    }
  });
};

const addAConditionWithKeyboard = async (
  getAllByRole,
  getByTestId,
  getByText,
  searchTerm,
  searchResult,
) => {
  const input = getByTestId('autocomplete-input');
  simulateInputChange(input, searchTerm);

  fireEvent.keyDown(input, { key: 'ArrowDown' });

  await waitFor(() => {
    const listResults = getAllByRole('option');

    for (const result of listResults) {
      if (result.textContent !== searchResult) {
        fireEvent.keyDown(result, { key: 'ArrowDown' });
      } else if (result.textContent === searchResult) {
        fireEvent.keyDown(input, { key: 'Enter' });
        break;
      }
    }
  });

  const saveButton = getVaButtonByText('Save');
  fireEvent.click(saveButton);
};

describe('Add Disabilities Page', () => {
  describe('Default Rendering', () => {
    it('should render page heading and directions', () => {
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

    it('should render "If conditions aren\'t listed" subheading and details', () => {
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
      const example1 = getByText('Tinnitus (ringing or hissing in ears)');
      const example2 = getByText('PTSD (post-traumatic stress disorder)');
      const example3 = getByText('Hearing loss');
      const example4 = getByText('Neck strain (cervical strain)');
      const example5 = getByText('Ankylosis in knee, right');
      const example6 = getByText('Hypertension (high blood pressure)');
      const example7 = getByText('Migraines (headaches)');

      expect(examplesSubHeading).to.be.visible;
      expect(examples.length).to.eq(7);
      expect(example1).to.be.visible;
      expect(example2).to.be.visible;
      expect(example3).to.be.visible;
      expect(example4).to.be.visible;
      expect(example5).to.be.visible;
      expect(example6).to.be.visible;
      expect(example7).to.be.visible;
    });

    it('should render "Your new conditions" subheading, AutoComplete, save button, and add another condition button', () => {
      const { container, getByRole, getByTestId, getByText } = createScreen();

      const newConditionsSubHeading = getByRole('heading', {
        name: 'Your new conditions',
      });
      const input = getByTestId('autocomplete-input');
      const saveButton = getVaButtonByText('Save', container);
      const addAnotherConditionButton = getByText('Add another condition');

      expect(newConditionsSubHeading).to.be.visible;
      expect(input).to.be.visible;
      expect(saveButton).to.be.visible;
      expect(addAnotherConditionButton).to.be.visible;
    });

    it('should render with no saved conditions by default', () => {
      const { container } = createScreen();

      const savedConditionEditButton = getVaButtonByText('Edit', container);

      expect(savedConditionEditButton).to.not.exist;
    });

    it('should render autocomplete label with required and input', () => {
      const { getByTestId } = createScreen();

      const input = getByTestId('autocomplete-input');

      expect(input).to.have.attribute('label', 'Enter your condition');
      expect(input).to.have.attribute('required');
    });

    it('should render error message on result and alert on page if no new conditions are added', () => {
      const { getByText } = createScreen();

      const submitButton = getByText('Submit');
      fireEvent.click(submitButton);

      const errorMessage = getByText(
        'Enter a condition, diagnosis, or short description of your symptoms',
      );
      const alertHeading = getByText('Enter a condition to submit your claim');
      const alertText = getByText(
        'You’ll need to enter a condition, diagnosis, or short description of your symptoms to submit your claim.',
      );

      expect(errorMessage).to.be.visible;
      expect(alertHeading).to.be.visible;
      expect(alertText).to.be.visible;
    });
  });

  describe('Updating State', () => {
    it('should render with saved condition when there is initial formData', () => {
      const { container, getByText } = createScreen(true, false, [
        {
          condition: 'asthma',
        },
      ]);

      const savedCondition = getByText('asthma');
      const savedConditionEditButton = getVaButtonByText('Edit', container);

      expect(savedCondition).to.be.visible;
      expect(savedConditionEditButton).to.be.visible;
    });

    it('should be able to add value to AutoComplete input ', async () => {
      const searchTerm = 'a';
      const searchResults = fullStringSimilaritySearch(searchTerm, items);
      const freeTextAndFilteredItemsCount = searchResults.length + 1;
      const { getByTestId, queryByTestId } = createScreen();

      const input = getByTestId('autocomplete-input');
      simulateInputChange(input, searchTerm);

      await waitFor(() => {
        const list = getByTestId('autocomplete-list');

        expect(list).to.have.length(freeTextAndFilteredItemsCount);
      });

      fireEvent.mouseDown(document.body);

      await waitFor(() => {
        const list = queryByTestId('autocomplete-list');

        expect(list).to.not.exist;
      });
    });

    it('should render AutoComplete list items in alignment with string similarity search', async () => {
      const searchTerm = 'ACL';
      const searchResults = fullStringSimilaritySearch(searchTerm, items);
      const { getAllByRole, getByTestId } = createScreen();

      const input = getByTestId('autocomplete-input');
      simulateInputChange(input, searchTerm);

      await waitFor(() => {
        const listResults = getAllByRole('option');

        listResults.forEach((result, index) => {
          if (index === 0) {
            expect(result.textContent).to.eq(
              `Enter your condition as "${searchTerm}"`,
            );
          } else {
            const searchResult = searchResults[index - 1];
            expect(result.textContent).to.eq(searchResult);
          }
        });
      });
    });
  });

  describe('Mouse Interactions', () => {
    it('should be able to add a free-text condition', async () => {
      const searchTerm = 'Tinnitus';
      const {
        container,
        getAllByRole,
        getByTestId,
        getByText,
        queryByTestId,
      } = createScreen();

      addAConditionWithMouse(
        getAllByRole,
        getByTestId,
        searchTerm,
        `Enter your condition as "${searchTerm}"`,
      );

      await waitFor(() => {
        const savedConditionEditButton = getVaButtonByText('Edit', container);
        const savedCondition = getByText(searchTerm);

        expect(savedConditionEditButton).to.be.visible;
        expect(savedCondition).to.be.visible;

        const input = queryByTestId('autocomplete-input');
        expect(input).to.not.exist;
      });
    });

    it('should be able to select a condition', async () => {
      const searchTerm = 'Tinn';
      const searchResult = 'tinnitus (ringing or hissing in ears)';
      const {
        container,
        getAllByRole,
        getByTestId,
        getByText,
      } = createScreen();

      addAConditionWithMouse(
        getAllByRole,
        getByTestId,
        searchTerm,
        searchResult,
      );

      await waitFor(() => {
        const savedConditionEditButton = getVaButtonByText('Edit', container);
        const savedCondition = getByText(searchResult);

        expect(savedConditionEditButton).to.be.visible;
        expect(savedCondition).to.be.visible;
      });
    });

    it('should be able to edit a condition', async () => {
      const searchTerm = 'Tinn';
      const searchResult = 'tinnitus (ringing or hissing in ears)';
      const newSearchTerm = 'Neck strain';
      const newSearchResult = 'neck strain (cervical strain)';
      const {
        container,
        getAllByRole,
        getByTestId,
        getByText,
      } = createScreen();

      addAConditionWithMouse(
        getAllByRole,
        getByTestId,
        searchTerm,
        searchResult,
      );

      await waitFor(() => {
        const savedConditionEditButton = getVaButtonByText('Edit', container);
        const savedCondition = getByText(searchResult);

        expect(savedConditionEditButton).to.be.visible;
        expect(savedCondition).to.be.visible;

        fireEvent.click(savedConditionEditButton);
      });

      addAConditionWithMouse(
        getAllByRole,
        getByTestId,
        newSearchTerm,
        newSearchResult,
      );

      await waitFor(() => {
        const newCondition = getByText(newSearchResult);

        expect(newCondition).to.be.visible;
      });
    });

    it('should be able to select two conditions then remove one', async () => {
      const searchTerm1 = 'Tinn';
      const searchResult1 = 'tinnitus (ringing or hissing in ears)';
      const searchTerm2 = 'Hear';
      const searchResult2 = 'hearing loss';
      const {
        container,
        getAllByRole,
        getByTestId,
        getByText,
        queryByText,
      } = createScreen();

      addAConditionWithMouse(
        getAllByRole,
        getByTestId,
        searchTerm1,
        searchResult1,
      );

      await waitFor(() => {
        const savedConditionEditButton1 = getVaButtonByText('Edit', container);
        const savedCondition1 = getByText(searchResult1);

        expect(savedConditionEditButton1).to.be.visible;
        expect(savedCondition1).to.be.visible;

        const addAnotherConditionButton = getByText('Add another condition');
        fireEvent.click(addAnotherConditionButton);
      });

      addAConditionWithMouse(
        getAllByRole,
        getByTestId,
        searchTerm2,
        searchResult2,
      );

      await waitFor(() => {
        const savedConditionEditButton2 = getAllVaButtonsByText(
          'Edit',
          container,
        )[1];
        let savedCondition2 = getByText(searchResult2);

        expect(savedConditionEditButton2).to.be.visible;
        expect(savedCondition2).to.be.visible;

        fireEvent.click(savedConditionEditButton2);
        const removeButton = getVaButtonByText('Remove', container);
        fireEvent.click(removeButton);

        savedCondition2 = queryByText(searchResult2);

        expect(savedCondition2).not.to.exist;
      });
    });

    it('should submit when form is completed', () => {
      const { getByText, queryByText } = createScreen(true, false, [
        {
          cause: 'NEW',
          condition: 'asthma',
          'view:descriptionInfo': {},
        },
      ]);

      const submitButton = getByText('Submit');
      fireEvent.click(submitButton);

      const errorMessage = queryByText(
        'Enter a condition, diagnosis, or short description of your symptoms',
      );
      const alertHeading = queryByText(
        'Enter a condition to submit your claim',
      );

      expect(errorMessage).not.to.exist;
      expect(alertHeading).not.to.exist;
    });
  });

  describe('Keyboard Interactions', () => {
    it('should be able to add a free-text condition', async () => {
      const searchTerm = 'Tinnitus';
      const {
        container,
        getAllByRole,
        getByTestId,
        getByText,
        queryByTestId,
      } = createScreen();

      addAConditionWithKeyboard(
        getAllByRole,
        getByTestId,
        getByText,
        searchTerm,
        `Enter your condition as "${searchTerm}"`,
      );

      await waitFor(() => {
        const savedConditionEditButton = getVaButtonByText('Edit', container);
        const savedCondition = getByText(searchTerm);

        expect(savedConditionEditButton).to.be.visible;
        expect(savedCondition).to.be.visible;

        const input = queryByTestId('autocomplete-input');
        expect(input).to.not.exist;
      });
    });

    it('should be able to select a condition', async () => {
      const searchTerm = 'Tinn';
      const searchResult = 'tinnitus (ringing or hissing in ears)';
      const {
        container,
        getAllByRole,
        getByTestId,
        getByText,
      } = createScreen();

      addAConditionWithKeyboard(
        getAllByRole,
        getByTestId,
        getByText,
        searchTerm,
        searchResult,
      );

      await waitFor(() => {
        const savedConditionEditButton = getVaButtonByText('Edit', container);
        const savedCondition = getByText(searchResult);

        expect(savedConditionEditButton).to.be.visible;
        expect(savedCondition).to.be.visible;
      });
    });

    it('should be able to edit a condition', async () => {
      const searchTerm = 'Tinn';
      const searchResult = 'tinnitus (ringing or hissing in ears)';
      const newSearchTerm = 'Neck strain';
      const newSearchResult = 'neck strain (cervical strain)';
      const {
        container,
        getAllByRole,
        getByTestId,
        getByText,
      } = createScreen();

      addAConditionWithKeyboard(
        getAllByRole,
        getByTestId,
        getByText,
        searchTerm,
        searchResult,
      );

      await waitFor(() => {
        const savedConditionEditButton = getVaButtonByText('Edit', container);
        const savedCondition = getByText(searchResult);

        expect(savedConditionEditButton).to.be.visible;
        expect(savedCondition).to.be.visible;

        userEvent.type(savedConditionEditButton, '{enter}');
      });

      addAConditionWithKeyboard(
        getAllByRole,
        getByTestId,
        getByText,
        newSearchTerm,
        newSearchResult,
      );

      await waitFor(() => {
        const newCondition = getByText(newSearchResult);

        expect(newCondition).to.be.visible;
      });
    });

    it('should be able to select two conditions then remove one', async () => {
      const searchTerm1 = 'Tinn';
      const searchResult1 = 'tinnitus (ringing or hissing in ears)';
      const searchTerm2 = 'Hear';
      const searchResult2 = 'hearing loss';
      const {
        container,
        getAllByRole,
        getByTestId,
        getByText,
        queryByText,
      } = createScreen();

      addAConditionWithKeyboard(
        getAllByRole,
        getByTestId,
        getByText,
        searchTerm1,
        searchResult1,
      );

      await waitFor(() => {
        const savedConditionEditButton1 = getVaButtonByText('Edit', container);
        const savedCondition1 = getByText(searchResult1);

        expect(savedConditionEditButton1).to.be.visible;
        expect(savedCondition1).to.be.visible;

        const addAnotherConditionButton = getByText('Add another condition');
        userEvent.type(addAnotherConditionButton, '{enter}');
      });

      addAConditionWithKeyboard(
        getAllByRole,
        getByTestId,
        getByText,
        searchTerm2,
        searchResult2,
      );

      await waitFor(() => {
        const savedConditionEditButton2 = getAllVaButtonsByText(
          'Edit',
          container,
        )[1];
        let savedCondition2 = getByText(searchResult2);

        expect(savedConditionEditButton2).to.be.visible;
        expect(savedCondition2).to.be.visible;

        userEvent.type(savedConditionEditButton2, '{enter}');
        const removeButton = getVaButtonByText('Remove', container);
        userEvent.type(removeButton, '{enter}');

        savedCondition2 = queryByText(searchResult2);

        expect(savedCondition2).not.to.exist;
      });
    });

    it('should submit when form is completed', () => {
      const { getByText, queryByText } = createScreen(true, false, [
        {
          cause: 'NEW',
          condition: 'asthma',
          'view:descriptionInfo': {},
        },
      ]);

      const submitButton = getByText('Submit');
      userEvent.type(submitButton, '{enter}');

      const errorMessage = queryByText(
        'Enter a condition, diagnosis, or short description of your symptoms',
      );
      const alertHeading = queryByText(
        'Enter a condition to submit your claim',
      );

      expect(errorMessage).not.to.exist;
      expect(alertHeading).not.to.exist;
    });
  });

  describe('Accessibility', () => {
    it('should announce errors to screen readers when a required field is not filled', () => {
      const { getByTestId, getByText } = createScreen();

      const input = getByTestId('autocomplete-input');
      const submitButton = getByText('Submit');
      simulateInputChange(input, '');
      fireEvent.click(submitButton);

      const errorMessage = getByText(
        'Enter a condition, diagnosis, or short description of your symptoms',
      );
      expect(errorMessage).to.have.attribute('role', 'alert');
    });
  });

  describe('User is claiming a new condition AND claiming an increase', () => {
    it('should display alert on page if no conditions exist', () => {
      const { getByText } = createScreen(true, true, null);

      const submitButton = getByText('Submit');
      fireEvent.click(submitButton);

      const alertHeading = getByText('We need you to add a condition');
      const alertText = getByText(
        'You’ll need to add a new condition or choose a rated disability to claim. We can’t process your claim without a disability or new condition selected. Please add a new condition or choose a rated disability for increased compensation.',
      );
      const disabilityLink = getByText('Choose a rated disability');

      expect(alertHeading).to.exist;
      expect(alertText).to.exist;
      expect(disabilityLink).to.exist;
    });

    it('should display helpful error if no new conditions are added', () => {
      const { getByText } = createScreen(true, true, null);

      const submitButton = getByText('Submit');
      fireEvent.click(submitButton);

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

  describe('Update Form Data', () => {
    const generateInitialData = () => ({
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

    it("if newDisabilities in initialData doesn't exist", () => {
      const initialData = {};
      const newData = { newDisabilities: ['asthma'] };

      expect(updateFormData(initialData, newData)).to.eql(newData);
    });

    it("if newDisabilities in newData doesn't exist", () => {
      const initialData = generateInitialData();
      const newData = {};

      expect(updateFormData(initialData, newData)).to.eql(newData);
    });

    it('if no disabilities changed', () => {
      const initialData = generateInitialData();

      expect(updateFormData(initialData, initialData)).to.eql(initialData);
    });

    it('should not modify initialData', () => {
      const initialData = generateInitialData();

      updateFormData(
        initialData,
        set(
          'newDisabilities[1]',
          { condition: 'Something else' },
          generateInitialData(),
        ),
      );

      expect(initialData).to.eql(generateInitialData());
    });

    it('should change the property name in treatedDisabilityNames and powDisabilities when a disability name is changed', () => {
      const initialData = generateInitialData();

      const newData = set(
        'newDisabilities[0].condition',
        'Foo-with EXTRAz',
        generateInitialData(),
      );
      const result = updateFormData(initialData, newData);

      expect(
        result.vaTreatmentFacilities[0].treatedDisabilityNames.foowithextraz,
      ).to.be.true;
      expect(result['view:isPow'].powDisabilities.foowithextraz).to.be.true;
    });

    it('should remove a deleted disability from treatedDisabilityNames and powDisabilities', () => {
      const newData = Object.assign(generateInitialData(), {
        newDisabilities: [],
      });
      const result = updateFormData(generateInitialData(), newData);

      expect(result.vaTreatmentFacilities[0].treatedDisabilityNames).to.be
        .empty;
      expect(result['view:isPow'].powDisabilities).to.be.empty;
    });
  });
});
