export default async function handler(req, res) {
  const API_KEY = process.env.RIOT_API_KEY;
  const cluster = "americas"; // Para LAN, LAS, NA, BR
  const platform = "la2";    // Cambia a "la2" si es LAS

  // Agrega aquí tus usuarios reales
  const users = [
    { gameName: "Lushoto", tagLine: "uwu" },
    { gameName: "CBS", tagLine: "zzz" }
  ];

  try {
    const results = await Promise.all(users.map(async (user) => {
      try {
        // 1. Buscar PUUID
        const urlAccount = `https://${cluster}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(user.gameName)}/${encodeURIComponent(user.tagLine)}?api_key=${API_KEY}`;
        const resAccount = await fetch(urlAccount);
        
        if (!resAccount.ok) throw new Error(`Account no encontrada: ${user.gameName}`);
        const accountData = await resAccount.json();

        // 2. Buscar ID de Invocador
        const urlSummoner = `https://${platform}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${accountData.puuid}?api_key=${API_KEY}`;
        const resSummoner = await fetch(urlSummoner);
        const summonerData = await resSummoner.json();

        // 3. Buscar Liga
        const urlLeague = `https://${platform}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerData.id}?api_key=${API_KEY}`;
        const resLeague = await fetch(urlLeague);
        const leagueData = await resLeague.json();

        const soloQ = leagueData.find(m => m.queueType === 'RANKED_SOLO_5x5') || {
          tier: 'UNRANKED', rank: '', leaguePoints: 0, wins: 0, losses: 0
        };

        return { 
          name: `${user.gameName}#${user.tagLine}`, 
          tier: soloQ.tier, 
          rank: soloQ.rank, 
          leaguePoints: soloQ.leaguePoints, 
          wins: soloQ.wins, 
          losses: soloQ.losses 
        };
      } catch (err) {
        console.error(`Error con usuario ${user.gameName}:`, err.message);
        return { name: `${user.gameName}#${user.tagLine}`, tier: 'UNRANKED', rank: '', leaguePoints: 0, wins: 0, losses: 0 };
      }
    }));

    res.status(200).json(results);
  } catch (globalError) {
    res.status(500).json({ error: "Error critico en el servidor", message: globalError.message });
  }
}

