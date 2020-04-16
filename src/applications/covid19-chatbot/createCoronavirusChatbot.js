export default (_store, widgetType) => {
  // Derive the element to render our widget.
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);

  // Escape early if no element was found.
  if (!root) {
    return;
  }

  // webpackChunkName: "chatbot"
  import('./index').then(module => {
    const initializeChatbot = module.default;
    initializeChatbot();
  });
};
