import React, { useState, useRef, useEffect } from "react";
import "./style.css";
import { Card } from "react-bootstrap";
import {
  TbPlayerTrackNext,
  TbPlayerTrackPrev,
  TbPlayerPlay,
  TbPlayerPause,
} from "react-icons/tb";

export const MusicPlayer = () => {
  const [tracks, setTracks] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);


  const audioRef = useRef(null);
  useEffect(() => {
    if (currentTrackIndex !== null) {
      audioRef.current.src = tracks[currentTrackIndex].preview;
      audioRef.current.play();
    }
  }, [currentTrackIndex, tracks, audioRef]);

  const handlePlay = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
    }
  };

  const handlePause = () => {
    if (!audioRef.current.paused) {
      audioRef.current.pause();
    }
  };

  const handlePrevious = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentTrackIndex < tracks.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
    }
  };

  const handleTrackSelect = (index) => {
    if (currentTrackIndex === index) {
      if (audioRef.current.paused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    } else {
      setCurrentTrackIndex(index);
    }
  };

  const handleAudioEnded = () => {
    if (currentTrackIndex < tracks.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
      audioRef.current.play();
    }
  };

  const handleSearchByArtist = (event) => {
    event.preventDefault();
    const searchQuery = event.target.elements.search.value;
    fetch(`https://deezerdevs-deezer.p.rapidapi.com/search?q=${searchQuery}`, {
      method: "GET",
      headers: {
        "X-rapidapi-key": "e2a7d21f36mshbc435b673d54057p1bf32djsn1d701ed982f0",
        "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setTracks(data.data);
        setCurrentTrackIndex(null);
      });
  };
  const handleSearchBySongName = (event) => {
    event.preventDefault();
    const songName = event.target.elements.songNameInput.value;
    fetch(
      `https://deezerdevs-deezer.p.rapidapi.com/search?q=track:"${songName}"`,
      {
        method: "GET",
        headers: {
          "X-rapidapi-key":
            "e2a7d21f36mshbc435b673d54057p1bf32djsn1d701ed982f0",
          "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setTracks(data.data);
        setCurrentTrackIndex(null);
      });
  };

  return (
    <div className="container">
      <h1 className="title">Media Player</h1>
      <div className="form-container">
        <form className="search-container" onSubmit={handleSearchByArtist}>
          <h4>Search By Artist Name</h4>
          <input
            type="text"
            id="artist-search"
            name="search"
            placeholder="Artist Name"
            autocomplete="off"
          />
          <input class="button--submit" value="Search" type="submit" />
        </form>
        <form className="search-container" onSubmit={handleSearchBySongName}>
          <h4>Search By Song Name</h4>
          <input
            type="text"
            id="songNameInput"
            name="songNameInput"
            placeholder="Song Name"
          />
          <button className="button--submit" type="submit">
            Search
          </button>
        </form>
      </div>
      
      <div className="button-container">
        <button onClick={handlePrevious}>
          <TbPlayerTrackPrev className="control-buttons" />
        </button>
        <button onClick={handlePlay}>
          <TbPlayerPlay className="control-buttons"/>
        </button>
        <button onClick={handlePause}>
          <TbPlayerPause className="control-buttons"/>
        </button>
        <button onClick={handleNext}>
          <TbPlayerTrackNext className="control-buttons"/>
        </button>
        {currentTrackIndex !== null && (
        <audio
          className="controlsPanel"
          ref={audioRef}
          src={tracks[currentTrackIndex].preview}
          onEnded={handleAudioEnded}
          controls
          type="audio/mpeg"
        />
      )}
      </div>
      
      <div className="tracks-container">
        {tracks.map((track, index) => (
          <Card
            key={track.id}
            className={`card-item ${
              index === currentTrackIndex ? "active" : ""
            }`}
            onClick={() => handleTrackSelect(index)}
          >
            <Card.Img
              className="track-image"
              variant="top"
              src={track.album.cover_medium}
              
            /> <TbPlayerPlay className="control-buttons"/>
            <Card.Body className="card-content">
              <Card.Title className="track-title">{track.title}</Card.Title>
              <Card.Text className="track-title">{track.artist.name}</Card.Text>
            </Card.Body>
          </Card>
        ))}
      </div>

     
    </div>
  );
};
