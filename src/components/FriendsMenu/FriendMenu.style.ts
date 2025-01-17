import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minWidth: 590,
      borderRadius: 20,
      padding: 0,
      paddingBottom: 10,

      [theme.breakpoints.down('xs')]: {
        minWidth: 0,
        borderRadius: 10,
      },
    },
    title: {
      padding: 24,
      fontSize: '18px',
      fontWeight: 700,
      lineHeight: '23px',
      letterSpacing: '0em',
    },
    mobile: {
      display: 'none',
      [theme.breakpoints.down('xs')]: {
        display: 'block',
      },
    },
    tabs: {
      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
    },
    padding: {
      width: '100%',
      [theme.breakpoints.down('xs')]: {
        padding: '0px 20px',
      },
    },
  }),
);
