const ytdl = require('ytdl-core');

const queue = new Map();

async function execute(message, args) {
    const serverQueue = queue.get(message.guild.id);
    const voiceChannel = message.member.voice.channel;
    const songInfo = await ytdl.getInfo(args[1]);
    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url
    };

    if (!voiceChannel) {
        return message.channel.send(`Vous devez être connecté dans un salon vocal.`);
    }

    if (serverQueue) {
        serverQueue.songs.push(song);
        return message.channel.send(`${song.title} a été ajouté à la queue.`);
    } else {
        const queueConstruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connexion: null,
            songs: [],
            volume: 1,
            playing: true
        }

        queue.set(message.guild.id, queueConstruct);
        queueConstruct.songs.push(song);

        try {
            queueConstruct.connexion = await voiceChannel.join();
            play(message.guild, queueConstruct.songs[0]);
        } catch (err) {
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send(err);
        }
    }
}

function play(guild, song) {
    const serveurQueue = queue.get(guild.id);

    if (song) {
        const dispatcher = serveurQueue.connexion
            .play(ytdl(song.url, {filter: 'audioonly'}))
            .on('finish', () => {
                serveurQueue.songs.shift();
                play(guild, serveurQueue.songs[0])
            })
            .on('error', error => console.error(error));

        dispatcher.setVolume(serveurQueue.volume);
        serveurQueue.textChannel.send(`Démarage de la musique : ${song.title}`);
    } else {
        serveurQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }
}

function skip(message) {
    const serverQueue = queue.get(message.guild.id);
    const channel = message.channel;

    if (message.member.voice.channel) {
        if (serverQueue) {
            serverQueue.connexion.dispatcher.end();
        } else { return channel.send(`Aucune musique en cours !`); }
    } else { return channel.send(`Vous devez être dans un salon vocal pour passer la musique.`); }
}

function stop(message) {
    const serverQueue = queue.get(message.guild.id);
    const channel = message.channel;

    if (message.member.voice.channel) {
        if (serverQueue) {
            serverQueue.songs = [];
            serverQueue.connexion.dispatcher.end();

            return channel.send(`Lecture stopper`);
        } else { return channel.send(`Aucune musique en cours !`); }
    } else { return channel.send(`Vous devez être dans un salon vocal pour stopper la lecture.`); }
}

module.exports = {
    execute: execute,
    skip: skip,
    stop: stop
}
