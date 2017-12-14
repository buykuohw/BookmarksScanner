chrome.browserAction.onClicked.addListener(function () {
    console.log("open bookmarks manager"),
        chrome.tabs.create({
            'url': 'chrome://bookmarks/'
        })
})