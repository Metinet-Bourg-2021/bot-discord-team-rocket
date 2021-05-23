require('dotenv').config();
const fs = require('fs');
const Discord = require('discord.js');
const music = require('./Modules/Musique');
const DB = './data/trigger.json';

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

    fs.readFile(DB, (err, data) => {
        if(err)
            return console.log(err.message);

        let triggers = JSON.parse(data);
        triggers.forEach(item => {
            if(item.trigger === message.content){
                console.log("marche");
                message.reply(item.message);
            }
        });
    });

    if (message.content.startsWith(`${Prefix}dev`)) {
        let embedPoll = new Discord.MessageEmbed()
            .setTitle('😲 New Poll! 😲')
            .setDescription('Test')
            .setColor('YELLOW')
        let msgEmbed = await channel.send(embedPoll);
        await msgEmbed.react('👍')
        await msgEmbed.react('👎')
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

    if (message.content.startsWith(`${Prefix}queue`)) { music.getQueue(message); }

    if (message.content.startsWith(`${Prefix}poll`)) {
        let pollMsgEmbed = new Discord.MessageEmbed()
            .setTitle(args[1])
            .setDescription(':regional_indicator_a:')
        ;

        let msg = await channel.send(pollMsgEmbed);
        console.log(client.emojis.cache)
        // await msg.react(message.guild.emojis.cache.find(emoji => emoji.name === 'regional_indicator_a'));
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
        let messageEmbed = new Discord.MessageEmbed()
            .setColor('#3089FF')
            .setTitle(`Choisissez votre Starter`)
            .setFooter(`Team Rocket`);

        let message = await channel.send(messageEmbed);
        await message.react('🐳');
        await message.react('🐦');
    }

    if(message.content.startsWith('!addtrigger')) {
        let regex1 =/{([^}]*)}/;
        let regex2 =/} {([^}]*)}/;
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
                triggers.push(trig);
                //Le trigger n'existe pas on doit donc l'ajouter
                fs.writeFile(DB, JSON.stringify(triggers), (err) => {
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

    if(message.content.startsWith('!deltrigger')) {
        let regex1 =/{([^}]*)}/;
        let trigger = message.content.match(regex1);
        trigger = trigger[1];
        fs.readFile(DB, (err, data) => {
            if(err)
                return console.log(err.message);

            let triggers = JSON.parse(data);
            let trig = triggers.find(p => p.trigger === trigger);


            if(trig){
                triggers = triggers.filter(function(value, inde, arr){
                   return value !== trig;
                });
                //Le trigger n'existe pas on doit donc l'ajouter
                fs.writeFile(DB, JSON.stringify(triggers), (err) => {
                    if(err)
                        return console.log(err.message);
                    //On affiche un message de validation
                    message.reply("Trigger succesfully Removed");
                });
            }
            else{
                //Le trigger existe on doit renvoyer un message d'erreur
                message.reply("Trigger don't existe");
            }
        });
    }

    if(message.content.startsWith('!showtrigger')) {
        fs.readFile(DB, (err, data) => {
            if(err)
                return console.log(err.message);

            let triggers = JSON.parse(data);

            let reponse = '';

            triggers.forEach(item => {
                reponse += item.trigger;
                reponse += '\n';
            });


            let messageEmbed = new Discord.MessageEmbed()
                .setColor('#3089FF')
                .setTitle(`Liste des triggers`)
                .setFooter(reponse);

            message.channel.send(messageEmbed);
        });
    }
});

client.on("messageReactionAdd", (reaction, user) => {
    if(!user || user.bot || !reaction.message.channel.guild) {  return; }

    if (reaction.emoji.name === '🐳') {
        let role = reaction.message.guild.roles.cache.find(role => role.name === "Team 1");
        reaction.message.guild.member(user).roles.add(role.id)
    }
    if (reaction.emoji.name === '🐦') {
        let role = reaction.message.guild.roles.cache.find(role => role.name === "Team 2");
        reaction.message.guild.member(user).roles.add(role.id)
    }
});

client.on("messageReactionRemove", (reaction, user) => {
    if(!user || user.bot || !reaction.message.channel.guild) {  return; }

    if (reaction.emoji.name === '🐳') {
        let role = reaction.message.guild.roles.cache.find(role => role.name === "Team 1");
        reaction.message.guild.member(user).roles.remove(role.id)
    }
    if (reaction.emoji.name === '🐦') {
        let role = reaction.message.guild.roles.cache.find(role => role.name === "Team 2");
        reaction.message.guild.member(user).roles.remove(role.id)
    }
});

client.login(process.env.DISCORD_TOKEN);
