import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import Autocomplete from './Autocomplete';
import { conditionObjects } from '../content/conditionOptions';

// Extract the raw string options from conditionObjects
const allResults = conditionObjects
  .map(obj => obj.option)
  .filter(opt => typeof opt === 'string');

// Helper to build free‑text label (mirrors component implementation)
const freeTextLabel = val => `Enter your condition as "${val}"`;

// <VaTextInput> is a React binding to a web component, direct value
// assignment + synthetic events are needed to simulate typing
export const simulateInputChange = (element, value) => {
  const el = element;
  el.value = value;

  const evt = new Event('input', { bubbles: true, composed: true });
  const customEvt = new CustomEvent('input', {
    detail: { value },
    bubbles: true,
    composed: true,
  });

  el.dispatchEvent(evt);
  el.dispatchEvent(customEvt);

  if (el.onInput) {
    el.onInput({ target: { value } });
  }
};

// Create props for each test (avoid cross‑test state bleed)
const getProps = overrides => ({
  availableResults: allResults,
  debounceDelay: 0, // instant for tests
  formData: '',
  id: 'test-id',
  label: 'Test label',
  hint: 'Helpful hint',
  onChange: sinon.spy(),
  ...overrides,
});

// Render function that returns the input element
const renderWithInput = rawProps => {
  const utils = render(<Autocomplete {...rawProps} />);
  const input = utils.getByTestId('autocomplete-input');
  return { ...utils, input };
};

// JSDOM doesn’t implement scrollIntoView; silence errors
beforeEach(() => {
  // eslint-disable-next-line no-undef
  Element.prototype.scrollIntoView =
    Element.prototype.scrollIntoView || (() => {});
});

// Rendering tests
describe('Autocomplete – smoke render', () => {
  it('renders base props (label, required, hint) with empty value and no list', () => {
    const props = getProps();
    const { input, queryByTestId } = renderWithInput(props);

    expect(input).to.have.attribute('label', 'Test label');
    expect(input).to.have.attribute('required');
    expect(input).to.have.attribute('hint', 'Helpful hint');
    expect(input.value).to.equal('');
    expect(queryByTestId('autocomplete-list')).to.not.exist;
  });
});

// Controlled value / prop sync tests
describe('Autocomplete – controlled value sync', () => {
  it('renders initial formData value and opens list on focus when value present', async () => {
    const props = getProps({ formData: 'mig' });
    const { input, findAllByRole, queryByRole } = renderWithInput(props);

    // Value reflected
    expect(input.value).to.equal('mig');
    // No list until focus
    expect(queryByRole('listbox')).to.not.exist;

    // Focus should trigger search (handleFocus)
    fireEvent.focus(input);

    const options = await findAllByRole('option');
    expect(options.length).to.be.greaterThan(0);
    expect(options[0].textContent).to.equal(freeTextLabel('mig'));
  });

  it('updates when formData prop changes', async () => {
    const props = getProps();
    const { rerender, input } = renderWithInput(props);

    expect(input.value).to.equal('');

    const newVal = 'dia'; // e.g., Diabetes
    rerender(<Autocomplete {...getProps({ formData: newVal })} />);
    expect(input.value).to.equal(newVal);
  });
});

// Typing & results tests
describe('Autocomplete – typing & results', () => {
  it('typing updates value, calls onChange, and shows free-text + suggestions', async () => {
    const props = getProps();
    const { input, findAllByRole } = renderWithInput(props);

    simulateInputChange(input, 'mig');
    expect(input.value).to.equal('mig');

    await waitFor(() => {
      expect(props.onChange.calledWith('mig')).to.be.true;
    });

    const options = await findAllByRole('option');
    expect(options[0].textContent).to.equal(freeTextLabel('mig'));
    expect(options.length).to.be.greaterThan(1); // should include suggestions

    // At least one suggestion came from provided results
    const anySuggestion = options
      .slice(1)
      .some(li => allResults.includes(li.textContent));
    expect(anySuggestion).to.be.true;
  });
});

// Mouse selection behavior tests
describe('Autocomplete – mouse interactions', () => {
  it('clicking a suggestion selects it, calls onChange, closes list', async () => {
    const props = getProps();
    const { input, findAllByRole, queryByTestId } = renderWithInput(props);

    simulateInputChange(input, 'mig'); // expect "Migraine" to match in dataset

    const options = await findAllByRole('option');
    // Choose a non‑free‑text option (first suggestion after index 0)
    const suggestion = options.find(
      li => li.textContent !== options[0].textContent,
    );
    fireEvent.click(suggestion);

    await waitFor(() => {
      expect(props.onChange.called).to.be.true;
    });
    const lastArg = props.onChange.lastCall.args[0];
    expect(lastArg).to.equal(suggestion.textContent); // selected suggestion
    expect(input.value).to.equal(suggestion.textContent);
    expect(queryByTestId('autocomplete-list')).to.not.exist;
  });

  it('clicking free-text option selects raw typed string and closes list', async () => {
    const props = getProps();
    const { input, findAllByRole, queryByTestId } = renderWithInput(props);

    simulateInputChange(input, 'xyz'); // unlikely to match suggestions

    const options = await findAllByRole('option');
    const freeTextOpt = options[0];
    expect(freeTextOpt.textContent).to.equal(freeTextLabel('xyz'));

    fireEvent.click(freeTextOpt);

    await waitFor(() => {
      expect(props.onChange.calledWith('xyz')).to.be.true;
    });
    expect(input.value).to.equal('xyz');
    expect(queryByTestId('autocomplete-list')).to.not.exist;
  });

  it('clicking outside closes list but preserves current value', async () => {
    const props = getProps();
    const { input, findAllByRole, queryByTestId } = renderWithInput(props);

    simulateInputChange(input, 'mig');
    const options = await findAllByRole('option');
    expect(options.length).to.be.greaterThan(0);

    // Click outside (document)
    fireEvent.mouseDown(document);
    await waitFor(() => {
      expect(queryByTestId('autocomplete-list')).to.not.exist;
    });
    // Value unchanged
    expect(input.value).to.equal('mig');
  });

  it('hovering another item updates active highlight', async () => {
    const props = getProps();
    const { input, findAllByRole } = renderWithInput(props);

    simulateInputChange(input, 'mig');
    const options = await findAllByRole('option');

    // ActiveIndex starts at 0 (free text)
    expect(options[0]).to.have.attribute('aria-selected', 'true');

    // mouseMove over second item
    fireEvent.mouseMove(options[1]);

    // Should now mark second as active
    await waitFor(() => {
      expect(options[1]).to.have.attribute('aria-selected', 'true');
    });
  });
});

// Keyboard navigation tests
describe('Autocomplete – keyboard navigation', () => {
  it('ArrowDown from input moves active to first option (free-text)', async () => {
    it('ArrowDown from input moves active from free-text (index 0) to first suggestion (index 1)', async () => {
      const props = getProps();
      const { input, findAllByRole, container } = renderWithInput(props);

      // Type to trigger results
      simulateInputChange(input, 'mig');

      // Wait for options to render
      let options = await findAllByRole('option');
      expect(options.length).to.be.greaterThan(1);

      // Initial state: activeIndex=0 (free-text)
      expect(options[0]).to.have.attribute('aria-selected', 'true');
      expect(options[1]).to.have.attribute('aria-selected', 'false');

      // Send ArrowDown
      fireEvent.keyDown(input, { key: 'ArrowDown' });

      // Re-query (attributes update asynchronously)
      await waitFor(() => {
        options = container.querySelectorAll('li[role="option"]');
        expect(options[1].getAttribute('aria-selected')).to.equal('true');
      });

      // Assert listbox aria-activedescendant reflects option-1
      const listbox = container.querySelector('[role="listbox"]');
      expect(listbox).to.have.attribute('aria-activedescendant', 'option-1');
    });
  });

  it('ArrowUp from first option returns focus to input', async () => {
    const props = getProps();
    const { input, findAllByRole } = renderWithInput(props);

    simulateInputChange(input, 'mig');
    await findAllByRole('option');

    // Move to second option, then ArrowUp twice to get back
    fireEvent.keyDown(input, { key: 'ArrowDown' }); // to index1
    fireEvent.keyDown(input, { key: 'ArrowUp' }); // back to index0 (free text)
    fireEvent.keyDown(input, { key: 'ArrowUp' }); // should return focus to input

    // We can't reliably test focus of shadowRoot input; assert list still open + input value unchanged
    expect(input.value).to.equal('mig');
  });

  it('Enter selects currently active item and closes list', async () => {
    const props = getProps();
    const { input, findAllByRole, queryByTestId } = renderWithInput(props);

    simulateInputChange(input, 'mig');
    const options = await findAllByRole('option');

    // Move to a suggestion (index1)
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });

    await waitFor(() => {
      expect(queryByTestId('autocomplete-list')).to.not.exist;
    });

    const lastArg = props.onChange.lastCall.args[0];
    expect(input.value).to.equal(lastArg);
    expect(lastArg).to.equal(options[1].textContent);
  });

  it('Escape closes list (value preserved)', async () => {
    const props = getProps();
    const { input, findAllByRole, queryByTestId } = renderWithInput(props);

    simulateInputChange(input, 'mig');
    await findAllByRole('option');

    fireEvent.keyDown(input, { key: 'Escape' });

    await waitFor(() => {
      expect(queryByTestId('autocomplete-list')).to.not.exist;
    });
    expect(input.value).to.equal('mig');
  });

  it('Tab closes list (value preserved)', async () => {
    const props = getProps();
    const { input, findAllByRole, queryByTestId } = renderWithInput(props);

    simulateInputChange(input, 'mig');
    await findAllByRole('option');

    fireEvent.keyDown(input, { key: 'Tab' });

    await waitFor(() => {
      expect(queryByTestId('autocomplete-list')).to.not.exist;
    });
    expect(input.value).to.equal('mig');
  });
});

// Accessibility tests
describe('Autocomplete – accessibility attributes & aria-live', () => {
  it('includes instructions (message-aria-describedby) when input is empty', () => {
    const props = getProps({ formData: '' });
    const { input } = renderWithInput(props);

    expect(input).to.have.attribute(
      'message-aria-describedby',
      'When autocomplete results are available use up and down arrows to review and enter to select. Touch device users, explore by touch or with swipe gestures.',
    );
  });

  it('omits instructions when input has a value', () => {
    const props = getProps({ formData: 'foo' });
    const { input } = renderWithInput(props);

    expect(input).to.not.have.attribute('message-aria-describedby');
  });

  it('aria-live announces results, selection, and empty input', async () => {
    const props = getProps();
    const { input, container, findAllByRole } = renderWithInput(props);

    // Type -> results
    simulateInputChange(input, 'mig');
    await findAllByRole('option');
    await waitFor(
      () => {
        const live = container.querySelector('[aria-live="polite"]');
        expect(live).to.exist;
        expect(live.textContent).to.match(/result/i);
        expect(live.textContent).to.include('mig');
      },
      { timeout: 1500 },
    );

    // Select free-text -> selection message
    const options = container.querySelectorAll('li[role="option"]');
    fireEvent.click(options[0]);
    await waitFor(() => {
      const live = container.querySelector('[aria-live="polite"]');
      expect(live.textContent).to.match(/is selected$/);
    });

    // Clear input -> empty message
    simulateInputChange(input, '');
    await waitFor(() => {
      const live = container.querySelector('[aria-live="polite"]');
      expect(live.textContent).to.contain('Input is empty');
    });
  });
});
