(() => {
  'use strict';
  const campaignNames = new Set(['what_next', 'feeding_notes', 'first_foods', 'reactions', 'milk_and_solids', 'launch_2026']);
  const allowedSources = new Set(['instagram', 'tiktok', 'youtube', 'facebook', 'newsletter', 'partner', 'organic']);
  const params = new URLSearchParams(location.search);
  // Campaign codes only. Never send free text, baby details or the full referrer.
  const source = allowedSources.has(params.get('utm_source')) ? params.get('utm_source') : 'organic';
  const campaign = campaignNames.has(params.get('utm_campaign')) ? params.get('utm_campaign') : 'what_next';
  const content = /^[a-z0-9_]{1,48}$/.test(params.get('utm_content') || '') ? params.get('utm_content') : 'website';
  const providerToken = window.TINYTASTE_MARKETING?.appleProviderToken || '';
  const sourceCodes = {instagram:'ig',tiktok:'tt',youtube:'yt',facebook:'fb',newsletter:'nl',partner:'partner',organic:'web'};
  const campaignCodes = {what_next:'next',feeding_notes:'notes',first_foods:'foods',reactions:'reactions',milk_and_solids:'milk',launch_2026:'launch'};
  const campaignToken = `tt_${sourceCodes[source]}_${campaignCodes[campaign]}_${content.slice(-10)}`.slice(0,30);
  document.querySelectorAll('.store-link').forEach(link => {
    const url = new URL('https://apps.apple.com/app/id6760778450');
    // Apple's generated provider token is required. Do not imply attribution without it.
    if (/^\d+$/.test(providerToken)) {
      url.searchParams.set('pt', providerToken);
      url.searchParams.set('ct', campaignToken);
      url.searchParams.set('mt', '8');
    }
    link.href = url.toString();
    link.addEventListener('click', () => {
      // Integrates with an existing analytics listener if one is configured by the owner.
      // This website does not pretend that an unconfigured listener is collecting data.
      window.dispatchEvent(new CustomEvent('tinytaste:store_click', {
        detail: {source, campaign, content, placement: link.dataset.placement || 'unknown'}
      }));
    });
  });
  if (source !== 'organic') {
    document.querySelectorAll('a[href]').forEach(link => {
      const url = new URL(link.href);
      if (url.origin === location.origin && (url.pathname.includes('/tinytaste/resources/') || url.pathname === '/tinytaste/')) {
        url.searchParams.set('utm_source', source);
        url.searchParams.set('utm_campaign', campaign);
        url.searchParams.set('utm_content', content);
        link.href = url.toString();
      }
    });
  }
  const tabs = [...document.querySelectorAll('[data-tour]')];
  function activate(tab, focus = false) {
    tabs.forEach(item => {
      const selected = item === tab;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
      document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
    });
    if (focus) tab.focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); activate(tabs[next], true); }
    });
  });
})();
