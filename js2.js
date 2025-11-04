const dataInput = document.getElementById('dataInput');
const startButton = document.getElementById('startButton');
const visualization = document.getElementById('visualization');

const nextStep = document.getElementById('nextStep');
const playSort = document.getElementById('playSort');

const selectSort = document.getElementById('selectSort');
const selectSpeed = document.getElementById('selectSpeed');

let animation_speed = selectSpeed.value;

let data = [];
let sorted_data = [];
let currentArray = [];
let n = 0;
let i = 0, j = 0;
let tempr = 0;
let temprIndex = 0;
let minIndex = 0;
// let flag = true;

let comp_counter = 0;
let swap_counter = 0;
let isSorting = false;

const SVGwidth = 600;
const SVGheight = SVGwidth/2;
const elementPadding = 4;
let elementRadius = 0;

let sortName = selectSort.value;
let currentMode = 'step';

document.getElementById("arrayGenerator").addEventListener('submit', generateArray);

// ---------------------------------
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

// ВВОД -----------------------------------------------------------------------------

selectSpeed.addEventListener("input", function(){
  animation_speed = selectSpeed.value;
  if (validateSpeed(animation_speed)) {
    displayErrors('remove');
    this.classList.remove('error-field');
  }
  else {
    console.log("speed error");
    //flag = false;
    displayErrors('display', 'Укажите скорость анимаций в мс в диапазоне [100; 10000]')
    this.classList.add('error-field');
  }
});

selectSort.addEventListener("change", function(){
  sortName = selectSort.value;
  
  // if (sortName == "insertionSort") {
  //   i = 1;
  //   j = i - 1;
  // }

  disableControls();

  //console.log(sortName);
});

// ВИЗУАЛИЗАЦИЯ ---------------------------------------------------------------------

function updateCounters() {
  const compElement = document.getElementById('comp-counter');
  const swapElement = document.getElementById('swap-counter');
  
  if (compElement) compElement.textContent = comp_counter;
  if (swapElement) swapElement.textContent = swap_counter;
}

function visualise (dataString) {

  visualization.innerHTML = '';

  data = dataString.split(',').map(Number);

  console.log(data);

  sorted_data = data.slice();
  sorted_data.sort(function (a, b) {
    return a - b;
  });

  n = data.length;

  elementRadius = (SVGwidth / data.length - 2 * elementPadding) / 2;

  const svg = d3.select('#visualization')
    .append('svg')
    .attr('width', SVGwidth)
    .attr('height', SVGheight);

  const circles = svg.selectAll('g')
    .data(data)
    .enter()
    .append('g')
    .attr('transform', (d, i) => {
      const xPosition = (i * (2 * elementRadius + 2 * elementPadding)) + elementRadius + elementPadding;
      const yPosition = SVGheight / 2;
      return `translate(${xPosition}, ${yPosition})`;
    })
    .attr('data-index', (d, i) => i);

  circles.append('circle')
    .attr('class', 'element')
    .attr('id', (d, i) => 'el' + String(i))
    .attr('r', elementRadius)
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('element-index', (d, i) => i);

  circles.append('text')
    .attr('text-anchor', 'middle')
    .attr('dy', '0.35em')
    .attr('class', 'element-text')
    .style('font-size', elementRadius / 2 + 'px')
    .text(d => String(d));
}

function switchElements(element1, element2) {
  return new Promise((resolve, reject) => {
    if (!element1 || element1.size() === 0 || !element2 || element2.size() === 0) {
      console.warn("switchElements: Один из элементов не найден");
      reject();
      return;
    }

    const index1 = parseInt(element1.attr('data-index'));
    const index2 = parseInt(element2.attr('data-index'));

    if (isNaN(index1) || isNaN(index2)) {
      console.warn("switchElements: Невалидные индексы ", index1, index2);
      reject();
      return;
    }

    const xPosition1 = (index2 * (2 * elementRadius + 2 * elementPadding)) + elementRadius + elementPadding;
    const xPosition2 = (index1 * (2 * elementRadius + 2 * elementPadding)) + elementRadius + elementPadding;
    const yPosition = SVGheight / 2;

    let completedAnimations = 0;
    const totalAnimations = 2;

    function checkCompletion() {
      completedAnimations++;
      if (completedAnimations === totalAnimations) {

          element1.attr('data-index', index2);
          element2.attr('data-index', index1);

          const circle1 = element1.select(`[element-index="${index1}"]`);
          const circle2 = element2.select(`[element-index="${index2}"]`);

          circle1.attr('element-index', index2);
          circle2.attr('element-index', index1);

          resolve();
      }
    }

  element1.transition()
    .duration(animation_speed)
    .attrTween("transform", function() {
      //const interpolateY = d3.interpolate(0, 1);

      function parabolicY(t) {
        const peakHeight = 50;
        const shiftedT = t * 2 - 1;
        const yOffset = peakHeight * (1 - shiftedT * shiftedT);
        return yPosition - yOffset;
      }
      
      const currentTransform = d3.select(this).attr("transform") || "translate(0,0)";
      const [x, y] = currentTransform.match(/translate\(([^,]+),([^)]+)\)/)?.slice(1).map(Number) || [0, 0];
      const interpolateX = d3.interpolate(x, xPosition1);
  
      return function(t) {
        const xCord = interpolateX(t);
        const yCord = parabolicY(t);
        return `translate(${xCord}, ${yCord})`;
      };
    })
    .on("end", checkCompletion);

    element2.transition()
    .duration(animation_speed)
    .attrTween("transform", function() {
      //const interpolateY = d3.interpolate(0, 1);

      function parabolicY(t) {
        const peakHeight = 50;
        const shiftedT = t * 2 - 1;
        const yOffset = peakHeight * (1 - shiftedT * shiftedT);
        return yPosition + yOffset;
      }
      
      const currentTransform = d3.select(this).attr("transform") || "translate(0,0)";
      const [x, y] = currentTransform.match(/translate\(([^,]+),([^)]+)\)/)?.slice(1).map(Number) || [0, 0];
      const interpolateX = d3.interpolate(x, xPosition2);
  
      return function(t) {
        const xCord = interpolateX(t);
        const yCord = parabolicY(t);
        
        return `translate(${xCord}, ${yCord})`;
      };
    })
    .on("end", checkCompletion);
  });
}

function shiftElement(element, toIndex) {
  if (!element) {
      console.warn("shiftElement: Элемент не найден");
      return Promise.resolve();
  }

  const newXPosition = (toIndex * (2 * elementRadius + 2 * elementPadding)) + elementRadius + elementPadding;
  const yPosition = SVGheight / 2;

  element.classed('active', true);

  return new Promise((resolve) => {
    element.transition()
        .duration(animation_speed)
        .attr('transform', `translate(${newXPosition}, ${yPosition})`)
        .on("end", function() {
          element.attr('data-index', toIndex);
          const circle = element.select('circle');
          if (circle.size() > 0) {
            circle.attr('element-index', toIndex);
          }
            element.classed('active', false);
            resolve();
        });
  });
}

function insertElement(element, toIndex) {
  if (element.size() === 0) {
      console.warn("insertElement: Элемент не найден");
      return Promise.resolve();
  }

  const newYPosition = SVGheight / 2;
  const newXPosition = (toIndex * (2 * elementRadius + 2 * elementPadding)) + elementRadius + elementPadding;
  
  // console.log("insertElement check");

  return new Promise((resolve) => {
    element.transition()
        .duration(animation_speed)
        .attr('transform', `translate(${newXPosition}, ${newYPosition})`)
        .on("end", function() {
            element.attr('data-index', toIndex);
            const circle = element.select('circle');
            if (circle.size() > 0) {
                circle.attr('element-index', toIndex);
            }
            element.classed('inserting', false);
            resolve();
        });
  });
}

async function visualizeSwap(index1, index2) {
  const element1 = d3.select(`[data-index="${index1}"]`);
  const circle1 = element1.select('circle');
    if (circle1.size() > 0) {
      circle1.classed('sortedElement', true);
    }
  const element2 = d3.select(`[data-index="${index2}"]`);
  const circle2 = element2.select('circle');
    if (circle2.size() > 0) {
      circle2.classed('sortedElement', true);
    }
  
  await switchElements(element1, element2);
  
  circle1.classed('sortedElement', false);
  circle2.classed('sortedElement', false);
}

async function visualizeShift(from, to) {

  const element1 = d3.select(`[data-index="${from}"]`);
  if (element1.size() === 0) return;

  await shiftElement(element1, to);
}

async function visualizeInsert(to, index1){

  const element1 = d3.select(`[data-index="${index1}"]`);
  if (element1.size() === 0) return;

  await insertElement(element1, to);
}

function ShiftUpElement(element){
  
  if (!element) {
    console.warn("insertElement: Элемент не найден");
    return Promise.resolve();
  }

  const transform = element.attr("transform");
  const match = transform.match(/translate\(([^,]+),([^)]+)\)/)
  const currentX = parseFloat(match[1])
  const currentY = SVGheight / 2;
  const newYPosition = SVGheight - SVGheight / 4; 

  return new Promise((resolve) => {
    element.transition()
      .duration(animation_speed)
      .attrTween("transform", function() {
        const interpolateY = d3.interpolate(currentY, newYPosition);
        const interpolateScale = d3.interpolate(1, 1.2);

        return function(t) {
          const yCord = interpolateY(t);
          const scale = interpolateScale(t);
            return `translate(${currentX}, ${yCord}) scale(${scale})`;
        };
      })
      .on("end", function() {
        d3.select(this).transition()
          .duration(animation_speed / 2)
          .attr('transform', `translate(${currentX}, ${newYPosition})`);
        resolve();
      });
  });
}

// УПРАВЛЕНИЕ ---------------------------------------------------------------------

startButton.addEventListener('click', () => {

  // flag = true;

  comp_counter = 0;
  swap_counter = 0;

  if (sortName == "insertionSort") {
    i = 1;
    j = i - 1;
    temprIndex = i;
  }
  else {
    i = 0;
    j = 0;
    minIndex = i;
  }

  const dataString = dataInput.value;
  
  if(validateInput(dataString) && validateSpeed(animation_speed)){
    visualise(dataString);

    enableControls();
    displayManageButtons('display');
    updateCounters();
  }

});

playSort.addEventListener('click', () => {

  playFullSort(data);

});

nextStep.addEventListener('click', () => {

  console.log("click");

  if (!validateSpeed(animation_speed)) {
    console.log("ERROR");
    return false;
  }
  if (!validateArray(data)) {
    console.log("ERROR");
    return false;
  }

  currentArray = [...data];

  currentSortMode = 'step';
  
  window[sortName + "Step"]();
  
});

function endSort(){

  //console.log("comp " + comp_counter);
 // console.log("swap " + swap_counter);

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

// ---------------------------------------------------------------------------------
function resetSortState() {
  d3.selectAll('.activeElement, .comparing, .swapping')
    .classed('activeElement comparing swapping', false);
}

function updateGlobalData() {

  for (let k = 0; k < currentArray.length; k++) {
      data[k] = currentArray[k];
  }
}

// СОРТИРОВКИ -----------------------------------------------------------------------

async function playFullSort(arr) {

  currentMode = 'full';
  currentArray = [...arr];
  isSorting = true;

  disableControls();

  await window[sortName]();

  endSort();
}

async function bubbleSort() {
  for (; i < n - 1; i++) {
    for (; j < n - i - 1; j++) {
        
        if (!isSorting || currentMode !== 'full') {
            return;
        }

        // const circle1 = d3.select(`[element-index="${j}"]`);
        // circle1.classed('sortedElement', true);

        comp_counter++;
        updateCounters();

        // const circle2 = d3.select(`[element-index="${j + 1}"]`);
        // circle2.classed('activeElement', true);

        if (currentArray[j] > currentArray[j + 1]) {

          // const circle2 = d3.select(`[element-index="${j + 1}"]`);
          // circle2.classed('activeElement', true);

          [currentArray[j], currentArray[j + 1]] = [currentArray[j + 1], currentArray[j]];
            
          await visualizeSwap(j, j + 1);
          //await new Promise(resolve => setTimeout(resolve, animation_speed));

          swap_counter++;
          updateCounters();

          //circle2.classed('activeElement', false);  
        }
        
        //await new Promise(resolve => setTimeout(resolve, animation_speed));

        // circle2.classed('activeElement', false);
        // circle1.classed('sortedElement', false);
    }
    j = 0;
  }

  // console.log("finish sorting");
  // console.log("final arr " + data);
  // console.log("final arr " + currentArray);
}

async function bubbleSortStep () {

  //console.log("1");

  // if (!isSorting || currentMode !== 'step') {
  //   return;
  // }

  //console.log("2");

  disableControls();

  if (i >= n - 1) {
    endSort();
    return;
  }

 // const circle1 = d3.select(`[element-index="${j}"]`);
  //circle1.classed('activeElement', true);

  comp_counter++;
  updateCounters();

  //console.log("currArray " + currentArray);

  //const circle2 = d3.select(`[element-index="${j + 1}"]`);
  //circle2.classed('activeElement', true);

  if (currentArray[j] > currentArray[j + 1]) {
    [currentArray[j], currentArray[j + 1]] = [currentArray[j + 1], currentArray[j]];
    
    console.log("CHECK");

    await visualizeSwap(j, j + 1);

    swap_counter++;
    updateCounters();
  }
  else{
    const circle1 = d3.select(`[element-index="${j}"]`);
    circle1.classed('activeElement', true);
    
    const circle2 = d3.select(`[element-index="${j + 1}"]`);
    circle2.classed('activeElement', true);

    await new Promise(resolve => setTimeout(resolve, animation_speed));

    circle2.classed('activeElement', false);
    circle1.classed('activeElement', false);
  }


  if (j < n - i - 2) {
    j++;
  } else {
    j = 0;
    i++;
  }

  enableControls();
  updateGlobalData();
}

async function insertionSort(){

  tempr = currentArray[temprIndex];

  for (; i < n; i++) {

    // console.log(temprIndex);
    keyElement = d3.select(`[data-index="${temprIndex}"]`);
    keyElement.attr('data-index', 'key');
    const circle = keyElement.select('circle');
    if (circle.size() > 0) {
        circle.attr('element-index', 'key');
    }

    await ShiftUpElement(keyElement);
    // await new Promise(resolve => setTimeout(resolve, animation_speed));

    // console.log("i " + i);
    // console.log("j " + j);
    // console.log("currentArray[j] " + currentArray[j]);
    // console.log("tempr " + tempr);

    while (j >= 0 && currentArray[j] > tempr) {

      // console.log("ch");
      if (!isSorting || currentMode !== 'full') {
        return;
      }

      comp_counter++;
      updateCounters();

      currentArray[j + 1] = currentArray[j];
      await visualizeShift(j, j + 1);
      //await new Promise(resolve => setTimeout(resolve, animation_speed));

      j--;
    }

    //console.log("else", i, j);
    currentArray[j + 1] = tempr;

    swap_counter++;
    updateCounters();

    //console.log("seek " + (j + 1));

    await visualizeInsert(j + 1, 'key');
    //await new Promise(resolve => setTimeout(resolve, animation_speed));

    //console.log(tempr + " jjj");

    j = i;
    temprIndex = i + 1;
    tempr = currentArray[temprIndex];

    //console.log("check insertionsort step1");

    for (let k = 0; k <= i; k++) {
      const circle = d3.select(`[element-index="${k}"]`);
      circle.classed('sortedElement', true);
    }

    console.log("cur " + currentArray);
  }
  
}

async function insertionSortStep(){

  disableControls();

  if (i >= n) {
    for (let k = 0; k < n; k++) {
        const circle = d3.select(`[element-index="${k}"]`);
        circle.classed('sortedElement', true);
    }
    endSort();
    return;
  }

  keyElement = d3.select(`[data-index="key"]`);

  if (keyElement.size() === 0) {

    tempr = currentArray[temprIndex];
    keyElement = d3.select(`[data-index="${temprIndex}"]`);
    keyElement.attr('data-index', 'key');
    const circle1 = keyElement.select('circle');
    if (circle1.size() > 0) {
        circle1.attr('element-index', 'key');
    }

    await ShiftUpElement(keyElement);

  } else if (j >= 0 && currentArray[j] > tempr) {

    comp_counter++;
    updateCounters();

    currentArray[j + 1] = currentArray[j];
    await visualizeShift(j, j + 1);
    j--;

  } else {

    currentArray[j + 1] = tempr;

    swap_counter++;
    updateCounters();

    await visualizeInsert(j + 1, 'key');

    for (let k = 0; k <= i; k++) {
      const circle = d3.select(`[element-index="${k}"]`);
      circle.classed('sortedElement', true);
    }

    j = i;
    i++;
    temprIndex = i;
  }

  enableControls();
  updateGlobalData();
}

async function selectionSort(){
  for (; i < n - 1; i++) {
    for (; j < n; j++) {

      if (!isSorting || currentMode !== 'full') {
        return;
      }

      comp_counter++;
      updateCounters();

      if (currentArray[j] < currentArray[minIndex]) {

        const circle1 = d3.select(`[element-index="${minIndex}"]`);
        circle1.classed('selectedElement', false);

        minIndex = j;

        const circle2 = d3.select(`[element-index="${minIndex}"]`);
        circle2.classed('selectedElement', true);

        await new Promise(resolve => setTimeout(resolve, animation_speed));
      }
    }

    //comp_counter++;
    //updateCounters();

    if (minIndex !== i) {

      [currentArray[i], currentArray[minIndex]] = [currentArray[minIndex], currentArray[i]];

      const circle1 = d3.select(`[element-index="${minIndex}"]`);
      circle1.classed('selectedElement', false);

      await visualizeSwap(i, minIndex);


      swap_counter++;
      updateCounters();

    }
    //await new Promise(resolve => setTimeout(resolve, animation_speed));

    const circle1 = d3.select(`[element-index="${minIndex}"]`);
    circle1.classed('selectedElement', false);
    await new Promise(resolve => setTimeout(resolve, animation_speed));

    minIndex = i + 1;

    j = i + 2;
  }

  // for (let k = 0; k <= n; k++) {
  //   const circle = d3.select(`[element-index="${k}"]`);
  //   circle.classed('selectedElement', false);
  // }
}

async function selectionSortStep(){

  disableControls();

  if (i >= n - 1) {
    endSort();
    const circle2 = d3.select(`[element-index="${minIndex}"]`);
    circle2.classed('selectedElement', false);
    return;
  }

  if (j === i + 1) {

    const circle1 = d3.select(`[element-index="${minIndex}"]`);
    circle1.classed('selectedElement', false);

    minIndex = i;

    const circle2 = d3.select(`[element-index="${minIndex}"]`);
    circle2.classed('selectedElement', true);
  
    await new Promise(resolve => setTimeout(resolve, animation_speed));
  }

  comp_counter++;
  updateCounters();
  console.log(comp_counter + " i: " + i + " j: " + j);

  if (j < n) {

    if (currentArray[j] < currentArray[minIndex]) {
        minIndex = j;
    }

    j++;
    
    if (j >= n) {
        if (minIndex !== i) {
            [currentArray[i], currentArray[minIndex]] = [currentArray[minIndex], currentArray[i]];
            
            await visualizeSwap(i, minIndex);

            swap_counter++;
            updateCounters();
        }
        
        i++;
        j = i + 1;
    }
    else{
      const circle1 = d3.select(`[element-index="${j}"]`);
      circle1.classed('activeElement', true);
      
      const circle2 = d3.select(`[element-index="${minIndex}"]`);
      circle2.classed('activeElement', true);
  
      await new Promise(resolve => setTimeout(resolve, animation_speed));
  
      circle2.classed('activeElement', false);
      circle1.classed('activeElement', false);
    }
  }

  //await new Promise(resolve => setTimeout(resolve, animation_speed));

  enableControls();
  updateGlobalData();
}

// ВАЛИДАЦИЯ ------------------------------------------------------------------------

function validateInput(dataString){
  if (/^\s*\d+(\s*,\s*\d+)*\s*$/.test(dataString)) {
    dataInput.classList.remove('error-field');
    return true;
  }
  else {
    dataInput.classList.add('error-field');
    displayErrors('display', 'Некорректные данные');
    return false;
  }
}

function validateArray(arr) {
  try {
    if(Array.isArray(arr)){
      return arr.length;
    }
    else{
      throw new Error("not array");
    }
  } catch (error) {
    console.error("given value is not an array");
    return false;
  }
}

function validateSpeed(val){
  try {
    const number = parseInt(val);

    if(isNaN(number)){
      throw new Error("not number");
    }

    return Number.isInteger(number) && number >= 100 && number <= 10000;

  } catch (error) {
    console.error("animation_speed is not a number");
    return false;
  }
}

// ГЕНЕРАЦИЯ МАССИВА ----------------------------------------------------------------

function generateArray(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  const len = data.arrayLength;
  // console.log(len);
  // console.log(data.arrayType);
  const array = window[data.arrayType + 'Array'](len);

  //console.log("array check");
  console.log(array);
  const stringArray = array.join(', ');
  dataInput.value = stringArray;

}

function randomArray(len) {
  console.log("check func randomArray");
  let max = 100;
  let min = 0;
  arr = [];
  for (let i = 0; i < len; i++) {
    arr[i] = Math.floor(Math.random() * (max - min + 1)) + min;
  }
  return arr;
}

function reverseSortedArray(len) {
  console.log("check func reverseSortedArray");
  let max = 100;
  let min = 0;
  let arr = [];
  for (let i = 0; i < len; i++) {
    arr[i] = Math.floor(Math.random() * (max - min + 1)) + min;
  }
  arr.sort(function (a, b) {
    return a - b;
  });
  return arr.reverse();
}

function almostSortedArray(len) {
  console.log("check func almostSortedArray");
  let max = 100;
  let min = 0;
  let arr = [];
  for (let i = 0; i < len; i++) {
    arr[i] = Math.floor(Math.random() * (max - min + 1)) + min;
  }
  arr.sort(function (a, b) {
    return a - b;
  });
  const dis = Math.floor(len * 0.15);

  for (let i = 0; i < dis; i++) {
    const index1 = Math.floor(Math.random() * len);
    const index2 = Math.floor(Math.random() * len);
    [arr[index1], arr[index2]] = [arr[index2], arr[index1]];
  }
  return arr;
}