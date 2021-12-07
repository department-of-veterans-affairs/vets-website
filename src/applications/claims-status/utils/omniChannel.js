const OMNI_CHANNEL_WIDTH = 400;
const OMNI_CHANNEL_HEIGHT = 600;
const OMNI_CHANNEL_TITLE = 'Chat with an agent';
export const OMNI_CHANNEL_URL = 'https://dvagov-udo-dev.powerappsportals.us/';

const openOmniChannel = ({
  url = OMNI_CHANNEL_URL,
  title = OMNI_CHANNEL_TITLE, // this is overridden by the window doc title
  setWidth = OMNI_CHANNEL_WIDTH,
  setHeight = OMNI_CHANNEL_HEIGHT,
} = {}) => {
  const width = Math.min(
    window.innerWidth || document.documentElement.clientWidth || screen.width,
    setWidth,
  );
  const height = Math.min(
    window.innerHeight ||
      document.documentElement.clientHeight ||
      screen.height,
    setHeight,
  );

  const right = window.screen.width * 2;
  const top = window.screen.height;
  const windowFeatures = [
    'scrollbars=no',
    'location=no',
    'resizable=no',
    'status=no',
    `width=${width}`,
    `height=${height}`,
    `top=${top}`,
    `left=${right}`,
  ].join(',');

  const newWindow = window.open(url, title, windowFeatures);
  // copy zoom level to new window
  newWindow.document.body.style.zoom = window.devicePixelRatio;

  if (window.focus) {
    newWindow.focus();
  }
};

export default openOmniChannel;
