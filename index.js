require('dotenv').config();
const fs = require('fs');
const Discord = require('discord.js');
const music = require('./Modules/Musique');
const DB = require('./data/trigger');

const client = new Discord.Client({partials: ["MESSAGE", "CHANNEL", "REACTION"]});

const Prefix = "!";

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

    if (message.content.startsWith(`${Prefix}play`)) { music.execute(message, args); }

    if (message.content.startsWith(`${Prefix}skip`)) { music.skip(message); }

    if (message.content.startsWith(`${Prefix}stop`)) { music.stop(message); }

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

        message.react('🐳').then(() => console.log('yes')).catch(console.error);
        message.react('🐦').then(() => console.log('yes')).catch(console.error);
        message.react('🐊').then(() => console.log('yes')).catch(console.error);

        const filter = (reaction, user) => {
            return ['🐳', '🐦', '🐊'];
        };


        message.awaitReactions( filter,{ max: 1, time: 60000, errors: ['time'] })
            .then(collected => {
                const reaction = collected.first();

                if (reaction.emoji.name === '🐳') {
                    console.log(reaction.users);
                }
                if (reaction.emoji.name === '🐦')
                {
                    console.log(reaction.users);
                }
                if(reaction.emoji.name === '🐊'){
                    console.log(reaction.users);
                }
            })
            .catch(collected => {
                message.reply('you reacted with neither a thumbs up, nor a thumbs down.');
            });
    }

    if(message.content.startsWith('!addtrigger')) {
        var regex1 =/{([^}]*)}/;
        var regex2 =/} {([^}]*)}/;
        let trigger = message.content.match(regex1);
        let msg = message.content.match(regex2);
        trigger = trigger[1];
        msg = msg[1];

        fs.readFile(DB, (err, data) => {
            if(err)
                return console.log(err.message);

            let triggers = JSON.parse(data);
            let trig = triggers.find(p => p.trigger === trigger);

            if(!trig){
                trig = {
                    trigger: trigger,
                    message: msg
                };
                //Le trigger n'existe pas on doit donc l'ajouter
                fs.writeFile(DB, JSON.stringify(trig), (err) => {
                    if(err)
                        return console.log(err.message);
                    //On affiche un message de validation
                    message.reply("Trigger succesfully added");
                });
            }
            else{
                //Le trigger existe on doit renvoyer un message d'erreur
                message.reply("Trigger already existe");
            }
        });
    }
});

client.login(process.env.DISCORD_TOKEN);
