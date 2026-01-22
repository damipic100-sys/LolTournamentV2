import fetch from "node-fetch";
import fs from "fs";

const API_KEY = "RGAPI-a0be21b2-2d89-4313-8b15-09967c369bcd";
const REGION = "americas"; // account-v1
const PLATFORM = "la2";    // la2 / la1 / br1, etc

const PUUIDS = [
  "weEPOlZqYq6fapzZ-KixGw65v1aaR133Z6m6O0F4j22LIAhtMn_Qe6xKuh2wGIhbtdWUyPM9UZfXYw",
  "v9ZVd9W_uuzwSFB1x9YS2_NOg0PI1dIWikhIe4O1BQn45Y_kzFz1ZukVD8c2KArtFTuYmcwQ1DejRQ",
  "oQco0OBbv3swcuvmPQ0a2fcqnJjGWjsNvKNYqH9HLkdV_MYQ6Etci62GrzikMpXCfc1f-nvtcXKjjg",
  "VYq90ZrnlZ8cBry-bZW9czUSf4yRu8P11HExr6lSmGLpXiwA5Q-EpdSEq6nnM01qMltX-U7DAnM6xg",
  "A-aUan8PNdR3AXIi6UzBMAlo0BoE9jJ-spKehLf-k1IsOUD5zO7TjnJP1fU2pUtOWJKayNlFWu43iw",
  "Zsp3E7bEQZGUO-po9jOBWt4wBJvMi_KTlN4PSv4H4PQvcptT6CnIAP0mrwejwDkkjwaWzWAvMAUROw",
  "WTxq30NhNcaMJgTApdAELBwgPOjkO-ffAFkAOeOxT6ctoCJJtC0eAhrsp2cx56yN2ywM2kp3LD-wEw",
  "cAu3jEMQaLRBFhHYQ3_lBgf6Nyy_wCOCpaAD5TODb0LEtf0kmNYCe9xqZUhDFZvi2AA0QMLRiyjWLA",
  "QNmSI9VqOn3qrPJJi7Gkma9hxeF40ub4Yjsq_xHn8I7B_esc3vN6FjhRYsdyoJIUmeZb21p9ja1a2Q",
  "LuibH8g6bt5OLeTgRI6eMt2HxqNTwcudRA5omeMjPuSnieAhLyuQV-7GC4174AQhHZUUtPXPuP1KYg",
  "4AtIVORYs97uhIbLwsxpHzelN20Iw7xhmxYz3Or0JcXeHNvJLeJNI2_6Vxs1LlJEceyrEzUmB5tuNw",
  "RbekpVBqbM3xUE4C1bvf_nTYMAcm7IaW2b7Nz94KvuC-DkH3Yz3ee_qFPt-tZw3RlTTjm7yTMs0GtA",
  "NCM14ymGrWk37gF_6Eiyztu7dDmoasKdKnFKCKoz1nGf8UdCtTHds5Adh7hRa3M6gD-8EW5EUs2f7g",
  "OIgVC80rIgTXV-lkTha4wmT0d9UQQXsk_kLB8LEkUfgk-GwbYwSSmoMdxSBnokVqB9crT0qiV9Xi-A",
  "sv8a56wIsIb4vwABMr1A1M2kloZb4V0NU15dp5_Y-PBtgh0qcnfUA9kuNZ6xClgs-oqiXQKmc63l0w",
  "9KMo6H2tFnENiEliAtE8TDt7b-kPPif-_sgG6VteEj1m19I84qQlVha3FK-HuplWA2MKruqtWOHShw",
  "ocGcGngbvPt2hVpdU_4suxTudR1M_2Fss6zyYJzeOZ4knzqHn2jRGARzGVD3tLlBynpxgA7mAvn1Qg",
  "kct52lCg1OrCMxUTJlsXG2AoVERExk79iBFWjkLTWy4NfXx2ZMiRkR6vCwUi57stxbTIgQNi-RqfCA",
  "bzP_gUD1t35-vFHgxXcIrATCpduJIcmbJ6OY2DNOe4o-NPzV9FqL98vslPWcURQmDwriioJYpVvAjA",
  "Bdh_8g7DcQeEt_FYUAFpk4n199BRyiXpFv5uuCy_PerTp3HvxeOalOjD2gVxXno1kyarTbtd2EIr6A",
  "NZr-PlYaik3jmNDf3KwWbreD8P69Aveh4hf_AdDH7kZ7nVMqeBXNnqW68TkljDWVgVxFhB5UcZnagg",
  "Qf7_Ao2T62rXQa85TmQWffVByvjeAAlkBY1CQtFHOQ_xPZS1iSDKMtYlYawFueLHV_kq107LOfhdzg",
  "jPzRi_IXrh335ahPJQbsZwqqMtHq3jrHehcLh5vm3iqtF9_MD0GsnajpJmSooz0pIDf5fWkg-qVj2g",
  "L02y3eQqLk-SwAyc28i8tF-9UB4yFyOAvstpzMO75zLywCOdIFK3RCeDhv8uOQDKRKRMn2hv4WC7Ug",
  "S1gI6coHKWEJu04rAV5AtIHnWAfwSXxD05FfukQcYy0y9a5U0Vy5NvPsdzD769NIabFkPUopHm7Q2A",
  "g7z3z62-28wFlBN6-tqDBddPqhUYgabuk6wvfqfOINGI_i0iOqB4P-gyH04Q3XtfeS7ms-j5Ek8G0A",
  "lWDZAI4k4odHQiHpO_xUHF0ek7z9hbxiSbilPjMbws3elebWrrjp7HgJqK5xyf9m3sKbPXhxJGtxiA",
  "J5x_g_Tb2yUDcmEw5-U1CesfldQlz4gKwifbJpqOUHKjlO-qEM9gOYeFwjUsR3m26k-hKOT_-4CPkw"
];

const headers = {
  "X-Riot-Token": API_KEY
};

async function getPlayerData(puuid) {
  // account data
  const accRes = await fetch(
    `https://${REGION}.api.riotgames.com/riot/account/v1/accounts/by-puuid/${puuid}`,
    { headers }
  );
  const acc = await accRes.json();

  // ranked data
  const leagueRes = await fetch(
    `https://${PLATFORM}.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}`,
    { headers }
  );
  const leagues = await leagueRes.json();

  const soloQ = leagues.find(
    l => l.queueType === "RANKED_SOLO_5x5"
  );

  // UNRANKED
  if (!soloQ) {
    return {
      name: `${acc.gameName}#${acc.tagLine}`,
      tier: "UNRANKED",
      rank: null,
      leaguePoints: 0,
      wins: 0,
      losses: 0
    };
  }

  // RANKED
  return {
    name: `${acc.gameName}#${acc.tagLine}`,
    tier: soloQ.tier,
    rank: soloQ.rank,
    leaguePoints: soloQ.leaguePoints,
    wins: soloQ.wins,
    losses: soloQ.losses
  };
}

async function run() {
  const result = [];

  for (const puuid of PUUIDS) {
    try {
      const data = await getPlayerData(puuid);
      result.push(data);
    } catch (e) {
      console.error("Error con puuid:", puuid);
    }
  }

  fs.writeFileSync(
  "ladder_data.json",
  JSON.stringify(result, null, 2),
  "utf8"
  );

console.log("ladder_data.json generado");
}

run();
