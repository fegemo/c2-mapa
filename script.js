var modal = document.getElementById('simpleModal');
var modalBtn = document.getElementById('modalBtn');
var closeBtn = document.getElementsByClassName('closeBtn')[0];
var historiaBtn = document.getElementById('historia');
var hmodal = document.getElementById('historiaModal');

modalBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', outsideClick);


function openModal(){
  modal.classList.add('modal-visible');
  // modal.style.display = 'block';
}

function closeModal(){
  modal.classList.remove('modal-visible');
  // modal.style.display = 'none';
}

function outsideClick(e){
  if(e.target == modal){
    // modal.style.display = 'none';
    modal.classList.remove('modal-visible');
  }
}


if('geolocation' in navigator){
    const watcher = navigator.geolocation.watchPosition(function(position){
      console.log(position)
    }, function(error){
      console.log(error)
    })
}else{
  alert('ops,nao foi possivel te localizar.Tente em outro navegador');
}

historiaBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', outsideClick);


function openModal(){
  modal.classList.add('modal-visible');
  // modal.style.display = 'block';
}

function closeModal(){
  modal.classList.remove('modal-visible');
  // modal.style.display = 'none';
}

function outsideClick(e){
  if(e.target == modal){
    // modal.style.display = 'none';
    modal.classList.remove('modal-visible');
  }
}

class Coord {
	constructor(x, y) {
  	this.x = x;
    this.y = y;
  }

  dot(other) {
  	return this.x * other.x + this.y * other.y;
  }

  static fromCoords(p1, p0) {
  	return new Coord(p1.x - p0.x, p1.y - p0.y);
  }
}

const referencePointsOnCampus = {
  left: new Coord(-19.938289, -43.998639),
  top: new Coord(-19.939804, -43.998548),
  right: new Coord(-19.939207, -43.999876)
};

const pixelPointsOnImage = {
  left: new Coord(333, 884),
  top: new Coord(560, 216),
  right: new Coord(985, 754)
};

// retorna o quão próximo está de cada um dos três pontos de referência
// esta função retorna um "array de pesos", que somam 1, e representam
// em "termos percentuais", em que parte do triângulo o ponto passado como
// parâmetro está
function triangulatePosition(latitude, longitude) {
  const top = referencePointsOnCampus.top;
	const left = referencePointsOnCampus.left;
	const right = referencePointsOnCampus.right;

	const v0 = Coord.fromCoords(top, left);
  const v1 = Coord.fromCoords(right, left);
  const v2 = Coord.fromCoords(new Coord(latitude, longitude), left);

  const dot00 = v0.dot(v0);
	const dot01 = v0.dot(v1);
  const dot02 = v0.dot(v2);
  const dot11 = v1.dot(v1);
  const dot12 = v1.dot(v2);

  const invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
	const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
	const v = (dot00 * dot12 - dot01 * dot02) * invDenom;
  const w = 1 - u - v;

	return [w, u, v];
}


// Dados "pesos" para os pontos de referência, acha, em px, qual o left/top
// considerando a largura e a altura da imagem do mapa na tela
// retorna um objeto que possui propriedades left/top numéricas, em pixels
function positionInTheMap(weightLeft, weightTop, weightRight) {
  // const mapEl = document.querySelector('#map > img');
  // const mapWidth = mapEl.width;
  // const mapHeight = mapEl.height;

  // mapHeight.value = '1262px';
  // mapWidth.value = '1516px';

  return {
    top: weightLeft * pixelPointsOnImage.left.y + weightTop * pixelPointsOnImage.top.y + weightRight * pixelPointsOnImage.right.y,
    left: weightLeft * pixelPointsOnImage.left.x + weightTop * pixelPointsOnImage.top.x + weightRight * pixelPointsOnImage.right.x
  };
}

if ('geolocation' in navigator) {
  const userPositionEl = document.querySelector('#user-position');
  const latitudeEl = document.querySelector('#latitude');
  const longitudeEl = document.querySelector('#longitude');
  const precisionEl = document.querySelector('#precision');
    const watcher = navigator.geolocation.watchPosition(function(position){
      console.log(position);
      latitudeEl.innerHTML = '<strong>lat</strong>: ' + position.coords.latitude.toFixed(6);
      longitudeEl.innerHTML = '<strong>lon</strong>: ' + position.coords.longitude.toFixed(6);
      precisionEl.innerHTML = '<strong>acu</strong>: ' + position.coords.accuracy + 'm';
      let weights = triangulatePosition(position.coords.latitude, position.coords.longitude);
      position = positionInTheMap(weights[0], weights[1], weights[2]);

      userPositionEl.style.top = position.top + 'px';
      userPositionEl.style.left = position.left + 'px';

    }, function(error){
      console.log(error)
    })
}else{
  alert('ops,nao foi possivel te localizar.Tente em outro navegador');
}
