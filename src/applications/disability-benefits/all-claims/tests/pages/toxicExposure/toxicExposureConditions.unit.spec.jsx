import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import {
  conditionsPageTitle,
  conditionsQuestion,
} from '../../../content/toxicExposure';
import ToxicExposureChoicePage from '../../../pages/toxicExposure/toxicExposureChoicePage';

describe('Toxic Exposure Conditions', () => {
  const getMockStore = (featureToggleEnabled = true) => {
    return {
      getState: () => ({
        featureToggles: {
          disabilityCompensationToxicExposureDestructionModal: featureToggleEnabled,
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };
  };

  const renderPage = ({
    data = {},
    setFormData = () => {},
    goForward = () => {},
    goBack = () => {},
    featureToggleEnabled = true,
  } = {}) => {
    const mockStore = getMockStore(featureToggleEnabled);
    return render(
      <Provider store={mockStore}>
        <ToxicExposureChoicePage
          data={data}
          setFormData={setFormData}
          goForward={goForward}
          goBack={goBack}
        />
      </Provider>,
    );
  };

  it('should render conditions page with multiple conditions', async () => {
    const formData = {
      newDisabilities: [
        {
          cause: 'NEW',
          primaryDescription: 'Test description',
          'view:serviceConnectedDisability': {},
          condition: 'anemia',
        },
        {
          cause: 'NEW',
          primaryDescription: 'Test description',
          'view:serviceConnectedDisability': {},
          condition: 'tinnitus (ringing or hissing in ears)',
        },
      ],
      toxicExposure: {
        conditions: {},
      },
    };
    const { container } = renderPage({ data: formData });

    // Check page title
    expect(container.textContent).to.contain(conditionsPageTitle);

    // Check that checkbox group is rendered
    await waitFor(() => {
      expect($$('va-checkbox-group', container).length).to.equal(1);
      expect($('va-checkbox-group', container).getAttribute('label')).to.equal(
        conditionsQuestion,
      );

      expect($$('va-checkbox', container).length).to.equal(3);
      expect($(`va-checkbox[label="Anemia"]`, container)).to.exist;
      expect(
        $(
          `va-checkbox[label="Tinnitus (Ringing Or Hissing In Ears)"]`,
          container,
        ),
      ).to.exist;
      expect(
        $(
          `va-checkbox[label="I am not claiming any conditions related to toxic exposure"]`,
          container,
        ),
      ).to.exist;
    });
  });

  it('should allow form submission when no condition is selected', async () => {
    // The toxic exposure selection is now optional.
    // Users can proceed without selecting any conditions.
    // A modal will only appear if they have existing toxic exposure data.
    let goForwardCalled = false;

    const setFormDataMock = () => {};
    const goForwardMock = () => {
      goForwardCalled = true;
    };

    const formData = {
      newDisabilities: [
        {
          cause: 'NEW',
          primaryDescription: 'Test description',
          'view:serviceConnectedDisability': {},
          condition: 'anemia',
        },
      ],
      toxicExposure: {
        conditions: {},
      },
    };

    const { container } = renderPage({
      data: formData,
      setFormData: setFormDataMock,
      goForward: goForwardMock,
    });

    // Submit the form without selecting any conditions
    fireEvent.click($('button[type="submit"]', container));

    // Verify that goForward was called (form was submitted)
    expect(goForwardCalled).to.be.true;
  });
});
