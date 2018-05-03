(() => {
  const experimental_regex = /(experimental=true)/gi,
    actionButton = document.querySelector('button');

  let getActiveTab = () => {
    return new Promise((res) => {
      chrome.tabs.getSelected((tab) => {

        res(tab);
      });
    })
  };

  let isExperimental = (url) => {
    return url && isExperimentalUrl(url);
  };

  let styleButton = (state) => {
    state ? actionButton.classList.add('active') : actionButton.classList.remove('active');
  };

  let isExperimentalUrl = (url) => {
    return !!(url && url.match(experimental_regex));
  };

  let removeExp = (tab) => {
    chrome.tabs.update(tab.id, { url: `${tab.url.replace(experimental_regex, '')}` }, (updatedTab) => {
      styleButton(isExperimental(updatedTab.url));
    });

  };
  let activateExperimental = (tab) => {
    chrome.tabs.update(tab.id, { url: `${tab.url}?experimental=true` }, (updatedTab) => {
      styleButton(isExperimental(updatedTab.url));
    });
  };

  actionButton.addEventListener('click', () => {
    getActiveTab().then((tab) => {
      const url = tab.url;
      let expActive = isExperimental(url);

      styleButton(expActive);

      if (expActive) {
        removeExp(tab);
      } else {
        activateExperimental(tab)
      }
    });
  });

  getActiveTab().then((tab) => {
    const url = tab.url;

    styleButton(url && isExperimentalUrl(url));
  })
})();