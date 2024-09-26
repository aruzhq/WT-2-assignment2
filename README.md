# WT-2-assignment2
Assignment made by using leaflet.js, OpenWeather API, GNews API and AirVisual API. 
## What do you need to install:
Visual Studio Code (https://code.visualstudio.com/download)
Node.js (https://nodejs.org/en)
## Steps for correct code execution:
1. Open Visual Studio Code and create app.js file.
2. Paste the code from app.js (which I submitted) into app.js file.
3. Create .env file.
4. Paste the into .env file:
   
   OPENWEATHER_API_KEY=key1
   GNEWS_API_KEY=key2
   AIRVISUAL_API_KEY=key3
   
where key1 is your API key from OpenWeather, key2 is your API key from GNews, key3 is your API key from AirVisual (just replace them with your real keys)

How to get your key1, key2, key3?
key1 - 1. Register/log in into https://openweathermap.org/ site and verify your email.
       2. Go to https://home.openweathermap.org/api_keys and generate a new key.
       3. Copy it and paste in place of key1.
key2 - 1. Register/log in into https://gnews.io/ site and verify your email.
       2. As you log in you can immediately copy your API key. So copy it and paste in place of key2.
key3 - 1. Register/log in into https://api-docs.iqair.com/ site and verify your email.
       2. https://dashboard.iqair.com/personal/api-keys then go here.
       3. Create a new API key.
       4. Copy it and paste in place of key3.

5. Write in terminal:

npm install express axios dotenv
node app.js

6. If everything is okay in terminal will appear 'Server is running on http://localhost:3000'
7. Go to http://localhost:3000

