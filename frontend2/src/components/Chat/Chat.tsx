import React, { RefObject } from 'react';
import { Button, Comment, Form, Icon, Input, Popup } from 'semantic-ui-react';
// import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { init } from 'emoji-mart';
// import onClickOutside from 'react-onclickoutside';
//@ts-ignore
import Linkify from 'react-linkify';
import { SecureLink } from 'react-secure-link';
import styles from './Chat.module.css';

import {
    formatTimestamp,
    formatUnixTime,
    getColorForStringHex,
    getDefaultPicture,
    isEmojiString,
} from '../../utils';
import { Separator } from '../App/App';
import { Socket } from 'socket.io-client';
import classes from './Chat.module.css';
import {
    CSSTransition,
    SwitchTransition,
    TransitionGroup,
} from 'react-transition-group';

interface ChatProps {
    chat: ChatMessage[];
    nameMap: StringDict;
    pictureMap: StringDict;
    socket: Socket;
    scrollTimestamp: number;
    className?: string;
    getMediaDisplayName: (input: string) => string;
    hide?: boolean;
    isChatDisabled?: boolean;
    ref: RefObject<Chat>;
}

export class Chat extends React.Component<ChatProps> {
    public state = {
        chatMsg: '',
        isNearBottom: true,
        isPickerOpen: false,
        reactionMenu: {
            isOpen: false,
            selectedMsgId: '',
            selectedMsgTimestamp: '',
            yPosition: 0,
            xPosition: 0,
        },
    };
    messagesRef = React.createRef<HTMLDivElement>();

    async componentDidMount() {
        this.scrollToBottom();
        this.messagesRef.current?.addEventListener('scroll', this.onScroll);
        init({});
    }

    componentDidUpdate(prevProps: ChatProps) {
        if (this.props.scrollTimestamp !== prevProps.scrollTimestamp) {
            if (prevProps.scrollTimestamp === 0 || this.state.isNearBottom) {
                this.scrollToBottom();
            }
        }
        if (this.props.hide !== prevProps.hide) {
            this.scrollToBottom();
        }
    }

    updateChatMsg = (_e: any, data: { value: string }) => {
        // console.log(e.target.selectionStart);
        this.setState({ chatMsg: data.value });
    };

    sendChatMsg = () => {
        if (!this.state.chatMsg) {
            return;
        }
        if (this.chatTooLong()) {
            return;
        }
        this.props.socket.emit('CMD:chat', this.state.chatMsg);
        this.setState({ chatMsg: '' });
    };

    chatTooLong = () => {
        return Boolean(this.state.chatMsg?.length > 10000);
    };

    onScroll = () => {
        this.setState({ isNearBottom: this.isChatNearBottom() });
    };

    isChatNearBottom = () => {
        return (
            this.messagesRef.current &&
            this.messagesRef.current.scrollHeight -
                this.messagesRef.current.scrollTop -
                this.messagesRef.current.offsetHeight <
                100
        );
    };

    scrollToBottom = () => {
        if (this.messagesRef.current) {
            this.messagesRef.current.scrollTop =
                this.messagesRef.current.scrollHeight;
        }
    };

    formatMessage = (cmd: string, msg: string): React.ReactNode | string => {
        if (cmd === 'host') {
            return (
                <React.Fragment>
                    {`changed the video to `}
                    <span style={{ textTransform: 'initial' }}>
                        {this.props.getMediaDisplayName(msg)}
                    </span>
                </React.Fragment>
            );
        } else if (cmd === 'playlistAdd') {
            return (
                <React.Fragment>
                    {`added to the playlist: `}
                    <span style={{ textTransform: 'initial' }}>
                        {this.props.getMediaDisplayName(msg)}
                    </span>
                </React.Fragment>
            );
        } else if (cmd === 'seek') {
            return `jumped to ${formatTimestamp(msg)}`;
        } else if (cmd === 'play') {
            return `started the video at ${formatTimestamp(msg)}`;
        } else if (cmd === 'pause') {
            return `paused the video at ${formatTimestamp(msg)}`;
        } else if (cmd === 'playbackRate') {
            return `set the playback rate to ${
                msg === '0' ? 'auto' : `${msg}x`
            }`;
        } else if (cmd === 'lock') {
            return `locked the room`;
        } else if (cmd === 'unlock') {
            return 'unlocked the room';
        }
        return cmd;
    };

    addEmoji = (emoji: any) => {
        this.setState({ chatMsg: this.state.chatMsg + emoji.native });
    };

    render() {
        return (
            <div
                className={this.props.className}
                style={{
                    display: this.props.hide ? 'none' : 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    minHeight: 0,
                    marginTop: 0,
                    marginBottom: 0,
                    padding: '8px',
                }}
            >
                <div
                    className={styles.chatContainer}
                    ref={this.messagesRef}
                    style={{ position: 'relative', paddingTop: 13 }}
                >
                    <Comment.Group>
                        {this.props.chat.map(msg => (
                            <ChatMessage
                                key={msg.timestamp + msg.id}
                                className={
                                    msg.id ===
                                        this.state.reactionMenu.selectedMsgId &&
                                    msg.timestamp ===
                                        this.state.reactionMenu
                                            .selectedMsgTimestamp
                                        ? classes.selected
                                        : ''
                                }
                                message={msg}
                                pictureMap={this.props.pictureMap}
                                nameMap={this.props.nameMap}
                                formatMessage={this.formatMessage}
                                socket={this.props.socket}
                                isChatDisabled={this.props.isChatDisabled}
                            />
                        ))}
                        {/* <div ref={this.messagesEndRef} /> */}
                    </Comment.Group>
                    {!this.state.isNearBottom && (
                        <Button
                            size="tiny"
                            onClick={this.scrollToBottom}
                            style={{
                                position: 'sticky',
                                bottom: 0,
                                display: 'block',
                                margin: '0 auto',
                            }}
                        >
                            Jump to bottom
                        </Button>
                    )}
                </div>
                <Separator />
                {this.state.isPickerOpen && (
                    <div style={{ position: 'absolute', bottom: '60px' }}>
                        <Picker
                            theme="dark"
                            previewPosition="none"
                            maxFrequentRows={1}
                            onEmojiSelect={this.addEmoji}
                            onClickOutside={() =>
                                this.setState({ isPickerOpen: false })
                            }
                        />
                    </div>
                )}
                <CSSTransition
                    in={this.state.reactionMenu.isOpen}
                    timeout={300}
                    classNames={{
                        enter: classes['reactionMenu-enter'],
                        enterActive: classes['reactionMenu-enter-active'],
                        exit: classes['reactionMenu-exit'],
                        exitActive: classes['reactionMenu-exit-active'],
                    }}
                    unmountOnExit
                >
                    <div
                        style={{
                            position: 'fixed',
                            top: Math.min(
                                this.state.reactionMenu.yPosition - 150,
                                window.innerHeight - 450
                            ),
                            left: this.state.reactionMenu.xPosition - 240,
                        }}
                    >
                        <Picker
                            theme="dark"
                            previewPosition="none"
                            maxFrequentRows={1}
                            perLine={6}
                        />
                    </div>
                </CSSTransition>
                <Form autoComplete="off">
                    <Input
                        inverted
                        fluid
                        onKeyPress={(e: any) =>
                            e.key === 'Enter' && this.sendChatMsg()
                        }
                        onChange={this.updateChatMsg}
                        value={this.state.chatMsg}
                        error={this.chatTooLong()}
                        icon
                        disabled={this.props.isChatDisabled}
                        placeholder={
                            this.props.isChatDisabled
                                ? 'The chat was disabled by the room owner.'
                                : 'Enter a message...'
                        }
                    >
                        <input />
                        <Icon
                            // style={{ right: '40px' }}
                            onClick={() => {
                                // Add a delay to prevent the click from triggering onClickOutside
                                const curr = this.state.isPickerOpen;
                                setTimeout(
                                    () =>
                                        this.setState({ isPickerOpen: !curr }),
                                    100
                                );
                            }}
                            name={undefined}
                            inverted
                            circular
                            link
                            disabled={this.props.isChatDisabled}
                            style={{ opacity: 1 }}
                        >
                            <span role="img" aria-label="Emoji">
                                😀
                            </span>
                        </Icon>
                        {/* <Icon onClick={this.sendChatMsg} name="send" inverted circular link /> */}
                    </Input>
                </Form>
            </div>
        );
    }
}

const ChatMessage = ({
    message,
    nameMap,
    pictureMap,
    formatMessage,
    socket,
    isChatDisabled,
    className,
}: {
    message: ChatMessage;
    nameMap: StringDict;
    pictureMap: StringDict;
    formatMessage: (cmd: string, msg: string) => React.ReactNode;
    socket: Socket;
    isChatDisabled: boolean | undefined;
    className: string;
}) => {
    const { id, timestamp, cmd, msg, system, isSub, reactions, videoTS } =
        message;
    const spellFull = 5; // the number of people whose names should be written out in full in the reaction popup
    return (
        <Comment className={`${classes.comment} ${className}`}>
            {id ? (
                <Popup
                    content="WatchParty Plus subscriber"
                    disabled={!isSub}
                    trigger={
                        <Comment.Avatar
                            className={isSub ? classes.subscriber : ''}
                            src={
                                pictureMap[id] ||
                                getDefaultPicture(
                                    nameMap[id],
                                    getColorForStringHex(id)
                                )
                            }
                        />
                    }
                />
            ) : null}
            <Comment.Content>
                <Comment.Metadata className={styles.dark}>
                    <div title={new Date(timestamp).toLocaleDateString()}>
                        {new Date(timestamp).toLocaleTimeString()}
                        {Boolean(videoTS) && ' @ '}
                        {formatTimestamp(videoTS)}
                    </div>
                </Comment.Metadata>
                <Comment.Text className={styles.light + ' ' + styles.system}>
                    {cmd && formatMessage(cmd, msg)}
                </Comment.Text>
                <Comment.Text
                        className={`${styles.light} ${
                            isEmojiString(msg) ? styles.emoji : ''
                        }`}
                    >
                        {!cmd && msg}
                    </Comment.Text>
            </Comment.Content>
        </Comment>
    );
};
