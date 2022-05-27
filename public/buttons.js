const roleButton = document.getElementById('roles');
const emojiButton = document.getElementById('emojis')
const ownerButton = document.getElementById('owner');
const moderatorButton = document.getElementById('moderators');
const boostTierButton = document.getElementById('boost-tier');

let guild = fetch('https://eftbot.kooterman.repl.co/themeparks').then(res => res.json());
(async () => {
  guild = await guild;
})

roleButton.addEventListener('click', async () => {
  const roles = guild.roles;
  console.log(roles)
})