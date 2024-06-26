import dotenv from 'dotenv';
import spotifyWebApi from 'spotify-web-api-node';
import express from 'express';
dotenv.config();

export const spotifyTokens = {
  access_token: null,
  refresh_token: null,
  expires_in: 0,
}


const scopes = [
    'ugc-image-upload',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'streaming',
    'app-remote-control',
    'user-read-email',
    'user-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-read-private',
    'playlist-modify-private',
    'user-library-modify',
    'user-library-read',
    'user-top-read',
    'user-read-playback-position',
    'user-read-recently-played',
    'user-follow-read',
    'user-follow-modify'
  ];

  const spotifyApi = new spotifyWebApi({
    redirectUri: 'http://localhost:8000/callback',
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_SECRET,
  });


  const app = express();

  app.get('/', (req, res) => {
    res.redirect(spotifyApi.createAuthorizeURL(scopes));
  });

  app.get('/callback', (req, res) => {
    const error = req.query.error;
    const code = req.query.code;
    const state = req.query.state;

    if(error) {
      console.error(error);
      res.send('There was an error:', error);
      return;
    }

    spotifyApi
      .authorizationCodeGrant(code)
      .then(data => {
        spotifyTokens.access_token = data.body['access_token'];
        spotifyTokens.refresh_token = data.body['refresh_token'];
        spotifyTokens.expires_in = data.body['expires_in'];

        spotifyApi.setAccessToken(spotifyTokens.access_token);
        spotifyApi.setRefreshToken(spotifyTokens.refresh_token);

        console.log(`access_token: ${spotifyTokens.access_token}`);
        console.log(`expires_in: ${spotifyTokens.expires_in}`);
        console.log(`refresh_token: ${spotifyTokens.refresh_token}`);

        res.send('You have successfully logged in!');

        setInterval(async () => {
          const data = await spotifyApi.refreshAccessToken();
          const access_token = data.body['access_token'];

          console.log('The access token has been refreshed');
          console.log(`New access token: ${access_token}`);
          spotifyApi.setAccessToken(access_token);
        }, spotifyTokens.expires_in / 2 * 1000);
      });
  });

  app.listen(process.env.PORT, () => {
    console.log(`http://localhost:${process.env.PORT}`);
  });