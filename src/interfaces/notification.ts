import {BaseModel} from './base.interface';

export enum NotificationType {
  FRIEND_REQUEST = 'friend_request',
  FRIEND_ACCEPT = 'friend_accept',
  POST_COMMENT = 'post_comment',
}

export type NotificationProps = {
  referenceId?: string;
  type: NotificationType;
  read: boolean;
  from: string;
  to: string;
  message: string;
};

export interface Notification extends NotificationProps, BaseModel {}
export interface TotalNewNotification {
  count: number;
}
