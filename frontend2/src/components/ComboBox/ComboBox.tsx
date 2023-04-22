import React from 'react';
import {
  DropdownProps,
  Input,
  Form,
} from 'semantic-ui-react';

interface ComboBoxProps {
  roomSetMedia: (data: DropdownProps) => void;
  roomMedia: string;
  mediaPath: string | undefined;
  streamPath: string | undefined;
  playlist: PlaylistVideo[];
}

export class ComboBox extends React.Component<ComboBoxProps> {
  state = {
    inputMedia: undefined as string | undefined,
    results: undefined as JSX.Element[] | undefined,
    lastResultTimestamp: Number(new Date()),
  };
  debounced: any = null;

  setMediaAndClose = (e: any, data: DropdownProps) => {
    this.props.roomSetMedia(data);
  };

  doSearch = async (e: any) => {
    e.persist();
    this.setState({ inputMedia: e.target.value });
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
              onChange={this.doSearch}
              onKeyPress={(e: any) => {
                if (e.key === 'Enter') {
                  this.setMediaAndClose(e, {
                    value: this.state.inputMedia,
                  });
                }
              }}
              label={'Now Watching:'}
              placeholder="Enter YouTube link"
              value={ this.state.inputMedia }
            />
          </Form>
          
        </div>
      </div>
    );
  }
}
