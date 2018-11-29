export function qSA(rootNode, selector) {
  return Array.from(rootNode.querySelectorAll(selector));
}

export function qS(rootNode, selector) {
  return rootNode.querySelector(selector);
}

export function removeChildNodes(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}
