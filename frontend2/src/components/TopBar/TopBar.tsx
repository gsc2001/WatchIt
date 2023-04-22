import React from 'react';
import { colorMappings } from '../../utils';
import { Icon } from 'semantic-ui-react';
// import 'firebase/compat/auth';
import { InviteButton, NewRoomButton } from '../Buttons';
import appStyles from '../App/App.module.css';

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
                                    position: 'absolute',
                                    top: 8,
                                    width: '100%',
                                    margin: '0 auto',
                                }}
                            />
                            <Icon
                                inverted
                                name="group"
                                size="large"
                                color="green"
                                style={{
                                    position: 'absolute',
                                    bottom: 8,
                                    width: '100%',
                                    margin: '0 auto',
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
