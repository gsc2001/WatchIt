import React, { RefObject, useState } from 'react';
import { Comment, Divider, Form, Input } from 'semantic-ui-react';
import { init } from 'emoji-mart';
import styles from './Chat.module.css';

import {
    formatTimestamp,
    isEmojiString,
} from '../../utils';
import { Socket } from 'socket.io-client';
import classes from './Chat.module.css';

interface ChatProps {
    chat: ChatMessage[];
    pictureMap: StringDict;
    socket: Socket;
    scrollTimestamp: number;
    className?: string;
    hide?: boolean;
    ref: RefObject<Chat>;
}

const avatarArray = [
    'https://react.semantic-ui.com/images/avatar/small/matt.jpg',
    'https://react.semantic-ui.com/images/avatar/small/elliot.jpg',
    'https://react.semantic-ui.com/images/avatar/small/jenny.jpg',
    'https://react.semantic-ui.com/images/avatar/small/joe.jpg',
    'https://react.semantic-ui.com/images/avatar/small/justen.jpg',
    'https://react.semantic-ui.com/images/avatar/small/laura.jpg',
    'https://react.semantic-ui.com/images/avatar/small/lena.jpg',
    'https://react.semantic-ui.com/images/avatar/small/lindsay.jpg',
    'https://react.semantic-ui.com/images/avatar/small/mark.jpg',
    'https://react.semantic-ui.com/images/avatar/small/matthew.png',
    'https://react.semantic-ui.com/images/avatar/small/molly.png',
    'https://react.semantic-ui.com/images/avatar/small/nan.jpg',
    'https://react.semantic-ui.com/images/avatar/small/steve.jpg',
    'https://react.semantic-ui.com/images/avatar/small/stevie.jpg',
    'https://react.semantic-ui.com/images/avatar/small/veronika.jpg',
    'https://react.semantic-ui.com/images/avatar/small/zoe.jpg',
    'https://react.semantic-ui.com/images/avatar/small/ade.jpg',
    'https://react.semantic-ui.com/images/avatar/small/christian.jpg',
    'https://react.semantic-ui.com/images/avatar/small/daniel.jpg',
    'https://react.semantic-ui.com/images/avatar/small/helen.jpg',
    'https://react.semantic-ui.com/images/avatar/small/justen.jpg',
    'https://react.semantic-ui.com/images/avatar/small/kristy.jpg',
]

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
        console.log(this.props.chat);
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
            return `${msg} joined the room`;
        } else if (cmd == 'left') {
            return `${msg} left the room`; 
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
                    borderRadius: "2%",
                    // backgroundImage: 'linear-gradient( 0deg, rgb(0, 2, 5) 0%, rgb(136, 136, 136) 100%)',
                }}
            >
                <div
                    className={styles.chatContainer}
                    ref={this.messagesRef}
                    style={{ position: 'relative', paddingTop: 13 }}
                >
                    <Comment.Group>
                        {this.props.chat.map((msg, idx) => (
                            <ChatMessage
                                key={idx}
                                message={msg}
                                pictureMap={this.props.pictureMap}
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
    formatMessage,
}: {
    message: ChatMessage;
    pictureMap: StringDict;
    formatMessage: (cmd: string, msg: string) => React.ReactNode;
}) => {
    const { senderName, avatarId, timestamp, cmd, msg } = message;
    console.log('avatarId', avatarId)
    return (
        <Comment className={`${classes.comment}`}>
            <div style={{ display: 'flex' }}>
                <Comment.Avatar
                    src={`${avatarArray[avatarId % avatarArray.length]}`}
                    style={{
                        marginRight: '1em',
                        width: '3em',
                        height: '3em',
                        marginLeft: '1em',
                        borderRadius: '50px'
                    }}
                />
                <div style={{flex: 1}}>
                    <div style={{ display: 'flex' , marginRight: '2rem', justifyContent: 'space-between'}}>
                        <Comment.Author className={styles.light}>{senderName}</Comment.Author>
                        <Comment.Metadata className={styles.light}>
                            <div title={new Date(timestamp).toLocaleDateString()}>
                                {new Date(timestamp).toLocaleTimeString()}
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
