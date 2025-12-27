fetch("data.json")
  .then(res => res.json())
  .then(players => {
    players.sort((a, b) => b.lp - a.lp)

    const table = document.getElementById("ladder")
    table.innerHTML = `
      <tr>
        <th>Nick</th>
        <th>Liga</th>
        <th>LP</th>
        <th>OP.GG</th>
        <th>Sanciones</th>
      </tr>
    `

    players.forEach(p => {
      table.innerHTML += `
        <tr>
          <td>${p.nick}</td>
          <td>${p.liga}</td>
          <td>${p.lp}</td>
          <td><a href="${p.opgg}" target="_blank">Ver</a></td>
          <td>${p.sanciones}</td>
        </tr>
      `
    })
  })
