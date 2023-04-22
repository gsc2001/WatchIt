import { useState, useEffect } from 'react';

import { Button, Modal, Form } from 'semantic-ui-react';

export const NamePopperModal = ({ closeModal }: { closeModal: () => void }) => {
    const [name, setName] = useState('');

    useEffect(() => {
        const name = localStorage.getItem('watchit_username');
        if (name) {
            setName(JSON.parse(name));
        }
    }, []);

    const AddUserInRoom = () => {
        localStorage.setItem('watchit_username', JSON.stringify(name));
    };

    if (name){
        return <></>
    }

    return (
        <Modal open centered={false} size="tiny" onClose={closeModal}>
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
                    <center>
                        <Button type="submit" onClick={() => AddUserInRoom()}>
                            Submit
                        </Button>
                    </center>
                </Form>
            </Modal.Content>
        </Modal>
    );
};
