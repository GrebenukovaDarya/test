// Глобальные переменные
const dataInput = document.getElementById('dataInput');
const startButton = document.getElementById('startButton');
const visualization = document.getElementById('visualization');
const nextStep = document.getElementById('nextStep');
const playSort = document.getElementById('playSort');
const selectSort = document.getElementById('selectSort');
const selectSpeed = document.getElementById('selectSpeed');

//console.log("check ", selectSpeed);

let animation_speed = selectSpeed.value;
let data = [];
let sorted_data = [];
let currentArray = [];
let n = 0;
let i = 0, j = 0;
let tempr = 0;
let temprIndex = 0;
let minIndex = 0;

let comp_counter = 0;
let swap_counter = 0;
let isSorting = false;

const SVGwidth = 600;
const SVGheight = SVGwidth/2;
const elementPadding = 4;
let elementRadius = 0;

let sortName = selectSort.value;
let currentMode = 'step';


// Основные функции управления
function displayManageButtons(state){
  const manageButtons = document.getElementById('manage-wrapper');
  if (state === 'remove'){
    manageButtons.classList.remove('visible');
    manageButtons.classList.add('hidden');
  } else if (state == 'display') {
    manageButtons.classList.add('visible');
    manageButtons.classList.remove('hidden');
  }
}

function displayErrors(state, str){
  const errorBlock = document.getElementById('error-message-wrapper');
  if (state === 'remove'){
    errorBlock.classList.remove('visible');
    errorBlock.classList.add('hidden');
  } else if (state == 'display') {
    errorBlock.classList.add('visible');
    errorBlock.classList.remove('hidden');
    document.getElementById('error-mes').textContent = str;
  }
}

function updateCounters() {
  const compElement = document.getElementById('comp-counter');
  const swapElement = document.getElementById('swap-counter');
  
  if (compElement) compElement.textContent = comp_counter;
  if (swapElement) swapElement.textContent = swap_counter;
}

function endSort(){
  str = toString(comp_counter) + ' ' + toString(swap_counter);

  if(document.getElementById('end-message') == null) {
    d3.select('#visualization')
    .append('div')
    .attr('class', 'message')
    .attr('id', 'end-message')
    .text('Массив отсортирован');
  }
}

function disableControls() {
  nextStep.setAttribute('disabled', 'disabled');
  playSort.setAttribute('disabled', 'disabled');
}

function enableControls() {
  nextStep.removeAttribute("disabled");
  playSort.removeAttribute("disabled");
}

function resetSortState() {
  d3.selectAll('.activeElement, .comparing, .swapping')
    .classed('activeElement comparing swapping', false);
}

function updateGlobalData() {
  for (let k = 0; k < currentArray.length; k++) {
      data[k] = currentArray[k];
  }
}