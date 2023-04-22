import React from 'react';
import { Icon, Progress, Label, Popup, Dropdown } from 'semantic-ui-react';
import { Slider } from 'react-semantic-ui-range';
import { formatTimestamp } from '../../utils';
import styles from './Controls.module.css';

interface ControlsProps {
  duration: number;
  paused: boolean;
  muted: boolean;
  volume: number;
  subtitled: boolean;
  currentTime: number;
  disabled?: boolean;
  leaderTime?: number;
  isPauseDisabled?: boolean;
  playbackRate: number;
  beta: boolean;
  roomPlaybackRate: number;
  isYouTube: boolean;
  isLiveHls: boolean;
  timeRanges: { start: number; end: number }[];
  loop: boolean;
  roomTogglePlay: () => void;
  roomSeek: (e: any, time: number) => void;
  roomSetPlaybackRate: (rate: number) => void;
  roomSetLoop: (loop: boolean) => void;
  localFullScreen: (fs: boolean) => void;
  localToggleMute: () => void;
  localSubtitleModal: () => void;
  localSeek: () => void;
  localSetVolume: (volume: number) => void;
  localSetSubtitleMode: (mode: TextTrackMode, lang?: string) => void;
}

export class Controls extends React.Component<ControlsProps> {
  state = {
    showTimestamp: false,
    hoverTimestamp: 0,
    hoverPos: 0,
  };

  onMouseOver = () => {
    // console.log('mouseover');
    this.setState({ showTimestamp: true });
  };

  onMouseOut = () => {
    // console.log('mouseout');
    this.setState({ showTimestamp: false });
  };

  onMouseMove = (e: any) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const max = rect.width;
    const pct = x / max;
    // console.log(x, max);
    const target = pct * this.props.duration;
    // console.log(pct);
    if (pct >= 0) {
      this.setState({ hoverTimestamp: target, hoverPos: pct });
    }
  };

  render() {
    const {
      roomTogglePlay,
      roomSeek,
      localFullScreen,
      localToggleMute,
      currentTime,
      duration,
      leaderTime,
      isPauseDisabled,
      disabled,
      paused,
      muted,
      volume,
    } = this.props;
    const buffers = this.props.timeRanges.map(({ start, end }) => {
      const buffStartPct = (start / duration) * 100;
      const buffLengthPct = ((end - start) / duration) * 100;
      return (
        <div
          key={start}
          style={{
            position: 'absolute',
            height: '6px',
            backgroundColor: 'grey',
            left: buffStartPct + '%',
            width: buffLengthPct + '%',
            bottom: '0.2em',
            zIndex: -1,
          }}
        ></div>
      );
    });
    return (
      <div className={styles.controls}>
        <Icon
          onClick={() => {
            roomTogglePlay();
          }}
          className={`${styles.control} ${styles.action}`}
          disabled={disabled || isPauseDisabled}
          name={paused ? 'play' : 'pause'}
        />
        <div className={`${styles.control} ${styles.text}`}>
          {formatTimestamp(currentTime)}
        </div>
        <Progress
          size="tiny"
          color="red"
          onClick={
            duration < Infinity && !this.props.disabled ? roomSeek : undefined
          }
          onMouseOver={this.onMouseOver}
          onMouseOut={this.onMouseOut}
          onMouseMove={this.onMouseMove}
          className={`${styles.control} ${styles.action}`}
          inverted
          style={{
            flexGrow: 1,
            marginTop: 0,
            marginBottom: 0,
            position: 'relative',
            minWidth: '50px',
          }}
          value={currentTime}
          total={duration}
        >
          {buffers}
          {
            <div
              style={{
                position: 'absolute',
                bottom: '0px',
                left: `calc(${
                  (this.props.currentTime / this.props.duration) * 100 +
                  '% - 6px'
                })`,
                pointerEvents: 'none',
                width: '12px',
                height: '12px',
                transform:
                  duration < Infinity && this.state.showTimestamp
                    ? 'scale(1, 1)'
                    : 'scale(0, 0)',
                transition: '0.25s all',
                borderRadius: '50%',
                backgroundColor: '#54c8ff',
              }}
            ></div>
          }
          {duration < Infinity && this.state.showTimestamp && (
            <div
              style={{
                position: 'absolute',
                bottom: '0px',
                left: `calc(${this.state.hoverPos * 100 + '% - 27px'})`,
                pointerEvents: 'none',
              }}
            >
              <Label basic color="blue" pointing="below">
                <div>{formatTimestamp(this.state.hoverTimestamp)}</div>
              </Label>
            </div>
          )}
        </Progress>
        <div className={`${styles.control} ${styles.text}`}>
          {formatTimestamp(duration)}
        </div>
        <Icon
          onClick={() => localFullScreen(true)}
          className={`${styles.control} ${styles.action}`}
          name="expand"
          title="Fullscreen"
        />
        <Icon
          onClick={() => {
            localToggleMute();
          }}
          className={`${styles.control} ${styles.action}`}
          name={muted ? 'volume off' : 'volume up'}
          title="Mute"
        />
        <div style={{ width: '100px', marginRight: '10px' }}>
          <Slider
            value={volume}
            color={'blue'}
            disabled={muted}
            settings={{
              min: 0,
              max: 1,
              step: 0.01,
              onChange: (value: number) => {
                if (value !== this.props.volume && !isNaN(value)) {
                  this.props.localSetVolume(value);
                }
              },
            }}
          />
        </div>
      </div>
    );
  }
}
