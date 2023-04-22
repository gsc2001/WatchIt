import React, { useState } from 'react';

import {
    Icon,
    Popup,
    Button,
    SemanticSIZES,
    Modal,
    Header,
    Form,
    Input,
    Radio,
    Checkbox,
} from 'semantic-ui-react';

export const JoinModal = ({
    closeJoinModal,
}: {
    closeJoinModal: () => void;
}) => {
    const joinRoom = async () => {
        //   const response = await window.fetch(serverPath + '/createRoom', {
        //     method: 'POST',
        //     headers: {
        //       'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //       video,
        //     }),
        //   });
        //   const data = await response.json();
        //   const { name } = data;
        //   if (openNewTab) {
        //     window.open('/watch' + name);
        //   } else {
        //     window.location.assign('/watch' + name);
        //   }
        console.log('Send request to join rooom!');
        closeJoinModal();
    };

    const [name, setName] = useState('');
    const [roomCode, setRoomCode] = useState('');
    const [passcode, setPasscode] = useState('');
    const [passcodeToggle, setPasscodeToggle] = useState(false);

    return (
        <Modal open centered={false} size="tiny" onClose={closeJoinModal}>
            <Modal.Header as="h3">Join Room</Modal.Header>
            <Modal.Content>
                <Header as="h5">Copy and share this link:</Header>
                <Form>
                    <Form.Field>
                        <Form.Input
                            onChange={e => setName(e.target.value)}
                            value={name}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Form.Input
                            onChange={e => setRoomCode(e.target.value)}
                            value={roomCode}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Checkbox
                            label="Check this box"
                            onChange={(e, data) =>
                                setPasscodeToggle(data.checked ? true : false)
                            }
                            checked={passcodeToggle}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Input
                            onChange={e => setPasscode(e.target.value)}
                            action={{
                                labelPosition: 'left',
                                content: 'Room code',
                            }}
                        />
                    </Form.Field>
                    <Button type="submit" onClick={joinRoom}>
                        Submit
                    </Button>
                </Form>
            </Modal.Content>
        </Modal>
    );
};

export const JoinRoomButton = () => {
    const [joinRoomModalOpen, setJoinRoomModalOpen] = useState(false);

    return (
        <>
            {joinRoomModalOpen && (
                <JoinModal closeJoinModal={() => setJoinRoomModalOpen(false)} />
            )}
            <Popup
                content="Join Room"
                trigger={
                    <Button
                        color="green"
                        icon
                        labelPosition="left"
                        fluid
                        className="toolButton"
                        style={{ minWidth: '12em' }}
                        onClick={() => setJoinRoomModalOpen(true)}
                    >
                        <Icon name="certificate" />
                        Invite Friends
                    </Button>
                }
            />
        </>
    );
};
