require('dotenv').config();
const Discord = require('discord.js');

const Prefix = "!";

const client = new Discord.Client({partials: ["MESSAGE", "CHANNEL", "REACTION"]});

client.once('ready', () => console.log("Bot ready !"));
client.once('reconnecting', () => console.log("Reconnected !"));
client.once('disconnect', () => console.log("Disconnected !"));

client.on('message', async (message) => {
	//Listen to send messages on the server
    if (message.content.startsWith('!kick')){
        const user = message.mentions.users.first();
        if (user) {
            const member = message.guild.member(user);
            if (member) {
                member
                    .kick('Optional reason that will display in the audit logs')
                    .then(() => {
                        message.reply(`Successfully kicked ${user.tag}`);
                    })
                    .catch(err => {
                        message.reply('I was unable to kick the member');
                        console.error(err);
                    });
            } else {
                message.reply("That user isn't in this server!");
            }
        } else {
            message.reply("You didn't mention the user to kick!");
        }
    }

    if (message.content.startsWith('!ban')) {
        const user = message.mentions.users.first();
        if (user) {
            const member = message.guild.member(user);
            if (member) {
                member
                    .ban({
                        reason: 'They were bad!',
                    })
                    .then(() => {
                        message.reply(`Successfully banned ${user.tag}`);
                    })
                    .catch(err => {
                        message.reply('I was unable to ban the member');
                        console.error(err);
                    });
            } else {
                message.reply("That user isn't in this server!");
            }
        } else {
            message.reply("You didn't mention the user to ban!");
        }
    }

    if (message.content.startsWith('!unban')) {
        const user = message.mentions.users.first();
        if (user) {
            const member = message.guild.member(user);
            if (member) {
                member
                    .unban(member)
                    .then(() => {
                        message.reply(`Successfully unbanned ${user.tag}`);
                    })
                    .catch(err => {
                        message.reply('I was unable to unban the member');
                        console.error(err);
                    });
            } else {
                message.reply("That user isn't in this server!");
            }
        } else {
            message.reply("You didn't mention the user to unban!");
        }
    }

    if (message.content.startsWith('!mute')) {
        const user = message.mentions.users.first();
        if (user) {
            const member = message.guild.member(user);
            if (member) {
                let role = message.guild.roles.cache.find(role => role.name === "Mute");
                member.roles.add(role.id);

            } else {
                message.reply("That user isn't in this server!");
            }
        } else {
            message.reply("You didn't mention the user to unban!");
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
