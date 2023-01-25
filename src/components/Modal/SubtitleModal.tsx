import React from 'react';
import {
  Modal,
  Button,
  Popup,
  Icon,
  Radio,
  Checkbox,
  Header,
} from 'semantic-ui-react';
import { Socket } from 'socket.io-client';
import { openFileSelector, serverPath } from '../../utils';

export class SubtitleModal extends React.Component<{
  closeModal: Function;
  currentSubtitle: string | undefined;
  haveLock: Function;
  src: string;
  socket: Socket;
  getMediaDisplayName: Function;
  beta: boolean;
  setSubtitleMode: Function;
  getSubtitleMode: Function;
}> {
  state = {
    loading: false,
    searchResults: [],
  };
  uploadSubtitle = async () => {
    const files = await openFileSelector('.srt');
    if (!files) {
      return;
    }
    const file = files[0];
    const reader = new FileReader();
    reader.addEventListener('load', async (event) => {
      const subData = event.target?.result;
      // Upload to server
      const resp = await window.fetch(serverPath + '/subtitle', {
        method: 'POST',
        body: subData,
        headers: { 'Content-Type': 'text/plain' },
      });
      // Once URL obtained, make those the room subtitles
      const json = await resp.json();
      this.props.socket.emit(
        'CMD:subtitle',
        serverPath + '/subtitle/' + json.hash
      );
    });
    reader.readAsText(file);
  };
  render() {
    const { closeModal } = this.props;
    return (
      <Modal open={true} onClose={closeModal as any}>
        <Modal.Header>Subtitles</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            {process.env.NODE_ENV === 'development' && (
              <p>{this.props.currentSubtitle}</p>
            )}
            <Checkbox
              toggle
              checked={this.props.getSubtitleMode() === 'hidden'}
              label="Hide subtitles for myself"
              onClick={(e, data) => {
                this.props.setSubtitleMode();
              }}
            />
            <hr />
            <div>
              <Header>Room subtitle settings</Header>
              <div>
                <Radio
                  disabled={!this.props.haveLock()}
                  name="radioGroup"
                  label="No subtitles"
                  value=""
                  checked={!this.props.currentSubtitle}
                  onChange={(e, { value }) => {
                    this.props.socket.emit('CMD:subtitle', null);
                  }}
                />
              </div>
              <div>
                <Radio
                  disabled={!this.props.haveLock()}
                  name="radioGroup"
                  label="Uploaded subtitles"
                  value=""
                  checked={
                    Boolean(this.props.currentSubtitle) &&
                    this.props.currentSubtitle?.startsWith(
                      serverPath + '/subtitle'
                    )
                  }
                />
                <Popup
                  content="Upload a .srt subtitle file for this video"
                  trigger={
                    <Button
                      style={{ marginLeft: '10px' }}
                      color="violet"
                      icon
                      labelPosition="left"
                      onClick={() => this.uploadSubtitle()}
                      disabled={!this.props.haveLock()}
                      size="mini"
                    >
                      <Icon name="upload" />
                      Upload (.srt)
                    </Button>
                  }
                />
              </div>
              {!this.state.searchResults.length && (
                <div>
                  <Radio
                    name="radioGroup"
                    disabled={!this.props.haveLock()}
                    value=""
                    checked={
                      Boolean(this.props.currentSubtitle) &&
                      this.props.currentSubtitle?.startsWith(
                        serverPath + '/downloadSubtitle'
                      )
                    }
                  />
                  {/* <Button
                      style={{ marginLeft: '10px' }}
                      loading={this.state.loading}
                      color="green"
                      disabled={!this.props.haveLock()}
                      icon
                      labelPosition="left"
                      onClick={async () => {
                        this.setState({ loading: true });
                        const resp = await window.fetch(
                          serverPath + '/searchSubtitles?url=' + this.props.src
                        );
                        const json = await resp.json();
                        this.setState({ searchResults: json });
                        this.setState({ loading: false });
                      }}
                    >
                      <Icon name="search" />
                      Search by Hash
                    </Button> */}
                  <Button
                    style={{ marginLeft: '10px' }}
                    loading={this.state.loading}
                    color="green"
                    disabled={!this.props.haveLock()}
                    icon
                    labelPosition="left"
                    size="mini"
                    onClick={async () => {
                      this.setState({ loading: true });
                      const resp = await window.fetch(
                        serverPath +
                          '/searchSubtitles?title=' +
                          this.props
                            .getMediaDisplayName(this.props.src)
                            .split('/')
                            .slice(-1)
                      );
                      const json = await resp.json();
                      this.setState({ searchResults: json });
                      this.setState({ loading: false });
                    }}
                  >
                    <Icon name="search" />
                    Search by Title
                  </Button>
                </div>
              )}
              {this.state.searchResults.map((result: any) => (
                <div>
                  <Radio
                    disabled={!this.props.haveLock()}
                    label={result.SubFileName}
                    name="radioGroup"
                    value={result.SubDownloadLink}
                    checked={this.props.currentSubtitle?.includes(
                      result.SubDownloadLink
                    )}
                    onChange={(e, { value }) => {
                      this.props.socket.emit(
                        'CMD:subtitle',
                        serverPath + '/downloadSubtitles?url=' + value
                      );
                    }}
                  />
                </div>
              ))}
            </div>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }
}
