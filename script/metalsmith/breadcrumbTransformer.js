// const jsdom = require('jsdom');
const cheerio = require('cheerio');
const path = require('path');

module.exports = (files, metalsmith, done) => {
  Object.keys(files).forEach(file => {
    if (path.extname(file) !== '.html') return;

    const data = files[file];
    const $ = cheerio.load(data.contents.toString());

    $('#va-breadcrumbs').each(() => {
      $.root().append(
        '<script type="text/javascript">var config={containerString:"va-breadcrumbs",listString:"va-breadcrumbs-list",jsHiddenClass:"js-hide",jsVisualClass:"js-visual",mobileClass:"va-nav-breadcrumbs-list__mobile-link",triggerDelay:500,triggerWidth:425};function _debounce(func,wait,immediate){var timeout;return function(){var self=this;var args=arguments;var later=function(){timeout=null;if(!immediate)func.apply(self,args)};var callNow=immediate&&!timeout;clearTimeout(timeout);timeout=setTimeout(later,wait);if(callNow){func.apply(self,args)}}}function cloneList(target,targetId){var clone=target.cloneNode();clone.setAttribute("id",targetId+"-clone");clone.classList.add(config.jsHiddenClass);return clone}function sliceMobileLink(targetId){var target=document.getElementById(targetId);var clonedTarget=target.cloneNode(true);var targetList=clonedTarget.children;var listArr=Array.prototype.slice.call(targetList);var breadcrumbList=listArr.slice(-2,-1);var breadcrumbLink=breadcrumbList[0].children[0];breadcrumbList[0].classList.add(config.mobileClass);breadcrumbLink.innerText=breadcrumbLink.innerText.trim();breadcrumbLink.removeAttribute("aria-current");breadcrumbLink.setAttribute("aria-label","Previous step: "+breadcrumbLink.innerText);return breadcrumbList}function toggleLinks(targetId){var breadcrumb=document.getElementById(targetId);var clone=document.getElementById(targetId+"-clone");if(window.innerWidth<=config.triggerWidth){breadcrumb.classList.add(config.jsHiddenClass);clone.classList.remove(config.jsHiddenClass)}else{clone.classList.add(config.jsHiddenClass);breadcrumb.classList.remove(config.jsHiddenClass)}}function buildMobileBreadcrumb(parentId,targetId){var container=document.getElementById(parentId);var target=document.getElementById(targetId);var clonedList=cloneList(target,targetId);var mobileLink=sliceMobileLink(targetId);target.classList.add(config.jsHiddenClass);clonedList.appendChild(mobileLink[0]);container.appendChild(clonedList);if(window.innerWidth<=config.triggerWidth){clonedList.classList.remove(config.jsHiddenClass)}else{target.classList.remove(config.jsHiddenClass)}container.classList.remove(config.jsVisualClass)}var debouncedToggleLinks=_debounce(function(targetId){toggleLinks(targetId)},config.triggerDelay);window.addEventListener("DOMContentLoaded",function(){buildMobileBreadcrumb(config.containerString,config.listString)});window.addEventListener("resize",function(){debouncedToggleLinks(config.listString)});</script>'
      );
    });

    data.contents = new Buffer($.html());
    files[file] = data; // eslint-disable-line no-param-reassign
  });
  done();
};
