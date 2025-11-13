import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { inputVaTextInput } from '@department-of-veterans-affairs/platform-testing/helpers';
import Autocomplete from './Autocomplete';
import { conditionObjects } from '../content/conditionOptions';

const allResults = conditionObjects
  .map(obj => obj.option)
  .filter(opt => typeof opt === 'string');

const freeTextLabel = val => `Enter your condition as "${val}"`;

export const simulateInputChange = async (container, value) => {
  await act(async () => {
    inputVaTextInput(container, value, 'va-text-input');
  });

  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
  });
};

const getProps = overrides => ({
  availableResults: allResults,
  debounceDelay: 0,
  formData: '',
  id: 'test-id',
  label: 'Test label',
  hint: 'Helpful hint',
  onChange: sinon.spy(),
  ...overrides,
});

const renderWithInput = rawProps => {
  const utils = render(<Autocomplete {...rawProps} />);
  const input = utils.getByTestId('autocomplete-input');
  return { ...utils, input };
};

beforeEach(() => {
  // eslint-disable-next-line no-undef
  Element.prototype.scrollIntoView =
    Element.prototype.scrollIntoView || (() => {});
});

describe('Autocomplete render', () => {
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

describe('Autocomplete controlled value sync', () => {
  it('renders initial formData value and opens list on focus when value present', async () => {
    const props = getProps({ formData: 'mig' });
    const { input, findAllByRole, queryByRole } = renderWithInput(props);

    expect(input.value).to.equal('mig');
    expect(queryByRole('listbox')).to.not.exist;

    fireEvent.focus(input);

    const options = await findAllByRole('option');
    expect(options.length).to.be.greaterThan(0);
    expect(options[0].textContent).to.equal(freeTextLabel('mig'));
  });

  it('updates when formData prop changes', async () => {
    const props = getProps();
    const { rerender, input } = renderWithInput(props);

    expect(input.value).to.equal('');

    const newVal = 'dia';
    rerender(<Autocomplete {...getProps({ formData: newVal })} />);
    expect(input.value).to.equal(newVal);
  });
});

describe('Autocomplete typing & results', () => {
  it('typing updates value, calls onChange, and shows free-text + suggestions', async () => {
    const props = getProps();
    const { input, container } = renderWithInput(props);

    await simulateInputChange(container, 'mig');
    expect(input.value).to.equal('mig');

    await waitFor(() => {
      expect(props.onChange.calledWith('mig')).to.be.true;
    });

    const options = await waitFor(
      () => {
        const opts = container.querySelectorAll('li[role="option"]');
        expect(opts.length).to.be.greaterThan(1);
        return opts;
      },
      { timeout: 1500 },
    );

    expect(options[0].textContent).to.equal(freeTextLabel('mig'));
    expect(options.length).to.be.greaterThan(1);

    const anySuggestion = Array.from(options)
      .slice(1)
      .some(li => allResults.includes(li.textContent));
    expect(anySuggestion).to.be.true;
  });
});

describe('Autocomplete mouse interactions', () => {
  it('clicking a suggestion selects it, calls onChange, closes list', async () => {
    const props = getProps();
    const { input, queryByTestId, container } = renderWithInput(props);

    await simulateInputChange(container, 'mig');

    const options = await waitFor(
      () => {
        const opts = container.querySelectorAll('li[role="option"]');
        expect(opts.length).to.be.greaterThan(1);
        return Array.from(opts);
      },
      { timeout: 1500 },
    );

    const suggestion = options.find(
      li => li.textContent !== options[0].textContent,
    );
    fireEvent.click(suggestion);

    await waitFor(() => {
      expect(props.onChange.called).to.be.true;
    });
    const lastArg = props.onChange.lastCall.args[0];
    expect(lastArg).to.equal(suggestion.textContent);
    expect(input.value).to.equal(suggestion.textContent);
    expect(queryByTestId('autocomplete-list')).to.not.exist;
  });

  it('clicking free-text option selects raw typed string and closes list', async () => {
    const props = getProps();
    const { input, queryByTestId, container } = renderWithInput(props);

    await simulateInputChange(container, 'xyz');

    const options = await waitFor(
      () => {
        const opts = container.querySelectorAll('li[role="option"]');
        expect(opts.length).to.be.greaterThan(0);
        return Array.from(opts);
      },
      { timeout: 1500 },
    );

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
    const { input, queryByTestId, container } = renderWithInput(props);

    await simulateInputChange(container, 'mig');

    await waitFor(
      () => {
        const opts = container.querySelectorAll('li[role="option"]');
        expect(opts.length).to.be.greaterThan(0);
      },
      { timeout: 1500 },
    );

    fireEvent.mouseDown(document);
    await waitFor(() => {
      expect(queryByTestId('autocomplete-list')).to.not.exist;
    });
    expect(input.value).to.equal('mig');
  });

  it('hovering another item updates active highlight', async () => {
    const props = getProps();
    const { container } = renderWithInput(props);

    await simulateInputChange(container, 'mig');

    const options = await waitFor(
      () => {
        const opts = container.querySelectorAll('li[role="option"]');
        expect(opts.length).to.be.greaterThan(1);
        return Array.from(opts);
      },
      { timeout: 1500 },
    );

    expect(options[0]).to.have.attribute('aria-selected', 'true');

    fireEvent.mouseMove(options[1]);

    await waitFor(() => {
      expect(options[1]).to.have.attribute('aria-selected', 'true');
    });
  });
});

describe('Autocomplete keyboard navigation', () => {
  it('ArrowDown from input moves active from free-text (index 0) to first suggestion (index 1)', async () => {
    const props = getProps();
    const { input, findAllByRole, container } = renderWithInput(props);

    await simulateInputChange(container, 'mig');

    let options = await findAllByRole('option');
    expect(options.length).to.be.greaterThan(1);

    expect(options[0]).to.have.attribute('aria-selected', 'true');
    expect(options[1]).to.have.attribute('aria-selected', 'false');

    fireEvent.keyDown(input, { key: 'ArrowDown' });

    await waitFor(() => {
      options = container.querySelectorAll('li[role="option"]');
      expect(options[1].getAttribute('aria-selected')).to.equal('true');
    });

    const listbox = container.querySelector('[role="listbox"]');
    expect(listbox).to.have.attribute('aria-activedescendant', 'option-1');
  });

  it('ArrowUp from first option returns focus to input', async () => {
    const props = getProps();
    const { input, container } = renderWithInput(props);

    await simulateInputChange(container, 'mig');

    await waitFor(
      () => {
        const opts = container.querySelectorAll('li[role="option"]');
        expect(opts.length).to.be.greaterThan(0);
      },
      { timeout: 1500 },
    );

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    fireEvent.keyDown(input, { key: 'ArrowUp' });

    expect(input.value).to.equal('mig');
  });

  it('Enter selects currently active item and closes list', async () => {
    const props = getProps();
    const { input, queryByTestId, container } = renderWithInput(props);

    await simulateInputChange(container, 'mig');

    const options = await waitFor(
      async () => {
        const opts = document.querySelectorAll('li[role="option"]');
        expect(opts.length).to.be.greaterThan(1);
        return opts;
      },
      { timeout: 1500 },
    );

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
    const { input, queryByTestId, container } = renderWithInput(props);

    await simulateInputChange(container, 'mig');

    await waitFor(
      () => {
        const opts = document.querySelectorAll('li[role="option"]');
        expect(opts.length).to.be.greaterThan(0);
      },
      { timeout: 1500 },
    );

    fireEvent.keyDown(input, { key: 'Escape' });

    await waitFor(() => {
      expect(queryByTestId('autocomplete-list')).to.not.exist;
    });
    expect(input.value).to.equal('mig');
  });

  it('Tab closes list (value preserved)', async () => {
    const props = getProps();
    const { input, queryByTestId, container } = renderWithInput(props);

    await simulateInputChange(container, 'mig');

    await waitFor(
      () => {
        const opts = document.querySelectorAll('li[role="option"]');
        expect(opts.length).to.be.greaterThan(0);
      },
      { timeout: 1500 },
    );

    fireEvent.keyDown(input, { key: 'Tab' });

    await waitFor(() => {
      expect(queryByTestId('autocomplete-list')).to.not.exist;
    });
    expect(input.value).to.equal('mig');
  });
});

describe('Autocomplete accessibility attributes & aria-live', () => {
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
    const { container } = renderWithInput(props);

    await simulateInputChange(container, 'mig');

    await waitFor(
      () => {
        const opts = container.querySelectorAll('li[role="option"]');
        expect(opts.length).to.be.greaterThan(0);
      },
      { timeout: 1500 },
    );

    await waitFor(
      () => {
        const live = container.querySelector('[aria-live="polite"]');
        expect(live).to.exist;
        expect(live.textContent).to.match(/result/i);
        expect(live.textContent).to.include('mig');
      },
      { timeout: 1500 },
    );

    const options = container.querySelectorAll('li[role="option"]');
    fireEvent.click(options[0]);
    await waitFor(() => {
      const live = container.querySelector('[aria-live="polite"]');
      expect(live.textContent).to.match(/is selected$/);
    });

    await simulateInputChange(container, '');
    await waitFor(() => {
      const live = container.querySelector('[aria-live="polite"]');
      expect(live.textContent).to.contain('Input is empty');
    });
  });
});
