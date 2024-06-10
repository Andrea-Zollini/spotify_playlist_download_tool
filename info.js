import { spotifyTokens } from "./index.js";
import fs from 'fs';
import spotifyWebApi from 'spotify-web-api-node';
const token = 'BQCo2jGWSkoo2JJCUayPlymm-FM4W4_ZDw_gfmM3IzjXW3gmSMN6Xcm8cBxq57mvTEbEz0lGcNKz_c2XsK9Wlj9xIqSARSOfwnEiQyWXvQHPu6PIOmhIUexNam_-Uewwn-2AdifHxzSPJOCs7upmBAP0vt9mFl-5nt0jyVH27wpkDRrFdQbtVP8kxu8kxrhzx4fDjcMTgb0xwAPLNYCUUxh90u-CggLuhw3MKp92Hg64kBsFitnw_mar--mJWgBqtbnDyCx5IBmB_Bwrm5kVIBGPkU53mH3MDG_SfvAdmi8rYVN5MuXNpo8kvgLca7aZyg';

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

        const tracks = await getPlaylistTracks(playlist.id, playlist.name);

        const tracksJson = { tracks };
        let data = JSON.stringify(tracksJson);


        playlists.push({
            name: playlist.name,
            id: playlist.id,
            songs: data,
        });
    }

    fs.writeFileSync('playlists.json', JSON.stringify(playlists));
}

const getPlaylistTracks = async (playlistId, playlistName) => {
    const data = await spotifyApi.getPlaylistTracks(playlistId, { limit: 100, offset: 1, fields: 'items' });
    let tracks = [];

    for(let track of data.body.items) {
        tracks.push({
            name: getPrettyName(track.track.name),
            artist: track.track.artists[0].name,
        }); 
    }
    return tracks;
}


const getPrettyName = (name) => {
    if(name.includes('-')) {
        return name.split('-')[0];
    }
    return name;
}

getInfo();