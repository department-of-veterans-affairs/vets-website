window.addEventListener('DOMContentLoaded', () => {
  const content = document.getElementById('content');
  const feedbackButtonContainer = document.getElementById('kampyleButtonContainer');
  const feedbackButtonDiv = document.getElementById('nebula_div_btn');
  const feedbackButton = document.getElementById('nebula_div_btn'); // this gets removed
  let formLightboxContainer = null;

  function removeFeedbackButton() {
    feedbackButtonContainer.remove();
  }

  function appendFeedbackButton() {
    content.append(feedbackButtonContainer);
  }

  function updateFeedbackButtonInlineCss() {
    feedbackButtonDiv.style.zIndex = null;
    feedbackButtonDiv.style.position = null;
  }

  removeFeedbackButton();
  appendFeedbackButton();
  updateFeedbackButtonInlineCss();

  // Options for the observer (which mutations to observe)
  const config = { attributes: true, childList: true }; // attributes prolly can be false

  // Callback function to execute the feedback button is removed for the first time
  const detectLightboxDisplayNone = function(mutationsList) {
    // listen to changes in the button container
    // when change happens look attribute change on button


    
    for(let mutation of mutationsList) {
      // detect lightbox display change to none
      console.log('In detectLightboxDisplayNone');
      console.log('Change detected!');
      console.log('Mutation: ', mutation);

      // remove form
      // insert button
      // update css

      // if (mutation.removedNodes.length > 0) {
      //   mutation.removedNodes.forEach(node => {
      //     if (node.id === 'nebula_div_btn') {
      //       moveFeedbackButton();
      //     }
      //   });
      // }
    }
  };

  // Callback function to execute the feedback button is removed for the first time
  const detectButtonRemovedFirstTime = function(mutationsList) {
    if (!formLightboxContainer) {
      for(let mutation of mutationsList) {
        console.log('Change detected!');
        console.log('Mutation: ', mutation);
  
        if (mutation.removedNodes.length > 0) {
          mutation.removedNodes.forEach(node => {
            if (node.id === 'nebula_div_btn') {
              console.log('YESS!!!')
              formLightboxContainer = document.getElementById('formLightboxContainer');

              // Create an observer instance linked to the callback function
              const observer2 = new MutationObserver(detectLightboxDisplayNone);
              // Start observing the target node for configured mutations
              observer2.observe(formLightboxContainer, config);
            }
          });
        }
      }
    }
  };

  // Create an observer instance linked to the callback function
  const observer1 = new MutationObserver(detectButtonRemovedFirstTime);
  // Start observing the target node for configured mutations
  observer1.observe(feedbackButtonContainer, config);
});

// closed form
// display: none
// <div id="kampyleFormContainer" style="top: 0px !important; left: 0px !important; width: 100% !important; height: 100% !important; position: fixed !important; visibility: hidden !important; display: none !important; background-color: rgba(102, 102, 102, 0.4) !important; z-index: 99999999 !important;"> <div id="innerContainer" style="overflow-y: auto; height: 100%;">   <img class="neb-loading-spinner" alt="Loading" style="position: absolute !important; top: 50% !important; left: 50% !important; margin-top: -30px !important; margin-left: -30px !important; max-width: 60px !important; display: none;" src="https://resource.digital.voice.va.gov/resources/onsite/images/kloader.gif">   <div id="kampyleFormModal" style="position: fixed !important; height: 100% !important; width: 100% !important;"><iframe id="kampyleForm11" src="https://resource.digital.voice.va.gov/wdcvoice/5/forms/11/form1626198517354.html?formId=11&amp;type=live&amp;isMobile=false&amp;referrer=https%3A%2F%2Fstaging.va.gov%2Fchange-address%2F&amp;region=digital-cloud-voice&amp;isWCAG=true&amp;displayType=lightbox&amp;isSeparateFormTemplateFromData=true" tabindex="-1" title="Feedback Survey" style="border: 0px !important; height: 100% !important; max-height: 100% !important; min-height: 100% !important; width: 100% !important; max-width: 100% !important; min-width: 100% !important; display: none !important; position: fixed !important;" origin="https://resource.digital.voice.va.gov"></iframe></div> </div></div>

// open form
// display: block
// <div id="kampyleFormContainer" style="top: 0px !important; left: 0px !important; width: 100% !important; height: 100% !important; position: fixed !important; visibility: visible !important; display: block !important; background-color: rgba(102, 102, 102, 0.4) !important; z-index: 99999999 !important;"> <div id="innerContainer" style="overflow-y: auto; height: 100%;">   <img class="neb-loading-spinner" alt="Loading" style="position: absolute !important; top: 50% !important; left: 50% !important; margin-top: -30px !important; margin-left: -30px !important; max-width: 60px !important; display: none;" src="https://resource.digital.voice.va.gov/resources/onsite/images/kloader.gif">   <div id="kampyleFormModal" style="position: fixed !important; height: 100% !important; width: 100% !important;"><iframe id="kampyleForm11" src="https://resource.digital.voice.va.gov/wdcvoice/5/forms/11/form1626198517354.html?formId=11&amp;type=live&amp;isMobile=false&amp;referrer=https%3A%2F%2Fstaging.va.gov%2Fchange-address%2F&amp;region=digital-cloud-voice&amp;isWCAG=true&amp;displayType=lightbox&amp;isSeparateFormTemplateFromData=true" tabindex="-1" title="Feedback Survey" style="border: 0px !important; height: 100% !important; max-height: 100% !important; min-height: 100% !important; width: 100% !important; max-width: 100% !important; min-width: 100% !important; display: block !important; position: fixed !important;" origin="https://resource.digital.voice.va.gov"></iframe></div> </div></div>
