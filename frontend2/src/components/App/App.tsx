import axios from 'axios';
import React from 'react';
import { DropdownProps, Grid, Message } from 'semantic-ui-react';
import io, { Socket } from 'socket.io-client';
import type WebTorrent from 'webtorrent';
import {
    formatSpeed,
    getAndSaveClientId,
    ioPath,
    isYouTube,
    serverPath,
    testAutoplay,
} from '../../utils';
import { Chat } from '../Chat';
import { ComboBox } from '../ComboBox/ComboBox';
import { Controls } from '../Controls/Controls';
import { ErrorModal } from '../Modal/ErrorModal';
import { NamePasscodeModal } from '../Modal/NamePasscodeModal';
import { getSavedPasscode } from '../../utils/passcode';
import { TopBar } from '../TopBar';
import styles from './App.module.css';
import { HTML } from './HTML';
import { YouTube } from './YouTube';
import toast from 'react-hot-toast';

declare global {
    interface Window {
        onYouTubeIframeAPIReady: any;
        YT: YT.JsApi;
        watchit: {
            ourStream: MediaStream | undefined;
            videoRefs: HTMLVideoElementDict;
            videoPCs: PCDict;
            webtorrent: WebTorrent.Instance | null;
        };
    }
}

window.watchit = {
    ourStream: undefined,
    videoRefs: {},
    videoPCs: {},
    webtorrent: null,
};

interface AppProps {
    vanity?: string;
    urlRoomId?: string;
    beta: boolean;
    streamPath: string | undefined;
}

interface AppState {
    state: 'init' | 'starting' | 'connected';
    roomMedia: string;
    roomPaused: boolean;
    participants: User[];
    chat: ChatMessage[];
    leaderTime: number;
    myName: string;
    loading: boolean;
    scrollTimestamp: number;
    fullScreen: boolean;
    unreadCount: number;
    controlsTimestamp: number;
    isAutoPlayable: boolean;
    overlayMsg: string;
    isErrorAuth: boolean;
    settings: Settings;
    roomId: string;
    errorMessage: string;
    successMessage: string;
    warningMessage: string;
    showRightBar: boolean;
    inviteLink: string;
    isNameSet: boolean;
    isPrivate: boolean;
}

export default class App extends React.Component<AppProps, AppState> {
    state: AppState = {
        state: 'starting',
        roomMedia: '',
        roomPaused: false,
        fullScreen: false,
        participants: [],
        chat: [],
        leaderTime: 0,
        myName: '',
        loading: true,
        scrollTimestamp: 0,
        unreadCount: 0,
        controlsTimestamp: 0,
        isAutoPlayable: true,
        overlayMsg: '',
        isErrorAuth: false,
        settings: {},
        roomId: '',
        errorMessage: '',
        successMessage: '',
        warningMessage: '',
        showRightBar: true,
        inviteLink: '',
        isNameSet: false,
        isPrivate: false,
    };
    socket: Socket = null as any;
    mediasoupPubSocket: Socket | null = null;
    mediasoupSubSocket: Socket | null = null;
    ytDebounce = true;
    localStreamToPublish?: MediaStream;
    isLocalStreamAFile = false;
    publisherConns: PCDict = {};
    consumerConn?: RTCPeerConnection;
    progressUpdater?: number;
    heartbeat: number | undefined = undefined;
    YouTubeInterface: YouTube = new YouTube(null);
    HTMLInterface: HTML = new HTML('leftVideo');
    Player = () => {
        if (this.usingYoutube()) {
            return this.YouTubeInterface;
        } else {
            return this.HTMLInterface;
        }
    };

    chatRef = React.createRef<Chat>();

    async componentDidMount() {
        document.onfullscreenchange = this.onFullScreenChange;
        document.onkeydown = this.onKeydown;

        // Send heartbeat to the server
        this.heartbeat = window.setInterval(() => {
            window.fetch(serverPath + '/ping');
        }, 10 * 60 * 1000);

        const canAutoplay = await testAutoplay();
        this.setState({ isAutoPlayable: canAutoplay });
        // console.log("reached before load youtube")
        this.loadYouTube();
        this.init();
    }

    componentWillUnmount() {
        document.removeEventListener(
            'fullscreenchange',
            this.onFullScreenChange
        );
        document.removeEventListener('keydown', this.onKeydown);
        window.clearInterval(this.heartbeat);
    }

    init = async () => {
        let roomId = this.props.urlRoomId;
        let isPrivate = false;
        // if a vanity name, resolve the url to a room id
        try {
            const res = await axios.get(serverPath + '/checkRoom/' + roomId);
            console.log('checkRoom', res.data);
            if (res.data.roomId) {
                roomId = res.data.roomId as string;
                isPrivate = res.data.isPrivate as boolean;
            } else {
                this.setState({ overlayMsg: "Couldn't load this room." });
                return;
            }
        } catch (e) {
            console.error(e);
            this.setState({ overlayMsg: "Couldn't load this room." });
            return;
        }
        this.setState({ roomId, isPrivate }, () => {
            this.join(roomId as string);
        });
    };

    join = async (roomId: string) => {
        const passcode = getSavedPasscode(roomId);
        const socket = io(ioPath + roomId, {
            transports: ['websocket'],
            query: {
                clientId: getAndSaveClientId(),
                passcode,
            },
        });
        this.socket = socket;
        socket.on('connect', async () => {
            console.log('client connected');
            this.setState({
                state: 'connected',
                overlayMsg: '',
                errorMessage: '',
                successMessage: '',
                warningMessage: '',
            });
            // Load username from localstorage
            let userName =
                window.localStorage.getItem('watchit_username') || '';
            if (userName !== '') {
                this.setState({ isNameSet: true });
                toast.success('Joined room!');
            } else {
                this.setState({ isNameSet: false });
            }
            console.log('username', userName);
            console.log('isNameSet', this.state.isNameSet);
            this.updateName(null, { value: userName });
        });
        socket.on('connect_error', (err: any) => {
            console.error(err);
            if (err.message === 'Invalid namespace') {
                this.setState({ overlayMsg: "Couldn't load this room." });
            } else if (err.message === 'not authorized') {
                toast.error('No password or wrong password');
                this.setState({ isErrorAuth: true });
            }
        });
        socket.on('disconnect', reason => {
            if (reason === 'io server disconnect') {
                // the disconnection was initiated by the server, you need to reconnect manually
                this.setState({ overlayMsg: 'Disconnected from server.' });
            } else {
                // else the socket will automatically try to reconnect
                // Use the alert pill since it's less disruptive
                this.setState({ warningMessage: 'Reconnecting...' });
            }
        });
        socket.on('REC:play', () => {
            this.localPlay();
        });
        socket.on('REC:pause', () => {
            this.localPause();
        });
        socket.on('REC:seek', (data: number) => {
            this.localSeek(data);
        });
        socket.on('REC:host', async (data: HostState) => {
            let currentMedia = data.video || '';
            this.setState(
                {
                    roomMedia: currentMedia,
                    roomPaused: data.paused,
                    loading: Boolean(data.video),
                },
                async () => {
                    const leftVideo = this.HTMLInterface.getVideoEl();

                    // Stop all players
                    // Unless the user is sharing a file, because we play it in leftVideo and capture stream
                    this.HTMLInterface.pauseVideo();

                    this.YouTubeInterface.stopVideo();

                    this.Player().clearState();

                    if (
                        this.usingYoutube() &&
                        !this.YouTubeInterface.isReady()
                    ) {
                        console.log(
                            'YT player not ready, onReady callback will retry when it is'
                        );
                        return;
                    }
                    const src = data.video;
                    const time = data.videoTS;
                    await this.Player().setSrcAndTime(src, time);
                    // Start this video
                    if (!data.paused) {
                        this.localPlay();
                    }
                    // One time, when we're ready to play
                    leftVideo?.addEventListener(
                        'canplay',
                        () => {
                            this.setLoadingFalse();
                            this.localSeek(undefined);
                        },
                        { once: true }
                    );

                    // Progress updater
                    window.clearInterval(this.progressUpdater);
                }
            );
        });
        socket.on('REC:chatMsg', (data: ChatMessage) => {
            console.log(data);
            this.state.chat.push(data);
            this.setState({
                chat: this.state.chat,
                scrollTimestamp: Number(new Date()),
            });
        });
        socket.on('REC:leaderTime', (data: number) => {
            this.setState({ leaderTime: data });
        });
        socket.on('roster', (data: User[]) => {
            this.setState({
                participants: data,
            });
        });
        socket.on('REC:chatinit', (data: ChatMessage[]) => {
            this.setState({ chat: data, scrollTimestamp: Number(new Date()) });
        });
        window.setInterval(() => {
            if (this.state.roomMedia) {
                this.socket.emit('CMD:ts', this.Player().getCurrentTime());
            }
        }, 1000);
    };

    loadYouTube = () => {
        // This code loads the IFrame Player API code asynchronously.
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.append(tag);
        window.onYouTubeIframeAPIReady = () => {
            // Note: this fails silently if the element is not available
            const ytPlayer = new window.YT.Player('leftYt', {
                events: {
                    onReady: () => {
                        console.log('yt onReady');
                        this.YouTubeInterface = new YouTube(ytPlayer);
                        this.setState({ loading: false });
                        // We might have failed to play YT originally, ask for the current video again
                        if (this.usingYoutube()) {
                            console.log(
                                'requesting host data again after ytReady'
                            );
                            this.socket.emit('CMD:askHost');
                        }
                    },
                    onStateChange: (e: any) => {
                        if (
                            this.usingYoutube() &&
                            e.data === window.YT?.PlayerState?.CUED
                        ) {
                            this.setState({ loading: false });
                        }
                        if (
                            this.usingYoutube() &&
                            e.data === window.YT?.PlayerState?.ENDED
                        ) {
                            this.onVideoEnded();
                        }
                        if (
                            this.ytDebounce &&
                            ((e.data === window.YT?.PlayerState?.PLAYING &&
                                this.state.roomPaused) ||
                                (e.data === window.YT?.PlayerState?.PAUSED &&
                                    !this.state.roomPaused))
                        ) {
                            this.ytDebounce = false;
                            if (e.data === window.YT?.PlayerState?.PLAYING) {
                                this.socket.emit('CMD:play');
                                this.localPlay();
                            } else {
                                this.socket.emit('CMD:pause');
                                this.localPause();
                            }
                            window.setTimeout(
                                () => (this.ytDebounce = true),
                                500
                            );
                        }
                    },
                },
            });
        };
    };

    setInviteLink = (inviteLink: string) => {
        this.setState({ inviteLink });
    };

    usingYoutube = () => {
        return isYouTube(this.state.roomMedia);
    };

    usingNative = () => {
        // Anything that uses HTML Video (e.g. not YouTube, Vimeo, or other embedded JS player)
        return !this.usingYoutube();
    };

    localSeek = (customTime?: number) => {
        // Jump to the leader's position, or a custom one
        let target = customTime ?? this.state.leaderTime;
        if (target >= 0 && target < Infinity) {
            console.log('syncing self to leader or custom:', target);
            this.Player().seekVideo(target);
        }
    };

    localPlay = async () => {
        if (!this.state.roomMedia) {
            return;
        }
        const canAutoplay = this.state.isAutoPlayable || (await testAutoplay());
        this.setState(
            { roomPaused: false, isAutoPlayable: canAutoplay },
            async () => {
                if (
                    !this.state.isAutoPlayable ||
                    (this.localStreamToPublish && !this.isLocalStreamAFile)
                ) {
                    console.log(
                        'auto-muting to allow autoplay or screenshare host'
                    );
                    this.localSetMute(true);
                } else {
                    this.localSetMute(false);
                }
                try {
                    await this.Player().playVideo();
                } catch (e: any) {
                    console.warn(e, e.name);
                }
            }
        );
    };

    localPause = () => {
        this.setState({ roomPaused: true }, async () => {
            this.Player().pauseVideo();
        });
    };

    localSetMute = (muted: boolean) => {
        this.Player().setMute(muted);
        this.refreshControls();
    };

    localSetVolume = (volume: number) => {
        this.Player().setVolume(volume);
        this.refreshControls();
    };

    roomSetPlaybackRate = (rate: number) => {
        // emit an event to the server
        this.socket.emit('CMD:playbackRate', rate);
    };

    roomSetLoop = (loop: boolean) => {
        this.socket.emit('CMD:loop', loop);
    };

    roomTogglePlay = () => {
        const shouldPlay = this.Player().shouldPlay();
        if (shouldPlay) {
            this.socket.emit('CMD:play');
            this.localPlay();
        } else {
            this.socket.emit('CMD:pause');
            this.localPause();
        }
    };

    roomSeek = (e: any, time: number) => {
        let target = time;
        // Read the time from the click event if it exists
        if (e) {
            const rect = e.target.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const max = rect.width;
            target = (x / max) * this.Player().getDuration();
        }
        target = Math.max(target, 0);
        this.Player().seekVideo(target);
        const hlsTarget =
            Math.floor(Date.now() / 1000) -
            this.HTMLInterface.getDuration() +
            target;
        this.socket.emit('CMD:seek', target);
    };

    onFullScreenChange = () => {
        this.setState({ fullScreen: Boolean(document.fullscreenElement) });
    };

    onKeydown = (e: any) => {
        if (
            !document.activeElement ||
            document.activeElement.tagName === 'BODY'
        ) {
            console.log('key pressed', e);
            if (e.key === ' ') {
                e.preventDefault();
                this.roomTogglePlay();
            } else if (e.key === 'ArrowRight') {
                this.roomSeek(null, this.Player().getCurrentTime() + 15);
            } else if (e.key === 'ArrowLeft') {
                this.roomSeek(null, this.Player().getCurrentTime() - 15);
            } else if (e.key === 't') {
                this.localFullScreen(false);
            } else if (e.key === 'f') {
                this.localFullScreen(true);
            } else if (e.key === 'm') {
                this.localToggleMute();
            }
        }
    };

    localFullScreen = async (bVideoOnly: boolean) => {
        let container = document.getElementById(
            'theaterContainer'
        ) as HTMLElement;
        if (bVideoOnly) {
            container = document.getElementById(
                'leftVideoParent'
            ) as HTMLElement;
        }
        if (
            !container.requestFullscreen &&
            (container as any).webkitEnterFullScreen
        ) {
            // e.g. iPhone doesn't allow requestFullscreen
            (container as any).webkitEnterFullscreen();
            return;
        }
        if (!document.fullscreenElement) {
            await container.requestFullscreen();
            return;
        }
        const bChangeElements = document.fullscreenElement !== container;
        await document.exitFullscreen();
        if (bChangeElements) {
            await container.requestFullscreen();
        }
    };

    localToggleMute = () => {
        this.localSetMute(!this.Player().isMuted());
    };

    roomSetMedia = (data: DropdownProps) => {
        console.log('data in set func:', data);
        this.socket.emit('CMD:host', data.value);
    };

    roomPlaylistAdd = (_e: any, data: DropdownProps) => {
        this.socket.emit('CMD:playlistAdd', data.value);
    };

    roomPlaylistMove = (index: number, toIndex: number) => {
        this.socket.emit('CMD:playlistMove', { index, toIndex });
    };

    roomPlaylistDelete = (index: number) => {
        this.socket.emit('CMD:playlistDelete', index);
    };

    updateName = (_e: any, data: { value: string }) => {
        console.log(data.value);
        this.setState({ myName: data.value });
        this.socket.emit('CMD:name', data.value);
        window.localStorage.setItem('watchit_username', data.value);
    };

    setLoadingFalse = () => {
        this.setState({ loading: false });
    };

    onVideoEnded = () => {
        this.localPause();
        // check if looping is on, if so set time back to 0 and restart
        // Play next fileIndex
    };

    refreshControls = () => {
        this.setState({ controlsTimestamp: Number(new Date()) });
    };

    render() {
        // console.log(this.roomSetMedia)
        const sharer = this.state.participants.find(p => p.isScreenShare);
        const controls = (
            <Controls
                key={this.state.controlsTimestamp}
                paused={this.state.roomPaused}
                currentTime={this.Player().getCurrentTime()}
                duration={this.Player().getDuration()}
                roomTogglePlay={this.roomTogglePlay}
                roomSeek={this.roomSeek}
            />
        );
        const displayRightContent = this.state.showRightBar;
        const rightBar = (
            <Grid.Column
                width={displayRightContent ? 4 : 1}
                style={{ display: 'flex', flexDirection: 'column' }}
                className={`${
                    this.state.fullScreen
                        ? styles.fullHeightColumnFullscreen
                        : styles.fullHeightColumn
                }`}
            >
                <p style={{ marginLeft: '1.3em', color: 'white' }}>
                    Nickname: {this.state.myName}
                </p>
                <Chat
                    chat={this.state.chat}
                    socket={this.socket}
                    scrollTimestamp={this.state.scrollTimestamp}
                    hide={!displayRightContent}
                    ref={this.chatRef}
                />
                {this.state.state === 'connected'}
            </Grid.Column>
        );
        return (
            <React.Fragment>
                {this.state.overlayMsg && (
                    <ErrorModal error={this.state.overlayMsg} />
                )}
                {(this.state.isErrorAuth || !this.state.isNameSet) && (
                    <NamePasscodeModal
                        roomId={this.state.roomId}
                        isPrivate={this.state.isPrivate}
                    />
                )}
                {this.state.errorMessage && (
                    <Message
                        negative
                        header="Error"
                        content={this.state.errorMessage}
                        style={{
                            position: 'fixed',
                            bottom: '10px',
                            right: '10px',
                            zIndex: 1000,
                        }}
                    ></Message>
                )}
                {this.state.successMessage && (
                    <Message
                        positive
                        header="Success"
                        content={this.state.successMessage}
                        style={{
                            position: 'fixed',
                            bottom: '10px',
                            right: '10px',
                            zIndex: 1000,
                        }}
                    ></Message>
                )}
                {this.state.warningMessage && (
                    <Message
                        warning
                        // header={this.state.warningMessage}
                        content={this.state.warningMessage}
                        style={{
                            position: 'fixed',
                            top: '10px',
                            left: '50%',
                            transform: 'translate(-50%, 0)',
                            zIndex: 1000,
                        }}
                    ></Message>
                )}
                <TopBar showInviteButton />
                {
                    <Grid stackable celled="internally">
                        <Grid.Row id="theaterContainer">
                            <Grid.Column
                                width={this.state.showRightBar ? 12 : 15}
                                className={
                                    this.state.fullScreen
                                        ? styles.fullHeightColumnFullscreen
                                        : styles.fullHeightColumn
                                }
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: '100%',
                                    }}
                                >
                                    {!this.state.fullScreen && (
                                        <React.Fragment>
                                            <ComboBox
                                                roomSetMedia={this.roomSetMedia}
                                                roomMedia={this.state.roomMedia}
                                                streamPath={
                                                    this.props.streamPath
                                                }
                                            />
                                            <Separator />
                                            <div
                                                className={styles.mobileStack}
                                                style={{
                                                    display: 'flex',
                                                    gap: '4px',
                                                }}
                                            ></div>
                                            <Separator />
                                        </React.Fragment>
                                    )}
                                    <div style={{ flexGrow: 1 }}>
                                        <div className={styles.playerContainer}>
                                            <iframe
                                                style={{
                                                    display:
                                                        this.usingYoutube() &&
                                                        !this.state.loading
                                                            ? 'block'
                                                            : 'none',
                                                }}
                                                title="YouTube"
                                                id="leftYt"
                                                className={styles.videoContent}
                                                allowFullScreen
                                                frameBorder="0"
                                                allow="autoplay"
                                                src="https://www.youtube.com/embed/?enablejsapi=1&controls=0&rel=0"
                                            />
                                        </div>
                                    </div>
                                    {this.state.roomMedia && controls}
                                </div>
                            </Grid.Column>
                            {rightBar}
                        </Grid.Row>
                    </Grid>
                }
            </React.Fragment>
        );
    }
}

export const Separator = () => <div style={{ height: '4px', flexShrink: 0 }} />;
