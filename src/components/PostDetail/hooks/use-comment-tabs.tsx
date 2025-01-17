import React, {useCallback, useState} from 'react';

import dynamic from 'next/dynamic';

import {TabItems, TabHookProps} from 'src/components/atoms/Tabs';
import {SectionType} from 'src/interfaces/interaction';
import {Post} from 'src/interfaces/post';

const CommentListContainer = dynamic(
  () => import('src/components/CommentList/CommentList.container'),
  {ssr: false},
);

export const useCommentTabs = (
  post: Post,
  ref: React.RefObject<HTMLDivElement>,
): TabHookProps<SectionType> => {
  const [selected, setSelected] = useState<SectionType>(SectionType.DISCUSSION);

  const scrollToPost = useCallback(() => {
    ref.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, [ref]);

  const tabs: TabItems<SectionType>[] = [
    {
      id: SectionType.DISCUSSION,
      title: `Discussion (${post.metric.discussions || 0})`,
      icon: '🤔 ',
      component: (
        <CommentListContainer
          placeholder={'Write a Discussion...'}
          referenceId={post.id}
          section={SectionType.DISCUSSION}
          scrollToPost={scrollToPost}
        />
      ),
    },
    {
      id: SectionType.DEBATE,
      title: `Debate (${post.metric.debates || 0})`,
      icon: '😡 ',
      component: (
        <CommentListContainer
          placeholder={'Your downvote will be submitted after you post a comment'}
          referenceId={post.id}
          section={SectionType.DEBATE}
          scrollToPost={scrollToPost}
        />
      ),
    },
  ];

  return {
    selected,
    setSelected,
    tabs,
  };
};
