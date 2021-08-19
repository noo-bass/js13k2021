// TODO: Auto variation?
function gameBoard(){
  var controls = document.getElementById("controls")
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 4; j++) {
      var keyClasses = ['Q', 'W', 'E', 'R']
      var span = document.createElement('span');
      span.innerHTML = "||||||| "
      span.setAttribute("class", `column${keyClasses[j]}`)
      controls.append(span)
      if (j == 3) {
        controls.append('\n')
      }
    }
  }
}
gameBoard()
function chords(pattern){
  // given array of ['m34', 'M34'] should return three patterns for bassNote (original pattern), third (bassNote + 5 for M + 4 for m), fifth (bassNote +7)
  root = []
  third = []
  fifth = []
  pattern.forEach((e,i)=>{
    if (e != 0) {
      tonality = ((e.includes('M')) ? 4 : 3)
      rootNote = parseInt(e.replace(/[mM]/, ''))
      root.push(rootNote)
      third.push(rootNote+tonality)
      fifth.push(rootNote+7)
    } else {
      root.push(0)
      third.push(0)
      fifth.push(0)
    }

  })
  return [[4,0].concat(Array(8).fill([root])).flat(2), [3,0].concat(Array(8).fill([third])).flat(2), [3,0].concat(Array(8).fill([fifth])).flat(2)]
}
// cheap way of making 16 bars
var kickPattern = [0,0].concat(Array(8).fill([1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1])).flat()
var snarePattern = [1,0].concat(Array(8).fill([0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0])).flat()
var hhPattern = [2,0].concat(Array(8).fill([1.9, 1.5, 1.3, 1.2, 1.5, 1.3, 1.3, 1.2, 1.6, 1.2, 1.4, 1.2, 1.7, 1.4, 1.3, 1.5])).flat()
var bassPattern = [3,0].concat(Array(2).fill([
  34, 0, 0, 0,
  24, 0, 0, 0,
  27, 0, 0, 0,
  32, 0, 0, 0,
  34, 0, 0, 0,
  34, 0, 0, 0,
  34, 0, 0, 0,
  34, 0, 0, 0,
  34, 0, 0, 0,
  24, 0, 0, 0,
  27, 0, 0, 0,
  32, 0, 0, 0,
  34, 0, 0, 0,
  0, 0, 0, 0,
  0, 0, 0, 0,
  0, 0, 0, 0
])).flat()
var bassPattern2 = [3,0].concat(Array(2).fill([
  34, 34, 0, 0,
  24, 24, 0, 0,
  27, 27, 0, 0,
  32, 32, 0, 0,
  34, 34, 0, 0,
  34, 34, 0, 0,
  34, 34, 0, 0,
  34, 34, 0, 0,
  34, 34, 0, 0,
  24, 24, 0, 0,
  27, 27, 0, 0,
  32, 32, 0, 0,
  34, 0, 0, 0,
  0, 34, 0, 0,
  0, 34, 0, 34,
  0, 0, 34, 0
])).flat()
var chordPattern = ['m47', 0, 0, 0, 0, 0, 0, 0, 'M46', 0, 0, 0, 0, 0, 0, 0]
var chordPatterns = chords(chordPattern)
var bpm = 120

var song =
[                                     // Song
  [                                     // Instruments
    [3,,110,,,,,,,,,,,.5], // kick
    [,,250,,,,4,,,,,,,8,,,,,.06], //snare
    [.75,0,2e3,,,.3,,20,,,,,,.5,,,,.2,.25], // hh
    [.7,0,22,,.07,.3,2,0,,,.5,.01], // bass
    [.5,0,22,,,1,,.4] // Sound Default
  ],
  [                                     // Patterns
    [                                     // Pattern 0
      kickPattern,
      snarePattern,
      hhPattern,
      bassPattern
    ],
    [                                     // Pattern 0
      kickPattern,
      snarePattern,
      hhPattern,
      bassPattern2
    ],
    [
      kickPattern,
      snarePattern,
      hhPattern,
      bassPattern,
      chordPatterns[0],
      chordPatterns[1],
      chordPatterns[2]
    ],
    [
      kickPattern,
      snarePattern,
      hhPattern,
    ]
  ],
  [                                     // Sequence
    0,1,2,3,2                                   // Play pattern 0
  ],
  bpm,                                  // 120 BPM
  {}
]
var patternStep = 2
var currentFrame = 1

function animate(currentFrame){
  document.getElementById(`frame1`).style.display = 'none';
  document.getElementById(`frame2`).style.display = 'none';
  document.getElementById(`frame3`).style.display = 'none';
  document.getElementById(`frame4`).style.display = 'none';
  document.getElementById(`frame${currentFrame}`).style.display = 'block';
}

document.getElementById('music').addEventListener('click', ()=>{
  if (typeof myAudioNode == 'undefined') {
    // Create a song
    let mySongData = zzfxM(...song);
    // Play the song (returns a AudioBufferSourceNode)
    let myAudioNode = zzfxP(...mySongData);

    window.setInterval(()=>{
      updateGameBoard(patternStep)
      animate(currentFrame)
      patternStep++
      currentFrame++
      if (currentFrame == 5) {
        currentFrame=1
      }
    }, (60/bpm)*1000);

    document.addEventListener('keypress', checkKeyPress);

    document.getElementById('music').disabled = true
  }
})
var keys = []
function checkKeyPress(key){
  if (keys.includes(key.code)) {
    console.log('ONE POINT');
  } else {
    console.log('MINUS POINT');
  }
}

function colourGameBoard(pattern, keyClass){
  // find all the hits, we need this so we can start colouring ~ten before
  var indices = [];
  var boolPattern = pattern.map(e=>e != 0)
  var idx = boolPattern.indexOf(true)
  while (idx != -1) {
    indices.push(idx);
    idx = boolPattern.indexOf(true, idx + 1);
  }
  debugger
  // This shows when it is hit, can you interp
  // if (!indices[indices.indexOf(patternStep)) {
  //
  // }
  if (indices[indices.indexOf(patternStep)] == patternStep) {
    console.log('the drum is hit');
  }
  indices.forEach(idx => {

    if (patternStep == (idx-8)) {
      // console.log(idx);
      // console.log(patternStep);
      x = 0
      let intervalID = window.setInterval(()=>{
        colourLeadUp(keyClass)
        if (++x === 4) {
          // console.log('cleared');
          window.clearInterval(intervalID);
        }
      }, 100)
    }
  })

  var elems = Array.from(document.querySelectorAll(`#keys>.${keyClass}`)).forEach((item, i) => {
    if (pattern[patternStep] != 0) {
      item.setAttribute("style", `background-color: ${getComputedStyle(item).color};`)
      keys.push(`Key${keyClass}`)
    } else {
      item.setAttribute("style", `background-color: none;`)
      keys.splice(keys.indexOf(`Key${keyClass}`), 1);
    }
  });
}

function colourLeadUp(keyClass){
  try {
    document.querySelector(`.column${keyClass}:not(.${keyClass})`).setAttribute("class", `column${keyClass} ${keyClass}`)
  } catch (e) {
    Array.from(document.querySelectorAll(`.column${keyClass}.${keyClass}`)).forEach((item)=>{
      item.setAttribute("class", `column${keyClass}`)
    })
  }
}

function updateGameBoard(patternStep) {
  colourGameBoard(kickPattern, 'Q');
  // colourGameBoard(snarePattern, 'W');
  // colourGameBoard(hhPattern, 'E');
  // colourGameBoard(bassPattern, 'R');
}

function update(progress) {
  // Update the state of the world for the elapsed time since last render
}

function draw() {
  // Draw the state of the world
}


function loop(timestamp) {
  var progress = timestamp - lastRender
  if (document.getElementById('music').disabled) {
    update(progress)
    draw()
  }

  lastRender = timestamp
  window.requestAnimationFrame(loop)
}
var lastRender = 0
window.requestAnimationFrame(loop)
//
// // Stop the song
// myAudioNode.stop();
