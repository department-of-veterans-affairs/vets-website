// Show that the tab of the current set of questions is selected
function selectTabOfActiveSection(newPanel) {
  const $currentTab = $('.tab-title.active');
  const allTabs = $('.tab-title');
  let newTab = '';

  for (let i = 0; i < allTabs.length; i++) {
    if ($(allTabs[i]).find('a').attr('aria-controls') === $(newPanel).attr('id')) {
      newTab = allTabs[i];
      break;
    }
  }

  $currentTab.removeClass('active');
  $currentTab.find('a').attr('aria-selected', 'false');

  $(newTab).addClass('active');
  $(newTab).find('a').attr('aria-selected', 'true');
}

// Show a different section from what is currently visible
function showSection(newPanel, newSection) {
  const $currentSection = $('.form-section:visible');
  const $currentPanel = $currentSection.parents('.content');

  $currentSection.hide();

  if ($(newPanel).attr('id') !== $currentPanel.attr('id')) {
    $currentPanel.removeClass('active');
    $currentPanel.attr('aria-hidden', 'true');

    $(newPanel).addClass('active');
    $(newPanel).attr('aria-hidden', 'fasle');

    selectTabOfActiveSection($(newPanel));
  }

  $(newSection).show();
}

// When a particular tab is selected, show the first set of questions in that topic
function showSectionOfSelectedTab(activeTab) {
  const newPanel = $(`#${$(activeTab).attr('aria-controls')}`);
  const $newSection = $(newPanel).find('.form-section').first();

  showSection(newPanel, $newSection);
}

// Show the next consecutive set of questions
function showNextSection() {
  const $allFormSections = $('.form-section');
  const $currentSection = $('.form-section:visible');
  const indexOfCurrentSection = $allFormSections.index($currentSection);
  const nextSection = $allFormSections[indexOfCurrentSection + 1];
  const $nextPanel = $(nextSection).parents('.content');

  showSection($nextPanel, nextSection);
}

export function init() {
  $('.content.active').find('.form-section').first().show();

  $('#continueButton, #skipButton').on('click', () => {
    showNextSection();
  });

  $('.tab-title a').on('click', function onTitleClick() {
    showSectionOfSelectedTab(this);
  });
}
