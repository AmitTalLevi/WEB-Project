const express = require('express');
const router = express.Router();
const axios = require('axios');
const Groq = require('groq-sdk');
const { v4: uuidv4 } = require("uuid");
const Trip = require('../models/Trip');

const client = new Groq({
  apiKey: "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",
});


const extractJsonFromResponse = (response) => {
    const itinerary = [];
    const dayPattern = /"day":\s*(\d+)/g;
    const startLatPattern = /"start":\s*{[^}]*"lat":\s*([\d.-]+)/g;
    const startLngPattern = /"start":\s*{[^}]*"lng":\s*([\d.-]+)/g;
    const startNamePattern = /"start":\s*{[^}]*"name":\s*"([^"]+)"/g;
    const stopLatPattern = /"stop":\s*{[^}]*"lat":\s*([\d.-]+)/g;
    const stopLngPattern = /"stop":\s*{[^}]*"lng":\s*([\d.-]+)/g;
    const stopNamePattern = /"stop":\s*{[^}]*"name":\s*"([^"]+)"/g;
    const descriptionPattern = /"description":\s*"([^"]+)"/g;
    const distancePattern = /"distance":\s*([\d.]+)/g; // 
    const durationPattern = /"duration":\s*([\d.]+)/g;
  
    const textWithoutExtraChars = response.replace(/[`*]+/g, '');
  
    let dayMatch, startLatMatch, startLngMatch, startNameMatch, stopLatMatch, stopLngMatch, stopNameMatch, descriptionMatch, durationMatch;
  
    while ((dayMatch = dayPattern.exec(textWithoutExtraChars)) &&
           (startLatMatch = startLatPattern.exec(textWithoutExtraChars)) &&
           (startLngMatch = startLngPattern.exec(textWithoutExtraChars)) &&
           (startNameMatch = startNamePattern.exec(textWithoutExtraChars)) &&
           (stopLatMatch = stopLatPattern.exec(textWithoutExtraChars)) &&
           (stopLngMatch = stopLngPattern.exec(textWithoutExtraChars)) &&
           (stopNameMatch = stopNamePattern.exec(textWithoutExtraChars)) &&
           (descriptionMatch = descriptionPattern.exec(textWithoutExtraChars)) &&
           (distanceMatch = distancePattern.exec(textWithoutExtraChars)) &&
           (durationMatch = durationPattern.exec(textWithoutExtraChars))) {
  
      itinerary.push({
        day: parseInt(dayMatch[1]),
        start: {
          lat: parseFloat(startLatMatch[1]),
          lng: parseFloat(startLngMatch[1]),
          name: startNameMatch[1],
        },
        stop: {
          lat: parseFloat(stopLatMatch[1]),
          lng: parseFloat(stopLngMatch[1]),
          name: stopNameMatch[1],
        },
        description: descriptionMatch[1],
        distance: parseFloat(distanceMatch[1]),
        duration: parseFloat(durationMatch[1]),
      });
    }
  
    return itinerary;
  };


router.post('/', async (req, res) => {  
  
  const { country, type } = req.body;
  const uuid = uuidv4();
  let prompt = '';
  if (type === 'car') {
    prompt = `Create a 3-day itinerary for a car trip in ${country}. The trip should cover a distance of 80 km to 300 km per day. Each day's start and end destinations should include latitude and longitude coordinates the description will include information about points of interest along the way
    and include trip if any, with the details provided in an array of objects (JSON) formatted like this:
    {"day": 1,"start": {"lat": number,"lng": number,"name": "string"},"stop": {"lat": number,"lng": number,"name": "string"},"description": "string","distance": number,"duration": number}`;
  } else if (type === 'bicycle') {
    prompt = `Create a 3-day itinerary for a bicycle trip in ${country}. The trip should cover a distance of 80 km. Each day's start and end destinations should include latitude and longitude coordinates the description will include information about points of interest along the way
    and include trip if any, with the details provided in an array of objects (JSON) formatted like this:
    {"day": 1,"start": {"lat": number,"lng": number,"name": "string"},"stop": {"lat": number,"lng": number,"name": "string"},"description": "string","distance": number,"duration": number}`;
  }
  console.log(`UUID - ${uuid}, fetching prompt`)
  try {
    const chatCompletion = await client.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama3-8b-8192',
    });

    const aiResponse = chatCompletion.choices[0].message.content;
    const parsedItinerary = extractJsonFromResponse(aiResponse);
    const newTrip = new Trip({
      uuid,
      prompt,
      response: parsedItinerary,
      generatedImage: '', 
      country,
    });

    await newTrip.save();
    console.log(`UUID - ${uuid}, fetching prompt sucssesed`)
    // console.log(`UUID - ${uuid}, prompt result - ${newTrip.toString()}`);
    res.status(200).json({
      uuid,
      prompt,
      response: parsedItinerary,
      country,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
