import React, { useState } from 'react'
import axios from "axios"

function Search() {
    const [artist, setArtist] = useState('');
    const [data, setData] = useState('')
    const [result, setResult] = useState('')
    const [artistId, setArtistId] = useState('')
    const [track, setTrack] = useState('')

    function handleChange(e){
        setArtist(e.target.value)
    }

    function handleSubmit(e){
        const toSearch = e.target[0].value
        axios
        .get(`https://api.musixmatch.com/ws/1.1/artist.search?q_artist=${toSearch}&apikey=${process.env.REACT_APP_APIKEY}&page_size=5`, { crossDomain: true })
        .then((response) => {
            setData(response.data);
        })
        .catch((err) => {
          console.log(err);
        })
        if (data){
            setResult(data.message.body.artist_list)
            console.log(result.length)
        }

        e.preventDefault();
    }

    function changeId(e){
        setArtistId(e.target.name)
        axios
        .get(`https://api.musixmatch.com/ws/1.1/track.search?q_artist=${artistId}&apikey=${process.env.REACT_APP_APIKEY}&page_size=1&page=1&s_track_rating=desc`, { crossDomain: true })
        .then((response) => {
            setTrack(response.data);
        })
        .catch((err) => {
          console.log(err);
        })
        console.log(track)
        e.preventDefault();

    }

    return (
        <>
            <div className='Search'>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="form-control px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                        placeholder="Who's your favourite artist?"
                        name="artist-search"
                        value={artist}
                        onChange={handleChange}
                    />
                    <button className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-s leading-tight uppercase shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out" type="submit">Search</button>
                </form>
            </div>
            <div className='Results'>
                {result  &&  result.map((artist) =>    
                <>
                    <p className='py-2'>{artist.artist.artist_name} &nbsp;
                    <button className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase shadow-md"
                    onClick={changeId} name={artist.artist.artist_name}>Choose</button>
                    </p>
                </>  )}
            </div>
            <hr/>
            <div className='Lyrics'>
                {artistId}
            </div>
        </>

    )
}

export default Search