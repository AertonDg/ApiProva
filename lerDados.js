import fs from 'node:fs'

const lerDados = (callback) => {
  fs.readFile('pessoas.json', 'utf8', (err, data) => {
    if (err) {
      callback(err)
      return
    }
    try {
      const pessoas = JSON.parse(data)
      callback(null, pessoas)
    } catch (error){
      callback(error)
    }
  })
}

export default lerDados