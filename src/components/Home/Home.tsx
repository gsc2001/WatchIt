import React from 'react';
import { Divider, Header, Icon, SemanticICONS, Step } from 'semantic-ui-react';

import { NewRoomButton } from '../TopBar';
import styles from './Home.module.css';

export const Home = () => {
  return (
    <div>
      <div className={styles.container}>
        <Hero
          heroText={'Watch videos together with friends anywhere.'}
          subText={'No registration or download required.'}
          action={
            <>
              <div style={{ marginTop: '8px', width: '300px' }}>
                <NewRoomButton size="huge" />
              </div>
              <div style={{ marginTop: '8px', width: '300px' }}>
                <NewRoomButton size="huge" />
              </div>
            </>
          }
          image={'/screenshot4.png'}
        />

        <Divider horizontal />
        <div
          style={{
            padding: '30px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div className={styles.heroText}>Get started!</div>
          <div className={styles.featureSection}>
            <Step.Group style={{ margin: '8px' }}>
              <Step>
                <Icon name="certificate" />
                <Step.Content>
                  <Step.Description>Make a room</Step.Description>
                </Step.Content>
              </Step>

              <Step>
                <Icon name="group" />
                <Step.Content>
                  <Step.Description>Share link with friends</Step.Description>
                </Step.Content>
              </Step>

              <Step>
                <Icon name="film" />
                <Step.Content>
                  <Step.Description>Pick something to watch</Step.Description>
                </Step.Content>
              </Step>

              <Step>
                <Icon name="thumbs up outline" />
                <Step.Content>
                  <Step.Description>Success!</Step.Description>
                </Step.Content>
              </Step>
            </Step.Group>
          </div>
        </div>
      </div>
    </div>
  );
};

const Feature = ({
  icon,
  text,
  title,
}: {
  icon: string;
  text: string;
  title: string;
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flex: '1 1 0px',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '10px',
        minWidth: '180px',
      }}
    >
      <Icon fitted size="huge" name={icon as SemanticICONS} />
      <h4 className={styles.featureTitle}>{title}</h4>
      <div className={styles.featureText}>{text}</div>
    </div>
  );
};

export const Hero = ({
  heroText,
  subText,
  subText2,
  action,
  image,
  color,
}: {
  heroText?: string;
  subText?: string;
  subText2?: string;
  action?: React.ReactNode;
  image?: string;
  color?: string;
}) => {
  return (
    <div className={`${styles.hero} ${color === 'green' ? styles.green : ''}`}>
      <div className={styles.heroInner}>
        <div style={{ padding: '30px', flex: '1 1 0' }}>
          <div className={styles.heroText}>{heroText}</div>
          <div className={styles.subText}>{subText}</div>
          <div className={styles.subText}>{subText2}</div>
          {action}
        </div>
        <div
          style={{
            flex: '1 1 0',
          }}
        >
          <img
            alt="hero"
            style={{ width: '100%', borderRadius: '10px' }}
            src={image}
          />
        </div>
      </div>
    </div>
  );
};
