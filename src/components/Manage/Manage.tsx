import {DuplicateIcon} from '@heroicons/react/outline';

import React from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import {TextField, InputAdornment} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';

import {useStyles} from './manage.style';
import {useWalletList} from './use-wallet-list.hook';

import ShowIf from 'src/components/common/show-if.component';
import {useToasterSnackHook} from 'src/hooks/use-toaster-snack.hook';
import {UserWallet} from 'src/interfaces/user';

export type ManageProps = {
  currentWallet?: UserWallet;
  wallets: UserWallet[];
  onConnect: (type: string) => void;
};

export const Manage: React.FC<ManageProps> = ({wallets, onConnect}) => {
  const style = useStyles();
  const {openToasterSnack} = useToasterSnackHook();
  const {walletList} = useWalletList(wallets);

  const handleLinkCopied = () => {
    openToasterSnack({
      message: 'Wallet address copied to clipboard!',
      variant: 'success',
    });
  };

  const handleConnectWallet = (selectedWallet: string) => {
    onConnect(selectedWallet);
  };

  return (
    <>
      <div>
        {walletList.map(option => (
          <ListItem alignItems={option.isConnect ? 'flex-start' : 'center'} key={option.id}>
            <ListItemAvatar>{option.icons}</ListItemAvatar>
            <ListItemText>
              <Typography variant="h5" component="div" color="textPrimary" className={style.name}>
                {option.title}
              </Typography>
              <ShowIf condition={option.isConnect}>
                <TextField
                  id="copy-wallet-address"
                  value={option.walletId}
                  variant="outlined"
                  disabled
                  fullWidth
                  margin="none"
                  className={style.input}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <CopyToClipboard text={option.walletId} onCopy={handleLinkCopied}>
                          <IconButton aria-label="copy-post-link" style={{padding: 0}}>
                            <SvgIcon component={DuplicateIcon} color="primary" />
                          </IconButton>
                        </CopyToClipboard>
                      </InputAdornment>
                    ),
                  }}
                />
              </ShowIf>
            </ListItemText>
            <ShowIf condition={!option.isConnect}>
              <div className={style.secondaryAction}>
                <Button
                  variant="outlined"
                  size="small"
                  color="secondary"
                  onClick={() => handleConnectWallet(option.id)}>
                  Connect
                </Button>
              </div>
            </ShowIf>
          </ListItem>
        ))}
      </div>
    </>
  );
};
