import React from 'react';


export default function VideoListItem(props) {
  const {videoId, collection, name, playbackPosition} = props;
  const hasSubs = collection.videos.get(videoId).subtitleTracks.size > 0;

  // Get the current playback position.  We first check if we have a "live"
  // version of the position, if the user has visited the video this session.
  // Otherwise we get the position that was loaded from the database on
  // application launch.
  var position;
  if (collection.videos.get(videoId).playbackPosition != null) {
    position = collection.videos.get(videoId).playbackPosition;
  } else {
    position = playbackPosition;
  }

  // Build the timestamp for time watched.
  var time_stamp = "";
  if (position > 2.0) { // Only give a time stamp if enough has been watched.
    time_stamp += "Watched ";
    time_stamp += secondsToTimestamp(position);
  }

  return (
    <li className={'App-library-list-item ' + (hasSubs ? 'App-library-list-item-has-subs' : 'App-library-list-item-no-subs')}>
      <Link to={'/player/' + encodeURIComponent(collection.locator) + '/' + encodeURIComponent(videoId)}>
        {name} <span className="App-library-list-item-time-stamp">{time_stamp}</span>
      </Link>
    </li>
  );
};
