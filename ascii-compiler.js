// Given an Ascii String Return
/* Otions:
  [
    [
      char,
      [index, no.repeats],
      [index, no.repeats],
      [index, no.repeats]
    ],
    [
      char,
      [index, no.repeats],
      [index, no.repeats],
      [index, no.repeats]
    ],
    ...
  ]

  {
    char: {index: repeats, index: repeats},
    char: {index: repeats, index: repeats}
  }

  [
    [char, repeats],
    [char, repeats]
  ]

*/
const fs = require('fs')
// fetch('ascii.txt')
//   .then(response => {
//     var asciiString = response
//   })
function readFile(file) {
  return new Promise((resolve, reject) => {
    let fr = new FileReader();
    fr.onload = x=> resolve(fr.result);
    fr.readAsText(file);
})}

fs.readFile('ascii.txt', 'utf8' , (err, data) => {
  if (err) {
    console.error(err)
    return
  } else {
    // console.log(data);
    // compile(data)
    // compile2(data)
    // compile3(data)
    // compile4(data)
    compile5(data)
    // compile3(',,,,,,]F                                                8,')
  }
})
fs.readFile('encoded.txt', 'utf8' , (err, data) => {
  if (err) {
    console.error(err)
    return
  } else {
    // console.log(data);
    // compile(data)
    // compile2(data)
    // compile3(data)
    // compile4(data)
    reconstruct5(data)
    // compile3(',,,,,,]F                                                8,')
  }
})

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

// Noo Compile 13,621
function compile(asciiString){
  var asciiArr = []
  var idx = 0
  for (var i = 0; i < asciiString.length; i++) {
    if (asciiString[i] == asciiString[i-1]) {
      asciiArr[asciiArr.length-1][1] = (parseInt('0x'+asciiArr[asciiArr.length-1][1])+1).toString(16)
    } else {
      asciiArr.push([asciiString[i], 1])
    }
  }
  console.log(asciiArr.indexOf([ '\n', 1 ]));
  // let set  = new Set(asciiArr.map(JSON.stringify));
  // let asciiArr2 = Array.from(set).map(JSON.parse);
  // console.dir(asciiArr, {'maxStringLength': null, 'maxArrayLength': null})
  var comp = JSON.stringify(asciiArr).replace(/\s+/g, '')
  console.dir(comp, {'maxStringLength': null, 'maxArrayLength': null})
  reconstruct(asciiArr)
}

// Basic RLE 5,306
function compile2(asciiString){
  var asciiStr = ''
  var count = 0
  for (var i = 0; i < asciiString.length; i++) {
    if (asciiString[i] != asciiString[i-1]) {
      count == 0 ? asciiStr += '|'+asciiString[i] : asciiStr += count.toString()+'|'+asciiString[i]
      count = 0
    } else if (asciiString[i] == asciiString[i-1] && asciiString[i] != asciiString[i-2]){
      asciiStr += asciiString[i]
      count += 2
    } else if (asciiString[i] == asciiString[i-1] && asciiString[i] == asciiString[i-2]) {
      count += 1
    }
  }
  // console.dir(asciiStr, {'maxStringLength': null, 'maxArrayLength': null})
  process.stdout.write(`${asciiStr.replace(/\s+/g,'')}`);
}

// Better RLE 3,935
function compile3(asciiString){
  var asciiStr = ''
  var count = 1
  for (var i = 0; i < asciiString.length; i++) {
    if (asciiString[i] != asciiString[i-1]) {
      count == 1 ? asciiStr += ''+asciiString[i] : asciiStr += count.toString()+'|'+asciiString[i]
      count = 1
    } else if (asciiString[i] == asciiString[i-1]){
      count += 1
    }
  }
  // console.dir(asciiStr, {'maxStringLength': null, 'maxArrayLength': null})
  process.stdout.write(`${asciiStr.replace(/\s+/g,'')}`);
}

// self referencing RLE (hex: 3,641), (base32: 3,335), (base36: 3,253)
function compile4(asciiString){
  var asciiStr = ''
  var count = 1
  for (var i = 0; i < asciiString.length; i++) {
    if (asciiString[i] != asciiString[i-1]) {
      count == 1 ? asciiStr += ''+asciiString[i] : asciiStr += count.toString()+'|'+asciiString[i]
      count = 1
    } else if (asciiString[i] == asciiString[i-1]){
      count += 1
    }
  }
  // console.log(asciiStr);
  var fullAsciiArr = asciiStr.replace(/\s+/g,'').split('|')
  let set  = new Set(fullAsciiArr.map(JSON.stringify));
  let uniqAsciiArr = Array.from(set).map(JSON.parse);
  console.log(uniqAsciiArr);

  var compressedAscii = ''
  for (var i = 0; i < fullAsciiArr.length; i++) {
    // get the index of the element in the uniqued array
    // both to be first occurence
    var firstOccurenceIndex = fullAsciiArr.indexOf(fullAsciiArr[i])

    if (firstOccurenceIndex == i) {
      compressedAscii += `${fullAsciiArr[i]}|`
    } else {
      compressedAscii += `${firstOccurenceIndex.toString(36)}|`
    }
  }
  // console.log(compressedAscii);
  reconstruct4(compressedAscii)
  // var asciiStr2 = asciiArr2.join('|')
  // console.dir(asciiStr, {'maxStringLength': null, 'maxArrayLength': null})
  // process.stdout.write(`${asciiStr2.replace(/\s+/g,'')}`);
  // process.stdout.write(`${compressedAscii.replace(/\s+/g,'')}`);
}

// return unicodeNospace(highestCount){
//   var charArray = []
//   for (var i = 0; i < highestCount; i++) {
//     String.fromCharCode(count)
//   }
// }

// self referencing repeats ascii encoded RLE 2,481
function compile5(asciiString){
  // var compressedAscii = [...asciiString].reduce((acc, curr)=>{ return acc.includes(curr) ?  acc  :  acc + curr;}, "")
  // console.log(uniq);
  var asciiString = asciiString.replace(/\s+/g, '')
  var charCodes = '.I*VN$:'
  var compressedAscii = ''
  for (var i = 0; i < asciiString.length; i++) {
    // get the index of the element in the uniqued array
    // both to be first occurence
    compressedAscii += `${charCodes.indexOf(asciiString[i])}`
  }
  console.log(compressedAscii);
  var asciiStr = ''
  var count = 1
  var highestCount = 0
  for (var i = 0; i < compressedAscii.length; i++) {
    if (compressedAscii[i] != compressedAscii[i-1]) {
      // count == 1 ? asciiStr += compressedAscii[i] : asciiStr += '\u' + count.toString(16).pad(4) + compressedAscii[i]
      // console.log(String.fromCharCode(count));
      count == 1 ? asciiStr += compressedAscii[i] : asciiStr += String.fromCharCode(count) + compressedAscii[i]
      count = 1
    } else if (compressedAscii[i] == compressedAscii[i-1]){
      count += 1
      highestCount = count > highestCount ? count : highestCount
    }
  }
  // console.log(asciiStr);
  // process.stdout.write(`${asciiStr.replace(/\s+/g,'')}`);
  fs.writeFile('./encoded.txt', asciiStr, err => {
    if (err) {
      console.error(err)
      return
    }
    //file written successfully
    console.log('done');
  })
// String.fromCharCode(ascii)
}
// compile5(`.............IIIVVVVVVVVVVVVVVVIIII*.`)

function reconstruct5(utfString){
  // console.log(utfString);
  // console.log(utfString.match(/.{2}/g));
  // utfString.match(/.{2}/g).forEach((item, i)=>{
  //   console.log(item);
  //
  //   // var buf = Buffer.from(item, "ascii");
  // })
  // console.log(utfString);
  var charCodes = '.I*VN$:'
  var asciiStr = ''
  utfString.match(/.{2}/g).forEach((a, i) => {
    var buf = Buffer.from(utfString.match(/.{2}/g)[0][1])
    if (charCodes[a[0]]) {
      asciiStr += charCodes[a[0]].repeat(buf.toString().charCodeAt(0));
    }
  });
  console.log(asciiStr);
}


function reconstruct4(asciiStr){
  var asciiString = ''
  var asciiArr = asciiStr.split('|')
  asciiArr.forEach((item, i) => {
    if (parseInt(item, 36)) {
      try {
        var ref = asciiArr[parseInt(item, 36)]
        asciiString += ref[0].repeat(ref.slice(1));
      } catch (e) {
        console.log(asciiArr[parseInt(item, 36)]);
        console.log(parseInt(item, 36));
      } finally {

      }
    } else {
      asciiString += item[0].repeat(item.slice(1));
    }
  });
  console.log(asciiString);
}

function reconstruct(asciiArr){
  asciiString = ''
  asciiArr.forEach((a, i) => {
    asciiString += a[0].repeat(a[1]);
  });
  console.dir(asciiString, {'maxStringLength': null, 'maxArrayLength': null})
}
