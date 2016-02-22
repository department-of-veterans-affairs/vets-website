// Show a different section from what is currently visible
function showSection(newPanel, newSection) {
  var $currentSection = $('.form-section:visible');
  var $currentPanel = $currentSection.parents('.content');

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

// Show that the tab of the current set of questions is selected
function selectTabOfActiveSection(newPanel) {
  var $currentTab = $('.tab-title.active');
  var allTabs = $('.tab-title');
  var newTab = '';

  for (var i = 0; i < allTabs.length; i++) {
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

// When a particular tab is selected, show the first set of questions in that topic
function showSectionOfSelectedTab(activeTab) {
  var newPanel = $('#' + $(activeTab).attr('aria-controls'));
  var $newSection = $(newPanel).find('.form-section').first();

  showSection(newPanel, $newSection);
}

// Show the next consecutive set of questions
function showNextSection()  {
  let $allFormSections = $('.form-section');
  var $currentSection = $('.form-section:visible');
  var indexOfCurrentSection = $allFormSections.index($currentSection);
  var nextSection = $allFormSections[indexOfCurrentSection + 1];
  var $nextPanel = $(nextSection).parents('.content');

  showSection($nextPanel, nextSection);
}

export function init() {
  $('.content.active').find('.form-section').first().show();

  $('#continueButton, #skipButton').on('click', function() {
    showNextSection();
  });

  $('.tab-title a').on('click', function() {
    showSectionOfSelectedTab(this);
  });
}
