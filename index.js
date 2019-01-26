const { Rule } = require('@cesium133/forgjs');
const NUMER_OF_CODE_VALIDATIONS = 2;

require("codemirror/mode/javascript/javascript");
require("codemirror/addon/edit/closebrackets");
require('codemirror/addon/edit/matchbrackets')

const codeMirror = require("codemirror");

const $ = a => document.querySelectorAll(a);

$('pre code').forEach((block) => {
  html = block.innerText;
  block.innerText = '';
  codeMirror(block, {
    value: html,
    mode: 'javascript',
    lineNumbers:true,
    theme:"one-dark",
    readOnly:true,
  });
});

const PhoneNumber = new Rule({
  type: 'string-int',
  minLength: 10,
  maxLength: 10,
  match: /0(7|6).*/,
});

const email = new Rule({
  type: 'email',
  domain: d => ['hotmail', 'outlook', 'gmail'].indexOf(d) !== -1,
});

const password = new Rule({
  type: 'password',
  minLength: 8,
  maxLength: 10,
  matchesOneOf: ['@', '_', '-', '.', '?', '$'],
  numbers: 1,
  uppercase: 1,
});

const url = new Rule({
  type: 'url',
  domain: domain => domain === 'github.com',
  protocol: protocol => protocol === 'https',
});

const country = new Rule({
  type: 'string',
  oneOf: ['FR', 'US', 'EN'],
});
const zipcode = new Rule({
  type: 'string-int',
  minLength: 5,
  maxLength: 5,
});

const street = new Rule({
  type: 'string',
  notEmpty: true,
});

const streetNumber = new Rule({
  type: 'string-int',
});

const rules = {
  'phone-number': PhoneNumber,
  password,
  email,
  url,
  zipcode,
  street,
  'street-number': streetNumber,
  country,

};


$('*[data-type]').forEach((e) => {
  e.addEventListener('keyup', (evt) => {
    const elem = evt.target;
    const { type } = elem.dataset;
    if (!rules[type]) {
      return;
    }
    if (!rules[type].test(elem.value)) {
      elem.classList.add('err');
      elem.classList.remove('valid');
    } else {
      elem.classList.remove('err');
      elem.classList.add('valid');
    }
  });
});

const editable =codeMirror.fromTextArea($('#palyArround')[0], {
  lineNumbers:true,
  mode:  "application/json",
  theme:"one-dark"
});

editable.on("cursorActivity", (e)=>{
  const prepared = `
    Rule.log = [];
    ${e.getValue()}
    return Rule.log;
  `;
  try{
    const res = Function("Rule",prepared)(customR);
    const doc = e.getDoc();
    let ln = 0;
    let times = 0
    doc.eachLine((line)=>{
      doc.removeLineClass(line,"gutter",'green');
      doc.removeLineClass(line,"gutter",'red');

      if(line.text.indexOf('.test(') !== -1){
        const cls = res[times] ? 'green': 'red'; 
        doc.addLineClass(line,"gutter",cls);
        times ++;
      }
      ln++;
    })
  }
  catch(err){
  }
  
})


class customR extends Rule{

  test(obj){
    const res = super.test(obj);
    customR.log.push(res);
    return res;
  }
}

function getScore(){
  const sum = $('.valid').length + ($('.green').length / 2);
  const max = $('input').length + NUMER_OF_CODE_VALIDATIONS;
  const score = Math.round((sum/max) * 100) ;
  return score;
}

function updateScore(){
  const score = getScore().toString();
  if($('.precent')[0].innerText !== score){
    $('.precent')[0].innerText = score;
  }
  if(score === '100'){
    const w = $('.winning')[0];
      w.classList.add('open');
      
      let i = setInterval(()=>{
        window.scrollTo(0,document.body.scrollHeight);
      });
      
      w.addEventListener("transitionend",()=>{
        clearInterval(i);
      })
  }
}
$('body')[0].addEventListener('keyup', updateScore);
$('body')[0].addEventListener('click', updateScore);

