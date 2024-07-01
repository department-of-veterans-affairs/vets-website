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

// Adds event listeners for most of the interaction for the header (4 sections of click handlers within this function)
export const addHeaderEventListeners = () => {
  // [DESKTOP] Govt banner icon ---------------------------------------------
  const govtBannerButton = document.getElementById('govt-banner-button');
  const govtBannerIcon = document.getElementById('govt-banner-icon');

  if (govtBannerButton && govtBannerIcon) {
    govtBannerButton.addEventListener('click', () => {
      govtBannerIcon.classList.toggle('expanded');
    });
  }

  // [DESKTOP] VA Benefits & Health Care, About VA ----------------------
  const searchButton = document.getElementById('search-dropdown-button');
  console.log('searchButton: ', searchButton);
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

    searchButton.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        closeNotActiveMenu([...megaMenuL1Buttons]);
      }
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

    const buttonIcons = btn.querySelectorAll('.mobile-benhub');

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
    const searchBar = document.getElementById('mobile-search-container');
    const id = menuBtn.getAttribute('data-menu');
    const menu = document.getElementById(id);
    const backButtons = document.querySelectorAll('button#header-back-to-menu');

    menuBtn.addEventListener('click', () => {
      menu.removeAttribute('hidden');
      mainNav.setAttribute('hidden', true);
      searchBar.setAttribute('hidden', true);

      backButtons.forEach(backBtn => {
        backBtn.focus();

        backBtn.addEventListener('click', () => {
          mainNav.removeAttribute('hidden');
          searchBar.removeAttribute('hidden');
          menu.setAttribute('hidden', true);
          menuBtn.focus();
        });
      });
    });
  });

  // [MOBILE] Menu button ----------------------------------------------
  const mobileMenuButton = document.getElementById('header-menu-button');
  const mobileMenuText = document.querySelector('#header-menu-button > span');
  const mobileMegaMenu = document.getElementById('mobile-mega-menu');
  const menuIcon = document.querySelector('#mobile-header-menu-icon');
  const closeIcon = document.querySelector('#mobile-header-close-icon');
  const overlay = document.querySelector('.header-menu-button-overlay');

  if (mobileMenuButton && mobileMegaMenu) {
    const openCloseMenu = () => {
      const menuExpanded = mobileMenuButton.getAttribute('aria-expanded');

      mobileMegaMenu.toggleAttribute('hidden');
      mobileMenuButton.setAttribute(
        'aria-expanded',
        menuExpanded === 'true' ? 'false' : 'true',
      );

      menuIcon.toggleAttribute('hidden');
      closeIcon.toggleAttribute('hidden');

      if (menuExpanded === 'false') {
        mobileMenuText.innerHTML = 'Close';
      } else {
        mobileMenuText.innerHTML = 'Menu';
      }
      overlay.toggleAttribute('hidden');
    };

    mobileMenuButton.addEventListener('click', openCloseMenu);
    mobileMenuButton.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        openCloseMenu();
      }
    });
  }
};
