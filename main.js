const { drawImage } = require('./js/images')
const { sendImageToMastodon } = require('./js/mastodon')
const { getColorCombo } = require('./js/colors')
const express = require('express')
const app = express()

app.use(express.static('public'))

app.get('/', (request, response) => {
  response.sendStatus(200)
})

app.get('/' + process.env.BOT_ENDPOINT, (request, response) => {
  const imageFileName = 'output.png'
  const imageFilePath = `${__dirname}/public/${imageFileName}`

  return getColorCombo().then(data => {
    const { colorOne, colorTwo }  = data
    
    const text = [
      `${colorOne.name} ${colorOne.hex}`,
      `${colorTwo.name} ${colorTwo.hex}`,
      ``,
      `(Contrast ratio: ${data.ratio.toFixed(1)}:1 | ${data.score})`
    ].join('\n')
    const imageDescription = `${colorOne.name} (${colorOne.hex}) and ${colorTwo.name} (${colorTwo.hex})`
    
    return drawImage(imageFilePath, data).then(() => {
      return sendImageToMastodon(imageFilePath, imageDescription, text)
    })
  })
  .then(() => {
    return response.status(200).send(`<img src="${imageFileName}" />`)
  })
  .catch(error => {
    console.error('error:', error)
    
    return response.status(500).send(error)
  })
})

const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`)
})