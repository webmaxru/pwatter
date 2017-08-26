import { TweetUser } from './tweet-user'

export class Tweet {
    id_str: string;
    text: string;
    created_at: string;
    user: TweetUser;
    favorite_count: number;
    retweet_count: number;
}
