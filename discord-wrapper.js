const Axios = require('axios').default;

module.exports = class DiscordWrapper {

    constructor(token) {
        this.token = token;
        this.axios = Axios.create({
            baseURL: 'https://discord.com/api/v6',
            headers: { 'Authorization': this.token }
        });
    }

    async fetch(channel_id, author_id) {
        const response = await this.axios.get(`/channels/${channel_id}/messages/search`, {
            params: {
                author_id,
                sort_by: 'timestamp',
                sort_order: 'desc'
            }
        });

        const messages = [...response.data['messages'].flat()].filter(e => e['hit'] && e['content']);
        return messages.map(e => ({ username: e.author.username, text: e.content }));
    }

};