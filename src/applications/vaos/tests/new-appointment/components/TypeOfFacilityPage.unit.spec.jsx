import React from 'react';
import { TypeOfFacilityPage } from '../../../new-appointment/components/TypeOfFacilityPage';
import { mockParentSites, mockSupportedFacilities } from '../../mocks/helpers';
import { getFacilityMock, getParentSiteMock } from '../../mocks/v0';
import {
  createTestStore,
  renderWithStoreAndRouter,
  setTypeOfCare,
} from '../../mocks/setup';
import { mockFetch, resetFetch } from 'platform/testing/unit/helpers';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingVSPAppointmentNew: false,
    vaOnlineSchedulingDirect: true,
    // eslint-disable-next-line camelcase
    show_new_schedule_view_appointments_page: true,
  },
  user: {
    profile: {
      facilities: [
        { facilityId: '983', isCerner: false },
        { facilityId: '984', isCerner: false },
      ],
    },
  },
};

const parentSite983 = {
  id: '983',
  attributes: {
    ...getParentSiteMock().attributes,
    institutionCode: '983',
    authoritativeName: 'Some VA facility',
    rootStationCode: '983',
    parentStationCode: '983',
  },
};
const parentSite984 = {
  id: '984',
  attributes: {
    ...getParentSiteMock().attributes,
    institutionCode: '984',
    authoritativeName: 'Some other VA facility',
    rootStationCode: '984',
    parentStationCode: '984',
  },
};

describe('VAOS integration: VA type of facility page with a multi-site user', () => {
  beforeEach(() => mockFetch());
  afterEach(() => resetFetch());

  it('should show form with required questions for both sites and facilities', async () => {
    mockParentSites(['983', '984'], [parentSite983, parentSite984]);
    const facility = {
      id: '984',
      attributes: {
        ...getFacilityMock().attributes,
        institutionCode: '984',
        city: 'Bozeman',
        stateAbbrev: 'MT',
        authoritativeName: 'Bozeman VA medical center',
        rootStationCode: '984',
        parentStationCode: '984',
        requestSupported: true,
      },
    };
    mockSupportedFacilities({
      siteId: '984',
      parentId: '984',
      typeOfCareId: '323',
      data: [facility],
    });
    const store = createTestStore(initialState);
    await setTypeOfCare(store, /primary care/i);

    const screen = renderWithStoreAndRouter(<TypeOfFacilityPage />, {
      store,
    });

    await screen.findByText(/Choose where you want to receive your care/i);
    // expect(screen.getByLabelText(/some other va facility/i)).to.have.attribute(
    //   'value',
    //   'var984',
    // );
  });
});

// describe('VAOS <TypeOfFacilityPage>', () => {
//   it('should render', () => {
//     const openFormPage = sinon.spy();
//     const updateFormData = sinon.spy();
//
//     const form = mount(
//       <TypeOfFacilityPage
//         openFormPage={openFormPage}
//         updateFormData={updateFormData}
//         data={{}}
//       />,
//     );
//
//     expect(form.find('input').length).to.equal(2);
//     form.unmount();
//   });
//
//   it('should not submit empty form', () => {
//     const openFormPage = sinon.spy();
//     const history = {
//       push: sinon.spy(),
//     };
//
//     const form = mount(
//       <TypeOfFacilityPage
//         openFormPage={openFormPage}
//         history={history}
//         data={{}}
//       />,
//     );
//
//     form.find('form').simulate('submit');
//
//     expect(form.find('.usa-input-error').length).to.equal(1);
//     expect(history.push.called).to.be.false;
//     form.unmount();
//   });
//
//   it('should call updateFormData after change', () => {
//     const openFormPage = sinon.spy();
//     const updateFormData = sinon.spy();
//     const history = {
//       push: sinon.spy(),
//     };
//
//     const form = mount(
//       <TypeOfFacilityPage
//         openFormPage={openFormPage}
//         updateFormData={updateFormData}
//         history={history}
//         data={{}}
//       />,
//     );
//
//     selectRadio(form, 'root_facilityType', FACILITY_TYPES.COMMUNITY_CARE);
//
//     expect(updateFormData.firstCall.args[2].facilityType).to.equal(
//       FACILITY_TYPES.COMMUNITY_CARE,
//     );
//     form.unmount();
//   });
//
//   it('should submit with valid data', () => {
//     const openFormPage = sinon.spy();
//     const routeToNextAppointmentPage = sinon.spy();
//
//     const form = mount(
//       <TypeOfFacilityPage
//         openFormPage={openFormPage}
//         routeToNextAppointmentPage={routeToNextAppointmentPage}
//         data={{ facilityType: FACILITY_TYPES.COMMUNITY_CARE }}
//       />,
//     );
//
//     form.find('form').simulate('submit');
//
//     expect(form.find('.usa-input-error').length).to.equal(0);
//     expect(routeToNextAppointmentPage.called).to.be.true;
//     form.unmount();
//   });
//
//   it('document title should match h1 text', () => {
//     const openFormPage = sinon.spy();
//     const updateFormData = sinon.spy();
//     const pageTitle = 'Choose where you want to receive your care';
//
//     const form = mount(
//       <TypeOfFacilityPage
//         openFormPage={openFormPage}
//         updateFormData={updateFormData}
//         data={{}}
//       />,
//     );
//
//     expect(form.find('h1').text()).to.equal(pageTitle);
//     expect(document.title).contain(pageTitle);
//     form.unmount();
//   });
// });
