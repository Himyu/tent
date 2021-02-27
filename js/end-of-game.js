const version = '11.4.1'
var championsData = {}
var gameData = {}
var participants = []

async function getGameData () {
  // TODO Change data source here
  const gameReq = await fetch('../data/game.json')
  return await gameReq.json()
}

async function getChampData () {
  const championsUrl = `http://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`
  const championsReq = await fetch(championsUrl)
  const championsJson = await championsReq.json()
  return championsJson.data
}

const itemUrl = id => {
  return `http://ddragon.leagueoflegends.com/cdn/${version}/img/item/${id}.png`
}
const champUrl = id => {
  const champ = Object.values(championsData).find(c => c.key == id)
  return `http://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champ.id}.png`
}
const spellUrl = id => {
  return `img/spells/${id}-min.png`
}

var showDmg = false

// Team Blue
const blueTeamKDA = document.querySelector('#blueTeam .stats .kda')
const blueTeamSecondStat = document.querySelector('#blueTeam .stats .secondStat')
const blueTeamCampions = document.querySelector('#blueTeam .campions')
const blueTeamSpells = document.querySelector('#blueTeam .spells')
const blueTeamData = document.querySelector('#blueTeam .data')

// Team Red
const redTeamKDA = document.querySelector('#redTeam .stats .kda')
const redTeamSecondStat = document.querySelector('#redTeam .stats .secondStat')
const redTeamCampions = document.querySelector('#redTeam .campions')
const redTeamSpells = document.querySelector('#redTeam .spells')
const redTeamData = document.querySelector('#redTeam .data')

function displayChamps () {
  for (const participant of gameData.participants) {
    const img = document.createElement('img')
    img.src = champUrl(participant.championId)
    if (participant.teamId == 100) {
      blueTeamCampions.appendChild(img)
    } else {
      redTeamCampions.appendChild(img)
    }
  }
}

function displaySpells () {
  for (const participant of gameData.participants) {
    const firstSpell = document.createElement('img')
    firstSpell.src = spellUrl(participant.spell1Id)

    const secondSpell = document.createElement('img')
    secondSpell.src = spellUrl(participant.spell2Id)

    if (participant.teamId == 100) {
      blueTeamSpells.appendChild(firstSpell)
      blueTeamSpells.appendChild(secondSpell)
    } else {
      redTeamSpells.appendChild(firstSpell)
      redTeamSpells.appendChild(secondSpell)
    }
  }
}

function displayData () {
  var blueTeamStats = {
    kills: 0,
    deaths: 0,
    assists: 0,
    gold: 0
  }
  var redTeamStats = {
    kills: 0,
    deaths: 0,
    assists: 0,
    gold: 0
  }

  for (const participant of gameData.participants) {
    const participantInfo = participants.find(p => p.participantId == participant.participantId)

    const data = document.createElement('div')
    data.classList.add('dataContainer')

    // first row
    const name = document.createElement('h3')
    name.classList.add('name')
    name.innerHTML = participantInfo.player.summonerName

    const kills = participant.stats.kills
    const deaths = participant.stats.deaths
    const assists = participant.stats.assists
    const kda = document.createElement('h3')
    kda.classList.add('kda')
    kda.innerHTML = `${kills} / ${deaths} / ${assists}`

    const firstRow = document.createElement('div')
    firstRow.classList.add('firstRow')

    // item row
    const itemRow = document.createElement('div')
    itemRow.classList.add('itemRow')
    const items = [
      participant.stats.item0,
      participant.stats.item1,
      participant.stats.item2,
      participant.stats.item3,
      participant.stats.item4,
      participant.stats.item5,
      participant.stats.item6,
    ]

    // other stats
    const cs = participant.stats.totalMinionsKilled
    const gold = participant.stats.goldEarned

    const csDiv = document.createElement('div')
    csDiv.classList.add('info')
    const csHeading = document.createElement('h5')
    csHeading.innerHTML = "CS"
    const csText = document.createElement('h4')
    csText.innerHTML = cs
    csDiv.appendChild(csHeading)
    csDiv.appendChild(csText)

    const goldDiv = document.createElement('div')
    goldDiv.classList.add('info')
    const goldHeading = document.createElement('h5')
    goldHeading.innerHTML = "Gold"
    const goldText = document.createElement('h4')
    goldText.innerHTML = calcGold(gold)
    goldDiv.appendChild(goldHeading)
    goldDiv.appendChild(goldText)

    if (participant.teamId == 100) {
      // teamStats
      blueTeamStats.kills += kills
      blueTeamStats.deaths += deaths
      blueTeamStats.assists += assists
      blueTeamStats.gold += gold
      
      firstRow.appendChild(name)
      firstRow.appendChild(kda)

      data.appendChild(firstRow)

      // item row
      for (const item of items) {
        if (item > 0) {
          const itemImg = document.createElement('img')
          itemImg.src = itemUrl(item)
          itemRow.appendChild(itemImg)
        }
      }
      data.appendChild(itemRow)

      data.appendChild(csDiv)
      data.appendChild(goldDiv)

      blueTeamData.appendChild(data)
    } else {
      // teamStats
      redTeamStats.kills += kills
      redTeamStats.deaths += deaths
      redTeamStats.assists += assists
      redTeamStats.gold += gold

      firstRow.appendChild(kda)
      firstRow.appendChild(name)

      data.appendChild(firstRow)

      data.appendChild(goldDiv)
      data.appendChild(csDiv)

      // item row
      for (const item of items.reverse()) {
        if (item > 0) {
          const itemImg = document.createElement('img')
          itemImg.src = itemUrl(item)
          itemRow.appendChild(itemImg)
        }
      }
      data.appendChild(itemRow)

      redTeamData.appendChild(data)
    }
  }

  blueTeamKDA.innerHTML = `${blueTeamStats.kills} / ${blueTeamStats.deaths} / ${blueTeamStats.assists}`
  redTeamKDA.innerHTML = `${redTeamStats.kills} / ${redTeamStats.deaths} / ${redTeamStats.assists}`

  blueTeamSecondStat.innerHTML = calcGold(blueTeamStats.gold)
  redTeamSecondStat.innerHTML = calcGold(redTeamStats.gold)
}

async function start () {
  gameData = await getGameData()
  championsData = await getChampData()
  participants = gameData.participantIdentities
  displayChamps()
  displaySpells()
  displayData()
}
start()

function calcGold (amount) {
  switch (true) {
    case amount > 1000:
      return `${Math.floor(amount / 1000)} k`
    default:
      return amount
  }
}