// Detail text formatting helpers for SwiftDocs.

/**
 * Parses a detail string with inline styling for color, bold, italic, underline
 * Syntax: @[prefix?#color;style1;style2[Text]]
 * @param {string} detailText - Input string containing styling markers
 * @returns {string} HTML string with inline styling
 */
function parseDetailContent(detailText) {
  if (!detailText) return "";

  let result = detailText;

  // Regex to match style markers
  result = result.replace(
    /@\[([^#;]*)?(#[0-9a-fA-F]{3,6})?;?([^\]]*)\[([^\]]+)\]\]/g,
    function(match, prefix, color, styles, text) {
      let styleString = "";

      if (color) styleString += `color: ${color};`;

      if (styles) {
        const styleCommands = styles.split(";").map(cmd => cmd.trim());
        if (styleCommands.includes("bold")) styleString += "font-weight: bold;";
        if (styleCommands.includes("italic")) styleString += "font-style: italic;";
        if (styleCommands.includes("underline")) styleString += "text-decoration: underline;";
      }

      // Wrap styled text in a span, otherwise return plain text
      return styleString
        ? `<span style="${styleString}">${text}</span>`
        : text;
    }
  );

  // Convert newline characters to HTML <br>
  return result.replace(/\n/g, "<br>");
}

// Expose for main.js without modules
window.parseDetailContent = parseDetailContent;
