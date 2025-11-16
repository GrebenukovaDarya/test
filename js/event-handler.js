// Обработчики событий
showArrayForm.addEventListener("click", () => {
  const form = document.getElementById('generator-wrapper');

  form.classList.toggle('hidden');
});


selectSpeed.addEventListener("input", function(){
    animation_speed = selectSpeed.value;
    if (validateSpeed(animation_speed)) {
      displayErrors('remove');
      this.classList.remove('error-field');
    }
    else {
      console.log("speed error");
      displayErrors('display', 'Укажите скорость анимаций в мс в диапазоне [100; 10000]')
      this.classList.add('error-field');
    }
  });
  
  selectSort.addEventListener("change", function(){
    sortName = selectSort.value;
    disableControls();
  });
  
  startButton.addEventListener('click', () => {
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

    const block = document.getElementById('success-message-wrapper');
    block.classList.remove('visible');
    block.classList.add('hidden');
  
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
    //console.log("click");
  
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
  
  // Инициализация
document.getElementById("arrayGenerator").addEventListener('submit', generateArray);


function generateArray(event) {
    event.preventDefault();

    console.log("generate");
  
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