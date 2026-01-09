export default async function handler(req, res) {
  const API_KEY = process.env.RIOT_API_KEY;
  const cluster = "americas"; // Routing para LAS, LAN, NA, BR
  const platform = "la2";    // LAS configurado correctamente

  // Lista de tus usuarios
  const users = [
    { gameName: "Lushoto", tagLine: "uwu" },
    { gameName: "FernecitoConCoca", tagLine: "ARG" }
  ];

  try {
    const results = await Promise.all(users.map(async (user) => {
      try {
        // 1. Obtener PUUID (Account-v1)
        const resAccount = await fetch(`https://${cluster}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(user.gameName)}/${encodeURIComponent(user.tagLine)}?api_key=${API_KEY}`);
        
        if (!resAccount.ok) {
          console.error(`Error Account API: ${resAccount.status} para ${user.gameName}`);
          return { name: `${user.gameName}#${user.tagLine}`, tier: 'ERROR', rank: '', leaguePoints: 0, wins: 0, losses: 0 };
        }
        const accountData = await resAccount.json();

        // 2. Obtener SummonerID usando el PUUID (Summoner-v4)
        const resSummoner = await fetch(`https://${platform}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${accountData.puuid}?api_key=${API_KEY}`);
        const summonerData = await resSummoner.json();

        // 3. Obtener Liga (League-v4)
        const resLeague = await fetch(`https://${platform}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerData.id}?api_key=${API_KEY}`);
        const leagueData = await resLeague.json();

        // LOG PARA DEBUG: Esto aparecerá en tus logs de Vercel
        console.log(`Datos crudos de ${user.gameName}:`, JSON.stringify(leagueData));

        // Buscar específicamente SoloQ
        const soloQ = leagueData.find(m => m.queueType === 'RANKED_SOLO_5x5');

        if (!soloQ) {
          return { 
            name: `${user.gameName}#${user.tagLine}`, 
            tier: 'UNRANKED', rank: '', leaguePoints: 0, wins: 0, losses: 0 
          };
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
        console.error(`Fallo crítico en usuario ${user.gameName}:`, err);
        return { name: `${user.gameName}#${user.tagLine}`, tier: 'UNRANKED', rank: '', leaguePoints: 0, wins: 0, losses: 0 };
      }
    }));

    res.status(200).json(results);
  } catch (globalError) {
    res.status(500).json({ error: "Error de servidor", details: globalError.message });
  }
}
