async function getPIBData () {
  // TODO Change data source here
  const gameReq = await fetch('../data/pub.json')
  return await gameReq.json()
}

const blueTeam = document.querySelector('#blueTeam .picks')
const blueBan = document.querySelector('#blueBan')

const redTeam = document.querySelector('#redTeam .picks')
const redBan = document.querySelector('#redBan')

async function displayPUBOrder () {
  const pubData = await getPIBData();
  const data = pubData.state.data

  // Bans
  for (const ban of data.blueTeam.bans) {
    const img = document.createElement('img')
    img.src = ban.champion.squareImg

    blueBan.appendChild(img)
  }

  for (const ban of data.redTeam.bans) {
    const img = document.createElement('img')
    img.src = ban.champion.squareImg

    redBan.appendChild(img)
  }

  // Picks
  for (const ban of data.blueTeam.bans) {
    const img = document.createElement('img')
    img.src = ban.champion.squareImg

    blueTeam.appendChild(img)
  }

  for (const ban of data.redTeam.bans) {
    const img = document.createElement('img')
    img.src = ban.champion.squareImg

    redTeam.appendChild(img)
  }
}

displayPUBOrder()