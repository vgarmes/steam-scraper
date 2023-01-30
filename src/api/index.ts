import json from '../../db/profile.json';
export default {
  async fetch() {
    return new Response(JSON.stringify(json), {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
    });
  },
};
