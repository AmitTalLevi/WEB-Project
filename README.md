# Overview
This project is designed to assist users in planning extended trips across different countries using cars or bicycles. The primary objective is to offer users personalized travel itineraries along with visual maps for their journeys.

## Features
* Selection of countries from an extensive list
* Option to choose between car or bicycle trips
* Creation of continuous 3-day travel itineraries
* Presentation of route details, including distances and travel times
* Interactive map displaying the planned routes
* AI-generated visuals depicting each day of the journey
* Responsive layout compatible with different screen sizes
  
## Project Structure

* Frontend – React
* Backend – Express Node.js
* Database – MongoDB
* Groq sdk - For generating detailed trip itineraries based on prompts
* StableHorde API - For generating AI-based images from prompts.
* react-leaflet – For displaying the route on map

## Prerequisites
Node.js (v14.0.0 or later)

npm (v6.0.0 or later)


# Installation

1. Clone the repository:
   ```
   git clone https://github.com/Your-User-Name/WEB-Project.git
   ```

2. Navigate to the project directory:
   ```
   cd WEB-Project
   ```

3. Install the dependencies for **both** frontend and backend:
   ```
   npm install
   cd server
   npm install
   cd ..
   ```
# Running the Application

1. Start the backend server:
   ```
   cd backend
   npm start
   ```

2. In a new terminal, start the React frontend:
   ```
   cd frontend
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

# How to Use
Pick a country from the dropdown menu.
Decide whether you want a car or bicycle trip.
Press "Create Itinerary" to generate your 3-day travel plan.
Examine the route on the map and scroll down for detailed information on each day.

# Application Flow

1) User is open the main page
2) User select country and vehicle type (Car/Bicycle)
3) User click submit
4) Frontend sends a post request to the backend ‘api/trips’ with body : 
{
  "country": "France",
  "type": "car"
}
5) Backend is generated prompt 
6) UUID for each request is created
7) Backend parse the response into formated json 
8) Object is save into the mongo-db
9) Send response back to front end
10 ) Frontend navigate to Trip details with the response from the backend
11) The page is start to render (Map Route + Trip Details)
12) A request is send to backend ‘api/generate-image` with the uuid of the request
13) The backend sending the prompt to stablehorde and waiting for the image request maximum of 3min (6 retries of 30 seconds)
14) When the backend receive the image url, we convert it into base64 and save it into the DB using the UUID first request and display it into the ui.

# Diagram
![Picture1](https://github.com/user-attachments/assets/19d5c997-c063-409b-b3e6-837acd279b97)


# Screenshots

![HomePage](https://github.com/user-attachments/assets/6e42c0e4-2d89-489c-91d3-fd08b171adce)

<img width="566" alt="Res" src="https://github.com/user-attachments/assets/7d7642ca-a988-4bd5-a46b-7ecbfce6875d">

<img width="504" alt="Res2" src="https://github.com/user-attachments/assets/b9becb04-13c3-432b-9e6d-3eb8e353ad60">



