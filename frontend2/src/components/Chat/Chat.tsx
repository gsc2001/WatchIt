import React, { RefObject, useState } from 'react';
import { Comment, Divider, Form, Input } from 'semantic-ui-react';
import { init } from 'emoji-mart';
import styles from './Chat.module.css';

import {
    formatTimestamp,
    getColorForStringHex,
    getDefaultPicture,
    isEmojiString,
} from '../../utils';
import { Socket } from 'socket.io-client';
import classes from './Chat.module.css';

interface ChatProps {
    chat: ChatMessage[];
    nameMap: StringDict;
    pictureMap: StringDict;
    socket: Socket;
    scrollTimestamp: number;
    className?: string;
    hide?: boolean;
    ref: RefObject<Chat>;
}

export class Chat extends React.Component<ChatProps> {
    public state = {
        chatMsg: '',
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
            if (prevProps.scrollTimestamp === 0) {
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
        if (cmd === 'seek') {
            return `jumped to ${formatTimestamp(msg)}`;
        } else if (cmd === 'play') {
            return `started the video at ${formatTimestamp(msg)}`;
        } else if (cmd === 'pause') {
            return `paused the video at ${formatTimestamp(msg)}`;
        } else if (cmd == 'join') {
            return `${msg} joined the room`
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
                            />
                        ))}
                        {/* <div ref={this.messagesEndRef} /> */}
                    </Comment.Group>
                </div>
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
                        placeholder={'Enter a message...'}
                    >
                        <input />
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
    className,
}: {
    message: ChatMessage;
    nameMap: StringDict;
    pictureMap: StringDict;
    formatMessage: (cmd: string, msg: string) => React.ReactNode;
    className: string;
}) => {
    const { id, timestamp, cmd, msg, system, isSub, reactions, videoTS } =
        message;
    const spellFull = 5; // the number of people whose names should be written out in full in the reaction popup
    return (
        <Comment className={`${classes.comment} ${className}`}>
            <div style={{ display: 'flex' }}>
                <Comment.Avatar
                    src={`/im${7}.jpg`}
                    style={{
                        marginRight: '2em',
                        width: '4em',
                        height: '4em',
                    }}
                />
                <div style={{flex: 1}}>
                    <div style={{ display: 'flex' , marginRight: '2rem', justifyContent: 'space-between'}}>
                        <Comment.Author as="a">{id}</Comment.Author>
                        <Comment.Metadata className={styles.dark}>
                            <div
                                title={new Date(timestamp).toLocaleDateString()}
                            >
                                {new Date(timestamp).toLocaleTimeString()}
                                {Boolean(videoTS) && ' @ '}
                                {formatTimestamp(videoTS)}
                            </div>
                        </Comment.Metadata>
                    </div>
                    <Comment.Content>
                        <Comment.Text
                            className={styles.light + ' ' + styles.system}
                        >
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
                </div>
            </div>
            <Divider />
        </Comment>
    );
};
