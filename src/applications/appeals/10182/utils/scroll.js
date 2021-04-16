import Scroll from 'react-scroll';

const scroller = Scroll.scroller;

export const scrollToTop = (id, options) => {
  if (!options.doNotScroll) {
    setTimeout(() => {
      scroller.scrollTo(
        `topOfTable_${id}`,
        window.Forms?.scroll || {
          duration: 500,
          delay: 0,
          smooth: true,
          offset: -60,
        },
      );
    }, 100);
  }
};

export const scrollToRow = (id, options) => {
  if (!options.doNotScroll) {
    setTimeout(() => {
      scroller.scrollTo(
        `table_${id}`,
        window.Forms?.scroll || {
          duration: 500,
          delay: 0,
          smooth: true,
          offset: 0,
        },
      );
    }, 100);
  }
};
