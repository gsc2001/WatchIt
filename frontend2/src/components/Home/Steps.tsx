import * as React from 'react';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import VideoLabelIcon from '@mui/icons-material/VideoLabel';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { withStyles } from "@mui/material/styles"
import { StepIconProps } from '@mui/material/StepIcon';

const ColorlibConnector = styled(StepConnector)(() => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 38,
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundImage:
      'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 80,
  height: 80,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'space-evenly',
  alignItems: 'center',
  backgroundImage:
    'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
  boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
}));

function ColorlibStepIcon(props: StepIconProps) {

  const icons: { [index: string]: React.ReactElement } = {
    1: <AddCircleIcon fontSize='large' />,
    2: <GroupAddIcon fontSize='large'/>,
    3: <VideoLabelIcon fontSize='large' />,
    4: <ThumbUpIcon fontSize='large' />,
  };

  return (
    <ColorlibStepIconRoot >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

const WhiteTextLabel = styled(StepLabel)({
  [`& .MuiStepLabel-label`]: {color: "#FFF", fontSize: '1.3em'}
})


const steps = ['Make a room', 'Share Link', 'Pick something to watch', 'Have fun!'];

export default function CustomizedSteppers() {
  return (
    // <center></center>
      <Stepper sx={{width: "100%"}} alternativeLabel activeStep={-1} connector={<ColorlibConnector />}>
        {steps.map((label) => (
          <Step key={label}>
            <WhiteTextLabel StepIconComponent={ColorlibStepIcon}>{label}</WhiteTextLabel>
          </Step>
        ))}
      </Stepper>
  );
}