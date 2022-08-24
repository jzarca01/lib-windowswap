const axios = require("axios");
const { feeds } = require('./feeds');

const pickVideo = () => feeds[Math.floor(Math.random() * feeds.length)]

const getVimeoInfos = async (url1, url2) => {
  try {
    const config = await axios({
      method: "GET",
      url: `https://player.vimeo.com/video/${url1}/config${url2 ? `?h=${url2}`: ''}`,
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
        return await getVimeoInfos(randomVideo.url1, randomVideo?.url2);
    }
    catch(err) {
        console.log(err);
    }
}

module.exports = { getRandomVideoInfos };
