const PORT = 8000
const express = require('express')
const axios = require('axios')
const cors = require('cors')


require('dotenv').config()

const app = express()

app.use(cors())

app.get('/',(req,res)=> {
    res.json('working...')
})

app.get('/search', (req, res)=> {
    
    
    const options = {
        method: 'GET',
        url:'https://genius.p.rapidapi.com/songs/65318',
        params: { q: 'Bon Jovi'},
        headers: {
            'x-rapidapi-host': 'genius.p.rapidapi.com',
            'x-rapidapi-key': process.env.GAME_RAPID_API_KEY
        }
    }

    axios.request(options).then((response)=> {
        console.log(response.data)
        res.json({
            artist: response.data.response.song.artist_names,
            title: response.data.response.song.title,
            released: response.data.response.song.release_date_for_display,
            album: response.data.response.song.album.name,
            image: response.data.response.song.song_art_image_url,
            spotify: response.data.response.song.media[1].url
        })
    }).catch((error)=> {
        console.error(error)
    })
})

app.listen(8000, () => console.log('server running') )