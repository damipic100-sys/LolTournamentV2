export default async function handler(req, res) {
  const API_KEY = process.env.RIOT_API_KEY;
  const cluster = "americas"; 
  const platform = "la2";    

  const users = [
    { gameName: "Lushoto", tagLine: "LAS" },
    { gameName: "FernecitoConCoca", tagLine: "ARG" }
  ];

  try {
    const results = await Promise.all(users.map(async (user) => {
      try {
        // 1. Obtener PUUID
        const resAccount = await fetch(`https://${cluster}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(user.gameName)}/${encodeURIComponent(user.tagLine)}?api_key=${API_KEY}`);
        const accountData = await resAccount.json();

        if (accountData.status) {
          console.error(`Error en Account API (${user.gameName}):`, accountData.status.message);
          return { name: `${user.gameName}#${user.tagLine}`, tier: 'API_ERROR', rank: '', leaguePoints: 0, wins: 0, losses: 0 };
        }

        // 2. Obtener SummonerID
        const resSummoner = await fetch(`https://${platform}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${accountData.puuid}?api_key=${API_KEY}`);
        const summonerData = await resSummoner.json();

        // 3. Obtener Liga
        const resLeague = await fetch(`https://${platform}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerData.id}?api_key=${API_KEY}`);
        const leagueData = await resLeague.json();

        // VALIDACIÓN CRUCIAL: Si leagueData no es un array, es un error de Riot
        if (!Array.isArray(leagueData)) {
          console.error(`Riot respondió con error para ${user.gameName}:`, leagueData);
          return { name: `${user.gameName}#${user.tagLine}`, tier: 'UNRANKED', rank: '', leaguePoints: 0, wins: 0, losses: 0 };
        }

        const soloQ = leagueData.find(m => m.queueType === 'RANKED_SOLO_5x5');

        if (!soloQ) {
          return { name: `${user.gameName}#${user.tagLine}`, tier: 'UNRANKED', rank: '', leaguePoints: 0, wins: 0, losses: 0 };
        }

        return { 
          name: `${user.gameName}#${user.tagLine}`, 
          tier: soloQ.tier, 
          rank: soloQ.rank, 
          leaguePoints: soloQ.leaguePoints, 
          wins: soloQ.wins, 
          losses: soloQ.losses 
        };

      } catch (err) {
        return { name: `${user.gameName}#${user.tagLine}`, tier: 'ERROR', rank: '', leaguePoints: 0, wins: 0, losses: 0 };
      }
    }));

    res.status(200).json(results);
  } catch (globalError) {
    res.status(500).json({ error: "Error de servidor" });
  }
}
