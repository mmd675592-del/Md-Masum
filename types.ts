
export interface ReactionCounts {
  like: number;
  love: number;
  care: number;
  haha: number;
  wow: number;
  sad: number;
  angry: number;
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  userId: string;
  text: string;
  image?: string;
  sticker?: string;
  timestamp: string;
  reactions: ReactionCounts;
  userReaction?: keyof ReactionCounts | null;
  replies?: Comment[];
}

export interface Post {
  id: string;
  author: string;
  authorId: string;
  avatar: string;
  content: string;
  image?: string;
  theme?: string;
  fontStyle?: string;
  taggedFriends?: string[];
  feeling?: { emoji: string; text: string };
  privacy?: 'public' | 'friends' | 'only_me';
  timestamp: string;
  reactions: ReactionCounts;
  comments: Comment[];
  userReaction?: keyof ReactionCounts | null;
  sharedPost?: Post; 
}

export type PrivacyType = 'public' | 'friends' | 'special_friends' | 'only_me';

export interface Story {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  image?: string;
  video?: string;
  text?: string;
  theme?: string;
  fontStyle?: string;
  timestamp: number;
  reactions: ReactionCounts;
  viewers: { name: string; avatar: string; reaction?: keyof ReactionCounts | null }[];
  privacy: PrivacyType;
  taggedFriends?: string[];
}

export interface Message {
  id: string;
  senderId: string;
  text?: string;
  image?: string;
  video?: string;
  audio?: string;
  sticker?: string;
  timestamp: number;
  isMe: boolean;
  isUnsent?: boolean;
  reaction?: keyof ReactionCounts | null;
}

export interface ChatSettings {
  themeColor: string;
  myNickname: string;
  friendNickname: string;
  isBlocked: boolean;
  note?: string;
  noteCreatedAt?: number;
}

export type FriendshipStatus = 'none' | 'sent' | 'received' | 'friends';

export interface UserInfo {
  id: string;
  name: string;
  avatar: string;
  cover: string;
  bio: string;
  school: string;
  college: string;
  university: string;
  hometown: string;
  district: string;
  relationship: string;
  nameLastChanged: number;
  isActive?: boolean;
  lastActive?: string;
  friendshipStatus?: FriendshipStatus;
  mutualFriends?: number;
}

export interface Store {
  id: string;
  name: string;
  image: string;
  isOwner?: boolean;
}

export interface ImageEditState {
  originalImage: string | null;
  editedImage: string | null;
  loading: boolean;
  error: string | null;
}
