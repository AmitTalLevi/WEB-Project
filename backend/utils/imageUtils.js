const axios = require('axios');

const convertUrlToBase64 = async (url) => {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const base64Image = Buffer.from(response.data, 'binary').toString('base64');
    return `data:image/png;base64,${base64Image}`;
  } catch (error) {
    console.error('Error converting URL to Base64:', error.message);
    return null;
  }
};

module.exports = {convertUrlToBase64,};
