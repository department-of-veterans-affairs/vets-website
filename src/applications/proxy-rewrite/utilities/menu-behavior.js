const toggleMenu = (nextSibling, btn, buttonIcons) => {
  nextSibling.toggleAttribute('hidden');

  btn.setAttribute(
    'aria-expanded',
    `${btn.getAttribute('aria-expanded') !== 'true'}`,
  );

  buttonIcons.forEach(icon => {
    icon.toggleAttribute('hidden');
  });
};

const closeNotActiveMenu = (buttons, thisButtonText) => {
  buttons.forEach(button => {
    if (button.outerText !== thisButtonText) {
      button.nextElementSibling.setAttribute('hidden', true);
      button.setAttribute('aria-expanded', false);

      const buttonIcons = button.querySelectorAll(':scope > i');

      buttonIcons.forEach(icon => {
        icon.setAttribute('hidden', true);
      });
    }
  });
};

// Used to add overlay behavior to modals (such as the Veterans Crisis Line modal)
export function addOverlayTriggers() {
  const overlays = document.querySelectorAll(
    '.va-overlay-trigger, .va-overlay',
  );

  const toggleOverlay = domEvent => {
    const overlayTarget = domEvent.currentTarget; // The overlay to open or close
    const clickTarget = domEvent.target; // The element clicked

    /*
    overlayId will be _either_
    - The value of element.getAttribute('href')
    - The value of element.dataset.show

    A .va-overlay-trigger element should have either a data-show attribute
    (preferred) or an href attribute.
    */
    const overlayId =
      overlayTarget.getAttribute('href') || overlayTarget.dataset.show;

    const shouldCloseOverlay =
      overlayTarget.classList.contains('va-overlay') &&
      clickTarget.classList.contains('va-overlay-close');

    if (shouldCloseOverlay) {
      overlayTarget.classList.remove('va-overlay--open');
      document.body.classList.remove('va-pos-fixed');
    } else if (overlayId) {
      const overlay = document.querySelector(overlayId);
      overlay.classList.add('va-overlay--open');
      overlay.querySelector('a').focus();
      document.body.classList.add('va-pos-fixed');
    }
  };
  Array.from(overlays).forEach(ol => {
    ol.addEventListener('click', toggleOverlay);
  });
}

// Adds event listeners for most of the interaction for the header (4 sections of click handlers within this function)
export const addHeaderEventListeners = () => {
  // [DESKTOP] VA Benefits & Health Care, About VA ---------------------
  const searchButton = document.getElementById('search-dropdown-button');
  const megaMenuL1Buttons = [
    ...document.querySelectorAll('button.vetnav-level1'),
  ];

  megaMenuL1Buttons.forEach(btn => {
    const nextSibling = btn.nextElementSibling;
    const buttonIcons = btn.querySelectorAll(':scope > i');

    btn.addEventListener('click', function() {
      const thisButtonText = this.outerText;

      closeNotActiveMenu([...megaMenuL1Buttons, searchButton], thisButtonText);
      toggleMenu(nextSibling, btn, buttonIcons);
    });
  });

  if (searchButton) {
    searchButton.addEventListener('click', function() {
      closeNotActiveMenu([...megaMenuL1Buttons]);
    });
  }

  // [DESKTOP] Benefit Hubs -------------------------------------------
  const benefitHubButtons = [
    ...document.querySelectorAll('button.vetnav-level2'),
  ];

  benefitHubButtons.forEach(btn => {
    const nextSibling = btn.nextElementSibling;
    const buttonIcons = btn.querySelectorAll(':scope > i');
    const expandedClass = 'vetnav-submenu--expanded';

    btn.addEventListener('click', function() {
      const currentActiveHubLink = document.querySelectorAll(
        '.vetnav-level2[aria-expanded="true"]',
      );
      let currentHubText = '';
      const thisButtonText = this.outerText;

      if (
        currentActiveHubLink &&
        currentActiveHubLink[0] &&
        currentActiveHubLink[0].outerText
      ) {
        currentHubText = currentActiveHubLink[0].outerText;
      }

      if (!currentHubText || currentHubText !== thisButtonText) {
        const container = document.getElementById(
          'vetnav-va-benefits-and-health-care',
        );
        container.classList.add(expandedClass);
        closeNotActiveMenu(benefitHubButtons, thisButtonText);
        toggleMenu(nextSibling, btn, buttonIcons);
      }
    });
  });

  // [DESKTOP, MOBILE] Mega menu buttons ------------------------------
  const buttons = document.querySelectorAll(
    'button.header-menu-item-button.level1',
  );

  buttons.forEach((btn, index) => {
    const correspondingUl = document.querySelectorAll('#header-nav-items ul')[
      index
    ];
    const buttonIcons = btn.querySelectorAll(':scope > i');

    btn.addEventListener('click', () =>
      toggleMenu(correspondingUl, btn, buttonIcons),
    );
  });

  // Toggle second level of mobile menu items
  const levelTwoButtons = document.querySelectorAll(
    'button.header-menu-item-button.level2',
  );

  levelTwoButtons.forEach(menuBtn => {
    const mainNav = document.getElementById('header-nav-items');
    const id = menuBtn.getAttribute('aria-controls');
    const menu = document.getElementById(id);
    const backButtons = document.querySelectorAll('button#header-back-to-menu');

    menuBtn.addEventListener('click', () => {
      menu.removeAttribute('hidden');
      mainNav.setAttribute('hidden', true);
      menuBtn.setAttribute('aria-expanded', 'true');

      backButtons.forEach(backBtn => {
        backBtn.focus();

        backBtn.addEventListener('click', () => {
          mainNav.removeAttribute('hidden');
          menu.setAttribute('hidden', true);
          menuBtn.setAttribute('aria-expanded', 'false');
          menuBtn.focus();
        });
      });
    });
  });

  // [MOBILE] Menu button ----------------------------------------------
  const mobileMenuButtons = [
    document.getElementById('mobile-menu-button'),
    document.getElementById('mobile-close-button'),
  ];
  const parent = document.getElementById('header-menu-button');

  if (mobileMenuButtons && parent) {
    mobileMenuButtons.forEach(button =>
      button.addEventListener('click', () => {
        const menuExpanded = parent.getAttribute('aria-expanded');
        const mobileMegaMenu = document.getElementById('mobile-mega-menu');
        const menuText = document.getElementById('mobile-menu-button');
        const closeText = document.getElementById('mobile-close-button');
        const overlay = document.querySelector('.header-menu-button-overlay');

        if (mobileMegaMenu) {
          mobileMegaMenu.toggleAttribute('hidden');
          parent.setAttribute(
            'aria-expanded',
            menuExpanded === 'true' ? 'false' : 'true',
          );

          menuText.toggleAttribute('hidden');
          closeText.toggleAttribute('hidden');
          overlay.toggleAttribute('hidden');
        }
      }),
    );
  }
};
