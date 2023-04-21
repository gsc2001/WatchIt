import { isMagnet, isYouTube } from '.';

export const examples: SearchResult[] = [
    {
        url: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
        img: 'https://i.ytimg.com/vi/kJQP7kiw5Fk/default.jpg',
    },
].map((urlOrObject: { url: string; img: string } | string) => {
    const url = typeof urlOrObject === 'object' ? urlOrObject.url : urlOrObject;
    let type = 'file';
    if (isYouTube(url)) {
        type = 'youtube';
    } else if (isMagnet(url)) {
        type = 'magnet';
    }
    const img = typeof urlOrObject === 'object' ? urlOrObject.img : '';
    return {
        url,
        type,
        img,
        name: url,
        duration: 0,
    };
});
