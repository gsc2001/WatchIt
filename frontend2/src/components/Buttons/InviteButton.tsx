import React, { useState } from 'react';
import { Button, Icon } from 'semantic-ui-react';
import toast from 'react-hot-toast';


const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(window.location.href);
    // window.alert('Link copied to clipboard!');
    toast('Link Copied to Clipboard!')
    // setInviteLinkCopied(true);
};

export const InviteButton = () => {
    const [inviteModalOpen, setInviteModalOpen] = useState(false);

    return (
        <>
            <Button
                color="green"
                icon
                labelPosition="left"
                fluid
                className="toolButton"
                style={{ 
                    minWidth: '12em',
                    backgroundImage: 'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(138,35,135) 100%)',
                }}
                onClick={() => handleCopyInviteLink()}
            >
                <Icon name="copy" />
                Copy Link
                
            </Button>
        </>
    );
};
