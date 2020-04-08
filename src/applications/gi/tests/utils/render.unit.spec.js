import { expect } from 'chai';
import { shallow } from 'enzyme';
import {
  renderCautionAlert,
  renderSchoolClosingAlert,
} from '../../utils/render';

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

describe('renderCautionAlert', () => {
  it('should render', () => {
    const cautionFlags = [
      { title: 'TEST A', id: 1 },
      { title: 'TEST B', id: 2 },
    ];

    const tree = shallow(renderCautionAlert({ cautionFlags }));
    expect(
      tree
        .find('li')
        .at(0)
        .text(),
    ).to.equal(cautionFlags[0].title);
    expect(tree.find('li').length).to.equal(cautionFlags.length);

    tree.unmount();
  });
  it('should render correct heading for single flag', () => {
    const tree = shallow(
      renderCautionAlert({ cautionFlags: [{ title: 'TEST A', id: 1 }] }),
    );
    expect(tree.find('.usa-alert-heading').text()).to.equal(
      'This school has a cautionary warning',
    );
    tree.unmount();
  });
  it('should render correct heading for multiple flag', () => {
    const tree = shallow(
      renderCautionAlert({
        cautionFlags: [{ title: 'TEST A', id: 1 }, { title: 'TEST B', id: 2 }],
      }),
    );
    expect(tree.find('.usa-alert-heading').text()).to.equal(
      'This school has cautionary warnings',
    );
    tree.unmount();
  });
  it('should sort caution flags by title', () => {
    const cautionFlags = [
      { title: 'TEST Z', id: 1 },
      { title: 'TEST A', id: 2 },
    ];

    const tree = shallow(renderCautionAlert({ cautionFlags }));
    expect(
      tree
        .find('li')
        .at(0)
        .text(),
    ).to.equal(cautionFlags[1].title);
    tree.unmount();
  });
});
