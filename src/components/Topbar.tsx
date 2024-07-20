import * as React from 'react';
import { DevicesProvider, WithEditor } from '@grapesjs/react';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { cx } from './common';
import TopbarButtons from './TopbarButtons';
import { ModalProvider, useModal } from './ModalContext';
import DeployModal from './DeployModal';

export default function Topbar({ className }) {
  return (
    <div className={cx('gjs-top-sidebar flex items-center p-1', className)}>
      <DevicesProvider>
        {({ selected, select, devices }) => (
          <FormControl size="small">
            <Select value={selected} onChange={(ev) => select(ev.target.value)}>
              {devices.map((device) => (
                <MenuItem value={device.id} key={device.id}>
                  {device.getName()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </DevicesProvider>
      <WithEditor>
        <ModalProvider>
          <TopbarContent className="ml-auto px-2" />
        </ModalProvider>
      </WithEditor>
    </div>
  );
}

function TopbarContent({ className }) {
  const { isModalOpen, setIsModalOpen } = useModal();

  const handleDeploy = async ({ repoOwner, repoName, branch, token }) => {
    console.log('Deploying with the following details:', {
      repoOwner,
      repoName,
      branch,
      token
    });
  
    const deploymentEndpoint = `https://api.github.com/repos/${repoOwner}/${repoName}/pages`;
  
    const headers = {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    };
  
    try {
      // Make a request to GitHub API to create or update the GitHub Pages deployment
      const response = await fetch(deploymentEndpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          // Example payload - adjust based on the GitHub API endpoint requirements
          "branch": branch
        })
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log('Deployment response:', result);
      alert('Deployment successful!');
    } catch (error) {
      console.error('Deployment failed:', error);
      alert(error);
    }
  };
  

  return (
    <>
      <TopbarButtons className={className} onDeployClick={() => setIsModalOpen(true)} />
      <DeployModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDeploy={handleDeploy}
      />
    </>
  );
}
