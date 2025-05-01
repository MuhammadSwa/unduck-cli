import { bangs } from "./bang";
// --- Script Logic ---

const DEFAULT_BANG_TRIGGER = "g"; // Default bang if none specified or matched

// Create a lookup map for faster access
const bangMap = new Map(bangs.map(b => [b.t, b]));

// Find the default bang entry
const defaultBang = bangMap.get(DEFAULT_BANG_TRIGGER);
if (!defaultBang) {
  console.error(`Error: Default bang trigger '!${DEFAULT_BANG_TRIGGER}' not found in bang list.`);
  process.exit(1); // Exit with error code
}

function getRedirectUrl(query: string) {
  /**
   * Determines the redirect URL based on the query string and bang rules.
   */
  if (!query || query.trim() === "") {
    // Original JS showed a default page. In CLI, we require a query.
    console.error("Error: No query provided.");
    return null;
  }

  query = query.trim(); // Trim whitespace once at the beginning

  let selectedBang = defaultBang; // Start assuming default
  let cleanQuery = query;
  let bangUsed = false; // Flag to track if a specific bang was *successfully* matched and used

  // Regex to match !bang at the start, optionally followed by space and the rest of the query
  // ^!       - Starts with !
  // (\S+)    - Captures one or more non-whitespace characters (the bang trigger)
  // (?:\s+   - Optionally matches one or more whitespace characters (non-capturing group)
  // (.*)     - Captures the rest of the string (the actual query)
  // )?       - Makes the space and the rest of the query optional
  // i        - Case-insensitive match
  const bangMatch = query.match(/^!(\S+)(?:\s+(.*))?$/i);

  if (bangMatch) {
    const bangCandidateTrigger = bangMatch[1].toLowerCase(); // The captured bang trigger (e.g., "gh")
    const potentialBangData = bangMap.get(bangCandidateTrigger);

    if (potentialBangData) {
      // Found a matching bang
      selectedBang = potentialBangData;
      // Query is the part after the bang and space (group 2), or empty string if nothing followed
      cleanQuery = (bangMatch[2] || "").trim(); // Use group 2, default to "", then trim
      bangUsed = true;
    } else {
      // Bang syntax like '!word' was used, but 'word' is not a known bang.
      // Fall back to the default bang, but *still remove* the '!word ' part.
      selectedBang = defaultBang;
      // Replace the first occurrence of !word followed by optional space(s)
      cleanQuery = query.replace(/^!\S+\s*/i, "").trim();
      // bangUsed remains false because we didn't match a *specific* bang
    }
  }
  // If no bangMatch, selectedBang remains defaultBang and cleanQuery remains the original query

  // If the query is empty *after* processing a *specific* bang (e.g., query was just "!gh"), redirect to domain
  if (bangUsed && cleanQuery === "") {
    if (selectedBang!.d) {
      return `https://${selectedBang!.d}`; // Construct domain URL
    } else {
      console.error(`Error: Selected bang '!${selectedBang!.t}' is missing domain 'd'.`);
      return null;
    }
  }

  // --- Construct the final search URL ---
  const searchTemplate = selectedBang!.u;
  if (!searchTemplate) {
    console.error(`Error: Selected bang '!${selectedBang!.t}' is missing URL template 'u'.`);
    // Fallback to domain if possible
    return selectedBang!.d ? `https://${selectedBang!.d}` : null;
  }

  // Encode the query like the browser version: encodeURIComponent, then replace %2F with /
  const encodedQuery = encodeURIComponent(cleanQuery).replace(/%2F/g, "/");

  // Substitute into the template
  const finalUrl = searchTemplate.replace("{{{s}}}", encodedQuery);
  return finalUrl;
}

// --- Main execution ---

// process.argv contains command line arguments:
// process.argv[0] = node executable path
// process.argv[1] = script file path
// process.argv[2...] = actual arguments passed
const args = process.argv.slice(2); // Get only the arguments passed to the script
//
if (args.length === 0) {
  // Print usage instructions similar to the JS default page's intent
  const scriptName = require('path').basename(process.argv[1]); // Get script filename
  console.error(`Und*ck Bang Redirector (CLI)`);
  console.error(`\nUsage: ${scriptName} "<query>"`);
  console.error(`\nExample: Search GitHub for 't3dotgg/unduck'`);
  console.error(`  ${scriptName} "!gh t3dotgg/unduck"`);
  console.error(`\nExample: Go to GitHub homepage`);
  console.error(`  ${scriptName} "!gh"`);
  console.error(`\nExample: Search Google (default) for 'hello world'`);
  console.error(`  ${scriptName} "hello world"`);
  console.error(`\nDefault bang: !${DEFAULT_BANG_TRIGGER}`);
  // You could list available bangs here if desired
  process.exit(1); // Exit with error code
}

// Combine all arguments into a single query string
const fullQuery = args.join(" ");

const redirectUrl = getRedirectUrl(fullQuery);

if (redirectUrl) {
  console.log(redirectUrl); // Output the result to standard output
} else {
  // An error occurred, message should have been printed to stderr already by getRedirectUrl
  process.exit(1); // Exit with error status
}
