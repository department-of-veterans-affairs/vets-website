import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import { SET_DATA } from 'platform/forms-system/src/js/actions';
import * as helpers from 'platform/forms-system/src/js/patterns/array-builder/helpers';

import OfficialReport, {
  shouldShowPoliceDataModal,
} from '../../components/OfficialReport';
import { POLICE_REPORT_LOCATION_FIELDS } from '../../constants';

const mockRedux = ({
  review = false,
  submitted = false,
  formData = {},
  onChange = () => {},
  setFormData = () => {},
} = {}) => {
  return {
    props: {
      onChange,
      formContext: {
        onReviewPage: review,
        reviewMode: review,
        submitted,
      },
      formData,
      setFormData,
    },
    mockStore: {
      getState: () => ({
        form: { data: formData },
        formContext: {
          onReviewPage: false,
          reviewMode: false,
          submitted: false,
          touched: {},
        },
      }),
      subscribe: () => {},
      dispatch: action => {
        if (action.type === SET_DATA) {
          return setFormData(action.data);
        }
        return null;
      },
    },
  };
};

const defaultProps = {
  arrayBuilder: {
    getSummaryPath: () => 'mental-health-form-0781/events-summary',
    reviewRoute: 'review-and-submit',
    arrayPath: 'events',
    required: () => true,
    getText: () => '',
  },
  name: 'officialReport',
  schema: {},
  uiSchema: {},
  appStateData: {},
  onSubmit: () => {},
  onChange: () => {},
  goToPath: () => {},
  goBack: () => {},
  pagePerItemIndex: 0,
  title: 'Official Report',
  data: {},
  fullData: {},
  getFormData: () => {},
  onReviewPage: false,
  pageContentBeforeButtons: null,
  contentBeforeButtons: null,
  contentAfterButtons: null,
};

let getArrayUrlSearchParamsStub;
let getIndexStub;

function stubUrlParams(str) {
  getArrayUrlSearchParamsStub = sinon
    .stub(helpers, 'getArrayUrlSearchParams')
    .returns(new URLSearchParams(str));
}

function stubUrlIndex(index) {
  getIndexStub = sinon
    .stub(helpers, 'getArrayIndexFromPathName')
    .returns(index);
}

afterEach(() => {
  if (getArrayUrlSearchParamsStub) {
    getArrayUrlSearchParamsStub.restore();
    getArrayUrlSearchParamsStub = null;
  }
  if (getIndexStub) {
    getIndexStub.restore();
    getIndexStub = null;
  }
});

function setupOfficialReport({
  eventData = {},
  urlParams = '?edit=true',
  onChange = sinon.spy(),
  setFormData = sinon.spy(),
} = {}) {
  stubUrlIndex(0);
  stubUrlParams(urlParams);

  const { mockStore } = mockRedux({
    formData: { events: [eventData] },
    setFormData,
  });

  const props = {
    ...defaultProps,
    data: eventData,
    onChange,
  };

  const { container, getByTestId, getByText } = render(
    <Provider store={mockStore}>
      <OfficialReport {...props} />
    </Provider>,
  );

  return { container, getByTestId, getByText, onChange };
}

describe('OfficialReport', () => {
  it('renders the component', () => {
    const { container } = setupOfficialReport({
      eventData: {
        agency: 'Agency 1',
        otherReports: {
          police: true,
        },
      },
    });

    const visibleHeading = container.querySelector('h3.vads-u-margin--0');
    expect(visibleHeading).to.exist;
    expect(visibleHeading.textContent).to.include('VA FORM 21-0781');
  });

  it('opens the police report modal when police is deselected and a location field is filled', () => {
    const { container, getByTestId } = setupOfficialReport({
      eventData: {
        agency: 'An Agency',
        otherReports: { police: false },
        city: 'Somewhere',
        state: 'VA',
      },
    });

    fireEvent.click(container.querySelector('va-button[continue]'));
    const $modal = getByTestId('remove-police-modal');
    expect($modal.getAttribute('visible')).to.equal('true');
  });

  it('removes police report location data on confirm', () => {
    const onChange = sinon.spy();
    const { container, getByTestId } = setupOfficialReport({
      eventData: {
        agency: 'An Agency',
        city: 'Somewhere',
        state: 'VA',
        otherReports: { police: false },
      },
      onChange,
    });

    fireEvent.click(container.querySelector('va-button[continue]'));
    const $modal = getByTestId('remove-police-modal');
    $modal.__events.primaryButtonClick();

    const updated = onChange.getCall(0).args[0];
    expect(updated.agency).to.equal('');
    expect(updated.city).to.equal('');
    expect(updated.state).to.equal('');
    expect(updated.otherReports.police).to.be.false;
  });

  it('directs focus to a rendered alert after confirming removal of police report', async () => {
    const { container, getByTestId } = setupOfficialReport({
      eventData: {
        agency: 'An Agency',
        city: 'Somewhere',
        state: 'VA',
        otherReports: { police: true },
      },
    });

    fireEvent.click(container.querySelector('va-button[continue]'));
    const $modal = getByTestId('remove-police-modal');
    $modal.__events.primaryButtonClick();

    await waitFor(() => {
      const $alert = getByTestId('remove-police-alert');
      expect($alert.getAttribute('visible')).to.equal('true');
      expect($alert).to.have.text(
        'We’ve removed police report information about Event #1.',
      );
      // expect($alert).to.equal(document.activeElement);
      expect($alert.getAttribute('tabIndex')).to.equal('-1');
    });
  });
});

describe('shouldShowPoliceDataModal', () => {
  it('returns true when police is false and at least one location field is non-empty', () => {
    POLICE_REPORT_LOCATION_FIELDS.forEach(field => {
      const data = {
        otherReports: { police: false },
        [field]: 'Some value',
      };
      expect(shouldShowPoliceDataModal(data)).to.be.true;
    });
  });

  it('returns false when police is true even if location fields are filled', () => {
    const data = {
      otherReports: { police: true },
      agency: 'Some agency',
      city: 'Some city',
      state: 'Some state',
      township: 'Some township',
      country: 'Some country',
    };
    expect(shouldShowPoliceDataModal(data)).to.be.false;
  });

  it('returns false when police is false but all location fields are empty', () => {
    const data = {
      otherReports: { police: false },
      agency: '',
      city: '',
      state: '',
      township: '',
      country: '',
    };
    expect(shouldShowPoliceDataModal(data)).to.be.false;
  });

  it('returns false when no location fields are defined', () => {
    const data = {
      otherReports: { police: false },
    };
    expect(shouldShowPoliceDataModal(data)).to.be.false;
  });
});
