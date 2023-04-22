import React from 'react';
import {
  DropdownProps,
  Menu,
  Input,
  Icon,
  Dropdown,
  Form,
} from 'semantic-ui-react';
import {
  debounce,
  getMediaPathResults,
  getYouTubeResults,
  isHttp,
  isMagnet,
  isYouTube,
} from '../../utils';
import { examples } from '../../utils/examples';
import ChatVideoCard from '../Playlist/ChatVideoCard';

interface ComboBoxProps {
  roomSetMedia: (e: any, data: DropdownProps) => void;
  roomMedia: string;
  mediaPath: string | undefined;
  streamPath: string | undefined;
  playlist: PlaylistVideo[];
}

export class ComboBox extends React.Component<ComboBoxProps> {
  state = {
    inputMedia: undefined as string | undefined,
    results: undefined as JSX.Element[] | undefined,
    loading: false,
    lastResultTimestamp: Number(new Date()),
  };
  debounced: any = null;

  setMediaAndClose = (e: any, data: DropdownProps) => {
    window.setTimeout(
      () => this.setState({ inputMedia: undefined, results: undefined }),
      200
    );
    console.log(data);
    this.props.roomSetMedia(e, data);
    console.log(this.props.roomMedia);
  };

  render() {
    const { roomMedia: currentMedia } = this.props;
    const { results } = this.state;
    return (
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          <Form style={{ flexGrow: 1 }} autoComplete="off">
            <Input
              inverted
              fluid
              focus
              onFocus={(e: any) => {
                e.persist();
                this.setState( { inputMedia: currentMedia },);
                setTimeout(() => e.target.select(), 100);
              }}
              onKeyPress={(e: any) => {
                if (e.key === 'Enter') {
                  this.setMediaAndClose(e, {
                    value: this.state.inputMedia,
                  });
                }
              }}
              label={'Now Watching:'}
              placeholder="Enter YouTube link or a search term"
              value={ this.state.inputMedia }
            />
          </Form>
          
        </div>
      </div>
    );
  }
}
