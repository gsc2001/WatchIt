import React from 'react';

// import 'firebase/compat/auth';

import { serverPath, colorMappings } from '../../utils';
import { Icon, Button, SemanticSIZES } from 'semantic-ui-react';
import { InviteButton } from '../Buttons';
import appStyles from '../App/App.module.css';

export async function createRoom(
    openNewTab: boolean | undefined,
    video: string = ''
) {
    const response = await window.fetch(serverPath + '/createRoom', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            video,
        }),
    });
    const data = await response.json();
    const { name } = data;
    console.log(name);

    if (openNewTab) {
        window.open('/watch/' + name);
    } else {
        window.location.assign('/watch/' + name);
    }
}

export class NewRoomButton extends React.Component<{
    size?: SemanticSIZES;
    openNewTab?: boolean;
}> {
    createRoom = async () => {
        await createRoom(this.props.openNewTab);
    };
    render() {
        return (
            <Button
                size={this.props.size}
                icon
                labelPosition="left"
                onClick={this.createRoom}
                className={this.props.size ? '' : 'toolButton'}
                fluid
                style={{  
                    backgroundImage:
                    'linear-gradient( 136deg, rgb(138,35,135) 0%, rgb(233,64,87) 50%, rgb(242,113,33) 100%)',
                    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
                    borderRadius: '50px',
                }}
            >
                <Icon name="play" />
                New Room
            </Button>
        );
    }
}

export class TopBar extends React.Component<{
    hideNewRoom?: boolean;
    hideSignin?: boolean;
    hideMyRooms?: boolean;
    roomTitle?: string;
    roomDescription?: string;
    roomTitleColor?: string;
    showInviteButton?: boolean;
}> {
    render() {
        return (
            <React.Fragment>
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        padding: '1em',
                        paddingBottom: '0px',
                        rowGap: '8px',
                    }}
                >
                    <a href="/" style={{ display: 'flex' }}>
                        <div
                            style={{
                                height: '48px',
                                width: '48px',
                                marginRight: '10px',
                                borderRadius: '50%',
                                position: 'relative',
                                backgroundColor: '#' + colorMappings.blue,
                            }}
                        >
                            <Icon
                                inverted
                                name="film"
                                size="large"
                                style={{
                                    // position: 'absolute',
                                    top: 14,
                                    width: '100%',
                                    textAlign: 'center',
                                    padding: "auto",
                                }}
                            />
                        </div>
                    </a>
                    {this.props.roomTitle || this.props.roomDescription ? (
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                marginRight: 10,
                                marginLeft: 10,
                            }}
                        >
                            <div
                                style={{
                                    fontSize: 30,
                                    color: this.props.roomTitleColor || 'white',
                                    fontWeight: 'bold',
                                    letterSpacing: 1,
                                }}
                            >
                                {this.props.roomTitle?.toUpperCase()}
                            </div>
                            <div
                                style={{
                                    marginTop: 4,
                                    color: 'rgb(255 255 255 / 63%)',
                                }}
                            >
                                {this.props.roomDescription}
                            </div>
                        </div>
                    ) : (
                        <React.Fragment>
                            <a href="/" style={{ display: 'flex' }}>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                >
                                    <div
                                        style={{
                                            textTransform: 'uppercase',
                                            fontWeight: 700,
                                            color: '#2185d0',
                                            fontSize: '30px',
                                            lineHeight: '30px',
                                        }}
                                    >
                                        Watch
                                    </div>
                                    <div
                                        style={{
                                            textTransform: 'uppercase',
                                            fontWeight: 700,
                                            color: '#21ba45',
                                            fontSize: '30px',
                                            lineHeight: '30px',
                                            marginLeft: 'auto',
                                        }}
                                    >
                                        Party
                                    </div>
                                </div>
                            </a>
                        </React.Fragment>
                    )}

                    <div
                        className={appStyles.mobileStack}
                        style={{
                            display: 'flex',
                            marginLeft: 'auto',
                            gap: '4px',
                        }}
                    >
                        {this.props.showInviteButton && <InviteButton />}
                        {!this.props.hideNewRoom && (
                            <NewRoomButton openNewTab />
                        )}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
