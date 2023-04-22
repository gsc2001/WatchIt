import axios from 'axios';
import { useState, useEffect } from 'react';

import {
    Icon,
    Popup,
    Button,
    SemanticSIZES,
    Modal,
    Form,
    Checkbox,
} from 'semantic-ui-react';
import { serverPath } from '../../utils';
import { savePasscode } from '../../utils/passcode';

const NewRoomModal = ({
    closeNewRoomModal,
}: {
    closeNewRoomModal: () => void;
}) => {
    const [name, setName] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [passcode, setPassCode] = useState('');

    const createRoom = async (openNewTab: boolean | undefined) => {
        localStorage.setItem('watchit_username', JSON.stringify(name));

        const roomData = {
            passcode,
        };
        console.log(roomData, name);
        try {
            const response = await axios.post(
                serverPath + '/createRoom',
                roomData
            );
            const roomId = response.data.roomId;
            savePasscode(roomId, passcode);
            if (openNewTab) {
                window.open('/watch/' + roomId);
            } else {
                window.location.assign('/watch/' + roomId);
            }
            closeNewRoomModal();
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        const name = localStorage.getItem('watchit_username');
        if (name) {
            setName(JSON.parse(name));
        }
    }, []);

    return (
        <Modal open centered={false} size="tiny" onClose={closeNewRoomModal}>
            <Modal.Header as="h3">
                <center>Create New Room</center>
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
                                content: 'Your Name',
                            }}
                        />
                    </Form.Field>

                    <Form.Field>
                        <Checkbox
                            label="Private Room"
                            onChange={(e, data) =>
                                setIsPrivate(data.checked ? true : false)
                            }
                            checked={isPrivate}
                        />
                    </Form.Field>
                    {isPrivate ? (
                        <Form.Field>
                            <Form.Input
                                type="password"
                                value={passcode}
                                onChange={e => setPassCode(e.target.value)}
                                action={{
                                    content: 'Passcode',
                                }}
                            />
                        </Form.Field>
                    ) : null}
                    <center>
                        <Button type="submit" onClick={() => createRoom(true)}>
                            Submit
                        </Button>
                    </center>
                </Form>
            </Modal.Content>
        </Modal>
    );
};

export const NewRoomButton = (props: {
    openNewTab?: Boolean;
    size?: SemanticSIZES;
}) => {
    const [newRoomModalOpen, setNewRoomModalOpen] = useState(false);

    const createRoom = async (openNewTab?: Boolean) => {
        await createRoom(openNewTab);
    };

    console.log('Newroom Button: ', props);
    return (
        <>
            {newRoomModalOpen && (
                <NewRoomModal
                    closeNewRoomModal={() => setNewRoomModalOpen(false)}
                />
            )}

            <Button
                size={props.size}
                icon
                labelPosition="left"
                onClick={() => setNewRoomModalOpen(true)}
                className={props.size ? '' : 'toolButton'}
                fluid
                style={{
                    color: 'white',
                    backgroundImage:
                        'linear-gradient( 95deg,rgb(138,35,135) 0%,rgb(233,64,87) 50%,rgb(242,113,33) 100%)',
                    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
                    borderRadius: '50px',
                }}
            >
                <Icon name="plus" />
                New Room
            </Button>
        </>
    );
};
