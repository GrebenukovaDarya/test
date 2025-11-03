
const displayGen = document.getElementById('generateArray');
const generator = document.getElementById('generator-wrapper');

displayGen.addEventListener('click', function() {
  if(generator.classList.contains('hidden')) {
    generator.classList.remove('hidden');
    generator.classList.add('visible');
  } else {
    generator.classList.remove('visible');
    generator.classList.add('hidden');
  }
});
