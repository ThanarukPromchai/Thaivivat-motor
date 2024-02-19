
export var pathLogFile = "cypress/log/write_log/test/test_write_log.json"

var sheetText = {}

function saveLog(filename, object) {
  cy.task('readFileMaybe', filename).then((textOrNull) => { 
    if (textOrNull == null){
      let arrObject = [object]
      cy.writeFile(filename, arrObject, 'UTF-8')
    } else {
      cy.readFile(filename, 'UTF-8').then((arrObj) => {
        arrObj.push(object)
        cy.writeFile(filename, arrObj, 'UTF-8')
      })
    }
  })
}

export function write(object) {
  Object.assign(sheetText, object);
}

export function save(filename) {
  saveLog(filename, sheetText)
  sheetText = {}
}

export function read(filename, callback) {
  cy.task('readFileMaybe', filename).then((textOrNull) => { 
    if (textOrNull != null){ cy.readFile(filename, 'UTF-8').then(callback) }
    else { callback(null)} 
  })
}