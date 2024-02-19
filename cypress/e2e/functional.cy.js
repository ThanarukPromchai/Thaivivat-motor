import * as logUtils from '../utils/logUtils.js'
import * as dateUtils from '../utils/dateUtils.js'

describe('fuction spec', () => {


  beforeEach(()=>{
    cy.wrap({
      timestamp: `${dateUtils.formatPad2(new Date())}`
    }).as('init')
  })

  it('test function dateNowPad2', ()=>{
    var date = new Date()
    var dateFormat = dateUtils.formatPad2(date)
    cy.log("TIMESTAMP :" + dateFormat)
  })

  it('write log', ()=> {
    cy.get('@init').then((e) => {
      logUtils.write({
        timestamp: `${e.timestamp}`
      })

      logUtils.write({
        test: "test1"
      })

      logUtils.save(`cypress/log/write_log/test/test_write_log.json`)
    })
  })
})