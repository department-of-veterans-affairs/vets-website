import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import sinon from 'sinon';
import { buildResultPage } from '../../pages/mebQuestionnaire';
import { getBenefitLabel } from '../../components/YourInformationDescription';

const mockStore = configureStore([]);
const store = mockStore({
  user: {
    profile: {
      loa: {
        current: 1,
      },
    },
  },
});
const setFormData = sinon.spy();

it('should clear questionnaire data when user clicks restart link', async () => {
  const formData = {
    mebWhatDoYouWantToDo: 'same-benefit',
    mebBenefitSelection: 'fry',
  };
  const { CustomPage: ResultPage } = buildResultPage();

  const screen = render(
    <Provider store={store}>
      <ResultPage data={formData} setFormData={setFormData} />
    </Provider>,
  );

  const restartLink = screen.getByText('Restart questionnaire');
  await userEvent.click(restartLink);
  sinon.assert.calledWith(setFormData, {
    mebWhatDoYouWantToDo: undefined,
    mebBenefitSelection: undefined,
    mebSameBenefitSelection: undefined,
  });
});

describe('foreignSchoolResult', () => {
  it('should render when user elects to update COE for foreign school', () => {
    const formData = {
      mebWhatDoYouWantToDo: 'foreign-school',
    };

    const { CustomPage: ResultPage } = buildResultPage();

    const screen = render(
      <Provider store={store}>
        <ResultPage data={formData} setFormData={setFormData} />
      </Provider>,
    );

    expect(screen.getByText('Ask VA')).to.exist;
    expect(screen.getAllByText('foreign school', { exact: false })).to.not.be
      .empty;
  });
});

describe('Switch benefit', () => {
  describe('mgibAdResult', () => {
    const formData = {
      mebWhatDoYouWantToDo: 'switch-benefit',
      mebBenefitSelection: 'mgib-ad',
    };

    it('should render when user elects to switch to ch 30', () => {
      const { CustomPage: ResultPage } = buildResultPage();

      const screen = render(
        <Provider store={store}>
          <ResultPage data={formData} setFormData={setFormData} />
        </Provider>,
      );

      expect(screen.getAllByText('VA Form 22-1990', { exact: false })).to.not.be
        .empty;
      expect(
        screen.getAllByText(
          `You want to change your current benefit to the ${getBenefitLabel(
            'CH30',
          )}`,
        ),
      ).to.exist;
    });
  });

  describe('mgibSrResult', () => {
    const formData = {
      mebWhatDoYouWantToDo: 'switch-benefit',
      mebBenefitSelection: 'mgib-sr',
    };

    it('should render when user elects to switch to ch 1606', () => {
      const { CustomPage: ResultPage } = buildResultPage();

      const screen = render(
        <Provider store={store}>
          <ResultPage data={formData} setFormData={setFormData} />
        </Provider>,
      );

      expect(screen.getAllByText('VA Form 22-1990', { exact: false })).to.not.be
        .empty;
      expect(
        screen.getAllByText(
          `You want to change your current benefit to the ${getBenefitLabel(
            'CH1606',
          )}`,
        ),
      ).to.exist;
    });
  });

  describe('toeResult', () => {
    const formData = {
      mebWhatDoYouWantToDo: 'switch-benefit',
      mebBenefitSelection: 'toe',
    };

    it('should render when user elects to switch to ch 33 toe', () => {
      const { CustomPage: ResultPage } = buildResultPage();

      const screen = render(
        <Provider store={store}>
          <ResultPage data={formData} setFormData={setFormData} />
        </Provider>,
      );

      expect(screen.getAllByText('VA Form 22-1990e', { exact: false })).to.not
        .be.empty;
      expect(
        screen.getAllByText(
          `You want to change your current benefit to the ${getBenefitLabel(
            'CH33_TOE',
          )}`,
        ),
      ).to.exist;
    });
  });

  describe('deaResult', () => {
    const formData = {
      mebWhatDoYouWantToDo: 'switch-benefit',
      mebBenefitSelection: 'dea',
    };

    it('should render when user elects to switch to ch 35', () => {
      const { CustomPage: ResultPage } = buildResultPage();

      const screen = render(
        <Provider store={store}>
          <ResultPage data={formData} setFormData={setFormData} />
        </Provider>,
      );

      expect(screen.getAllByText('VA Form 22-5490', { exact: false })).to.not.be
        .empty;
      expect(
        screen.getAllByText(
          `You want to change your current benefit to the ${getBenefitLabel(
            'CH35',
          )}`,
        ),
      ).to.exist;
    });
  });

  describe('fryResult', () => {
    const formData = {
      mebWhatDoYouWantToDo: 'switch-benefit',
      mebBenefitSelection: 'fry',
    };

    it('should render when user elects to switch to ch 33 fry', () => {
      const { CustomPage: ResultPage } = buildResultPage();

      const screen = render(
        <Provider store={store}>
          <ResultPage data={formData} setFormData={setFormData} />
        </Provider>,
      );

      expect(screen.getAllByText('VA Form 22-5490', { exact: false })).to.not.be
        .empty;
      expect(
        screen.getAllByText(
          `You want to change your current benefit to the ${getBenefitLabel(
            'CH33_FRY',
          )}`,
        ),
      ).to.exist;
    });
  });

  describe('pgibResult', () => {
    const formData = {
      mebWhatDoYouWantToDo: 'switch-benefit',
      mebBenefitSelection: 'pgib',
    };

    it('should render when user elects to switch to ch 33', () => {
      const { CustomPage: ResultPage } = buildResultPage();

      const screen = render(
        <Provider store={store}>
          <ResultPage data={formData} setFormData={setFormData} />
        </Provider>,
      );

      expect(screen.getAllByText('VA Form 22-1990', { exact: false })).to.not.be
        .empty;
      expect(
        screen.getAllByText(
          `You want to change your current benefit to the ${getBenefitLabel(
            'CH33',
          )}`,
        ),
      ).to.exist;
    });
  });
});
