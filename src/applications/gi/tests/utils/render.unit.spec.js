import { shallow } from 'enzyme';
import { renderSchoolClosingAlert } from '../../utils/render';

describe('renderSchoolClosingAlert', () => {
  test('should render as upcoming closure alert', () => {
    const tree = shallow(
      renderSchoolClosingAlert({
        schoolClosing: true,
      }),
    );
    expect(tree.find('.usa-alert-text').text()).toBe(
      'A campus at this school will be closing soon',
    );
    tree.unmount();
  });
  test('should render as school closed alert', () => {
    const tree = shallow(
      renderSchoolClosingAlert({
        schoolClosing: true,
        schoolClosingOn: '2019-05-06',
      }),
    );
    expect(tree.find('.usa-alert-text').text()).toBe('School has closed');
    tree.unmount();
  });
  test('should not render an alert', () => {
    const result = renderSchoolClosingAlert({
      schoolClosing: false,
    });
    expect(result).toBeNull();
  });
});
