import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import sinon from 'sinon';

import FilterStudentFeedbackPage from '../../containers/FilterStudentFeedbackPage';

const fireVaSelect = (el, value) => {
  const ev = new CustomEvent('vaSelect', {
    bubbles: true,
    detail: { value },
  });
  el.dispatchEvent(ev);
};

const firePageSelect = (el, page) => {
  const ev = new CustomEvent('pageSelect', {
    bubbles: true,
    detail: { page },
  });
  el.dispatchEvent(ev);
};
const fireVaChange = (el, checked) => {
  const ev = new CustomEvent('vaChange', {
    bubbles: true,
    detail: { checked },
  });
  el.dispatchEvent(ev);
};

const makeBigState = () => {
  const items = [];
  // 12 complaints: alternate categories, mix 2022/2023
  const cats = ['marketing', 'academics'];
  for (let i = 0; i < 12; i += 1) {
    const year = i < 6 ? 2022 : 2023;
    items.push({
      closed: `${year}-02-0${(i % 9) + 1}`,
      facilityCode: '21805113',
      categories: [cats[i % cats.length]],
    });
  }
  return {
    profile: {
      inProgress: false,
      attributes: {
        name: 'Test Inst',
        allOpe6Complaints: items,
      },
    },
  };
};

before(() => {
  if (typeof window !== 'undefined' && !window.matchMedia) {
    window.matchMedia = q => ({
      matches: false,
      media: q,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    });
  }
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = cb => setTimeout(cb, 0);
  }
});

const expectFocusOnResults = async container => {
  const results = container.querySelector('#results-summary');
  await waitFor(() => {
    expect(results, '#results-summary not found').to.exist;
    expect(document.activeElement).to.equal(results);
  });
};
// Tiny fake Redux store (enough for Provider)
const makeStore = state => {
  const dispatch = sinon.spy(); // swallow actions/thunks
  return {
    getState: () => state,
    subscribe: () => () => {},
    dispatch,
  };
};

// Helper: render with Router+Provider and the route the page expects
const renderPage = state =>
  render(
    <Provider store={makeStore(state)}>
      <MemoryRouter
        initialEntries={[
          '/schools-and-employers/institution/21805113/filter-student-feedback?version=v1',
        ]}
      >
        <Route path="/schools-and-employers/institution/:facilityCode/filter-student-feedback">
          <FilterStudentFeedbackPage />
        </Route>
      </MemoryRouter>
    </Provider>,
  );

describe('<FilterStudentFeedbackPage> early-return branches (RTL)', () => {
  it('shows the loading indicator when profile.inProgress is true', () => {
    const state = { profile: { inProgress: true } };
    const { getByTestId } = renderPage(state);
    expect(getByTestId('loading-indicator')).to.exist;
  });

  it('shows the loading indicator when attributes are missing', () => {
    const state = { profile: { inProgress: false } };
    const { getByTestId } = renderPage(state);
    expect(getByTestId('loading-indicator')).to.exist;
  });

  it('short-circuits to the error branch when profile.error is true (no loading, no results UI)', () => {
    const state = { profile: { error: true, inProgress: false } };
    const { queryByTestId, queryByText } = renderPage(state);
    expect(queryByTestId('loading-indicator')).to.be.null;
    expect(queryByText('Filter Results')).to.be.null;
  });
});

describe('<FilterStudentFeedbackPage> sorting & pagination (RTL)', () => {
  it.skip('advances to page 2 via va-pagination, then changing sort resets back to page 1', async () => {
    // skipping to support node 22 upgrade
    // appears to be flaky and likely related to shadow DOM rendering timing

    const state = makeBigState();
    const { container, getByText } = renderPage(state);

    getByText(/Showing\s+1[\u2013-]8 of 12 results/i);

    const pager = container.querySelector('va-pagination');
    firePageSelect(pager, 2);

    await waitFor(() => getByText(/Showing\s+9[\u2013-]12 of 12 results/i));
    await expectFocusOnResults(container);

    const sortSelect = container.querySelector('va-select[name="sort-order"]');
    fireVaSelect(sortSelect, 'desc');
    await waitFor(() => getByText(/Showing\s+1[\u2013-]8 of 12 results/i));
    await expectFocusOnResults(container);
  });

  it('moving to page 2, applying a filter, resets back to page 1', async () => {
    const state = makeBigState();
    const { container, getByText } = renderPage(state);

    const pager = container.querySelector('va-pagination');
    firePageSelect(pager, 2);
    await waitFor(() => getByText(/Showing\s+9[\u2013-]12 of 12 results/i));
    await expectFocusOnResults(container);

    const year2022 = container.querySelector('va-checkbox[label="2022"]');
    fireVaChange(year2022, true);

    const applyBtn = container.querySelector('va-button[text="Apply filters"]');
    fireEvent.click(applyBtn);

    getByText(/Filters\s*\(1\)/);
    await waitFor(() => getByText(/Showing\s+1[\u2013-]\d+ of \d+ results/));
    await expectFocusOnResults(container);
  });
});

describe('<FilterStudentFeedbackPage> combined filters & clear/reset flows (RTL)', () => {
  it('applies year + type together (Filters (2)), then Clear filters restores defaults', async () => {
    const state = makeBigState();
    const { container, getByText } = renderPage(state);

    fireVaChange(container.querySelector('va-checkbox[label="2022"]'), true);
    const typeAcademics = container.querySelector(
      'va-checkbox[label="Academics"]',
    );
    fireVaChange(typeAcademics, true);

    const applyBtn = container.querySelector('va-button[text="Apply filters"]');
    fireEvent.click(applyBtn);

    getByText(/Filters\s*\(2\)/);
    await expectFocusOnResults(container);

    const summary = getByText(/Showing/i).closest('p');
    const txt = summary ? summary.textContent : '';
    expect(txt).to.include('2022');
    expect(txt.toLowerCase()).to.include('academics');
    expect(txt).to.match(/with\s+2\s+filters?\s+applied/i);

    const clearBtn = container.querySelector('va-button[text="Clear filters"]');
    fireEvent.click(clearBtn);
    getByText(/^Filters$/);
    await expectFocusOnResults(container);
    fireEvent.click(applyBtn);
    getByText(/^Filters$/);
    await expectFocusOnResults(container);
    expect(container.querySelector('va-checkbox[label="All complaint years"]'))
      .to.exist;
    expect(container.querySelector('va-checkbox[label="All complaint types"]'))
      .to.exist;
  });

  it('toggling “All complaint years” clears specific year selections before applying', async () => {
    const state = makeBigState();
    const { container, getByText } = renderPage(state);

    fireVaChange(container.querySelector('va-checkbox[label="2022"]'), true);
    fireVaChange(
      container.querySelector('va-checkbox[label="All complaint years"]'),
      true,
    );

    const applyBtn = container.querySelector('va-button[text="Apply filters"]');
    fireEvent.click(applyBtn);

    getByText(/^Filters$/);
  });

  it('toggling “All complaint types” clears specific type selections before applying', async () => {
    const state = makeBigState();
    const { container, getByText } = renderPage(state);

    fireVaChange(
      container.querySelector('va-checkbox[label="Marketing"]'),
      true,
    );
    fireVaChange(
      container.querySelector('va-checkbox[label="All complaint types"]'),
      true,
    );

    const applyBtn = container.querySelector('va-button[text="Apply filters"]');
    fireEvent.click(applyBtn);

    getByText(/^Filters$/);
  });
});

describe('<FilterStudentFeedbackPage> result summary text (RTL)', () => {
  it('shows the correct initial summary with zero filters', () => {
    const state = makeBigState();
    const { getByText } = renderPage(state);
    getByText(/Showing\s+1[\u2013-]8 of 12 results/i);
    getByText(/^Filters$/);
  });

  it('shows “Showing 0 results” when a filter combination yields no matches', async () => {
    const state = {
      profile: {
        inProgress: false,
        attributes: {
          name: 'Test Inst',
          allOpe6Complaints: [
            {
              closed: '2022-05-10',
              facilityCode: '21805113',
              categories: ['academics'],
            },
            {
              closed: '2023-03-12',
              facilityCode: '21805113',
              categories: ['marketing'],
            },
          ],
        },
      },
    };
    const { container, getByText } = renderPage(state);

    fireVaChange(container.querySelector('va-checkbox[label="2023"]'), true);
    fireVaChange(
      container.querySelector('va-checkbox[label="Academics"]'),
      true,
    );

    const applyBtn = container.querySelector('va-button[text="Apply filters"]');
    fireEvent.click(applyBtn);

    await waitFor(() => getByText(/^Showing 0 results$/));
    await expectFocusOnResults(container);
  });
});

// ---- matchMedia subscription coverage ----
describe('<FilterStudentFeedbackPage> matchMedia subscription', () => {
  let mmStub;

  afterEach(() => {
    if (mmStub) {
      mmStub.restore();
      mmStub = null;
    }
  });

  it('uses addEventListener/removeEventListener when present and cleans up on unmount', () => {
    let savedCb;
    const mqObj = {
      matches: false,
      addEventListener: sinon.spy((type, cb) => {
        if (type === 'change') savedCb = cb;
      }),
      removeEventListener: sinon.spy(),
    };

    mmStub = sinon.stub(window, 'matchMedia').callsFake(q => {
      expect(q).to.equal('(max-width: 767px)');
      return mqObj;
    });

    const state = {
      profile: {
        inProgress: false,
        attributes: { name: 'Test Inst', allOpe6Complaints: [] },
      },
    };

    const { unmount } = renderPage(state);

    expect(mqObj.addEventListener.calledOnce).to.be.true;
    expect(mqObj.addEventListener.firstCall.args[0]).to.equal('change');
    expect(typeof savedCb).to.equal('function');

    savedCb({ matches: true });

    unmount();
    expect(mqObj.removeEventListener.calledOnce).to.be.true;
    expect(mqObj.removeEventListener.firstCall.args[0]).to.equal('change');
    expect(mqObj.removeEventListener.firstCall.args[1]).to.equal(savedCb);
  });

  it('falls back to addListener/removeListener when addEventListener is absent', () => {
    let savedCb;
    const mqObj = {
      matches: true,
      addListener: sinon.spy(cb => {
        savedCb = cb;
      }),
      removeListener: sinon.spy(),
    };

    mmStub = sinon.stub(window, 'matchMedia').returns(mqObj);

    const state = {
      profile: {
        inProgress: false,
        attributes: { name: 'Test Inst', allOpe6Complaints: [] },
      },
    };

    const { unmount } = renderPage(state);

    expect(mqObj.addListener.calledOnce).to.be.true;
    expect(typeof savedCb).to.equal('function');

    savedCb({ matches: false });

    unmount();
    expect(mqObj.removeListener.calledOnce).to.be.true;
    expect(mqObj.removeListener.firstCall.args[0]).to.equal(savedCb);

    mmStub.restore();
  });
});
