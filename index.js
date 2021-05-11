require('dotenv').config();
const Discord = require('discord.js');

const Prefix = "!";

const client = new Discord.Client({partials: ["MESSAGE", "CHANNEL", "REACTION"]});

client.once('ready', () => console.log("Bot ready !"));
client.once('reconnecting', () => console.log("Reconnected !"));
client.once('disconnect', () => console.log("Disconnected !"));

client.on('guildMemberAdd', async (member) => {
    const channel = member.guild.channels.cache.find(c => c.id === "841601584122691585");
    channel.send(`${member} est de retour pour vous jouer de mauvais tours ! :cat:`);

    member.roles.add("837635122655133756");
});

client.on('message', async (message) => {
	//Listen to send messages on the server
    let channel = message.channel;
    let args = message.content.split(' ');

    if (message.content.startsWith(`${Prefix}dev`)) {

    }

    if (message.content.startsWith(`${Prefix}role`)) {
        const user = message.mentions.users.first();
        if (user) {
            const member = message.guild.member(user);
            if (member) {
                member.roles.add("837635122655133756")
            }
        }
    }

    if (message.content.startsWith(`${Prefix}clear`)) {
        channel.bulkDelete(args[1]);
        channel.send(`${args[1]} messages ont été supprimé.`);
    }

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
                member.roles.remove(member.roles.cache)
                    .then( () => {
                        console.log('all role remove');
                        let role = message.guild.roles.cache.find(role => role.name === "Mute");
                        member.roles.add(role.id);
                    })
                    .catch(console.error);
            } else {
                message.reply("That user isn't in this server!");
            }
        } else {
            message.reply("You didn't mention the user to unban!");
        }
    }

    if (message.content.startsWith('!unmute')) {
        const user = message.mentions.users.first();
        if (user) {
            const member = message.guild.member(user);
            if (member) {
                member.roles.remove(member.roles.cache)
                    .then( () => {
                        console.log('all role remove');
                        let role = message.guild.roles.cache.find(role => role.name === "Member");
                        member.roles.add(role.id);
                    })
                    .catch(console.error);
            } else {
                message.reply("That user isn't in this server!");
            }
        } else {
            message.reply("You didn't mention the user to unban!");
        }
    }

    if(message.content.startsWith('!getroles')) {
        const channel = client.channels.cache.find(c => c.id === "841608941992542239");
        let message = channel.send('choisissez votre Starter');
        message.react(':whale:1cb536137c5e70d114922edd3d3faaa0').then(consolo.log('yes')).catch(console.error);
        message.react(':bird:cf725f98edb284d25530f5dbd7d30ee4');
        message.react(':crocodile:fface028e87dd156db7f772d5009211e');

        message.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
            .then(collected => {
                const reaction = collected.first();

                if (reaction.emoji.name === ':whale:') {
                    console.log(reaction.users);
                }
                if (reaction.emoji.name === ':crocodile')
                {
                    console.log(reaction.users);
                }
                if(reaction.emoji.name === ':bird:'){
                    console.log(reaction.users);
                }
            })
            .catch(collected => {
                message.reply('you reacted with neither a thumbs up, nor a thumbs down.');
            });
    }
});

client.login(process.env.DISCORD_TOKEN);
