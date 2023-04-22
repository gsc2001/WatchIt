import React, { useState } from 'react';

import {
    Icon,
    Popup,
    Button,
    SemanticSIZES,
    Modal,
    Form,
    Checkbox,
} from 'semantic-ui-react';

const NewRoomModal = ({
    closeNewRoomModal,
}: {
    closeNewRoomModal: () => void;
}) => {
    const createRoom = async (
        openNewTab: boolean | undefined
        // video: string = ''
    ) => {
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
            window.open('/watch' + name);
        } else {
            window.location.assign('/watch' + name);
        }
    };

    const [name, setName] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);

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
                                content: 'Name',
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
                    <center>
                        <Button type="submit" onClick={() => {
                            closeNewRoomModal()
                            createRoom(true)
                        }}>
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
            <Popup
                content="Create a new room with a random URL that you can share with friends"
                trigger={
                    <Button
                        color="blue"
                        size={props.size}
                        icon
                        labelPosition="left"
                        onClick={() => setNewRoomModalOpen(true)}
                        className={props.size ? '' : 'toolButton'}
                        fluid
                    >
                        <Icon name="certificate" />
                        New Room
                    </Button>
                }
            />
        </>
    );
};
