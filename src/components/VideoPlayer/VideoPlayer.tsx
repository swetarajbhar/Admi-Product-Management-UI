import { useEffect, useRef } from 'react';
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from 'video.js';
import 'video.js/dist/video-js.css';

type VideoPlayerProps = {
    options: VideoJsPlayerOptions,
    onReady: (player: VideoJsPlayer) => void
    playing?: (player: VideoJsPlayer | null, video: HTMLVideoElement | null) => void
    onPlaybackEnd?: (player: VideoJsPlayer | null, video: HTMLVideoElement | null) => void
    showTranscodingMsg?: boolean
}

const VideoPlayer = ({ options = {}, onReady, playing, onPlaybackEnd, showTranscodingMsg = false }: VideoPlayerProps): JSX.Element => {

    const videoRef = useRef<HTMLVideoElement>(null);
    const playerRef = useRef<VideoJsPlayer | null>(null);

    useEffect(() => {
        // make sure Video.js player is only initialized once
        if (!playerRef.current) {
            const videoElement = videoRef.current;
            if (!videoElement) return;
            const player = playerRef.current = videojs(videoElement, options, () => {
                onReady(player);
            });
        } else {
            const videoElement = videoRef.current;
            const _options = { sources: [], ...options };
            if (videoElement !== null && _options !== undefined) {
                videoElement.src = _options.sources[0].src;
            }
        }
    }, [options]);

    useEffect(() => {
        videoRef.current?.addEventListener('timeupdate', () => playing && playing(playerRef.current, videoRef.current));
        videoRef.current?.addEventListener('ended', () => onPlaybackEnd && onPlaybackEnd(playerRef.current, videoRef.current));
        return () => {
            videoRef.current?.removeEventListener('timeupdate', () => playing && playing(playerRef.current, videoRef.current));
            videoRef.current?.removeEventListener('ended', () => onPlaybackEnd && onPlaybackEnd(playerRef.current, videoRef.current));
            // Dispose the Video.js player when the functional component unmounts
            if (playerRef.current) {
                playerRef.current.dispose();
                playerRef.current = null;
            }
        };
    }, []);

    return (
        <>
            <div data-vjs-player>
                <video ref={videoRef} className="video-js vjs-big-play-centered" />
            </div>
        </>
    );
};

export default VideoPlayer;
