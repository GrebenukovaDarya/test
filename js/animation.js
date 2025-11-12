// ВИЗУАЛИЗАЦИЯ ---------------------------------------------------------------------

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