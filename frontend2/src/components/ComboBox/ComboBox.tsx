import { display } from '@mui/system';
import React from 'react';
import { DropdownProps, Form, Input, Label } from 'semantic-ui-react';

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
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'stretch',
                                justifyContent: 'center',
                            }}
                        >
                            <Label
                                style={{
                                    // backgroundColor: '#e94057',
                                    color: 'white',
                                    fontSize: '1em',
                                    marginBottom: 0,
                                    paddingBottom: 0,
                                    paddingTop: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    backgroundImage: 'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',

                                }}
                            >
                                Now Watching
                            </Label>
                            <Input
                                style={{ flex: 1 }}
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
                                // label={'Now Watching'}
                                placeholder="Enter YouTube link"
                                value={this.state.inputMedia}
                                // action={{
                                //     color: 'purple',
                                //     labelPosition: 'left',
                                //     content: 'Now Watching',
                                // }}
                            />
                        </div>
                    </Form>
                </div>
            </div>
        );
    }
}
