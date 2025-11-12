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
  
          comp_counter++;
          updateCounters();
  
          if (currentArray[j] > currentArray[j + 1]) {
            [currentArray[j], currentArray[j + 1]] = [currentArray[j + 1], currentArray[j]];
              
            await visualizeSwap(j, j + 1);
  
            swap_counter++;
            updateCounters();
          }
      }
      j = 0;
    }
  }
  
  async function bubbleSortStep () {
    disableControls();
  
    if (i >= n - 1) {
      endSort();
      return;
    }
  
    comp_counter++;
    updateCounters();
  
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
      keyElement = d3.select(`[data-index="${temprIndex}"]`);
      keyElement.attr('data-index', 'key');
      const circle = keyElement.select('circle');
      if (circle.size() > 0) {
          circle.attr('element-index', 'key');
      }
  
      await ShiftUpElement(keyElement);
  
      while (j >= 0 && currentArray[j] > tempr) {
        if (!isSorting || currentMode !== 'full') {
          return;
        }
  
        comp_counter++;
        updateCounters();
  
        currentArray[j + 1] = currentArray[j];
        await visualizeShift(j, j + 1);
  
        j--;
      }
  
      currentArray[j + 1] = tempr;
  
      swap_counter++;
      updateCounters();
  
      await visualizeInsert(j + 1, 'key');
  
      j = i;
      temprIndex = i + 1;
      tempr = currentArray[temprIndex];
  
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
  
      if (minIndex !== i) {
        [currentArray[i], currentArray[minIndex]] = [currentArray[minIndex], currentArray[i]];
  
        const circle1 = d3.select(`[element-index="${minIndex}"]`);
        circle1.classed('selectedElement', false);
  
        await visualizeSwap(i, minIndex);
  
        swap_counter++;
        updateCounters();
      }
  
      const circle1 = d3.select(`[element-index="${minIndex}"]`);
      circle1.classed('selectedElement', false);
      await new Promise(resolve => setTimeout(resolve, animation_speed));
  
      minIndex = i + 1;
      j = i + 2;
    }
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
  
    enableControls();
    updateGlobalData();
  }