import React from 'react';

import { JoinRoomButton } from '../Buttons/JoinRoomButton';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';

import { NewRoomButton } from '../Buttons';
import styles from './Home.module.css';
import CustomizedSteppers from './Steps'

export const Home = () => {
    return (
        <div>
            <div className={styles.container}>
                <Hero
                    heroText={'Youtube & Chill 😏'}
                    action={
                        <>
                        <Stack divider={<Divider color='white' orientation="vertical" flexItem />} direction="row"  sx={{ width: '100%' }} spacing={4}>

                            <div style={{ marginTop: '8px', width: '300px' }}>
                                <NewRoomButton size="huge" />
                            </div>
                            <div style={{ marginTop: '8px', width: '300px' }}>
                                <JoinRoomButton />
                            </div>
                        </Stack>
                        </>
                    }
                />

                <div
                    style={{
                        padding: '30px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'stretch',
                    }}
                >
                <CustomizedSteppers/>
                </div>
            </div>
        </div>
    );
};

export const Hero = ({
    heroText,
    action,
    color,
}: {
    heroText?: string;
    subText?: string;
    action?: React.ReactNode;
    color?: string;
}) => {
    return (
        <div
            className={`${styles.hero} ${
                color === 'green' ? styles.green : ''
            }`}
        >
            <div className={styles.heroInner}>
                <div style={{ padding: '100px', flex: '1', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                    <div style={{padding: "30px", content: "center"}} className={styles.heroText}>{heroText}</div>
                    {action}
                </div>
                <div
                    style={{
                        flex: '1 1 0',
                    }}
                >
                </div>
            </div>
        </div>
    );
};
