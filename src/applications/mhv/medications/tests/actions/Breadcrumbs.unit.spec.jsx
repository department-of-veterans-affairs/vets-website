import { expect } from 'chai';
import sinon from 'sinon';
import { Actions } from '../../util/actionTypes';
import { setBreadcrumbs } from '../../actions/breadcrumbs';

describe('Set breadcrumbs action', () => {
  it('should dispatch a set breadcrumbs action', () => {
    const dispatch = sinon.spy();
    return setBreadcrumbs(
      [
        {
          url: '/my-health/medications/about',
          label: 'About medications',
        },
        {
          url: '/my-health/medications/1',
          label: 'Medications',
        },
      ],
      {
        url: `/my-health/medications/prescription/000`,
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
