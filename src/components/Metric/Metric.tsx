import React from 'react';

import {Grid, Typography} from '@material-ui/core';

import {useStyles} from './Metric.style';

import ShowIf from 'src/components/common/show-if.component';
import {formatCount} from 'src/helpers/number';
import {UserMetric} from 'src/interfaces/user';

export type MetricProps = {
  data?: UserMetric;
  official: boolean;
  profile?: boolean;
  anonymous?: boolean;
};

export const Metric: React.FC<MetricProps> = props => {
  const {data, official, profile = false, anonymous = false} = props;
  const style = useStyles({...props, profile});

  return (
    <Grid container spacing={2} wrap="nowrap" classes={{root: style.root}}>
      <Grid item xs={3} className={style.post}>
        <Typography variant="body1" className={`${style.username}`} component="p">
          Post
        </Typography>
        <Typography variant="h5" className={style.total} component="p">
          {formatCount(data?.totalPosts ?? 0)}
        </Typography>
      </Grid>
      <Grid item xs={3}>
        <Typography variant="body1" className={`${style.username}`} component="p">
          Kudos
        </Typography>
        <Typography variant="h5" className={style.total} component="p">
          {formatCount(data?.totalKudos ?? 0)}
        </Typography>
      </Grid>
      <ShowIf condition={!official}>
        <Grid item xs={3}>
          <Typography variant="body1" className={`${style.username}`} component="p">
            Friends
          </Typography>
          <Typography variant="h5" className={style.total} component="p">
            {formatCount(data?.totalFriends ?? 0)}
          </Typography>
        </Grid>
      </ShowIf>
      <Grid item xs={3}>
        <Typography variant="body1" className={`${style.username}`} component="p">
          Experience
        </Typography>
        <Typography variant="h5" className={style.total} component="p">
          {anonymous ? 3 : formatCount(data?.totalExperiences ?? 0)}
        </Typography>
      </Grid>
    </Grid>
  );
};
