// ==UserScript==
// @name                GitHub Show Contribution Languages
// @namespace           https://github.com/felixonmars/github-show-contributions-language
// @version             0.1
// @author              felixonmars
// @require             https://cdn.jsdelivr.net/npm/jquery@3.6.0
// @match               https://github.com/*
// @license MIT
// ==/UserScript==

$(".TimelineItem details details span[data-hovercard-type=repository]").each(function(index){
    let item = this;
    let url = this.getAttribute('data-hovercard-url');
    $.get(url, function(data){
        let lang = data.match(/\"programmingLanguage\">(\w+)</)[1];
        let color = data.match(/background-color: (#\w+)\"/)[1];
        $(item).append('<svg style="color:' + color + ';" aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-dot-fill ml-2"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8z"></path></svg>');
        $(item).append('<span class="color-fg-default text-bold f6">' + lang + '</span> ');
    });
});
