(function(window) {
  function withFormContent(acc, data) {
    //console.log("acc.content data",data.Content);
    acc.content = data.Content;
  }

  function withFeedbackUUID(acc, data) {
    acc.feedbackUUID = data.Feedback_UUID;
  }

  function mEvent(name, action, opts) {
    opts = opts || {};
    var custom = opts.custom;
    var label = opts.label;

    function handle(event) {
      var start = +new Date();
      var cm = window.cm || function() {};
      var mData = event.detail;
      var eData = {
        category: 'Medallia',
        action: action,
        label: label || mData.Form_Type,
        value: mData.Form_ID,
        myParams: {},
      };
      if (custom) {
        for (var i = 0; i < custom.length; i++)
          custom[i](eData.myParams, mData);
      }
      var end = +new Date();
      console.log('send', 'event', eData, end - start);
      recordEvent({
        event: eData.action,
        'survey-tool': eData.category,
        'survey-form-id': eData.value,
        'survey-status': eData.label,
        'survey-details': eData.myParams,
      });
    }
    window.addEventListener('MDigital_' + name, handle);
  }
  mEvent('ShowForm_Called', 'survey-show-form-call');
  mEvent('Form_Displayed', 'survey-start-form');
  mEvent('Form_Next_Page', 'survey-next-click');
  mEvent('Form_Back_Page', 'survey-back-click');
  mEvent('Form_Close_Submitted', 'survey-submit-close');
  mEvent('Form_Close_No_Submit', 'survey-no-submit-close');
  mEvent('Feedback_Submit', 'survey-submit', {
    custom: [withFeedbackUUID, withFormContent],
  });
  mEvent('Submit_Feedback', 'survey--submission', {
    custom: [withFeedbackUUID, withFormContent],
  });
  mEvent('Feedback_Button_Clicked', 'survey-button-click', {
    custom: [withFeedbackUUID],
  });
  mEvent('ThankYou_Displayed', 'survey--submission-successful', {
    custom: [withFeedbackUUID, withFormContent],
  });
  mEvent('Invite_Displayed', 'survey-invitation-display', {
    label: 'Invite',
  });
  mEvent('Invite_Accepted', 'survey-invitation-accept', {
    label: 'Invite',
  });
  mEvent('Invite_Declined', 'survey-invitation-decline', {
    label: 'Invite',
  });
  mEvent('Invite_Skipped', 'survey-invitation-skip', {
    label: 'Invite',
  });
})(window);
