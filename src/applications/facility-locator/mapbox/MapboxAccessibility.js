import xtend from 'xtend';
import bbox from '@turf/bbox';
import debounce from 'lodash/debounce';

// Source plugin - https://github.com/mapbox/mapbox-gl-accessibility

export default class MapboxAccessibility {
  constructor(options) {
    const defaultOptions = {
      width: 24,
      height: 24,
    };

    if (!options && !options.layers) {
      throw new Error('An array of layers is required');
    }

    if (!options && !options.accessibleLabelProperty) {
      throw new Error('a valid accessibleLabelProperty is required');
    }

    this.options = xtend(defaultOptions, options);
  }

  clearMarkers = () => {
    if (this.features) {
      this.features.forEach(feature => {
        if (feature.marker) {
          this.map.getCanvasContainer().removeChild(feature.marker);
          // eslint-disable-next-line no-param-reassign
          delete feature.marker;
        }
      });
    }
  };

  queryFeatures = () => {
    this._debouncedQueryFeatures.cancel();
    this.clearMarkers();

    this.features = this.map.queryRenderedFeatures({
      layers: this.options.layers,
    });
    this.features.map(feature => {
      let { width, height } = this.options;
      const label = feature.properties[this.options.accessibleLabelProperty];

      // eslint-disable-next-line no-param-reassign
      feature.marker = document.createElement('button');
      feature.marker.setAttribute('aria-label', label);
      feature.marker.setAttribute('title', label);
      feature.marker.setAttribute('tabindex', 0);
      // eslint-disable-next-line no-param-reassign
      feature.marker.style.display = 'block';

      let position;
      if (feature.geometry.type === 'Point') {
        position = this.map.project(feature.geometry.coordinates);
      } else {
        const featureBbox = bbox(feature);
        const bl = this.map.project([featureBbox[0], featureBbox[1]]);
        const tr = this.map.project([featureBbox[2], featureBbox[3]]);

        width = Math.abs(tr.x - bl.x);
        height = Math.abs(tr.y - bl.y);

        position = {
          x: (tr.x + bl.x) / 2,
          y: (tr.y + bl.y) / 2,
        };
      }
      // eslint-disable-next-line no-param-reassign
      feature.marker.style.width = `${width}px`;
      // eslint-disable-next-line no-param-reassign
      feature.marker.style.height = `${height}px`;
      // eslint-disable-next-line no-param-reassign
      feature.marker.style.transform = `translate(-50%, -50%) translate(${
        position.x
      }px, ${position.y}px)`;
      // eslint-disable-next-line no-param-reassign
      feature.marker.className = 'mapboxgl-accessibility-marker';

      this.map.getCanvasContainer().appendChild(feature.marker);
      return feature;
    });
  };

  _movestart = () => {
    this._debouncedQueryFeatures.cancel();
    this.clearMarkers();
  };

  _render = () => {
    if (!this.map.isMoving()) {
      this._debouncedQueryFeatures();
    }
  };

  onAdd(map) {
    this.map = map;

    this._debouncedQueryFeatures = debounce(this.queryFeatures, 100);

    this.map.on('movestart', this._movestart);
    this.map.on('moveend', this._render);
    this.map.on('render', this._render);

    this.container = document.createElement('div');
    return this.container;
  }

  onRemove() {
    this.container.parentNode.removeChild(this.container);
    this.map.off('movestart', this._movestart);
    this.map.off('moveend', this._render);
    this.map.off('render', this._render);
    this._debouncedQueryFeatures.cancel();
    delete this.map;
  }
}
