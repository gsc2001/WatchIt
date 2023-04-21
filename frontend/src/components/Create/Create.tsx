import React, { useRef } from 'react';
import { createRoom } from '../TopBar/TopBar';
import { Dimmer, Loader } from 'semantic-ui-react';

export const Create = () => {
  const buttonEl = useRef<HTMLButtonElement>(null);
  setTimeout(() => {
    buttonEl?.current?.click();
  }, 1000);
  return (
    <Dimmer active>
      <Loader>Creating room. . .</Loader>
      <button
        style={{ display: 'none' }}
        ref={buttonEl}
        onClick={() => {
          createRoom(
            false,
            new URLSearchParams(window.location.search).get('video') ??
              undefined
          );
        }}
      />
    </Dimmer>
  );
};
