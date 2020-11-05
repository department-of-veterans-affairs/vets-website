export default class SearchAreaControl {
  onAdd(map) {
    this.map = map;
    this.container = document.createElement('button');
    this.container.id = 'search-area-control';
    this.container.style.display = 'none';
    this.container.textContent = 'Search this area of map';
    return this.container;
  }
  onRemove() {
    this.container.parentNode.removeChild(this.container);
    this.map = undefined;
  }
}
