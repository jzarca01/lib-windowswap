const axios = require("axios");
const { feeds } = require('./feeds');

const pickVideo = () => feeds[Math.floor(Math.random() * feeds.length)]

const getVimeoInfos = async (vimeoId) => {
  try {
    const config = await axios({
      method: "GET",
      url: `https://player.vimeo.com/video/${vimeoId}/config`,
    });
    const { request: { files }, video: { title, thumbs }} = config.data;
    return {
        title: title,
        url: files.progressive[files.progressive.length - 1].url,
        thumbnail: thumbs['640']
    }
  } catch (err) {
    console.log("error with getDirectLink", err);
  }
};

const getRandomVideoInfos = async () => {
    try {
        const randomVideo = pickVideo();
        return await getVimeoInfos(randomVideo.url);
    }
    catch(err) {
        console.log(err);
    }
}

module.exports = { getRandomVideoInfos };
