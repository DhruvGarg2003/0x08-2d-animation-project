const canvasSel = '#myCanvas'
//const {canvas, ctx, bb} = getCanvas(canvasSel)

function main() {
  const experiment = new Experiment()

  // Update Candidate Details
  updateCandidateDetails(Experiment)

  console.log({canvas, ctx, bb})

  experiment.run()
}

let score = 0;

function stars() {
 static rollNos = '102103429,102103433,102103438'
  static names = 'Fliers(Dhruv Garg,Navpreet Singh,Chhavi)'
  const count = 50;
  const scene = document.querySelector('.scene');
  for (let i = 0; i < count; i++) {
    const star = document.createElement('i');
    const x = Math.floor(Math.random() * window.innerWidth);
    const duration = Math.random() * 1;
    const h = Math.random() * 100;
    star.style.left = x + 'px';
    star.style.width = 1 + 'px';
    star.style.height = 50 + h + 'px';
    star.style.animationDuration = duration + 's';
    scene.appendChild(star);
  }
}
stars();

const rocket = document.querySelector('.rocket');
const scene = document.querySelector('.scene');
const scoreDisplay = document.getElementById('score');

scene.addEventListener('mousemove', function(event) {
  const rocketWidth = rocket.offsetWidth;
  const rocketHeight = rocket.offsetHeight;
  const sceneRect = scene.getBoundingClientRect();
  const mouseX = event.clientX - sceneRect.left;
  const mouseY = event.clientY - sceneRect.top;

  const newX = Math.max(0, Math.min(scene.offsetWidth - rocketWidth, mouseX - rocketWidth / 2));
  const newY = Math.max(0, Math.min(scene.offsetHeight - rocketHeight, mouseY - rocketHeight / 2));

  rocket.style.left = newX + 'px';
  rocket.style.top = newY + 'px';
});

document.addEventListener('keydown', function(event) {
  if (event.key === ' ') {
    const rocketRect = rocket.getBoundingClientRect();
    const bullet = document.createElement('div');
    bullet.classList.add('bullet');
    bullet.style.left = (rocketRect.left + rocketRect.width / 2 - 2.5) + 'px';
    bullet.style.top = (rocketRect.top - 5) + 'px';
    scene.appendChild(bullet);
    
    const bulletMove = setInterval(() => {
      const bulletRect = bullet.getBoundingClientRect();
      if (bulletRect.top <= 0) {
        clearInterval(bulletMove);
        bullet.remove();
      } else {
        bullet.style.top = (bulletRect.top - 5) + 'px';
      }

      const obstacles = document.querySelectorAll('.obstacle');
      obstacles.forEach(obstacle => {
        const obstacleRect = obstacle.getBoundingClientRect();
        if (
          bulletRect.left >= obstacleRect.left &&
          bulletRect.right <= obstacleRect.right &&
          bulletRect.top >= obstacleRect.top &&
          bulletRect.bottom <= obstacleRect.bottom
        ) {
          obstacle.remove();
          bullet.remove();
          score += 10;
          scoreDisplay.textContent = score;
        }
      });
    }, 10);
  }
});

function createObstacle() {
  const obstacle = document.createElement('div');
  obstacle.classList.add('obstacle');
  obstacle.style.left = Math.floor(Math.random() * (scene.offsetWidth / 2 - 20)) + (scene.offsetWidth / 2) + 'px';
  obstacle.style.top = '0';
  scene.appendChild(obstacle);
  
  const obstacleMove = setInterval(() => {
    const obstacleRect = obstacle.getBoundingClientRect();
    if (obstacleRect.bottom >= scene.offsetHeight) {
      clearInterval(obstacleMove);
      obstacle.remove();
    } else {
      obstacle.style.top = (obstacleRect.top + 5) + 'px';
    }
  }, 100);
}

setInterval(createObstacle, 2000);

// FIXME: Relax the validators for multiple names
function updateCandidateDetails({rollNos,names}) {
  let isValidRollNo, isValidName, act, byHtml, n
  isValidRollNo = (isValidName = false)

  // Validate RollNo
  
  rollNos = rollNos.split(',')
    .map(
      s => Number(s.trim())
    )
    .filter(
      n => {
	isValidRollNo = !isNaN(n) && 9999999 < n
	if (!isValidRollNo) {
	  console.warn({invalidRollNo: n,
			message: "Roll No should be Integer."})
	}
	return isValidRollNo
      }
    )

  // Validate Name
  const titleCasePat = /^[A-Z][a-z]+( [A-Z][a-z]+)*$/
  names = String(names).trim()

  act = names.split('(').shift().trim()
  isValidName = titleCasePat.test(act)
  if (!isValidName) {
    console.warn({invalidAct: act,
		  message: "Act should be in Title Case."})
    act = ''
  }

  names = names.split('(').pop().split(')').shift()
    .split(',').map(s=>s.trim())
    .filter(name => {
      isValidName = titleCasePat.test(name)
      if (!isValidName) {
	console.warn({invalidName: name,
		      message: "Name should be a Title Case."})
      }
      return isValidName
    })
  
  byHtml = ''

  n = Math.min(names.length, rollNos.length)
  for (const i of Array(n).keys()) {
    if (0 < i)
      byHtml = `${byHtml}<span class="p-2">|</span>`

    byHtml = `${byHtml}<code>${rollNos[i]}</code> : ${names[i]}`
  }

  if (0 < act.length) {
    byHtml = `<strong>${act}</strong><br class="hidden md:inline"/><span class="p-4 md:hidden">&mdash;</span>${byHtml}`
  }

  if (0 < byHtml.length) {
    byHtml = `Created by ${byHtml}`
  } else {
    byHtml
      = 'Error parsing candidate details. Check console.'
  }

  document.querySelector('#by')
    .innerHTML = byHtml
}


function saveCanvas() {
  const link = document.createElement('a');
  const {canvas, ctx, bb} = getCanvas(canvasSel)
  link.download = `${slug(Experiment.rollNos)}-${slug(document.title)}-canvas.png`;
  link.href = canvas.toDataURL()
  link.click();  
}


// ----------------------------------------------------
// String Manipulations
// ----------------------------------------------------
function slug(s) {
  return s
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(s=>0<s.length)
    .join('-')
}
