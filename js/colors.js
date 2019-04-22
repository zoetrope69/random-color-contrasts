
const fetch = require('node-fetch')
const contrast = require('get-contrast')
const colorNamer = require('color-namer')

/*
  colors to block for various reasons, for example this one:
  https://botsin.space/@accessibleColors/101967888732908331

  for example in .env use:
  COLOR_BLOCKLIST='["flesh"]
  
  this will skip this colour name and try another one
  
  we'll put in in .env just incase there are words you'd rather not read
  in source code...
*/
const COLOR_BLOCKLIST = JSON.parse(process.env.COLOR_BLOCKLIST)

function colorIsBlocked (str) {
  return COLOR_BLOCKLIST.includes(str.toLowerCase())
}

function toTitleCase (str) {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}

function getClosestName (color) {
  const names = colorNamer(color)
  
  if (!names) {
    return null
  }
  
  const possibleColors = []
    
  if (names.roygbiv[0]) {
    possibleColors.push(names.roygbiv[0])
  }
  
  if (names.pantone[0]) {
    possibleColors.push(names.pantone[0])
  }
  
  if (names.ntc[0]) {
    possibleColors.push(names.ntc[0])
  }
  
  // filter out blocked colours
  const possibleColorsWithBlockedColors = possibleColors.filter(color => !colorIsBlocked(color.name));
  
  if (possibleColorsWithBlockedColors.length === 0) {
    return null
  }
  
  const sortedByDistancePossibleColors = possibleColorsWithBlockedColors.sort((a, b) => {
    return a.distance > b.distance
  })
    
  const closestMatchedColor = sortedByDistancePossibleColors[0]
  
  return toTitleCase(closestMatchedColor.name)
}
  
function randomNumberBetween (min, max) {
  return Math.floor(Math.random() * (max - min + 1 ) + min)
}

function getColorCombo () {
  const statsUrl = 'https://randoma11y.com/stats'
  return fetch(statsUrl)
    .then(response => response.json())
    .then(stats => {
      const url = `https://randoma11y.com/combos?page=${randomNumberBetween(1, stats.combos)}&per_page=1`
      return fetch(url)
        .then(response => response.json())
        .then(results => results[0])
        .then(data => {
          const { color_one, color_two } = data

          return {
            colorOne: { hex: color_one.toUpperCase(), name: getClosestName(color_one) },
            colorTwo: { hex: color_two.toUpperCase(), name: getClosestName(color_two) },
            ratio: contrast.ratio(color_one, color_two),
            score: contrast.score(color_one, color_two)
          }
        })
    })
}

module.exports = {
  getColorCombo
}