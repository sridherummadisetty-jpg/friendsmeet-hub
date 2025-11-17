
export enum ActivityType {
  Movies = 'Movies',
  Music = 'Music',
  Social = 'Social',
  YouTube = 'YouTube',
  PrimeVideo = 'PrimeVideo',
  LocalVideo = 'LocalVideo',
  LocalImage = 'LocalImage',
  LocalMusic = 'LocalMusic',
  WebVideo = 'WebVideo',
}

export interface User {
  name: string;
  isMe?: boolean;
}

export interface Message {
  id: number;
  user: User;
  text: string;
  timestamp: string;
}