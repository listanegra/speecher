require('dotenv').config();
const token = process.env['DISCORD_TOKEN'];

const WebSocket = require('ws');
const Discord = require('discord.js');

const Utils = require('./utils');
const DiscordWrapper = require('./discord-wrapper');

const client = new Discord.Client();
const wrapper = new DiscordWrapper(token);

client.login(token).then(() => {
    Array.from(client.channels.values())
        .filter(e => ['group'].includes(e.type))
        .map(e => e.id).forEach(e => run(e));
});

function run(channel) {
    setTimeout(() => handler(client.channels.get(channel)),
        Utils.rand(60 * 60 * 1000, 120 * 60 * 1000));
}

async function handler(channel) {
    if (channel && client.channels.has(channel.id)) {
        var messages = [];
        const generated = [];

        const users = Utils.scramble(Array.from(channel.recipients.values()))
            .slice(0, Utils.rand(2, Math.min(4, channel.recipients.size)));

        for (let user of users) {
            const fetched = (await wrapper.fetch(channel.id, user.id))
                .filter(e => !/<@.+?>/gi.test(e.text) && /^[A-Z]/gi.test(e.text))
                .map(e => `${e.username}: ${e.text}`);

            messages = messages.concat(Utils.scramble(fetched).slice(0, Utils.rand(1, 2)));
        }

        messages = Utils.scramble(messages);

        const socket = new WebSocket('ws://163.172.76.10:8080', {
            headers: { 'Origin': 'http://textsynth.org' }
        });

        socket.onopen = () => socket.send(`g,${messages.join('\n')}`);
        socket.onmessage = e => generated.push(e.data);

        socket.onclose = () => {
            const text = messages.map(e => `- ${e}`).join('\n') + generated.join('').replace(/\n/gi, '\n+ ');
            channel.send('```diff\n' + text + '```').then(() => run(channel.id));
        };
    }
}