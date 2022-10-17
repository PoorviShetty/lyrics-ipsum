import React, { useState } from 'react'
import axios from "axios"

function Search() {
    const [artist, setArtist] = useState('');
    const [result, setResult] = useState('Waiting for an artist!')

    function handleChange(e){
        setArtist(e.target.value)
    }

    async function getData(url) {
        try {
           let res = await axios({
                url: url,
                method: 'get',
                timeout: 8000,
                headers: {
                    'Content-Type': 'application/json',
                }
            })   
            return res.data
        }
        catch (err) {
            console.error(err);
        }
    }
    function handleSubmit(e){
        const toSearch = e.target[0].value
        getData(`https://api.musixmatch.com/ws/1.1/artist.search?q_artist=${toSearch}&apikey=${process.env.REACT_APP_APIKEY}&page_size=1`)
        .then(res => {
            const artist_name = res.message.body.artist_list[0].artist.artist_name
            getData(`https://api.musixmatch.com/ws/1.1/track.search?q_artist=${artist_name}&apikey=${process.env.REACT_APP_APIKEY}&page_size=1&page=1&s_track_rating=desc`)
            .then(res => {
                const track_info ={
                    "artist_name": res.message.body.track_list[0].track.artist_name,
                    "track_name": res.message.body.track_list[0].track.track_name,
                }

                getData(`https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?q_track=${track_info['track_name']}&q_artist=${track_info['artist_name']}&apikey=${process.env.REACT_APP_APIKEY}`)
                .then(res => {
                    console.log(res.message.body.lyrics.lyrics_body)
                    setResult(res.message.body.lyrics.lyrics_body)
                })
            })
        })
        e.preventDefault();
    }

    return (
        <>
            <div className='bg-slate-200 h-screen py-5'>
                <div className="flex justify-center p-5">
                    <div className="block rounded-lg shadow-lg bg-white max-w-xl text-center">
                        <div className="py-3 px-6 border-b border-gray-300 bg-orange-200">
                            <form onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    className="form-control px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                    placeholder="Who's your favourite artist?"
                                    name="artist-search"
                                    value={artist}
                                    onChange={handleChange}
                                />
                                <button className="inline-block px-6 py-2.5 bg-orange-600 text-white font-medium text-s leading-tight uppercase shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out" type="submit">Search</button>
                            </form>
                        </div>
                        <div className="p-6 bg-yellow-200">
                            <p className="text-gray-700 text-base mb-4">
                                {result}
                            </p>
                        </div>
                    </div>
                </div>                
            </div>
        </>

    )
}

export default Search