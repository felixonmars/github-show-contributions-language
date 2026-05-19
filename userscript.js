// ==UserScript==
// @name                GitHub Show Contribution Languages
// @namespace           https://github.com/felixonmars/userscripts
// @version             0.2
// @author              felixonmars
// @match               https://github.com/*
// @homepageURL         https://github.com/felixonmars/userscripts
// @supportURL          https://github.com/felixonmars/userscripts/issues
// @updateURL           https://raw.githubusercontent.com/felixonmars/userscripts/main/github-show-contributions-language.user.js
// @downloadURL         https://raw.githubusercontent.com/felixonmars/userscripts/main/github-show-contributions-language.user.js
// @license             MIT
// @grant               none
// ==/UserScript==

(function () {
    function scan() {
        document.querySelectorAll('[data-hovercard-type=repository]:not([data-contribution-language])').forEach(function (item) {
            let url = item.getAttribute('data-hovercard-url');

            if (!url) {
                return;
            }

            url = new URL(url, location.origin).href;

            item.setAttribute('data-contribution-language', 'loading');

            let request = new XMLHttpRequest();
            request.open('GET', url);
            request.setRequestHeader('Accept', 'text/html');
            request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            request.onload = function () {
                if (request.status < 200 || request.status >= 300) {
                    item.setAttribute('data-contribution-language', 'failed');
                    return;
                }

                let data = request.responseText;
                let lang = data.match(/itemprop="programmingLanguage">(.+?)</);
                let color = data.match(/repo-language-color" style="background-color:\s*(#[0-9a-fA-F]+)"/);

                if (!lang || !color) {
                    item.setAttribute('data-contribution-language', 'missing');
                    return;
                }

                item.insertAdjacentHTML('afterend', ' <span class="github-contribution-language no-wrap"><svg style="color:' + color[1] + ';" aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-dot-fill ml-2"><path d="M8 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z"></path></svg><span class="color-fg-default text-bold f6">' + lang[1] + '</span></span>');
                item.setAttribute('data-contribution-language', 'done');
            };
            request.onerror = function () {
                item.setAttribute('data-contribution-language', 'failed');
            };
            request.send();
        });
    }

    scan();

    new MutationObserver(scan).observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();
