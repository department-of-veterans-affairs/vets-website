import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './sass/homepage-hero.scss';

export default function createHomepageHeroRandomizer(store, widgetType) {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  if (root) {
    import('./index').then(module => {
      const HeroRandom = module.default;
      ReactDOM.render(
        <Provider store={store}>
          <HeroRandom />
        </Provider>,
        root,
      );
    });
  }
}
