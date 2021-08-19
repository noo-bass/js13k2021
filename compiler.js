const fs = require('fs')

fs.readFile('ascii.txt', 'utf8' , (err, data) => {
  if (err) {
    console.error(err)
    return
  } else {
    compile5(data)
  }
})
fs.readFile('encoded.txt', 'utf8' , (err, data) => {
  if (err) {
    console.error(err)
    return
  } else {
    reconstruct5(data)
  }
})

// self referencing repeats ascii encoded RLE 2,481, 2,884
function compile5(asciiString){
  var charCodes = ['.','I','*','V','N', '$',':','\n']
  var compressedAscii = ''
  for (var i = 0; i < asciiString.length; i++) {
    // get the index of the element in the uniqued array
    // both to be first occurence
    compressedAscii += `${charCodes.indexOf(asciiString[i])}`
  }
  // console.log(compressedAscii);
  var asciiStr = ''
  var count = 100
  var highestCount = 0
  // console.log(compressedAscii);
  // compile3(compressedAscii)
  for (var i = 0; i < compressedAscii.length; i++) {
    // if you don't equal the one behind or in front you are a single
    if (compressedAscii[i] != compressedAscii[i-1] && compressedAscii[i] != compressedAscii[i+1]) {
      asciiStr += compressedAscii[i] + String.fromCharCode(count)
      count = 100
    // if you are not the same as the one behind but the same as the one in front then you begin the run
    } else if (compressedAscii[i] != compressedAscii[i-1] && compressedAscii[i] == compressedAscii[i+1]){
      asciiStr += compressedAscii[i]
      count = count+1
    // if you are the same as the one behind but not the next you are the end of the run
    } else if (compressedAscii[i] == compressedAscii[i-1] && compressedAscii[i] != compressedAscii[i+1]){
      count = count+1
      asciiStr += String.fromCharCode(count)
      count = 100
    // same as both, in the middle
    } else if (compressedAscii[i] == compressedAscii[i+1] && compressedAscii[i] == compressedAscii[i+1]){
      count = count+1
    } else {
      console.log('huh?');
    }
  }
  console.log(asciiStr);

  fs.writeFile('./encoded.txt', asciiStr, err => {
    if (err) {
      console.error(err)
      return
    }
    //file written successfully
    console.log('done');
  })

}

function reconstruct5(utfString){
  var charCodes = ['.','I','*','V','N', '$',':','\n']
  console.dir(utfString.match(/.{2}/g), {'maxStringLength': null, 'maxArrayLength': null});
  console.dir(utfString.match(/.{2}/g).every(e => charCodes.indexOf[e] != -1), {'maxStringLength': null, 'maxArrayLength': null});

  var asciiStr = ''
  utfString.match(/.{2}/g).forEach((a, i) => {
    var buf = Buffer.from(a[1])
    var repeats = buf.toString().charCodeAt(0)-100
    if (charCodes[a[0]]) {
      repeats != 0 ? asciiStr += charCodes[a[0]].repeat(repeats) : asciiStr += charCodes[a[0]]
    }
  });
  // console.log(asciiStr);
  fs.writeFile('./decoded.txt', asciiStr, err => {
    if (err) {
      console.error(err)
      return
    }
    //file written successfully
    console.log('done');
  })
}
