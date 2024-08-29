const express = require('express');
const axios = require('axios');
const { convertUrlToBase64 } = require('../utils/imageUtils');
const Trip = require('../models/Trip');
const router = express.Router();

const generateImage = async (country,uuid) => {
  const prompt = country;
  const requestBody = {
    prompt: prompt,
    params: {
      cfg_scale: 7.5,
      denoising_strength: 0.75,
      seed: "312912",
      height: 512,
      width: 512,
      seed_variation: 1,
      steps: 10
    }
  };
  let id;
  try {
    const response = await axios.post('https://stablehorde.net/api/v2/generate/async', requestBody, {
      headers: {
        'accept': 'application/json',
        'apiKey': 'Xto_mOsvJ_b_IQswhzsgyQ',
        'Client-Agent': 'unknown:0:unknown',
        'Content-Type': 'application/json',
      }
    });
    id = response.data.id;
  } catch (error) {
    console.error('Error generating image:', error.message);
    return null;
  }

  let imageUrl = null;
  let retries = 0;
  const maxRetries = 5;

  while (!imageUrl && retries < maxRetries) {
    console.log(`UUID - ${uuid}, fetching image with id ${id} - retryNumber ${retries}}`)
    await new Promise(resolve => setTimeout(resolve, 35000)); 
    try {

      const statusResponse = await axios.get(`https://stablehorde.net/api/v2/generate/status/${id}`);
      if (statusResponse.data && statusResponse.data.generations && statusResponse.data.generations[0] && statusResponse.data.generations[0].img) {
        imageUrl = statusResponse.data.generations[0].img;
        console.log(`UUID - ${uuid}, Succses fetching ai image`)
      } else {
        retries++;
      }
    } catch (error) {
      console.log(`UUID - ${uuid}, Failed to generate ai image`)
      return null;
    }
  }

  if (!imageUrl) {
    console.log(`UUID - ${uuid}, Failed to generate ai image`)
    return null;
  }

  return imageUrl;
}

router.post('/', async (req, res) => {
  const { uuid, country } = req.body; // Pass uuid and country from the frontend
  try {
    const imageUrl = await generateImage(country,uuid);
    if (!imageUrl) {
      return res.status(500).json({ error: 'Failed to generate image' });
    }

    const base64Image = await convertUrlToBase64(imageUrl);
    await Trip.findOneAndUpdate({ uuid }, { generatedImage: base64Image });
    console.log(`UUID - ${uuid}, base64 image is generated and inserted to db`)
    res.status(200).json({ imageUrl: base64Image });
  } catch (error) {
    console.error('Error in generate image route:', error.message);
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
