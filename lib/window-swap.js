const { Client, DefaultMediaReceiver } = require("castv2-client");
const mdns = require("mdns");

const { getRandomVideoInfos } = require("./vimeo");

const browser = mdns.createBrowser(mdns.tcp("googlecast"));

browser.on("serviceUp", function (service) {
  const isChromecast = (service) => service.name.indexOf("Chromecast") > -1;

  console.log(
    'found device "%s" at %s:%d',
    service.name,
    service.addresses[0],
    service.port
  );
  if (isChromecast(service)) {
    onDeviceFound(service.addresses[0]);
    browser.stop();
  }
});

const onDeviceFound = (host) => {
  var client = new Client();

  client.connect(host, async function () {
    console.log("connected, launching app ...");

    const randomVideo = await getRandomVideoInfos();

    client.launch(DefaultMediaReceiver, function (err, player) {
      const media = {
        contentId: randomVideo.url,
        contentType: "video/mp4",
        streamType: "BUFFERED", // or LIVE
        metadata: {
          type: 0,
          metadataType: 0,
          title: randomVideo.title,
          images: [
            {
              url: randomVideo.thumbnail,
            },
          ],
        },
      };

      player.load(media, { autoplay: true, loop: true }, function (
        err,
        status
      ) {
        console.log("media loaded playerState=%s", status.playerState);
      });
    });
  });

  client.on("error", function (err) {
    console.log("Error: %s", err.message);
    client.close();
  });
};

class AssistantWindowSwap {
  init() {
    return Promise.resolve(this);
  }
  async action(commande) {
    console.log("commande", commande);
    switch (commande) {
      case "go":
        return browser.start();
      default:
        return browser.start();
    }
  }
}

exports.init = (configuration, plugins) => {
  return new AssistantWindowSwap().init(plugins).then((resource) => {
    console.log("[assistant-windowswap] Plugin chargé et prêt.");
    return resource;
  });
};
