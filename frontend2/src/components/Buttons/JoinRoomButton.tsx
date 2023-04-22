import React, { useState } from 'react';

import {
    Icon,
    Popup,
    Button,
    Modal,
    Header,
    Form,
    Input,
    Checkbox,
} from 'semantic-ui-react';

const JoinRoomModal = ({
    closeJoinRoomModal,
}: {
    closeJoinRoomModal: () => void;
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
        console.log(name, roomCode, passcode);
        console.log('Send request to join rooom!');
        closeJoinRoomModal();
    };

    const [name, setName] = useState('');
    const [roomCode, setRoomCode] = useState('');
    const [passcode, setPasscode] = useState('');
    const [passcodeToggle, setPasscodeToggle] = useState(false);

    return (
        <Modal open centered={false} size="tiny" onClose={closeJoinRoomModal}>
            <Modal.Header as="h3">
                <center>Join Room</center>
            </Modal.Header>
            <Modal.Content>
                {/* <Header as="h5">Copy and share this link:</Header> */}
                <Form>
                    <Form.Field>
                        <Form.Input
                            onChange={e => setName(e.target.value)}
                            // actionPosition="left"
                            value={name}
                            action={{
                                content: 'Name',
                            }}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Form.Input
                            // actionPosition="left"
                            onChange={e => setRoomCode(e.target.value)}
                            value={roomCode}
                            action={{
                                content: 'Room code',
                            }}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Checkbox
                            label="Private Room"
                            onChange={(e, data) =>
                                setPasscodeToggle(data.checked ? true : false)
                            }
                            checked={passcodeToggle}
                        />
                    </Form.Field>
                    {passcodeToggle ? (
                        <Form.Field>
                            <Form.Input
                                // label="Passcode"
                                value={passcode}
                                onChange={e => setPasscode(e.target.value)}
                                action={{
                                    content: 'Passcode',
                                }}
                                // actionPosition="left"
                            />
                        </Form.Field>
                    ) : null}
                    <center>
                        <Button type="submit" onClick={joinRoom}>
                            Submit
                        </Button>
                    </center>
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
                <JoinRoomModal
                    closeJoinRoomModal={() => setJoinRoomModalOpen(false)}
                />
            )}
            <Popup
                content="Join Room"
                trigger={
                    <Button
                        color="green"
                        icon
                        labelPosition="left"
                        fluid
                        size="huge"
                        style={{ minWidth: '12em' }}
                        onClick={() => setJoinRoomModalOpen(true)}
                    >
                        <Icon name="certificate" />
                        Join Room
                    </Button>
                }
            />
        </>
    );
};
