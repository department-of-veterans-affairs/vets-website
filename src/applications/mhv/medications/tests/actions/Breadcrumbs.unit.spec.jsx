import { expect } from 'chai';
import sinon from 'sinon';
import { Actions } from '../../util/actionTypes';
import { setBreadcrumbs } from '../../actions/breadcrumbs';
import { medicationsUrls } from '../../util/constants';

describe('Set breadcrumbs action', () => {
  it('should dispatch a set breadcrumbs action', () => {
    const dispatch = sinon.spy();
    return setBreadcrumbs(
      [
        {
          url: medicationsUrls.MEDICATIONS_ABOUT,
          label: 'About medications',
        },
        {
          url: `${medicationsUrls.MEDICATIONS_URL}/1`,
          label: 'Medications',
        },
      ],
      {
        url: `${medicationsUrls.PRESCRIPTION_DETAILS}/000`,
        label: 'Prescription Name',
      },
    )(dispatch).then(() => {
      expect(dispatch.firstCall.args[0].type).to.equal(
        Actions.Breadcrumbs.SET_BREAD_CRUMBS,
      );
      expect(dispatch.firstCall.args[0].payload.crumbs[0].label).to.equal(
        'About medications',
      );
      expect(dispatch.firstCall.args[0].payload.crumbs[1].label).to.equal(
        'Medications',
      );
      expect(dispatch.firstCall.args[0].payload.location.label).to.equal(
        'Prescription Name',
      );
    });
  });
});
