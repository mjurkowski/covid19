const csv = strData => {
  const strDelimiter = ',';

  // Create a regular expression to parse the CSV values.
  const objPattern = new RegExp(
    // Delimiters.
    '(\\' +
      strDelimiter +
      '|\\r?\\n|\\r|^)' +
      // Quoted fields.
      '(?:"([^"]*(?:""[^"]*)*)"|' +
      // Standard fields.
      '([^"\\' +
      strDelimiter +
      '\\r\\n]*))',
    'gi'
  );

  const arrData = [[]];
  let arrMatches = null;

  while ((arrMatches = objPattern.exec(strData))) {
    var strMatchedDelimiter = arrMatches[1];
    if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter) {
      arrData.push([]);
    }

    var strMatchedValue;

    if (arrMatches[2]) {
      strMatchedValue = arrMatches[2].replace(new RegExp('""', 'g'), '"');
    } else {
      strMatchedValue = arrMatches[3];
    }
    arrData[arrData.length - 1].push(strMatchedValue);
  }

  return arrData;
};

const formatSnakeCase = text => {
  let formattedText = text.replace(/_/g, ' ');
  return formattedText[0].toUpperCase() + formattedText.substr(1);
};
