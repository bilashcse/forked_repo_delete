
const rp = require('request-promise');

const configs = require('./configs/default.json');

const allRepos = async () => {
  const options = {
    uri: `https://api.github.com/users/${configs.userName}/repos`,
    qs: {
      access_token: configs.accessToken,
    },
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36',
    },
    json: true,
  };

  const results = await rp(options);
  return results.filter((r) => r.fork === true).map((r) => ({
    name: r.name,
    full_name: r.full_name,
    fork: r.fork,
  }));
};


const deleteForedRepo = async (repo) => {
  console.log(`Deleting repo : ${repo.name}`);

  try {
    const options = {
      method: 'DELETE',
      uri: `https://api.github.com/repos/${repo.full_name}`,
      qs: {
        access_token: configs.accessToken,
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36',
      },
    };
    await rp(options);
  } catch (err) {
    throw new Error(err);
  }
};

async function init() {
  const forkedRepos = await allRepos();
  console.log(forkedRepos);

  if (forkedRepos.length > 0) {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < forkedRepos.length; i++) {
    // eslint-disable-next-line no-await-in-loop
      await deleteForedRepo(forkedRepos[i]);
    }
  }
  console.log('Forked Repos are deleted successfully');
}


module.exports = {
  init,
};
