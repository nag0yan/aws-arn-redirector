chrome.omnibox.onInputEntered.addListener((text) => {
  chrome.storage.sync.get(['ssoUrl', 'defaultAccount'], (data) => {
    const url = generateConsoleUrl(text, data.ssoUrl, data.defaultAccount);

    if (url) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.update(tabs[0].id, { url: url });
      });
    } else {
      alert('Invalid ARN format or missing SSO settings.');
    }
  });
});

function generateConsoleUrl(arn, ssoUrl, defaultAccount) {
  const arnParts = arn.split(':');
  if (arnParts.length < 6) {
    return null;
  }

  const resourceType = arnParts[2];
  const resourceId = arnParts.slice(5).join(':');
  const defaultRegion = "ap-northeast-1"; // Use global services such as S3

  let consoleUrl = '';
  switch (resourceType) {
    case 's3':
      consoleUrl = `https://${defaultRegion}.console.aws.amazon.com/s3/buckets/${resourceId}`;
      break;
    case 'ec2':
      consoleUrl = `https://${arnParts[3]}.console.aws.amazon.com/ec2/v2/home?region=${arnParts[3]}#Instances:instanceId=${resourceId}`;
      break;
    // 他のリソースタイプに対するケースを追加
    default:
      consoleUrl = null;
  }

  if (ssoUrl && defaultAccount && consoleUrl) {
    consoleUrl = `${ssoUrl}/#/console?account_id=${defaultAccount}&destination=${encodeURIComponent(consoleUrl)}`;
  }

  return consoleUrl;
}
