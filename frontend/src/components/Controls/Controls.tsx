import React from 'react';
import { Icon, Progress, Label } from 'semantic-ui-react';
import { Slider } from 'react-semantic-ui-range';
import { formatTimestamp } from '../../utils';
import styles from './Controls.module.css';

interface ControlsProps {
  duration: number;
  paused: boolean;
  currentTime: number;
  roomTogglePlay: () => void;
  roomSeek: (e: any, time: number) => void;
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
      currentTime,
      duration,
      paused,
    } = this.props;
    
    return (
      <div className={styles.controls}>
        <Icon
          onClick={() => {
            roomTogglePlay();
          }}
          className={`${styles.control} ${styles.action}`}
          name={paused ? 'play' : 'pause'}
        />
        <div className={`${styles.control} ${styles.text}`}>
          {formatTimestamp(currentTime)}
        </div>
        <Progress
          size="tiny"
          color="red"
          onClick={
            duration < Infinity ? roomSeek : undefined
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
        </Progress>
        <div className={`${styles.control} ${styles.text}`}>
          {formatTimestamp(duration)}
        </div>
      </div>
    );
  }
}
