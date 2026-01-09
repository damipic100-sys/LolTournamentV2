export default async function handler(req, res) {
  const API_KEY = process.env.RIOT_API_KEY;
  // Cambia la región según donde jueguen (americas, europe, asia)
  const cluster = "americas"; 
  // Cambia la plataforma según el servidor (la1, la2, na1, br1)
  const platform = "la2"; 

  // Lista de tus usuarios con sus Tags
  const users = [
    { gameName: "Lushoto", tagLine: "uwu" },
    { gameName: "GwungleAccount", tagLine: "ARG" }
  ];

  try {
    const results = await Promise.all(users.map(async (user) => {
      // 1. Obtener PUUID usando Account-v1 (Nombre + Tag)
      const resAccount = await fetch(`https://${cluster}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${user.gameName}/${user.tagLine}?api_key=${API_KEY}`);
      const accountData = await resAccount.json();

      if (!accountData.puuid) return { name: user.gameName, tier: 'NOT_FOUND', leaguePoints: 0 };

      // 2. Obtener ID de Invocador usando el PUUID
      const resSummoner = await fetch(`https://${platform}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${accountData.puuid}?api_key=${API_KEY}`);
      const summonerData = await resSummoner.json();

      // 3. Obtener datos de la Liga
      const resLeague = await fetch(`https://${platform}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerData.id}?api_key=${API_KEY}`);
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
    }));

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: "Error en la conexión con Riot" });
  }
}


