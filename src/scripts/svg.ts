export enum ConversionType {
  UrlString,
  BackgroundImage,
  Boilerplate,
}

// Returns whether a string is valid svg (little janky)
export function testValidSVG(text: string) {
  return text.replaceAll(/\n/g, "").match(/^<svg.*<\/svg>$/) !== null;
}

// Converts the input text to an SVG URL
export function convertToURL(text: string, type: ConversionType) {
  // Check for validity
  if (text === "") {
    return "";
  } else if (!testValidSVG(text)) {
    return "That's not a valid SVG";
  }

  // Convert to a safe version
  const safeText = text
    .replaceAll(/\#/g, "%23") // Change question marks for
    .replaceAll(/\?/g, "%3F") // Change question marks for
    .replaceAll(/\s\s+/g, " ") // Change spaces to singular versions
    .replaceAll(/[\t\n\r]/g, "") // Remove other whitespace
    .replaceAll(/\'/g, '"') // Replace single quotes with double quotes
    .replaceAll(/> </g, "><"); // Remove space between tags

  // Conversion types
  let urlWrapper = `url('data:image/svg+xml,${safeText}')`;
  let formattedOutput: string = "";

  switch (type) {
    case ConversionType.UrlString:
      formattedOutput = `${urlWrapper}`;
      break;
    case ConversionType.BackgroundImage:
      formattedOutput = `background-image: ${urlWrapper};`;
      break;
    case ConversionType.Boilerplate:
      // Taken from MDN description of background
      formattedOutput = `\
/* background-attachment: scroll | fixed | local; */
/* background-clip: border-box | padding-box | content-box; */
/* background-color: #ffffff; */
background-image: ${urlWrapper};
/* background-origin: border-box | padding-box | content-box; */
/* background-position: center | top 10px left 20px; */
/* background-repeat: no-repeat; */
/* background-size: cover | contain | 400px | 50% 25%; */\
`;
      break;
  }

  return formattedOutput;
}
