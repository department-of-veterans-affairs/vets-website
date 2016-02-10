var formProgress = (function() {
  var continueButton = $('#continueButton');
  var skipButton = $('#skipButton');

  var $allFormSections = $('.form-section');

  var showSectionOfSelectedTab = function(activeTab) {
    var activePanel = $('#' + $(activeTab).attr('aria-controls'));
    var $activeSection = $(activePanel).find('.form-section').first();

    $activeSection.show();
  };

  var showNextSection = function() {
    var $currentSection = $('.form-section:visible');
    var indexOfCurrentSection = $allFormSections.index($currentSection);
    var $currentPanel = $currentSection.parents('.content');
    var nextSection = $allFormSections[indexOfCurrentSection + 1];
    var $nextPanel = $(nextSection).parents('.content');

    $currentSection.hide();

    if ($nextPanel !== $currentPanel) {
      $currentPanel.removeClass('active');
      $currentPanel.attr('aria-hidden', 'true');

      $nextPanel.addClass('active');
      $nextPanel.attr('aria-hidden', 'fasle');
    }

    $(nextSection).show();
  };

  var initForm = function() {
    $('.content.active').find('.form-section').first().show();

    $('#continueButton, #skipButton').on('click', function() {
      showNextSection();
    });

    $('.tab-title a').on('click', function() {
      showSectionOfSelectedTab(this);
    });
  };

  return {
    initForm: initForm
  };
}());
$(document).ready(formProgress.initForm);
