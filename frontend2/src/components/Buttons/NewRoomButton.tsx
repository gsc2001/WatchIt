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

const NewRoomModal = ({
    closeNewRoomModal,
}: {
    closeNewRoomModal: () => void;
}) => {
    const createRoom = async (
        openNewTab: boolean | undefined
        // video: string = ''
    ) => {
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
            window.open('/watch/' + roomcode);
        } else {
            window.location.assign('/watch/' + roomcode);
        }
        closeNewRoomModal();
    };

    const [name, setName] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);

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
                    backgroundImage: 'linear-gradient( 95deg,rgb(138,35,135) 0%,rgb(233,64,87) 50%,rgb(242,113,33) 100%)',
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
