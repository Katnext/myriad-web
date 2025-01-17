import {alpha, createStyles, makeStyles, Theme} from '@material-ui/core/styles';

type FriendStyleProps = {
  type?: 'contained' | 'basic';
};

export const useStyles = makeStyles<Theme, FriendStyleProps>(theme =>
  createStyles({
    root: {
      background: 'white',
      padding: props => (props.type === 'contained' ? theme.spacing(3, 0) : theme.spacing(0)),
      borderRadius: props => (props.type === 'contained' ? '20px 20px 0px 0px' : 'unset'),
    },
    search: {
      padding: '0px 24px',
      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
    },
    list: {
      padding: '20px',
      '& .MuiListItem-button:hover': {
        backgroundColor: alpha('#FFC857', 0.15),
      },
    },
    item: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
      '& .MuiListItemText-root': {
        alignSelf: 'center',
      },
    },
    backgroundEven: {
      '&:nth-child(even)': {
        backgroundColor: '#F2F2F4',
      },
    },
    name: {
      fontSize: '16px',
      lineHeight: '20.08px',
      fontWeight: 400,
      textDecoration: 'none',
    },
    friend: {
      fontSize: '12px',
      lineHeight: '15.06px',
      fontWeight: 400,
    },
    button: {width: 'auto'},
    fill: {fill: 'none'},
    buttonText: {
      fontWeight: 600,
      fontSize: '14px',
    },
    icon: {
      color: '#FFF',
      '&:hover': {
        color: theme.palette.primary.main,
      },
    },
    error: {
      background: '#FE3636',
      color: '#FFF',
      '&:hover': {
        color: theme.palette.text.primary,
      },
    },
    option: {
      '& .hidden-button': {
        display: 'none',
      },
      '&:hover .hidden-button': {
        display: 'flex',
      },
      '&:hover': {
        background: 'rgba(255, 200, 87, 0.15)',
      },
      '&.MuiListItem-gutters': {
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3),
      },
    },
    iconbutton: {
      backgroundColor: theme.palette.primary.main,
      '&:hover': {
        backgroundColor: '#e5e5e5',
        opacity: 0.8,
      },
      width: '32px',
      height: '32px',
    },
    dropdownMenu: {
      marginBottom: theme.spacing(1.5),
    },
    danger: {
      color: theme.palette.error.main,
    },
  }),
);
