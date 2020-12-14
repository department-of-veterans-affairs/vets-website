export default class SearchAreaControl {
  constructor(isMobile) {
    this.isMobile = isMobile;
  }

  onAdd(map) {
    this.map = map;
    this.container = document.createElement('div');
    this.container.id = 'search-area-control-container';
    this.container.setAttribute('aria-live', 'polite');
    this.container.className = this.isMobile
      ? 'mapboxgl-ctrl-bottom-center'
      : 'mapboxgl-ctrl-top-center';
    this.container.style.display = 'none';
    this.button = document.createElement('button');
    this.button.id = 'search-area-control';
    this.button.textContent = 'Search this area of map';
    this.container.appendChild(this.button);
    return this.container;
  }
  onRemove() {
    this.container.parentNode.removeChild(this.container);
    this.map = undefined;
  }
}
