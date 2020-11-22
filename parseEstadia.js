

const fs = require('fs')
const CsvReadableStream = require('csv-reader');
const { read } = require('csv-reader');


const FILE_PATH = './Estadia.csv'

async function parseCSV() {

    let inputStream = fs.createReadStream(FILE_PATH, "utf8");
  
    let csvStream = new CsvReadableStream({
      parseNumbers: true,
      parseBooleans: true,
      trim: true,
      delimiter: ";",
    });

    let records = []
    let countLines = 0

    inputStream
        .pipe(csvStream)
        .on("data", function (line) {

            // DEBUG
            if(countLines <= 0){
                console.log('line', line)
            }

            countLines++

            const item = {
                'Número do DUV' : line[0],
                'Estadia Off-Shore' : line[1],
                'Porto de estadia atual' : line[2],
                'Atracação Prevista' : line[3],
                'Atracação Efetiva' : line[4],
                'Desatracação Prevista' : line[5],
                'Desatracação Efetiva' : line[6],
                'Local(is) Atracação (área do porto > berço > cabeço)' : line[7],
                'Local(is) e Data(s) Reatracação (área do porto > berço > ca' : line[8],
                'Bandeira da Embarcação' : line[9],
                'Área de Navegação' : line[10],
                'Finalidade da Embarcação' : line[11],
                'Tipo de Embarcação' : line[12],
                'Motivo de Atracação' : line[13],
                'Tipo de Viagem Chegada' : line[14],
                'Tipo de Viagem Saída' : line[15],
                'Especialidade da Carga Predominante': line[16],
            }

            records.push(item);


        })
        .on("finish", () => {
            let data = JSON.stringify(records);
            fs.writeFileSync("estadias.json", data);
            console.log('FIM DO PARSE')
        });

}


async function getRecordsByLoadType(loadType){

    const estadias = require('./estadias.json')

    let granelSolido = estadias
        .filter(estadiaItem => estadiaItem['Especialidade da Carga Predominante'] == loadType)
        // .map(estadiaItem => estadiaItem['Atracação Prevista'])
    
    // const teste = granelSolido.sort(function(a, b) {
    //     var c = new Date(a['Atracação Prevista']);
    //     var d = new Date(b['Atracação Prevista']);
        
    //     return c-d;
    // });

    console.log(granelSolido)
}

const CLIMA_TEMPO_URL = 'https://www.climatempo.com.br'

const FormData = require('form-data');
const fetch = require('node-fetch');

const getClimaTempoTabuaMares = async (idLocale, year) => {
    const url = `${CLIMA_TEMPO_URL}/json/previsao-mare`
  
    const formData = new FormData()
    formData.append('idLocale', '80807')
    formData.append('year', '2020')
  
    const response = await fetch(url, {
      method: "POST",
      mode: "cors",
      body: formData
    })
    
    const data = await response.json()
    return data
  }



//   getClimaTempoTabuaMares(80807, 2019).then(climateData => {
//     console.log('getClimaTempoTabuaMares RESPONSE', climateData)
//     // setTabuaMares(climateData)
//   })




var cheerio = require('cheerio');
const request = require('request')

const getClimaTempoTabuaMaresV2 = async(cod, mes, ano) => {

    const url = `http://ondas.cptec.inpe.br/~rondas/mares/index.php?cod=50225&mes=11&ano=1`
  
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
        

        // arrayItems.forEach(item => {
        //     // const field1 = item[0].slice(1,3)
        //     console.log(item)
        //     console.log('****')
        // })

        const data = arrayItems[0].slice(0,5)
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

        // console.log(data, item1, item2, item3, item4, item5, item6)
        
        
        
        items.push({
            data, item1, item2, item3, item4, item5, item6
        })

        console.log(items)

    })

    return items

}

// parseCSV()
// getRecordsByLoadType('Granel Sólido')
getClimaTempoTabuaMaresV2().then(data => {
    console.log(data)

})