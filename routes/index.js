const express = require('express');
const router = express.Router();
const FormData = require('form-data');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const estadias = require('./../estadias.json')

const CLIMA_TEMPO_URL = 'https://www.climatempo.com.br'
const OPENWEATHER_URL = 'http://api.openweathermap.org/data/2.5/weather?lat=-23.964883938860563&lon=-46.3019437&appid=c32ff90826e60c1b8eb4770926b0a0ee'


const getClimaTempoTabuaMares = async (idLocale, year) => {
    const url = `${CLIMA_TEMPO_URL}/json/previsao-mare`
  
    const formData = new FormData()
    formData.append('idLocale', String(idLocale))
    formData.append('year', String(year))
  
    const response = await fetch(url, {
      method: "POST",
      mode: "cors",
      body: formData
    })
    
    const data = await response.json()
    return data
}

const getClimaTempoTabuaMaresV2 = async(cod, mes, ano) => {

  const url = `http://ondas.cptec.inpe.br/~rondas/mares/index.php?cod=${cod}&mes=${mes}&ano=${ano}`

  const response = await fetch(url)
  const data = await response.text()
  
  console.log(data)
  console.log('@@@@@')

  const $ = cheerio.load(data);

  const items = []

  $('li.dados').each((i, element) => {

      const cheerioElement = $(element);
      // console.log(cheerioElement.text())
      const innerText = cheerioElement.text()
      const arrayItems = innerText.split(' ')
      // console.log(arrayItems, arrayItems.length)

      const data = arrayItems[0].slice(0,5)

      if(data.trim() != ''){
        const item1 = {
            horario: arrayItems[0].slice(5,10),
            metros: arrayItems[2] == undefined ? null: arrayItems[2].slice(0,3)
        }
  
        const item2 = {
            horario: arrayItems[2] == undefined ? null: arrayItems[2].slice(3,8),
            metros: arrayItems[4] == undefined ? null: arrayItems[4].slice(0,3)
        }
  
        const item3 = {
            horario: arrayItems[4] == undefined ? null: arrayItems[4].slice(3,8),
            metros: arrayItems[6] == undefined ? null: arrayItems[6].slice(0,3)
        }
  
        const item4 = {
            horario: arrayItems[6] == undefined ? null: arrayItems[6].slice(3,8),
            metros: arrayItems[8] == undefined ? null: arrayItems[8].slice(0,3)
        }
  
        const item5 = {
            horario: arrayItems[8] == undefined ? null: arrayItems[8].slice(3,8),
            metros: arrayItems[10] == undefined ? null: arrayItems[10].slice(0,3)
        }
  
        const item6 = {
            horario: arrayItems[10] == undefined ? null: arrayItems[10].slice(3,8),
            metros: arrayItems[12] == undefined ? null: arrayItems[12].slice(0,3)
        }
        
        items.push({
            data, item1, item2, item3, item4, item5, item6
        })

      }

      console.log(items)

  })

  return items

}


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/estadias/:loadType', (req, res) => {

  const {loadType} = req.params

  const filterEstadias = estadias
        .filter(estadiaItem => estadiaItem['Especialidade da Carga Predominante'] == loadType)
        // .map(estadiaItem => estadiaItem['Atracação Prevista'])

  res.status(200).send(filterEstadias)

})

router.get('/tabua_mares/:cod/:mes/:ano', async (req, res) => {

  const {cod, mes, ano} = req.params
  
  const data = await getClimaTempoTabuaMaresV2(cod, mes, ano)

  res.status(200).send(data)

})

router.get('/climate', async (req, res) => {

  const url = `${OPENWEATHER_URL}`
  
  const response = await fetch(url)
  
  const data = await response.json()

  res.status(200).send(data)
  
})

module.exports = router;
