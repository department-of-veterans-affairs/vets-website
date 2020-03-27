import { expect } from 'chai';
import { shallow } from 'enzyme';
import { renderSchoolClosingAlert } from '../../utils/render';

describe('renderSchoolClosingAlert', () => {
  it('should render as upcoming closure alert', () => {
    const tree = shallow(
      renderSchoolClosingAlert({
        schoolClosing: true,
      }),
    );
    expect(tree.find('.usa-alert-text').text()).to.equal(
      'A campus at this school will be closing soon',
    );
    tree.unmount();
  });
  it('should render as school closed alert', () => {
    const tree = shallow(
      renderSchoolClosingAlert({
        schoolClosing: true,
        schoolClosingOn: '2019-05-06',
      }),
    );
    expect(tree.find('.usa-alert-text').text()).to.equal('School has closed');
    tree.unmount();
  });
  it('should not render an alert', () => {
    const result = renderSchoolClosingAlert({
      schoolClosing: false,
    });
    expect(result).to.be.null;
  });
});
