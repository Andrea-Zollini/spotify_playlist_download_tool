import { spotifyTokens } from "./index.js";
import spotifyWebApi from 'spotify-web-api-node';
// const token = spotifyTokens.access_token;
const token = 'BQBJsk7AcrRUzipBJxOAHMGNVjto2x1iqwIYNHIO3eA3uzyVTM1IAvWocaCMVbluwVWGHqjyId8wU-TU59S1dOvq9sRTJXCk7Y4hamtuak06QbL5m03spvrLQNSYLvvxwH6TFA5RBApsXASbEPKOKJ4KCVLJFyoH5F3h6l8b_Kwivakp4kCWPyHhk1JwXapG0zipQiHUpvwLtM4rSf6f8IHWOvIdPl1HqB1UhJnt_L_89vOQgHhJVgwFAkGPETlRX4zs4ik81hW0eRfUyZIk8MHJ5Agkmih6ubHq3JB1idMeynHjOgWvPAYstFbQSFQMUA';

const spotifyApi = new spotifyWebApi();
spotifyApi.setAccessToken(token);

const getInfo = async () => {
    try {
        const user = await spotifyApi.getMe();
        getUserPlaylists(user.body.id);
    } catch (error) {
        console.error(error);
    }
}

const getUserPlaylists = async (userId) => {
    const data = await spotifyApi.getUserPlaylists(userId);

    let playlists = [];

    for(let playlist of data.body.items) {
    //     console.log('--------------------');

    //     console.log(`${playlist.name} - ${playlist.id}`);
    //     const tracks = await spotifyApi.getPlaylistTracks(playlist.id);
    //     // console.log(tracks.body.items);
    //     for(let track of tracks.body.items) {
    //         console.log(`${track.track.name}`);
    //     }

    //     console.log('--------------------');

        playlists.push({
            name: playlist.name,
            id: playlist.id,
        });
    }

    console.log(playlists);
    return playlists;
}

getInfo();