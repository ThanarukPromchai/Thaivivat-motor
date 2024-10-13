import * as e2e from "../support/e2e";
import * as dateUtils from "../utils/dateUtils";
import * as logUtils from "../utils/logUtils";

const runNo = Cypress.env('runNo')
const planList = Cypress.env('plan')

const promoList = 
["TVIPPUAIS000999",
"TVIPPUAIS001000",
"TVIPPUAIS001001",
"TVIPPUAIS001002",
"TVIPPUAIS001003",
"TVIPPUAIS001004",
"TVIPPUAIS001005",
"TVIPPUAIS001006",
"TVIPPUAIS001007",
"TVIPPUAIS001008",
"TVIPPUAIS001009",
"TVIPPUAIS001010",
"TVIPPUAIS001011",
"TVIPPUAIS001012",
"TVIPPUAIS001013",
"TVIPPUAIS001014",
"TVIPPUAIS001015",
"TVIPPUAIS001016",
"TVIPPUAIS001017",
"TVIPPUAIS001018",
"TVIPPUAIS001019",
"TVIPPUAIS001020",
"TVIPPUAIS001021",
"TVIPPUAIS001022",
"TVIPPUAIS001023",
"TVIPPUAIS001024",
"TVIPPUAIS001025",
"TVIPPUAIS001026",
"TVIPPUAIS001027",
"TVIPPUAIS001028"]

describe('fuction spec', () => {

  beforeEach(() => {
    cy.viewport('macbook-16')
    cy.wrap({
      timestamp: dateUtils.formatPad2(new Date())
    }).as('init')
    cy.visit("https://beta.thaivivat.co.th/campaign/prepaid");
  })

  afterEach(() => {
    cy.clearCookies()
  })

  planList.forEach((el, idx) => {
    it(`Test No: ${(idx + 1)}, plan_fix: ${el.plan_fix}, brand: ${el.brand} car: ${el.veh_desc}, year: ${el.car_year}, plan_fix: ${el.plan_fix}, sum_insure: ${el.sum_insure}` ,
      {
        retries: {
          runMode: 2,
          openMode: 0,
        },
      },
     () => {
        var index = getRandomInt(0, promoList.length - 1)
        var code = promoList[index];
      // if (idx < promoList.size) code = promoList[idx]
    

      let info = {
        promoCode: code,
        homePlus: el.home_plus == "Y",
        extraPlus: el.extra_plus == "Y"
      }

      var logPath = `cypress/log/${runNo}.json`
      logUtils.read(logPath, (log)=>{
        var isHomePlus = (info.homePlus && ["PACKAGE_120","PACKAGE_180","PACKAGE_365","TOPUP_1","TOPUP_2"].includes(el.plan_fix)) || !info.homePlus
        var isExtra = (info.extraPlus && ["PACKAGE_365", "TOPUP_1","TOPUP_2"].includes(el.plan_fix)) || !info.extraPlus
        var duplicateRec = log != null && log.find((v) => {
          return v.brand == el.brand &&
           v.model == el.veh_desc && 
           v.type == el.type &&
           v.car_year == el.car_year && 
           v.home_plus == el.home_plus && 
           v.extra_plus == el.extra_plus && 
           v.plan_fix == el.plan_fix
        }) != undefined

        if (!duplicateRec && isHomePlus && isExtra) {
          e2e.selectCar(el)
          e2e.selectPlan(el)
          e2e.purchaseInfo(el, info)

          logUtils.write({
            brand: el.brand,
            model: el.veh_desc,
            type: el.type,
            car_year: el.car_year,
            home_plus: el.home_plus,
            extra_plus: el.extra_plus,
            plan_fix: el.plan_fix,
          })  
          logUtils.save(logPath)
        }
      })
    })
  });
})

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}