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

  let isQueryUrl = (url) => {
    return url.indexOf('?') > -1;
  };

  let hasMultipleQueries = (url) => {
    return url.indexOf('&') > -1;
  };

  let hasOtherQueries = (url) => {
    return url.indexOf('=') > -1;
  };

  let styleButton = (state) => {
    state ? actionButton.classList.add('active') : actionButton.classList.remove('active');
  };

  let isExperimentalUrl = (url) => {
    return !!(url && url.match(experimental_regex));
  };

  let removeExp = (tab) => {
    chrome.tabs.update(tab.id, { url: removeExperimentalFromUrl(tab.url) }, (updatedTab) => {
      styleButton(isExperimental(updatedTab.url));
    });

  };
  let activateExperimental = (tab) => {
    chrome.tabs.update(tab.id, { url: createExperimentalUrl(tab.url) }, (updatedTab) => {
      styleButton(isExperimental(updatedTab.url));
    });
  };

  let createExperimentalUrl = (url) => {
    let newUrl;
    if (isQueryUrl(url)) {
      newUrl = url.replace('?', '?experimental=true&')
    } else {
      newUrl = `${url}?experimental=true`
    }

    return newUrl;
  };

  let removeExperimentalFromUrl = (url) => {
    let newUrl;
    if (hasMultipleQueries(url)) {
      newUrl = url.replace(/(experimental=true&)/gi, '');
    } else {
      newUrl = url.replace(/(\?experimental=true)/gi, '');
    }

    return newUrl;
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