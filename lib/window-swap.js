const { Client, DefaultMediaReceiver } = require("castv2-client");
const mdns = require("mdns");

const { getRandomVideoInfos } = require("./vimeo");

class AssistantWindowSwap {
  constructor() {
    this.browser = mdns.createBrowser(mdns.tcp("googlecast"));
  }

  init() {
    return Promise.resolve(this);
  }

  onDeviceFound(host) {
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
  }

  async action(commande) {
    switch (commande) {
      default:
        return this.browser.start();
    }
  }
}

exports.init = (configuration, plugins) => {
  return new AssistantWindowSwap().init(plugins).then((resource) => {
    console.log("[assistant-windowswap] Plugin chargé et prêt.");
    return resource;
  });
};
