// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'


import { th, Faker } from '@faker-js/faker';
import thaiIdCard from "thai-id-card"

const fakerTh = new Faker({
  locale: [th]
})

var logPath = "cypress/log/etc/log.json"

// Alternatively you can use CommonJS syntax:
// require('./commands')

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  return false
})

export function selectCar(element) {  
  var plus = ""
  if (element.type > 1) { plus = '-plus' }
  
  cy.wait(1000);
  cy.get(`[data-test="button-planType-${element.type}${plus}"]`).click();

  cy.get('[data-test="input-car-year"]', { timeout: 500 }).type(element.car_year);
  cy.get('[data-test="input-car-year"]', { timeout: 500 }).type('{downArrow}{enter}');

  cy.get('[data-test="input-car-brand"]', { timeout: 500 }).type(element.brand);
  cy.get('[data-test="input-car-brand"]', { timeout: 500 }).type('{downArrow}{enter}');

  cy.wait(1000);
  cy.get('[data-test="input-car-model"]', { timeout: 500 })
    .invoke('val')
    .then(text => {
      if (text.trim() == '') {
        cy.get('[data-test="input-car-model"]', { timeout: 500 }).type(element.veh_desc);
        cy.get('[data-test="input-car-model"]', { timeout: 500 }).type('{downArrow}{enter}');
      }
      cy.get('[data-test="button-check-price"]').click();
    });
}

export function selectPlan(element) {
  cy.get("body").then($body => {
    if ($body.find('[id="onetrust-accept-btn-handler"]').length > 0) {   
      cy.get('[id="onetrust-accept-btn-handler"]').click();
    }
  });

  const id = `${element.campaign}-${element.sum_insure}`
  cy.contains("แนะนำแผนประกัน", { timeout: 25000 }).then(() => {
    if (element.plan_date == 30)      { cy.get('[id="hour1"]').click(); } 
    else if (element.plan_date == 90) { cy.get('[id="hour2"]').click(); }
  
    cy.get("#select-plan-" + id).click({ force: true, timeout: 25000 })
  
    cy.get('[id="purchase-order"]').click();
  })
}

export function purchaseInfo(element, info) {
  let value = {
    chassis: randomNumber(),
    licensePlateNo: randomPlateNumber(),
    licensePlateProvince: "กรุงเทพมหานคร",
    displacement: "1500",
    insurePrename: "นางสาว",
    insureName: `${fakerTh.person.firstName()} ${fakerTh.person.lastName()}`,
    insureIdCardNo: thaiIdCard.generate(),
    insureMobileNo: "0923239376",
    insureEmail: "thanaruktvi@gmail.com",
    address: "98/32 หมู่บ้านศุภาลัย ไพร์ด บางใหญ่ ถนนประชาอุทิศ",
    province: "จ.นนทบุรี",
    district: "อ.บางใหญ่",
    subDistrict: "บ้านใหม่",
  }

  cy.get("body").then($body => {
    if ($body.find('[id="onetrust-accept-btn-handler"]').length > 0) {   
      cy.get('[id="onetrust-accept-btn-handler"]').click();
    }
  });

  //HomePlus/ExtraPlus 
  cy.wait(1000)
  if(element.plan_date != 30 && info.homePlus) {
    cy.get('[id="home_flag"]', { timeout: 10000 }).should('be.visible');
    cy.get('[id="home_flag"]').click()
    cy.get('[id="confirm_owner_flag"]').click()
    cy.get('[id="btn-confirm-owner-home"]').click()
  }
  
  if([365, 730].includes(element.plan_date) && info.extraPlus) {
    cy.get('[class="checkbox-btn pull-left"]', { timeout: 10000 }).should('be.visible');
    cy.get('[id="extra_flag"]').check()
  }
  
   //PromocodepurchaseData
   if (info.promoCode != undefined) cy.get('[id="promocode"]').type(info.promoCode)

  //vehicle info
  cy.get('[id="car_plate_number"]').type(value.licensePlateNo);
  cy.get('[name="car_plate_province"]').select(value.licensePlateProvince);

  cy.get('[id="chassis_number"]').type(value.chassis);
  cy.get('[id="re_chassis_number"]').type(value.chassis);


  cy.get("body").then($body => {
    if ($body.find('[id="displacement"]').length > 0) {   
      cy.get('[id="displacement"]').type(value.displacement)
    }
  });

  //insure info
  cy.get('[id="insured_title"]').select(value.insurePrename);
  cy.get('[id="insured_name"]').focus().clear().invoke('val', value.insureName);
  cy.get('[id="insured_national_id"]').focus().clear().invoke('val', value.insureIdCardNo);
  cy.get('[id="insured_mobile"]').focus().clear().invoke('val', value.insureMobileNo);
  cy.get('[id="insured_email"]').focus().clear().invoke('val', value.insureEmail)

  //addr info
  cy.get('[id="address"]').focus().clear().invoke('val', value.address);
  cy.get('[id="province"]').select(value.province);
  cy.get('[id="district"]').select(value.district);
  cy.get('[id="subdistrict"]').select(value.subDistrict);

  //contract info
  //used same insure info
  cy.get('[id="contact_flag"]').click();

  //read policy
  cy.get('[class="box_policy"]').scrollTo('bottom');

  //accept policy
  cy.get('[id="policy"]').click();

  cy.get('[id="onetrust-accept-btn-handler"]').should(($el) => {
    if ($el.is('visible') && $el.length > 0) {
      cy.get('[id="onetrust-accept-btn-handler"]', {force: true}).click();
    }
  })

  cy.get('@init').then((init) => {
    cy.screenshot(`${info.brand}/${init.timestamp}/${element.veh_desc}/${element.car_year}/${element.type}/${element.campaign}/${element.code}`);
  })
  
  //submit purchase insure
  cy.get('[id="button-submit"]').click();
  cy.get('[class="swal2-actions"]').contains("ยืนยัน", { timeout: 10000 }).click();

 
  cy.get("body").then($body => {
    if (element.type > 1) {
      cy.get('[id="button-confirm"]').click();
      paymentInfo()
    } else {
      if ($body.find('[id="button-back"]').length > 0) {   
        cy.get('[id="button-back"]').click();
      } else {
        cy.get('.botton_submit').click();
      }
    }
  });
}

function paymentInfo() {
  const payment = {
    cardName: "test",
    cardNo: '4242424242424242',
    expMonth: "01",
    expYear: "2030",
    ccv: "123"
  }

  cy.wait(1000)
  cy.get('#card-number').type(payment.cardNo);
  cy.get('select[id="card-expiration-month"]').select(payment.expMonth).should('have.value', payment.expMonth) ;    
  cy.get('select[id="card-expiration-year"]').select(payment.expYear).should('have.value', payment.expYear);
  cy.get ('[id="card-name"]').type(payment.cardName);

  cy.get ('[ id="card-ccv"]').type(payment.ccv);
  cy.get ('[id="button-confirm"]').click();

  confirm()
}

function confirm() {
  cy.wait(1000)
  cy.get ('[class="btn btn-success btn-confirm"]', { timeout: 10000 }).click();
}



// ***********************************************************************************


const randomNumber = () => {
  const randomDigits = Math.floor(Math.random() *1000000)
  .toString()
  .padStart(10, "0");
  return randomDigits.toString()
}

function randomPlateNumber() {
  var char = Math.floor(Math.random() * 10)
  for (var i = 0; i < 2; i++) {
      const maxChar = 'ฮ'.charCodeAt(0)
      const minChar = 'ก'.charCodeAt(0)
      char += String.fromCharCode(Math.random() * (maxChar - minChar) + minChar)
  }
  char +=  Math.floor(Math.random() * 10000)
  return char
}

String.prototype.isNumber = function(){return /^\d+$/.test(this);}