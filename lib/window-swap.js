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

browser.on("serviceDown", function () {
  console.log("Disconnection browser.");
  process.exit(1);
});

const onDeviceFound = (host) => {
  var client = new Client();

  const isRunningApp = (status) => {
    if (!status.applications) {
      return true;
    }
    const { applications } = status;
    return (
      applications.length >= 1 &&
      applications[0].displayName === "Default Media Receiver"
    );
  };

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

      player.load(
        media,
        { autoplay: true, repeatMode: "REPEAT_SINGLE" },
        function (err, status) {
          console.log("media loaded playerState=%s", status.playerState);
        }
      );

      player.on("status", function (status) {
        //console.log("status", status);
        if (
          status.idleReason == "FINISHED" &&
          status.loadingItemId === undefined
        ) {
          client.stop();
        }
      });
    });
  });

  client.on("error", function (err) {
    console.log("Error: %s", err.message);
    client.close();
  });

  client.on("status", function (status) {
    if (!isRunningApp(status)) {
      console.log("Disconnection client.");
      process.exit(1);
    }
  });
};

browser.start();
