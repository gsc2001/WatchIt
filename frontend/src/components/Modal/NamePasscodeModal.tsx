import { useEffect, useState } from 'react';
import { Modal, Form, Button } from 'semantic-ui-react';
import { savePasscode } from '../../utils/passcode';

export const NamePasscodeModal = ({
    roomId,
    isPrivate,
}: {
    roomId: string;
    isPrivate: boolean;
}) => {

    useEffect(() =>{
        const temp_name = window.localStorage.getItem('watchit_username')
        if (temp_name && temp_name != name){
            setName(temp_name) 
        }
    }, [])
    
    const [name, setName] = useState('')
    const [passcode, setPasscode] = useState('');

    const saveNameAndPasscode = () => {
        window.localStorage.setItem('watchit_username', name);

        if (isPrivate) {
            savePasscode(roomId, passcode);
        }
        window.location.reload();
    };

    return (
        <Modal open centered={false} size="tiny">
            <Modal.Header as="h1" style={{ textAlign: 'center' }}>
                Fill your Name
            </Modal.Header>
            <Modal.Content>
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

                    {isPrivate ? (
                        <Form.Field>
                            <Form.Input
                                type="password"
                                value={passcode}
                                onChange={e => setPasscode(e.target.value)}
                                action={{
                                    content: 'Passcode',
                                }}
                            />
                        </Form.Field>
                    ) : null}
                    <center>
                        <Button type="submit" onClick={saveNameAndPasscode}>
                            Submit
                        </Button>
                    </center>
                </Form>
            </Modal.Content>
        </Modal>
    );
};
