chrome.runtime.onInstalled.addListener(() => {
	chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
		chrome.declarativeContent.onPageChanged.addRules([
		{
			conditions: [
				new chrome.declarativeContent.PageStateMatcher({
					pageUrl: {
						urlContains: '/issues',
					},
				})
			],
			actions: [new chrome.declarativeContent.ShowPageAction()]
		}
		]);
	});
});


chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (
		changeInfo.status === 'complete' &&
		tab.url.indexOf('/issues/') !== -1
	) {
		chrome.tabs.executeScript(tabId, { file: 'main.js' });
	}
});

chrome.pageAction.onClicked.addListener(tab => {
	chrome.tabs.executeScript(tab.id, { file: 'main.js' });
});