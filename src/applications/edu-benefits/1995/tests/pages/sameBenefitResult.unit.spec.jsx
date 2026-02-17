import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { buildResultPage } from '../../pages/mebQuestionnaire';

const mockStore = configureStore([]);

describe('sameBenefitResultPage description prioritization', () => {
  it('should correctly prioritize mebSameBenefitSelection over currentBenefitType', () => {
    const store = mockStore({
      user: {
        profile: {
          loa: {
            current: 1,
          },
        },
      },
    });

    const formData = {
      mebWhatDoYouWantToDo: 'same-benefit',
      currentBenefitType: 'chapter30',
      mebSameBenefitSelection: 'chapter33',
    };

    const { CustomPage: DescriptionComponent } = buildResultPage();

    const { container } = render(
      <Provider store={store}>
        <DescriptionComponent data={formData} setFormData={() => {}} />
      </Provider>,
    );

    // Should use mebSameBenefitSelection (chapter33) not currentBenefitType (chapter30)
    expect(container.textContent).to.include('VA Form 22-1990');
    expect(container.textContent).to.include(
      'Your most recently used benefit is Post-9/11 GI Bill (PGIB, Chapter 33)',
    );
    expect(container.textContent).to.not.include('Montgomery GI Bill');
  });

  it('should use currentBenefitType when mebSameBenefitSelection is not present', () => {
    const store = mockStore({
      user: {
        profile: {
          loa: {
            current: 3,
          },
        },
      },
    });

    const formData = {
      mebWhatDoYouWantToDo: 'same-benefit',
      currentBenefitType: 'chapter30',
    };

    const { CustomPage: DescriptionComponent } = buildResultPage();

    const { container } = render(
      <Provider store={store}>
        <DescriptionComponent data={formData} setFormData={() => {}} />
      </Provider>,
    );

    // Should use currentBenefitType (chapter30)
    expect(container.textContent).to.include('VA Form 22-1990');
    expect(container.textContent).to.include(
      'Your most recently used benefit is Montgomery GI Bill (MGIB-AD, Chapter 30)',
    );
  });

  it('should route to correct form (22-5490) for DEA benefit', () => {
    const store = mockStore({
      user: {
        profile: {
          loa: {
            current: 1,
          },
        },
      },
    });

    const formData = {
      mebWhatDoYouWantToDo: 'same-benefit',
      mebSameBenefitSelection: 'chapter35',
    };

    const { CustomPage: DescriptionComponent } = buildResultPage();

    const { container } = render(
      <Provider store={store}>
        <DescriptionComponent data={formData} setFormData={() => {}} />
      </Provider>,
    );

    expect(container.textContent).to.include('VA Form 22-5490');
    expect(container.textContent).to.include(
      "Your most recently used benefit is Survivors' and Dependents' Educational Assistance (DEA, Chapter 35)",
    );
  });

  it('should handle null/undefined benefit type gracefully', () => {
    const store = mockStore({
      user: {
        profile: {
          loa: {
            current: 1,
          },
        },
      },
    });

    const formData = {
      mebWhatDoYouWantToDo: 'same-benefit',
    };

    const { CustomPage: DescriptionComponent } = buildResultPage();

    const { container } = render(
      <Provider store={store}>
        <DescriptionComponent data={formData} setFormData={() => {}} />
      </Provider>,
    );

    expect(container.textContent).to.include('VA Form 22-1990');
  });
});
