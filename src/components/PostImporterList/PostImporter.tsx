import React, {useEffect, useState} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {useDispatch, useSelector} from 'react-redux';

import Link from 'next/link';

import {List, ListItem, ListItemText, Typography} from '@material-ui/core';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import {Avatar, AvatarSize} from '../atoms/Avatar';
import {Loading} from '../atoms/Loading';
import {Modal} from '../atoms/Modal';
import {useStyles} from './PostImporter.styles';

import {Post} from 'src/interfaces/post';
import {RootState} from 'src/reducers';
import {fetchImporter} from 'src/reducers/importers/actions';
import {ImporterState} from 'src/reducers/importers/reducer';

type Props = {
  open: boolean;
  post: Post | null;
  onClose: () => void;
};

export const PostImporter: React.FC<Props> = props => {
  const {post, open, onClose} = props;
  const styles = useStyles();
  const dispatch = useDispatch();

  const {
    importers,
    loading,
    meta: {totalItemCount: totalImporter, currentPage},
  } = useSelector<RootState, ImporterState>(state => state.importersState);
  const [importer, setImporter] = useState<string | undefined>(undefined);
  const hasMore = importers.length < totalImporter;

  const onHover = (userId: string | undefined) => () => setImporter(userId);
  const onLoadNextPage = () => {
    if (post) {
      if (post.importers?.length === 0) {
        dispatch(fetchImporter(post.originPostId, post.platform, ''));
      } else {
        dispatch(fetchImporter(post.originPostId, post.platform, post.createdBy));
      }
    }
  };

  useEffect(() => {
    if (post) {
      if (post.importers?.length === 0) {
        dispatch(fetchImporter(post.originPostId, post.platform, '', currentPage + 1));
      } else {
        dispatch(fetchImporter(post.originPostId, post.platform, post.createdBy, currentPage + 1));
      }
    }
  }, [dispatch, post]);

  return (
    <Modal
      title="Who else imported this post?"
      align="left"
      open={open}
      onClose={onClose}
      subtitle={`${
        !post
          ? 0
          : !post.importers
          ? 0
          : post.importers.length === 0
          ? post.totalImporter
          : post.totalImporter - 1
      } users imported this post`}
      className={styles.root}
      gutter="custom">
      {loading ? (
        <Loading />
      ) : (
        <List style={{padding: 0}}>
          <InfiniteScroll
            scrollableTarget="scrollable-timeline"
            dataLength={importers.length}
            hasMore={hasMore}
            next={onLoadNextPage}
            loader={<Loading />}>
            {importers
              .filter(ar => Boolean(ar.deletedAt) === false)
              .map(e => {
                return (
                  <Link key={e.id} href={'/profile/[id]'} as={`/profile/${e.id}`} passHref>
                    <a style={{cursor: 'pointer', textDecoration: 'none'}}>
                      <ListItem
                        style={{
                          background: importer === e.id ? 'rgba(255, 200, 87, 0.2)' : '#FFF',
                          padding: '8px 30px',
                        }}
                        onClick={onClose}
                        onMouseEnter={onHover(e.id)}
                        onMouseLeave={onHover(undefined)}>
                        <ListItemAvatar>
                          <Avatar
                            name={e.name}
                            src={e.profilePictureURL}
                            size={AvatarSize.MEDIUM}
                          />
                        </ListItemAvatar>
                        <ListItemText>
                          <Typography className={styles.name} component="span" color="textPrimary">
                            {e.name}
                          </Typography>
                        </ListItemText>
                      </ListItem>
                    </a>
                  </Link>
                );
              })}
          </InfiniteScroll>
        </List>
      )}
    </Modal>
  );
};
