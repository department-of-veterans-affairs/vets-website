import { expect } from 'chai';
import sinon from 'sinon';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import widgetTypes from 'platform/site-wide/widgetTypes';
import { BannerContainer } from '../bannerContainer';
import createSituationUpdatesBanner from '../createSituationUpdatesBanner';

describe('createSituationUpdatesBanner', () => {
  let sandbox;
  let store;
  let widgetContainer;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    store = {
      getState: () => ({
        featureToggles: {
          loading: false,
          bannerUseAlternativeBanners: true,
        },
      }),
      subscribe: () => {},
      dispatch: sinon.spy(),
    };

    widgetContainer = document.createElement('div');
    widgetContainer.setAttribute(
      'data-widget-type',
      widgetTypes.SITUATION_UPDATES_BANNER,
    );
    document.body.appendChild(widgetContainer);

    sandbox.stub(ReactDOM, 'render');
  });

  afterEach(() => {
    sandbox.restore();
    if (widgetContainer && widgetContainer.parentNode) {
      widgetContainer.parentNode.removeChild(widgetContainer);
    }
  });

  it('should not render banner when widget container is not found', async () => {
    document.body.removeChild(widgetContainer);
    await createSituationUpdatesBanner(
      store,
      widgetTypes.SITUATION_UPDATES_BANNER,
    );
    expect(ReactDOM.render.called).to.be.false;
  });

  it('should render banner with default props when widget container exists', async () => {
    await createSituationUpdatesBanner(
      store,
      widgetTypes.SITUATION_UPDATES_BANNER,
    );

    expect(ReactDOM.render.calledOnce).to.be.true;

    const renderCall = ReactDOM.render.getCall(0);
    const [element, container] = renderCall.args;

    expect(container).to.equal(widgetContainer);

    // Check if rendered element is wrapped in Provider
    expect(element.type).to.equal(Provider);

    // Check if SituationUpdateBanner is rendered with correct props
    const situationBanner = element.props.children;
    expect(situationBanner.type).to.equal(BannerContainer);
  });
});
