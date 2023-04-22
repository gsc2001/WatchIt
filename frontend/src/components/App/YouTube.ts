import { Player } from './Player';

export class YouTube implements Player {
  watchItYTPlayer: YT.Player | null;
  constructor(watchItYTPlayer: YT.Player | null) {
    this.watchItYTPlayer = watchItYTPlayer;
  }
  getCurrentTime = () => {
    return this.watchItYTPlayer?.getCurrentTime() ?? 0;
  };

  getDuration = () => {
    return this.watchItYTPlayer?.getDuration() ?? 0;
  };

  isMuted = () => {
    return this.watchItYTPlayer?.isMuted() ?? false;
  };

  isSubtitled = (): boolean => {
    // This actually isn't accurate after subtitles have been toggled off because track doesn't update
    // try {
    //   const current = this.watchItYTPlayer?.getOption('captions', 'track');
    //   return Boolean(current && current.languageCode);
    // } catch (e) {
    //   console.warn(e);
    //   return false;
    // }
    return false;
  };

  getPlaybackRate = (): number => {
    return this.watchItYTPlayer?.getPlaybackRate() ?? 1;
  };

  setPlaybackRate = (rate: number) => {
    this.watchItYTPlayer?.setPlaybackRate(rate);
  };

  setSrcAndTime = async (src: string, time: number) => {
    let url = new window.URL(src);
    // Standard link https://www.youtube.com/watch?v=ID
    let videoId = new URLSearchParams(url.search).get('v');
    // Link shortener https://youtu.be/ID
    let altVideoId = src.split('/').slice(-1)[0];
    this.watchItYTPlayer?.cueVideoById(videoId || altVideoId, time);
  };

  playVideo = async () => {
    setTimeout(() => {
      console.log('play yt');
      console.log(this.watchItYTPlayer);
      this.watchItYTPlayer?.playVideo();
    }, 200);
  };

  pauseVideo = () => {
    this.watchItYTPlayer?.pauseVideo();
  };

  seekVideo = (time: number) => {
    this.watchItYTPlayer?.seekTo(time, true);
  };

  shouldPlay = () => {
    return (
      this.watchItYTPlayer?.getPlayerState() ===
        window.YT?.PlayerState.PAUSED ||
      this.getCurrentTime() === this.getDuration()
    );
  };

  setMute = (muted: boolean) => {
    if (muted) {
      this.watchItYTPlayer?.mute();
    } else {
      this.watchItYTPlayer?.unMute();
    }
  };

  setVolume = (volume: number) => {
    this.watchItYTPlayer?.setVolume(volume * 100);
  };

  getVolume = (): number => {
    const volume = this.watchItYTPlayer?.getVolume();
    return (volume ?? 0) / 100;
  };

  setSubtitleMode = (mode?: TextTrackMode, lang?: string) => {
    // Show the available options
    // console.log(this.watchItYTPlayer?.getOptions('captions'));
    if (mode === 'showing') {
      console.log(lang);
      //@ts-ignore
      this.watchItYTPlayer?.setOption('captions', 'reload', true);
      //@ts-ignore
      this.watchItYTPlayer?.setOption('captions', 'track', {
        languageCode: lang ?? 'en',
      });
    }
    if (mode === 'hidden') {
      // BUG this doesn't actually set the value of track
      // so we can't determine if subtitles are on or off
      // need to provide separate menu options
      //@ts-ignore
      this.watchItYTPlayer?.setOption('captions', 'track', {});
    }
  };

  getSubtitleMode = () => {
    return 'hidden' as TextTrackMode;
  };

  isReady = () => {
    return Boolean(this.watchItYTPlayer);
  };

  stopVideo = () => {
    this.watchItYTPlayer?.stopVideo();
  };

  clearState = () => {
    return;
  };

  loadSubtitles = async (src: string) => {
    return;
  };

  syncSubtitles = (sharerTime: number) => {
    return;
  };

  getTimeRanges = (): { start: number; end: number }[] => {
    return [
      {
        start: 0,
        end:
          (this.watchItYTPlayer?.getVideoLoadedFraction() ?? 0) *
          this.getDuration(),
      },
    ];
  };

  setLoop = (loop: boolean): void => {
    this.watchItYTPlayer?.setLoop(loop);
  };

  getVideoEl = (): HTMLMediaElement => {
    return document.getElementById('leftYt') as HTMLMediaElement;
  };
}
