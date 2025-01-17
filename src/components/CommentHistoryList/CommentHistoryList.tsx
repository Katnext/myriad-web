import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import {Grid} from '@material-ui/core';

import {CommentHistory} from '../CommentHistory/CommentHistory';
import {sortOptions} from '../FriendsMenu/default';
import {DropdownMenu} from '../atoms/DropdownMenu';
import {useStyles} from './CommentHistoryList.style';

import {Loading} from 'src/components/atoms/Loading';
import {Comment} from 'src/interfaces/comment';
import {User} from 'src/interfaces/user';
import {SortType} from 'src/lib/api/interfaces/pagination-params.interface';

type CommentHistoryListProps = {
  user?: User;
  comments: Comment[];
  hasMore: boolean;
  sort: SortType;
  loadMore: () => void;
  onSort: (sort: SortType) => void;
};

export const CommentHistoryList: React.FC<CommentHistoryListProps> = props => {
  const {comments, user, hasMore, sort, loadMore, onSort} = props;

  const styles = useStyles();

  return (
    <div className={styles.root}>
      <Grid container justifyContent="flex-end">
        <DropdownMenu<SortType>
          title={'Sort by'}
          options={sortOptions}
          selected={sort}
          onChange={onSort}
        />
      </Grid>

      <InfiniteScroll
        scrollableTarget="scrollable-timeline"
        dataLength={comments.length}
        hasMore={hasMore}
        next={loadMore}
        loader={<Loading />}>
        {comments.map(comment => (
          <CommentHistory key={comment.id} comment={comment} user={user} />
        ))}
      </InfiniteScroll>
    </div>
  );
};
