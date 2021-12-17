import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',
      maxHeight: 400,
      width: 508,
      background: '#FFFFFF',
      borderRadius: 10,
      padding: 40,
      boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',

      '& .MuiFormHelperText-contained': {
        marginLeft: 0,
        marginRight: 0,
      },
    },
    action: {
      marginTop: 80,
    },
  }),
);