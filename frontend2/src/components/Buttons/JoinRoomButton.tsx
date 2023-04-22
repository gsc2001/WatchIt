import { useState, useEffect } from 'react';

import {
    Icon,
    Popup,
    Button,
    Modal,
    Form,
    Checkbox,
} from 'semantic-ui-react';

const JoinRoomModal = ({
    closeJoinRoomModal,
}: {
    closeJoinRoomModal: () => void;
}) => {
    const joinRoom = async (openNewTab: boolean) => {
        localStorage.setItem('watchit_username', JSON.stringify(name));
        const roomcode = '123-456'; // Get it from backend
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
        if (openNewTab) {
            window.open('/watch' + roomCode);
        } else {
            window.location.assign('/watch' + roomCode);
        }
        console.log(name, roomCode, passcode);
        console.log('Send request to join rooom!');
        closeJoinRoomModal();
    };

    useEffect(() => {
        const name = localStorage.getItem('watchit_username');
        if (name) {
            setName(JSON.parse(name));
        }
    }, []);

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
                        <Button type="submit" onClick={() => joinRoom(true)}>
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
                <Button
                    icon
                    labelPosition="left"
                    fluid
                    size="huge"

                    onClick={() => setJoinRoomModalOpen(true)}
                    style={{
                        color: 'white',
                        minWidth: '12em', 
                        backgroundImage: 'linear-gradient( 95deg,rgb(138,35,135) 0%,rgb(233,64,87) 50%,rgb(242,113,33) 100%)',
                        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
                        borderRadius: '50px',
                    }}
                >
                    <Icon name="play" />
                    Join Room
                </Button>
        </>
    );
};
