const res = await fetch('https://steamcommunity.com/id/vgmestre/');
const text = await res.text();

console.log(text);

export {};
