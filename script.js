document.addEventListener('DOMContentLoaded', () => {
    // Won't add the intervals that are bigger than 6 hours
    const maxHoursBetweenSaves = 6;

    // The html elements used in this script
    const input = document.getElementById('folder');
    const list = document.getElementById('savesList');
    const playtime = document.getElementById('playtime');
    const nettime = document.getElementById('nettime');
    const intervals = document.getElementById('intervals');

    // Trigger when the files gets uploaded
    input.addEventListener('change', async () => {
    // FILES CLEANUP
        // Make an array of all the files
        const files = Array.from(input.files);
        // Only keep the SaveInfo.txt files of each SAVE
        const saveInfoFiles = files.filter(file =>
            /(\/|^)Saves\/SAVE\d+\/SaveInfo\.txt$/i.test(file.webkitRelativePath)
        );
        // Sort the array by title
        const sortedInfoFiles = [...saveInfoFiles].sort((a, b) => getSaveIndex(a) - getSaveIndex(b));

    // SAVES LIST
        // Get all the file names in an array
        const paths = sortedInfoFiles.map(file => 
            file.webkitRelativePath || file.name
        );
        // Turn that array into a string
        var pathsString = paths.join("\n");
        // Cleanup the SAVE names
        pathsString = pathsString.replaceAll("Saves/", "");
        pathsString = pathsString.replaceAll("/SaveInfo.txt", "");
        // Display all the SAVE names
        list.textContent = pathsString;

    // .NET TIMES LIST
        // Get all the .net times from each SaveInfo.txt file
        const realTimesBigInt = (await Promise.all(saveInfoFiles.map(async f => {
            const m = (await f.text()).match(/"realTime"\s*:\s*(\d+)/);
            return m ? BigInt(m[1]) : null;
        }))).filter(v => v !== null);
        // Sort the .net times
        const realTimesBigIntSorted = realTimesBigInt.sort((a,b) => (a<b ? -1 : a>b ? 1 : 0));
        // Display all the .net times
        nettime.textContent = realTimesBigIntSorted.join('\n');

    // INTERVALS
        // Initial variables
        var i = 0;
        var playtimeAccumulator = 0n;
        var interval = 0n;
        var intervalsString = "";
        const timeThreshold = BigInt(maxHoursBetweenSaves) * 36000000000n;
        const nbrOfSaves = realTimesBigIntSorted.length;
        // Iterate through the whole .net times list
        for (i; i < nbrOfSaves - 1; i++) {
            // Calculate the interval of ticks between each SAVE
            interval = realTimesBigIntSorted[i+1] - realTimesBigIntSorted[i]
            // If the interval is below 6 hours, add to the playtime
            if (interval < timeThreshold) {
                playtimeAccumulator += interval;
            }
            // Add each interval to a string
            intervalsString += interval/600000000n + "mins\n";
        }
        // Display all the intervals
        intervals.textContent = intervalsString;

    // FINAL TOUCHES
        // Convert the .net numbers into real time
        const playtimeAccumulatorHours = playtimeAccumulator / 36000000000n;
        const playtimeAccumulatorMinutes = playtimeAccumulator / 600000000n - playtimeAccumulatorHours*60n;
        const playtimeAccumulatorSeconds = playtimeAccumulator / 10000000n - playtimeAccumulatorHours*3600n - playtimeAccumulatorMinutes*60n;
        // Display final playtime
        playtime.textContent = playtimeAccumulatorHours + " hours, " + playtimeAccumulatorMinutes + " minutes and " + playtimeAccumulatorSeconds + " seconds.";
    });
});

// Sorting used in the arrays
function getSaveIndex(file) {
  const p = file.webkitRelativePath || file.name;
  const m = p.match(/(?:^|\/)Saves\/SAVE(\d+)\/SaveInfo\.txt$/i);
  return m ? Number(m[1]) : Number.POSITIVE_INFINITY;
}
