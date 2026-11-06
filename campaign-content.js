/* Bind the approved campaign configuration to existing placements. No popup engine here. */
(function () {
  'use strict';
  var campaign = window.BGSiteConfig && window.BGSiteConfig.campaign;
  if (!campaign) return;
  var english = !!(window.BGPageLocale && window.BGPageLocale.english);
  var content = english ? campaign.en : campaign.pt;
  function apply(root) {
    if (!root || !root.querySelectorAll) return;
    root.querySelectorAll('[data-campaign-field]').forEach(function (el) {
      var value = content[el.getAttribute('data-campaign-field')];
      if (typeof value === 'string' && el.textContent !== value) el.textContent = value;
    });
    root.querySelectorAll('[data-campaign-artwork]').forEach(function (el) {
      if (campaign.artwork && el.getAttribute('src') !== campaign.artwork) el.setAttribute('src', campaign.artwork);
      var alt = (english ? 'BEST GYM campaign — ' : 'Campanha BEST GYM — ') + content.headline;
      if (el.getAttribute('alt') !== alt) el.setAttribute('alt', alt);
    });
    root.querySelectorAll('[data-campaign-mobile-artwork]').forEach(function (el) {
      if (campaign.mobileArtwork && el.getAttribute('srcset') !== campaign.mobileArtwork) el.setAttribute('srcset', campaign.mobileArtwork);
    });
    root.querySelectorAll('[data-campaign-media]').forEach(function (el) {
      if (el.hidden !== !campaign.artwork) el.hidden = !campaign.artwork;
    });
    root.querySelectorAll('[data-campaign-cta]').forEach(function (el) {
      var kind = el.getAttribute('data-campaign-cta');
      if (el.getAttribute('href') !== content[kind + 'Href']) el.setAttribute('href', content[kind + 'Href']);
    });
  }
  window.BGCampaign = Object.freeze({ apply: apply });
  function ready() {
    apply(document);
    var pending = false;
    new MutationObserver(function () {
      if (pending) return;
      pending = true;
      requestAnimationFrame(function () { pending = false; apply(document); });
    }).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready, { once: true });
  else ready();
})();
