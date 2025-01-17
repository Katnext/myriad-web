import {SocialsEnum} from './social';
import {UserSocialMedia} from './user';

export interface PeopleProps {
  id: string;
  name: string;
  originUserId: string;
  platform: SocialsEnum;
  profilePictureURL: string;
  username: string;
  deletedAt?: string;
}

export interface SearchablePeople extends PeopleProps {
  userSocialMedia: UserSocialMedia;
}

export interface People extends PeopleProps {
  walletAddress?: string;
  //TODO: remove later, experience related attribute
  hide?: boolean;
}
