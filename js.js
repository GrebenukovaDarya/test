const dataInput = document.getElementById('dataInput');
const startButton = document.getElementById('startButton');
const visualization = document.getElementById('visualization');

const nextStep = document.getElementById('nextStep');
const playSort = document.getElementById('playSort');

const selectSort = document.getElementById('selectSort');

const selectSpeed = document.getElementById('selectSpeed');

let animation_speed = 1000;

let data = [];
let sorted_data = [];
let n = 0;
let i = 0, j = 0;
let tempr = 0;
let flag = true;

let comp_counter = 0;
let swap_counter = 0;

const SVGwidth = 600;
const SVGheight = SVGwidth/2;
const elementPadding = 4;
let elementRadius = 0;

let sortName = 'bubbleSort';

document.getElementById("arrayGenerator").addEventListener('submit', generateArray);

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

function generateArray(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  const len = data.arrayLength;
  // console.log(len);
  // console.log(data.arrayType);
  const array = window[data.arrayType + 'Array'](len);

  // console.log("array check");
  // console.log(array);
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

selectSpeed.addEventListener("input", function(){
  animation_speed = selectSpeed.value;
  if (validateSpeed(animation_speed)) {
    
    this.classList.remove('error-field');
  }
  else {
    console.log("speed error");
    flag = false;
    this.classList.add('error-field');
  }
})

selectSort.addEventListener("change", function(){
  sortName = selectSort.value;
  
  if (sortName == "insertionSort") {
    i = 1;
    j = i - 1;
  }
  //console.log(sortName);
});

function switchElements(element1, element2) {

  //console.log(element1, element2);
  if (!element1 || !element2) {
    console.warn("switchElements: Один из элементов не найден (null или undefined).");
    return;
  }

  //const circle1 = element1.select('circle');
  //circle1.classed('activeElement', true);

  //console.log(element1.attr('data-index'))
  const index1 = parseInt(element1.attr('data-index'));
  //console.log(element2.attr('data-index'))
  const index2 = parseInt(element2.attr('data-index'));

  const xPosition1 = (index2 * (2 * elementRadius + 2 * elementPadding)) + elementRadius + elementPadding;
  const xPosition2 = (index1 * (2 * elementRadius + 2 * elementPadding)) + elementRadius + elementPadding;
  const yPosition = SVGheight / 2;

  element1.transition()
    .duration(animation_speed)
    .attrTween("transform", function() {

      const interpolateY = d3.interpolate(0, 1);

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
    });
    
/*
  element2.transition()
    .duration(1500)
    .attr('transform', `translate(${xPosition2}, ${yPosition})`);*/

    element2.transition()
    .duration(animation_speed)
    .attrTween("transform", function() {

      const interpolateY = d3.interpolate(0, 1);

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
    });

  element1.attr('data-index', index2);
  element2.attr('data-index', index1);
  const circle1 = element1.select(`[element-index="${index1}"]`);
  const circle2 = element2.select(`[element-index="${index2}"]`);
  circle1.attr('element-index', index2);
  circle2.attr('element-index', index1);

}

async function bubbleSort(arr) {

  comp_counter = 0;
  swap_counter = 0;

  nextStep.setAttribute('disabled', 'disabled');
  playSort.setAttribute('disabled', 'disabled');

  const n = arr.length;
  for (i = 0; i < n - 1; i++) {
    for (j = 0; j < n - i - 1; j++) {

      const circle1 = d3.select(`[element-index="${j}"]`);
      circle1.classed('activeElement', true);

      comp_counter++;
      //console.log("ch: " + i + " " + j)

      if (arr[j] > arr[j + 1]) {
        
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;

        const element1 = d3.select(`[data-index="${j}"]`);
        const element2 = d3.select(`[data-index="${j + 1}"]`);

        switchElements(element1, element2);
        swap_counter++;

        await new Promise(resolve => setTimeout(resolve, animation_speed));
        
      }
      circle1.classed('activeElement', false);
    }
  }
  //console.log('fin');

  endSort()

  nextStep.removeAttribute("disabled")
  playSort.removeAttribute("disabled")
}

async function bubbleSortStep () {
  nextStep.setAttribute('disabled', 'disabled');

  const circle1 = d3.select(`[element-index="${j}"]`);
  circle1.classed('activeElement', true);

    if (i < n - 1 && i < n - i - 1){
      comp_counter++;
      //console.log("ch: " + i + " " + j)
    }
    
    if (data[j] > data[j+1]) {
      const element1 = d3.select(`[data-index="${j}"]`);
      const element2 = d3.select(`[data-index="${j + 1}"]`);

      let temp = data[j];
      data[j] = data[j + 1];
      data[j + 1] = temp;

      //const currentClass = circle1.attr('class') || '';
      //circle1.attr('class', currentClass + ' activeElement');

      switchElements(element1, element2);
      swap_counter++;

    }

    await new Promise(resolve => setTimeout(resolve, animation_speed));

    if (j < n - i - 2) {
      j++;
      circle1.classed('activeElement', false);
    } else {
      j = 0;
      i++;
      circle1.classed('activeElement', false);
    }

    nextStep.removeAttribute("disabled")
}

async function selectionSort(arr) {

  comp_counter = 0;
  swap_counter = 0;

  nextStep.setAttribute('disabled', 'disabled');
  playSort.setAttribute('disabled', 'disabled');

  for (i = 0; i < n - 1; i++) {
    let minIndex = i;
    for (j = i + 1; j < n; j++) {

      comp_counter++;
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }

    comp_counter++;
    if (minIndex !== i) {

        let temp = arr[i];
        arr[i] = arr[minIndex];
        arr[minIndex] = temp;

        const element1 = d3.select(`[data-index="${i}"]`);
        const element2 = d3.select(`[data-index="${minIndex}"]`);

        switchElements(element1, element2);
        swap_counter++;

        await new Promise(resolve => setTimeout(resolve, animation_speed));
    }
    
  }

  endSort();

  nextStep.removeAttribute("disabled")
  playSort.removeAttribute("disabled")
}

async function selectionSortStep() {

  nextStep.setAttribute('disabled', 'disabled');

  let minIndex = i; 

  for (let j = i + 1; j < n; j++) {

    comp_counter++;
    if (data[j] < data[minIndex]) {
      minIndex = j;
    }
  }

  comp_counter++;
  if (minIndex !== i) {

    let temp = data[i];
    data[i] = data[minIndex];
    data[minIndex] = temp;

    const element1 = d3.select(`[data-index="${i}"]`);
    const element2 = d3.select(`[data-index="${minIndex}"]`);

    switchElements(element1, element2);
    swap_counter++;

    await new Promise(resolve => setTimeout(resolve, animation_speed));
  }

  i++;
  nextStep.removeAttribute("disabled")
}

async function insertionSort(arr) {

  comp_counter = 0;
  swap_counter = 0;

  nextStep.setAttribute('disabled', 'disabled');
  playSort.setAttribute('disabled', 'disabled');

  for (i = 1; i < n; i++) {

    const circle1 = d3.select(`[element-index="${i}"]`);
    circle1.classed('activeElement', true);

    const temp = arr[i];
    j = i - 1;

    comp_counter++;
    while (j >= 0 && arr[j] > temp) {

      const element1 = d3.select(`[data-index="${j}"]`);
      const element2 = d3.select(`[data-index="${j + 1}"]`);

      switchElements(element1, element2);
      swap_counter++;

      await new Promise(resolve => setTimeout(resolve, animation_speed));

      arr[j + 1] = arr[j];
      j = j - 1;

      //console.log(i, j);
    }

    //console.log("else", i, j);
    arr[j + 1] = temp;

    circle1.classed('activeElement', false);
  }

  endSort();

  nextStep.removeAttribute("disabled")
  playSort.removeAttribute("disabled")

  //console.log(arr);
}

async function insertionSortStep() {

  nextStep.setAttribute('disabled', 'disabled');

  if (j == i - 1) {
    tempr = data[i];
  }
  if (j >= 0 && data[j] > tempr) {

    const element1 = d3.select(`[data-index="${j}"]`);
    const element2 = d3.select(`[data-index="${j + 1}"]`);

    switchElements(element1, element2);
    swap_counter++;

    await new Promise(resolve => setTimeout(resolve, animation_speed));

    data[j + 1] = data[j];
    j = j - 1;

    //console.log(i, j);
    
    if(j < 0 || data[j] <= tempr) {

      //console.log("else", i, j);

      data[j + 1] = tempr;
      i++;
      j = i - 1;
    }
  }
  else {
    //console.log("else", i, j);

    data[j + 1] = tempr;
    i++;
    j = i - 1;
  }

  nextStep.removeAttribute("disabled")
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

startButton.addEventListener('click', () => {

  comp_counter = 0;
  swap_counter = 0;

  if (sortName == "insertionSort") {
    i = 1;
    j = i - 1;
  }
  else {
    i = 0;
    j = 0;
  }

  const dataString = dataInput.value;
  
  if (/^\s*\d+(\s*,\s*\d+)*\s*$/.test(dataString)) {
    visualise(dataString);
    dataInput.classList.remove('error-field');
  }
  else {
    dataInput.classList.add('error-field');
    //console.log('error');
  }
});

playSort.addEventListener('click', () => {

  window[sortName](data);

});

nextStep.addEventListener('click', () => {

  if (!validateSpeed(animation_speed)) {

    console.log("ERROR");
    return false;
  }
  if (!validateArray(data)) {

    console.log("ERROR");
    return false;
  }

  //console.log(data);
  //console.log(sorted_data);
  //console.log(n);

  if (!(sorted_data.toString() === data.toString())) {

    //bubbleSortStep();
    const sortStep = sortName + "Step";
    window[sortName + "Step"]();
    
  }
  else {

    console.log("fin");

    endSort()
  }
});

function endSort(){

  console.log("comp " + comp_counter);
  console.log("swap " + swap_counter);

  str = toString(comp_counter) + ' ' + toString(swap_counter);

  if(document.getElementById('end-message') == null) {
    d3.select('#visualization')
    .append('div')
    .attr('class', 'message')
    .attr('id', 'end-message')
    .text('Массив отсортирован');
  }
}