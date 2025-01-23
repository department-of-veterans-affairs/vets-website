const toBoolean = value => value === 'true';

const isElementInViewport = (
  el,
  win = window,
  docEl = document.documentElement,
) => {
  const rect = el.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (win.innerHeight || docEl.clientHeight) &&
    rect.right <= (win.innerWidth || docEl.clientWidth)
  );
};

const addAriasExpandedAttr = () => {
  Array.from(document.querySelectorAll('.usa-accordion-button')).forEach(
    element => {
      const hasAriasExpandedAttr =
        element.getAttribute('aria-expanded') === 'true';
      if (!hasAriasExpandedAttr) {
        element.setAttribute('aria-expanded', false);
      }
    },
  );
};

const addAriaHiddenAttr = () => {
  Array.from(document.querySelectorAll('.usa-accordion-content')).forEach(
    el => {
      const buttonElement = document.querySelector(
        `[aria-controls="${el.id}"]`,
      );

      if (buttonElement) {
        const hiddenValue = !toBoolean(
          buttonElement.getAttribute('aria-expanded'),
        );

        el.setAttribute('aria-hidden', hiddenValue);
      }
    },
  );
};

const getAccordionParents = elem => {
  // Setup parents array
  const parents = [];

  // Get matching parent elements
  // eslint-disable-next-line unicorn/no-abusive-eslint-disable, no-param-reassign
  for (let i = 0; elem && elem !== document; elem = elem.parentNode) {
    // Add matching parents to array
    // eslint-disable-next-line sonarjs/no-collapsible-if
    if (i !== 0) {
      if (elem.classList.contains('usa-accordion')) {
        parents.push(elem);
      }
    }
    // eslint-disable-next-line no-plusplus
    i++;
  }

  return parents;
};

const getOtherButtons = (element, target) =>
  Array.from(element.getElementsByClassName('usa-accordion-button')).filter(
    item => item !== target,
  );

const addAccordionClickHandler = () => {
  Array.from(
    document.querySelectorAll('.usa-accordion, .usa-accordion-bordered'),
  ).forEach(element => {
    const parents = getAccordionParents(element);

    if (parents.length === 0) {
      element.addEventListener('click', e => {
        const accordionButton = e.target.closest('.usa-accordion-button');

        // Checks whether the button has a click event already assigned to it.
        // and if it is a .usa-accordion-button.
        // Specifically React Components.
        if (accordionButton && !accordionButton.onclick) {
          const multiSelectable =
            toBoolean(element.getAttribute('aria-multiselectable')) ||
            toBoolean(element.getAttribute('data-multiselectable'));

          const hasAriaControlsAttr = accordionButton.getAttribute(
            'aria-controls',
          );

          if (hasAriaControlsAttr && !multiSelectable) {
            getOtherButtons(element, accordionButton).forEach(el => {
              const contentEl = el.getAttribute('aria-controls');
              el.setAttribute('aria-expanded', 'false');

              document
                .getElementById(contentEl)
                .setAttribute('aria-hidden', 'true');
            });
          }

          if (hasAriaControlsAttr) {
            const dropDownElement = document.getElementById(
              accordionButton.getAttribute('aria-controls'),
            );
            const accordionButtonExpandedAttr = toBoolean(
              accordionButton.getAttribute('aria-expanded'),
            );

            dropDownElement.setAttribute(
              'aria-hidden',
              accordionButtonExpandedAttr,
            );

            accordionButton.setAttribute(
              'aria-expanded',
              !accordionButtonExpandedAttr,
            );

            if (!isElementInViewport(accordionButton)) {
              element.scrollIntoView();
            }

            // Fire event for subscription by any consuming apps that need to
            // handle click further (e.g., for analytics).
            // Cannot use new customEvent() method due to IE11 support.
            const accordionClickEvent = document.createEvent('Event');
            accordionClickEvent.initEvent(
              'accordion/button-clicked',
              true,
              true,
            );
            accordionClickEvent.detail = {
              toggle:
                accordionButton.getAttribute('aria-expanded') === 'true'
                  ? 'expand'
                  : 'collapse',
            };
            accordionButton.dispatchEvent(accordionClickEvent);
          }
        }
      });
    }
  });

  // Don't use aria-multiselectable, it's not a valid use of that attribute
  if (
    document.querySelectorAll(
      '.usa-accordion[aria-multiselectable], .usa-accordion-bordered[aria-multiselectable]',
    ).length
  ) {
    // eslint-disable-next-line no-console
    console.warn(
      'Accordion elements are not a valid context for aria-multiselectable, use data-multiselectable instead',
    );
  }
};

// only keep alpha-numeric characters from header, hash and id
const normalizeRegexp = /[^\w]/g;
const normalizeText = id => id.replace(normalizeRegexp, '').toLowerCase();

function autoExpandAccordionPanelByUrlHash() {
  const { hash } = document.location;

  if (!hash) {
    return;
  }

  // legacy accordion - target entity ID (id + partial text)
  const anchorId = hash.slice(1);
  const accordionButtonSelector = `.usa-accordion li[id="${anchorId}"] .usa-accordion-button`;
  const accordionButton = document.querySelector(accordionButtonSelector);

  if (accordionButton) {
    accordionButton.click();
  }

  // <va-accordion-item> web component - match either
  // 1) partial text of header, e.g. "#contact-us"
  // 2) the entity ID, e.g. "#1234"
  const anchorText = normalizeText(anchorId);
  const accordionItemSelector = 'va-accordion-item';
  const accordionItems = document.querySelectorAll(accordionItemSelector);

  if (accordionItems) {
    [...accordionItems].some(accordion => {
      const idInSlot = accordion?.querySelector('[id]')?.id || null;
      const headerText = normalizeText(accordion.getAttribute('header') || '');
      if (headerText.includes(anchorText) || idInSlot === anchorText) {
        accordion.setAttribute('open', true);
        // eslint-disable-next-line no-unused-expressions
        accordion?.shadowRoot?.querySelector('button')?.focus();
        window.scrollTo(0, accordion.offsetTop);
        return true;
      }
      return false;
    });
  }
}

const loadAccordionHandler = () => {
  addAriasExpandedAttr();
  addAriaHiddenAttr();
  addAccordionClickHandler();
  autoExpandAccordionPanelByUrlHash();
};

export default loadAccordionHandler;
